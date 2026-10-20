import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { Header } from "@/components/Header";
import { FavoriteButton } from "@/components/FavoriteButton";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({
    id: String(product.id),
  }));
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const numId = Number(id);
  const validId = /^\d+$/.test(id) && Number.isSafeInteger(numId);
  const product = products.find((p) => p.id === numId);

  if (!validId || !product) {
    return {
      title: "Not Found | SE20B Store",
    };
  }

  return {
    title: `${product.name} | SE20B Store`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const numId = Number(id);

  if (!/^\d+$/.test(id) || !Number.isSafeInteger(numId)) {
    notFound();
  }

  const product = products.find((p) => p.id === numId);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full overflow-x-hidden">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="mb-6">
          <Link
            href="/"
            data-testid="link-back"
            className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Back to Products
          </Link>
        </div>

        <div
          data-testid="product-detail"
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
        >
          {/* Image */}
          <div className="relative w-full aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-5">
            <div>
              <span
                data-testid="detail-category"
                className="inline-block text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full mb-3"
              >
                {product.category}
              </span>
              <h1
                data-testid="detail-name"
                className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
              >
                {product.name}
              </h1>
            </div>

            <div>
              <span
                data-testid="detail-price"
                className="text-3xl font-extrabold text-emerald-600"
              >
                ${product.price.toFixed(2)}
              </span>
            </div>

            <div className="border-t border-b border-slate-100 py-4">
              <h2 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
                Description
              </h2>
              <p
                data-testid="detail-description"
                className="text-slate-600 text-sm sm:text-base leading-relaxed"
              >
                {product.description}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <FavoriteButton productId={product.id} />
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t bg-white py-6 text-center text-xs text-slate-500 w-full">
        © 2026 SE20B.NJS Store - Product Detail
      </footer>
    </div>
  );
}
