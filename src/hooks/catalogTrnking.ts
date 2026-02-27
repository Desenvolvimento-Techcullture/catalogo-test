import { Product, CartItem, Order, User, PaymentMethod, ShippingMethod } from "@/lib/types";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { company } from "@/assets/data.js";

export const useCatalogTracking = () => {
  const { authFetch } = useAuthFetch();

  const pushToDataLayer = (event: string, data: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event,
        ...data,
      });
    } else {
      console.log("Tracking event:", event, data);
    }

    authFetch({
      url: `analytcs.php?event=${event}`,
      method: "POST",
      body: data,
    });
  };

  
/**
 *  Visualização de Produto
 */
const trackViewProduct = (product: Product) => {
    pushToDataLayer("view_item",
      {
        id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
      });
  };
  /**
   *  Visitas na página
   */
  const trackPageVisiting = (url: string = company.site) => {
    pushToDataLayer("page_visiting",
      {
        id: url,
       
      });
  };
  
  /**
   *  Adicionar ao Carrinho
   */
  const trackAddToCart = (item: CartItem) => {
    pushToDataLayer("add_to_cart", {
      id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    });
  };
  
  /**
   *  Remover do Carrinho
   */
  const trackRemoveFromCart = (item: CartItem) => {
    pushToDataLayer("remove_from_cart", {
      id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    });
  };
  
  /**
   *  Início do Checkout
   */
  const trackBeginCheckout = (items: CartItem[]) => {
  
    items.map((item) => pushToDataLayer("begin_checkout", {
      id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))
  
  };
  
  /**
   *  Seleção de Frete
   */
  const trackSelectShipping = (method: ShippingMethod, cost: number) => {
    pushToDataLayer("select_shipping", {
      shipping_method: method,
      value: cost,
    });
  };
  
  /**
   *  Seleção de Pagamento
   */
  const trackSelectPayment = (method: PaymentMethod) => {
    pushToDataLayer("select_payment", {
      payment_method: method,
    });
  };
  
  /**
   *  Compra Finalizada
   */
  const trackPurchase = (order: any) => {
    pushToDataLayer("purchase", {
      ecommerce: {
        transaction_id: order.id,
        currency: "BRL",
        value: order.total / 100,
        shipping: order.shipping.cost / 100,
        items: order.items.map((item) => ({
          id: item.id,
          item_name: item.name,
          price: item.price / 100,
          quantity: item.quantity,
        })),
      },
    });
  };
  
  /**
   *  Login
   */
  const trackLogin = (user: User) => {
    pushToDataLayer("login", {
      user_id: user.id,
      method: "email",
    });
  };
  
  /**
   *  Registro
   */
  const trackRegister = (user: User) => {
    pushToDataLayer("sign_up", {
      user_id: user.id,
      method: "email",
    });
  };
  

  return {
    trackViewProduct,
    trackPageVisiting,
    trackAddToCart,
    trackRemoveFromCart,
    trackBeginCheckout,
    trackSelectShipping,
    trackSelectPayment,
    trackPurchase,
    trackLogin,
    trackRegister,
    // exporta os outros também
  };
};
