// catalogTracking.tsx
import { Product, CartItem, Order, User, PaymentMethod, ShippingMethod } from "./types";

/**
 * Helper genérico para envio ao dataLayer (GTM)
 */
const pushToDataLayer = (event: string, data: Record<string, any>) => {
  if (typeof window !== "undefined" && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event,
      ...data,
    });
  } else {
    console.log("Tracking event:", event, data);
  }
};

/**
 * 🔎 Visualização de Produto
 */
export const trackViewProduct = (product: Product) => {
  pushToDataLayer("view_item", {
    ecommerce: {
      currency: "BRL",
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
        },
      ],
    },
  });
};

/**
 * 🛒 Adicionar ao Carrinho
 */
export const trackAddToCart = (item: CartItem) => {
  pushToDataLayer("add_to_cart", {
    ecommerce: {
      currency: "BRL",
      value: item.price * item.quantity,
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          price: item.price,
          quantity: item.quantity,
          item_variant: item.selectedSize,
        },
      ],
    },
  });
};

/**
 * ❌ Remover do Carrinho
 */
export const trackRemoveFromCart = (item: CartItem) => {
  pushToDataLayer("remove_from_cart", {
    ecommerce: {
      currency: "BRL",
      value: item.price * item.quantity,
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        },
      ],
    },
  });
};

/**
 * 💳 Início do Checkout
 */
export const trackBeginCheckout = (items: CartItem[], total: number) => {
  pushToDataLayer("begin_checkout", {
    ecommerce: {
      currency: "BRL",
      value: total,
      items: items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    },
  });
};

/**
 * 📦 Seleção de Frete
 */
export const trackSelectShipping = (method: ShippingMethod, cost: number) => {
  pushToDataLayer("select_shipping", {
    shipping_method: method,
    value: cost,
  });
};

/**
 * 💰 Seleção de Pagamento
 */
export const trackSelectPayment = (method: PaymentMethod) => {
  pushToDataLayer("select_payment", {
    payment_method: method,
  });
};

/**
 * ✅ Compra Finalizada
 */
export const trackPurchase = (order: Order) => {
  pushToDataLayer("purchase", {
    ecommerce: {
      transaction_id: order.id,
      currency: "BRL",
      value: order.total / 100,
      shipping: order.shipping.cost / 100,
      items: order.items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price / 100,
        quantity: item.quantity,
      })),
    },
  });
};

/**
 * 👤 Login
 */
export const trackLogin = (user: User) => {
  pushToDataLayer("login", {
    user_id: user.id,
    method: "email",
  });
};

/**
 * 📝 Registro
 */
export const trackRegister = (user: User) => {
  pushToDataLayer("sign_up", {
    user_id: user.id,
    method: "email",
  });
};
