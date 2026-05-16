import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ProductCarousel } from "@/components/ProductCarousel";
import { formatPrice } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';


interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  max_installments?: number;
  quantity: number;
  category: string;
}

const ProductCard = ({
  id,
  image,
  name,
  description,
  price,
  original_price,
  max_installments,
  quantity,
  category,
}: ProductCardProps) => {
  const navigate = useNavigate();
  const isOutOfStock =  quantity < 1 ;

  const { user } = useAuth();
  const isSeller = (user?.role == 'seller');
  const discount = original_price
    ? Math.round(
      ((original_price - price) / original_price) * 100
    )
    : 0;

 
  return (
    <div
      className={`group relative overflow-hidden rounded-lg bg-card transition-smooth hover:shadow-hover cursor-pointer ${isOutOfStock ? "opacity-80" : ""
        }`}
      onClick={() => {
        if (!isOutOfStock) {
          navigate(`/product/${id}`);
        }
      }}
    >
        
      {/* Faixa Esgotado */}
      {isOutOfStock && (
        <div className="absolute top-4 left-[-40px] z-10 rotate-[-45deg] bg-red-600 text-white text-xs font-semibold px-12 py-1">
          ESGOTADO
        </div>
      )}

      {/* Image */}
      <div className="aspect-square overflow-hidden bg-muted relative">
        <img
          src={image}
          alt={name}
          className={`h-full w-full object-contain transition-smooth ${isOutOfStock ? "grayscale" : "group-hover:scale-105"
            }`}
        />
        {/* <ProductCarousel/> */}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {(discount > 0) && (!isOutOfStock) && (
            // <span className="bg-primary px-1 font-bold text-sm  rounded">{discount}% OFF</span>
            <span className=" bg-primary text-muted rounded-full px-3 py-1.5 font-bold text-sm shadow-lg animate-scale-in">{discount}% OFF</span>
          )}
          {/* {quantity > 0 && quantity <= 5 && (
            <span className="text-orange-500">Últimas unidades!</span>
          )} */}
         
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-base font-medium mt-1">{name}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {description}
          </p>
          {/* <p> Quantidade: {quantity}</p> */}
        </div>

        <div className="flex items-center justify-between">
          {/* <p className="text-lg font-light">
            R$ {price.toFixed(2).replace(".", ",")}
          </p> */}

          <div className="mt-3">
            {original_price && original_price > price && !isSeller && (
              <p className="text-sm text-muted-foreground ">{formatPrice(original_price)}</p>
            )}
            { ( max_installments > 0) && !isSeller ?
            (<><p className="price-current">  <span className="text-sm text-muted-foreground line"> {max_installments}x </span>  {formatPrice(original_price / max_installments)}</p><p className="text-sm text-muted-foreground line">Ou {formatPrice(price)} à vista </p></>
            ):
            (<p className="price-current">   {formatPrice(price)}</p>)}
     
            {discount > 0 && !isSeller &&(
              <p className="price-discount-percent mt-1">
                {discount}% de desconto
              </p>
            )}
          </div>
          {/* 
          <Button
            size="sm"
            variant="default"
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) {
                navigate(`/product/${id}`);
              }
            }}
          >
            {isOutOfStock ? "Indisponível" : "Ver Detalhes"}
          </Button> */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    size="sm"
                    variant="default"
                    disabled={isOutOfStock}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isOutOfStock) {
                        navigate(`/product/${id}`);
                      }
                    }}
                  >
                    {isOutOfStock ? "Indisponível" : "Ver Detalhes"}
                  </Button>
                </span>
              </TooltipTrigger>

              {isOutOfStock && (
                <TooltipContent>
                  <p>Produto indisponível</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

        </div>


      </div>
    </div>
  );
};

export default ProductCard;
