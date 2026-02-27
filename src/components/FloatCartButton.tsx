import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function FloatingCartButton() {
  
    const { itemCount } = useCart();
    const navigate = useNavigate();

    return (
          <Link
            to="/cart"
            className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white text-2xl shadow-lg md:hidden"
          >
            <ShoppingCart/>

            {itemCount > 0 && (
              <span className="
                absolute -top-1 -right-1
                flex h-5 w-5 items-center justify-center
                rounded-full bg-red-600 text-xs font-bold
              ">
                {itemCount}
              </span>
            )}
          </Link>

        // <Button
        //     variant="ghost"
        //     size="icon"
        //     className="hidden md:flex relative"
        //     onClick={() => navigate("/cart")}
        // >
        //     <ShoppingBag className="h-5 w-5" />
        //     {itemCount > 0 && (
        //         <Badge
        //             className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        //         >
        //             {itemCount}
        //         </Badge>
        //     )}
        // </Button>
    );
}