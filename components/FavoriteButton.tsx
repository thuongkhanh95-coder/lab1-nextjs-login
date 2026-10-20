"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Button } from "@/components/ui/button";

interface FavoriteButtonProps {
  productId: number;
}

export function FavoriteButton({ productId }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(productId);

  return (
    <Button
      type="button"
      data-testid="btn-favorite"
      aria-pressed={isFav ? "true" : "false"}
      onClick={() => toggleFavorite(productId)}
      variant={isFav ? "default" : "outline"}
      className="flex items-center gap-2 cursor-pointer"
    >
      <Heart className={`w-5 h-5 ${isFav ? "fill-white text-white" : "text-slate-600"}`} />
      <span>{isFav ? "Favorited" : "Add to Favorites"}</span>
    </Button>
  );
}
