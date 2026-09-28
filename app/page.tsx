import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full overflow-x-hidden">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full box-border">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Our Products
          </h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Discover our latest technology gadgets and accessories.
          </p>
        </div>

        {/* Product grid container with data-testid="product-list", 1 col at 375px, >= 3 cols at 1280px */}
        <div
          data-testid="product-list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <footer className="border-t bg-white py-6 text-center text-xs text-slate-500 w-full">
        © 2026 SE20B.NJS Store - Lab 2 Product Listing
      </footer>
    </div>
  );
}