"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "@/data/products";
import { useFavorites } from "@/contexts/FavoritesContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(product.id);

  return (
    <Card
      data-testid="product-card"
      className="flex flex-col overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow bg-white rounded-xl border border-slate-200 relative group"
    >
      <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
        <Image
          data-testid="product-image"
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Heart button */}
        <button
          type="button"
          data-testid="btn-favorite"
          aria-pressed={isFav ? "true" : "false"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow hover:bg-white transition-colors z-10 cursor-pointer"
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFav ? "fill-red-500 text-red-500" : "text-slate-500 hover:text-red-500"
            }`}
          />
        </button>
      </div>
      <CardHeader className="space-y-1.5 p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle
            data-testid="product-name"
            className="text-base font-bold text-slate-900 line-clamp-1"
          >
            <Link
              href={`/products/${product.id}`}
              className="hover:text-primary transition-colors"
            >
              {product.name}
            </Link>
          </CardTitle>
          <span
            data-testid="product-price"
            className="text-emerald-600 font-extrabold text-base whitespace-nowrap"
          >
            ${product.price.toFixed(2)}
          </span>
        </div>
        <CardDescription
          data-testid="product-description"
          className="line-clamp-2 text-xs text-slate-500 min-h-[2rem]"
        >
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0" />
      <CardFooter className="p-4 pt-2">
        <Link
          href={`/products/${product.id}`}
          data-testid="link-detail"
          className="w-full"
        >
          <Button className="w-full text-xs h-9 cursor-pointer" variant="outline">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
