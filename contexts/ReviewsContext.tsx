"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import type { Review } from "@/lib/reviews";

type ReviewsAction =
  | { type: "SET"; payload: Review[] }
  | { type: "ADD"; payload: Review }
  | { type: "UPDATE"; payload: Review }
  | { type: "REMOVE"; payload: number };

function reviewsReducer(state: Review[], action: ReviewsAction): Review[] {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "ADD":
      if (state.some((r) => r.id === action.payload.id)) return state;
      return [action.payload, ...state];
    case "UPDATE":
      return state.map((r) => (r.id === action.payload.id ? { ...r, ...action.payload } : r));
    case "REMOVE":
      return state.filter((r) => r.id !== action.payload);
    default:
      return state;
  }
}

interface ActionResult {
  error?: string;
}

interface ReviewsContextType {
  reviews: Review[];
  myReview: Review | undefined;
  submitReview: (rating: number, comment: string) => Promise<ActionResult>;
  updateReview: (rating: number, comment: string) => Promise<ActionResult>;
  deleteReview: () => Promise<ActionResult>;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

interface ReviewsProviderProps {
  productId: number;
  initialReviews: Review[];
  children: React.ReactNode;
}

export function ReviewsProvider({ productId, initialReviews, children }: ReviewsProviderProps) {
  // Initial state comes from the data fetched on the server.
  const [reviews, dispatch] = useReducer(reviewsReducer, initialReviews);
  const { user } = useAuth();
  const router = useRouter();

  // When router.refresh() brings fresh server data, adopt it (skip the first render).
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    dispatch({ type: "SET", payload: initialReviews });
  }, [initialReviews]);

  const myReview = user ? reviews.find((r) => r.user_id === user.id) : undefined;

  const getToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  };

  // Edits/deletes go straight to Supabase, so ask the server to refresh the cached page.
  const refreshPage = useCallback(
    async (token: string) => {
      try {
        await fetch("/api/reviews/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
          body: JSON.stringify({ product_id: productId }),
        });
      } catch {
        // best effort
      }
      router.refresh();
    },
    [productId, router]
  );

  const submitReview = async (rating: number, comment: string): Promise<ActionResult> => {
    const token = await getToken();
    if (!token || !user) return { error: "Please log in to write a review." };

    let res: Response;
    try {
      res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ product_id: productId, rating, comment }),
      });
    } catch {
      return { error: "Network error. Please try again." };
    }

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      return { error: json?.error ?? "Could not submit review." };
    }

    // The API row has no user_id (it is not sent back), but we know it is ours.
    dispatch({ type: "ADD", payload: { ...json, user_id: user.id } });
    router.refresh();
    return {};
  };

  const updateReview = async (rating: number, comment: string): Promise<ActionResult> => {
    if (!myReview) return { error: "You have no review to update." };
    const { data, error } = await supabase
      .from("reviews")
      .update({ rating, comment })
      .eq("id", myReview.id)
      .select("id, user_id, product_id, rating, comment, author, created_at")
      .single();

    if (error || !data) return { error: error?.message ?? "Could not update review." };

    dispatch({ type: "UPDATE", payload: data as Review });
    const token = await getToken();
    if (token) await refreshPage(token);
    return {};
  };

  const deleteReview = async (): Promise<ActionResult> => {
    if (!myReview) return { error: "You have no review to delete." };
    const previous = reviews;
    const target = myReview;

    // Optimistic: remove immediately, roll back if Supabase says no.
    dispatch({ type: "REMOVE", payload: target.id });

    // .select() returns the deleted rows, so an RLS-blocked delete (0 rows) is detected too.
    const { data, error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", target.id)
      .select("id");

    if (error || !data || data.length === 0) {
      dispatch({ type: "SET", payload: previous });
      return { error: error?.message ?? "Could not delete review." };
    }

    const token = await getToken();
    if (token) await refreshPage(token);
    return {};
  };

  return (
    <ReviewsContext.Provider
      value={{ reviews, myReview, submitReview, updateReview, deleteReview }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
}
