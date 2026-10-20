import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);

  if (!/^\d+$/.test(id) || !Number.isSafeInteger(numId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const product = products.find((p) => p.id === numId);

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product, { status: 200 });
}
