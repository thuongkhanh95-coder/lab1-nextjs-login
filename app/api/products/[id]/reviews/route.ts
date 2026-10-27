import { NextRequest, NextResponse } from "next/server";
import { getReviewsData, isKnownProduct } from "@/lib/reviews";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);

  if (!/^\d+$/.test(id) || !Number.isSafeInteger(numId) || !isKnownProduct(numId)) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  try {
    const data = await getReviewsData(numId);
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Could not load reviews" }, { status: 500 });
  }
}
