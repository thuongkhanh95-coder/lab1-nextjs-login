import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";

interface HomePageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q, category } = await searchParams;

  const categories = Array.from(new Set(products.map((p) => p.category)));

  let filtered = products;

  if (q && q.trim()) {
    const query = q.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  if (category && category.trim()) {
    const cat = category.trim().toLowerCase();
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === cat
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full overflow-x-hidden">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full box-border">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Our Products
          </h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Discover our latest technology gadgets and accessories.
          </p>
        </div>

        {/* URL-driven search & category filter form */}
        <form method="get" action="/" className="flex flex-col sm:flex-row gap-3 items-center mb-8">
          <input
            type="text"
            name="q"
            defaultValue={q || ""}
            placeholder="Search products by name or description..."
            data-testid="search-input"
            className="w-full sm:flex-1 h-10 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <select
            name="category"
            defaultValue={category || ""}
            data-testid="category-select"
            className="w-full sm:w-48 h-10 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <Button type="submit" data-testid="btn-search" className="w-full sm:w-auto h-10 px-6 cursor-pointer">
            Search
          </Button>
        </form>

        {/* Product grid or empty state */}
        {filtered.length === 0 ? (
          <div
            data-testid="no-results"
            className="p-12 text-center bg-white rounded-xl border border-slate-200"
          >
            <p className="text-lg font-semibold text-slate-700">No products found</p>
            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your search query or category filter.
            </p>
          </div>
        ) : (
          <div
            data-testid="product-list"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <footer className="border-t bg-white py-6 text-center text-xs text-slate-500 w-full">
        © 2026 SE20B.NJS Store - Lab 4 Dynamic Routing & Filtering
      </footer>
    </div>
  );
}