import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ProductCarousel } from "@/components/ProductCarousel";
import { Package } from "lucide-react";



interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  original_price?: number | null;
  quantity: number;
  category: string;
}

const ProductCard = ({
  id,
  image,
  name,
  description,
  price,
  quantity,
  category,
}: ProductCardProps) => {
  const original_price = price + 50;
  const discount = original_price
  ? Math.round(
      ((original_price - price) / original_price) * 100
    )
  : 0;

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

return (
  <Link to={`/product/${id}`} className="block">
    <article className="product-card animate-fade-in  transition-smooth hover:shadow-hover ">
      {/* Image */}
      <div className="relative aspect-square bg-secondary overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-16 w-16 text-muted-foreground/40" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="bg-primary px-1  rounded">{discount}% Off</span>
          )}
          {quantity > 0 && quantity <= 5 && (
            <span className="text-orange-500">Últimas unidades!</span>
          )}
          {quantity === 0 && (
            <span className="bg-descructive">Esgotado</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {category && (
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {category}
          </span>
        )}

        {/* Name */}
        <h3 className="font-medium text-foreground mt-1 line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>

        {/* Price */}
        <div className="mt-3">
          {original_price && original_price > price && (
            <p className="price-original">{formatPrice(original_price)}</p>
          )}
          <p className="price-current">{formatPrice(price)}</p>
          {discount > 0 && (
            <p className="price-discount-percent mt-1">
              {discount}% de desconto
            </p>
          )}
        </div>

        {/* Stock indicator */}
        <div className="mt-3">
          {quantity > 5 ? (
            <span className="text-xs text-success">Em estoque</span>
          ) : quantity > 0 ? (
            <span className="text-xs text-warning">
              Apenas {quantity} em estoque
            </span>
          ) : (
            <span className="text-xs text-destructive">Produto esgotado</span>
          )}
        </div>
      </div>
    </article>
  </Link>
);

};

export default ProductCard;
