"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { products } from "@/data/products";

export default function FavoritesPage() {
  const { user, loading } = useAuth();
  const { favorites, favoritesLoadError } = useFavorites();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full overflow-x-hidden">
      <Header />
      <main
        data-testid="favorites-page"
        className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full box-border"
      >
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your Favorites
          </h1>
        </div>

        {favoritesLoadError ? (
          <div
            data-testid="favorites-error"
            className="p-8 text-center bg-white rounded-xl border border-red-200"
          >
            <p className="text-sm font-medium text-red-700">
              Favorites could not be loaded. Please refresh and try again.
            </p>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div
            data-testid="favorites-empty"
            className="p-12 text-center bg-white rounded-xl border border-slate-200"
          >
            <p className="text-lg font-semibold text-slate-700">
              No favorite products yet
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Add products to your favorites and they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProducts.map((product) => (
              <div key={product.id} data-testid="favorite-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
