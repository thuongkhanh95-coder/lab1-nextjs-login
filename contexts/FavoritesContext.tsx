"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

type FavoritesAction =
  | { type: "SET"; payload: number[] }
  | { type: "ADD"; payload: number }
  | { type: "REMOVE"; payload: number };

function favoritesReducer(state: number[], action: FavoritesAction): number[] {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "ADD":
      if (state.includes(action.payload)) return state;
      return [...state, action.payload];
    case "REMOVE":
      return state.filter((id) => id !== action.payload);
    default:
      return state;
  }
}

interface FavoritesContextType {
  favorites: number[];
  favoritesLoadError: boolean;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, dispatch] = useReducer(favoritesReducer, []);
  const [favoritesLoadError, setFavoritesLoadError] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Load favorites when user logs in, reset to [] when user logs out
  useEffect(() => {
    setFavoritesLoadError(false);

    if (!user) {
      dispatch({ type: "SET", payload: [] });
      return;
    }

    let isMounted = true;
    async function loadFavorites() {
      const { data, error } = await supabase
        .from("favorites")
        .select("product_id");

      if (!isMounted) return;

      if (error) {
        console.error("Failed to load favorites:", error);
        setFavoritesLoadError(true);
        return;
      }

      if (data) {
        dispatch({ type: "SET", payload: data.map((row) => row.product_id) });
      }
    }

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const isFavorite = (id: number): boolean => {
    return favorites.includes(id);
  };

  const toggleFavorite = async (id: number): Promise<void> => {
    if (!user) {
      router.push("/login");
      return;
    }

    const currentlyFavorite = favorites.includes(id);

    if (currentlyFavorite) {
      // Optimistic update: remove first
      dispatch({ type: "REMOVE", payload: id });
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("product_id", id);

      if (error) {
        // Rollback
        dispatch({ type: "ADD", payload: id });
        console.error("Failed to remove favorite:", error);
      }
    } else {
      // Optimistic update: add first
      dispatch({ type: "ADD", payload: id });
      const { error } = await supabase
        .from("favorites")
        .insert({ product_id: id });

      if (error) {
        // Rollback
        dispatch({ type: "REMOVE", payload: id });
        console.error("Failed to add favorite:", error);
      }
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, favoritesLoadError, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
