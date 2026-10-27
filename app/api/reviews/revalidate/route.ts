import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAnonClient, isKnownProduct } from "@/lib/reviews";

// Called by the client after an edit/delete (done directly against Supabase) so the
// cached product page does not keep showing stale reviews. Requires a valid token.
export async function POST(request: NextRequest) {
  const match = request.headers.get("authorization")?.match(/^Bearer\s+(\S+)\s*$/i);
  if (!match) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data, error } = await createAnonClient().auth.getUser(match[1]);
  if (error || !data.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let productId: unknown;
  try {
    productId = (await request.json())?.product_id;
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  if (typeof productId !== "number" || !isKnownProduct(productId)) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  revalidatePath("/products/" + productId);
  return NextResponse.json({ revalidated: true }, { status: 200 });
}
