import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { reviewSchema } from "@/lib/reviewSchema";
import { createAnonClient, createUserClient, isKnownProduct } from "@/lib/reviews";

function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  const match = header?.match(/^Bearer\s+(\S+)\s*$/i);
  return match ? match[1] : null;
}

export async function POST(request: NextRequest) {
  // 1. Authentication
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data: userData, error: authError } = await createAnonClient().auth.getUser(token);
  if (authError || !userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Validation (body that is not JSON is invalid input too)
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid input", issues: [] }, { status: 400 });
  }
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const { product_id, rating, comment } = parsed.data;

  // 3. Product check
  if (!isKnownProduct(product_id)) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // 4. Insert as the user (RLS applies). user_id and author come from DB defaults.
  const { data, error } = await createUserClient(token)
    .from("reviews")
    .insert({ product_id, rating, comment })
    .select("id, product_id, rating, comment, author, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "You already reviewed this product" },
        { status: 409 }
      );
    }
    if (error.code === "23514") {
      return NextResponse.json({ error: "Invalid input", issues: [] }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not save review" }, { status: 500 });
  }

  // 5. Rebuild the cached product page on its next request
  revalidatePath("/products/" + product_id);

  return NextResponse.json(data, { status: 201 });
}
