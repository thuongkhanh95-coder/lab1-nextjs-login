import { createClient } from "@supabase/supabase-js";
import { products } from "@/data/products";

export interface Review {
  id: number;
  user_id: string;
  product_id: number;
  rating: number;
  comment: string;
  author: string;
  created_at: string;
}

export interface ReviewsData {
  average: number;
  count: number;
  reviews: Review[];
}

const REVIEW_COLUMNS = "id, user_id, product_id, rating, comment, author, created_at";

function env() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return { url, anonKey };
}

/** Anonymous (anon key) client for server-side reads. */
export function createAnonClient() {
  const { url, anonKey } = env();
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Client that acts as the logged-in user, so Row Level Security applies. Never uses service_role. */
export function createUserClient(token: string) {
  const { url, anonKey } = env();
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: "Bearer " + token } },
  });
}

export function isKnownProduct(id: number): boolean {
  return products.some((p) => p.id === id);
}

export function computeAverage(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

/** Shared by GET /api/products/[id]/reviews and the product detail page. */
export async function getReviewsData(productId: number): Promise<ReviewsData> {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("reviews")
    .select(REVIEW_COLUMNS)
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) throw new Error("Failed to load reviews: " + error.message);

  const reviews = (data ?? []) as Review[];
  return { average: computeAverage(reviews), count: reviews.length, reviews };
}
