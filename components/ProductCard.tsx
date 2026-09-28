import Image from "next/image";
import { Product } from "@/data/products";
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
  return (
    <Card
      data-testid="product-card"
      className="flex flex-col overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow bg-white rounded-xl border border-slate-200"
    >
      <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
        <Image
          data-testid="product-image"
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader className="space-y-1.5 p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle
            data-testid="product-name"
            className="text-base font-bold text-slate-900 line-clamp-1"
          >
            {product.name}
          </CardTitle>
          <span
            data-testid="product-price"
            className="text-emerald-600 font-extrabold text-base whitespace-nowrap"
          >
            {product.price}
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
        <Button className="w-full text-xs h-9" variant="outline">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
