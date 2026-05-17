import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { CartItem } from "@/lib/types/product";
import { Product, PaymentMethod } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selectedSize?: string) => void;
  removeFromCart: (id: string, selectedSize?: string) => void;
  updateQuantity: (id: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  getPrice: (item: CartItem) => number;
  setPaymentMethod: (method: PaymentMethod) => void;
  discount: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Pix")

  const addToCart = (product: Product, selectedSize?: string) => {
    setItems((prev) => {
      const existingItem = prev.find(
        (item) => item.id === product.id && item.selectedSize === selectedSize
      );

      if (existingItem) {
        toast({
          title: "Quantidade atualizada",
          description: `${product.name} adicionado ao carrinho`,
        });
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      toast({
        title: "Produto adicionado",
        description: `${product.name} foi adicionado ao carrinho`,
      });

      return [...prev, { ...product, quantity: 1, selectedSize }];
    });
  };

  const removeFromCart = (id: string, selectedSize?: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.id === id && item.selectedSize === selectedSize))
    );
  };

  const updateQuantity = (id: string, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, selectedSize);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    );
  };

  const discount = useMemo( () =>{

    return items.reduce(
      (sum, item) => {
        return ( ["Pix","Dinheiro"].includes(paymentMethod) ? 
        sum + (item.original_price ?? item.price) - item.price
      : 0) },
      0
    );

  },[items, paymentMethod]

  )
  const clearCart = () => {
    setItems([]);
  };
  
  // const getPrice = (item: CartItem) =>  (["Pix","Dinheiro"].includes(paymentMethod) ) ? item.price : item.original_price;
  const getPrice = (item: CartItem) => {
    // switch (paymentMethod) {
    //   case "Pix":
    //   case "Dinheiro":
    //     return item.price;
    //   default:
    //     return item.original_price ?? item.price;
    // }
    return (item.original_price ?? item.price);
  };
  
  const total = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + getPrice(item) * item.quantity,
      0
    );
  }, [items, paymentMethod]);
  
  // const total = items.reduce((sum, item) => sum + getPrice(item) * item.quantity, 0);
  const itemCount = useMemo( () => {
      return items.reduce((sum, item) => sum + item.quantity, 0);
  },[items])

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getPrice,
        setPaymentMethod,
        discount,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
