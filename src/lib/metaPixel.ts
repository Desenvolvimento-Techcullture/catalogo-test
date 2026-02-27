// Meta Pixel Helper
// Replace this with your real Pixel ID
const META_PIXEL_ID = "123456789012345";

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: (...args: unknown[]) => void;
  }
}

export const initMetaPixel = () => {
  if (typeof window === "undefined" || window.fbq) return;

  const f = window;
  const b = document;
  const n = function (...args: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
  } as unknown as Window["fbq"] & {
    callMethod?: (...args: unknown[]) => void;
    queue: unknown[];
    loaded: boolean;
    version: string;
    push: (...args: unknown[]) => void;
  };

  if (!f.fbq) f.fbq = n;
  f._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];

  const s = b.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  const firstScript = b.getElementsByTagName("script")[0];
  firstScript.parentNode?.insertBefore(s, firstScript);

  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");
};

export const trackPageView = () => {
  if (window.fbq) window.fbq("track", "PageView");
};

export const trackViewContent = (product: {
  id: string;
  name: string;
  category: string;
  price: number;
}) => {
  if (window.fbq) {
    window.fbq("track", "ViewContent", {
      content_ids: [product.id],
      content_name: product.name,
      content_category: product.category,
      content_type: "product",
      value: product.price,
      currency: "BRL",
    });
  }
};

export const trackAddToCart = (product: {
  id: string;
  name: string;
  category: string;
  price: number;
}) => {
  if (window.fbq) {
    window.fbq("track", "AddToCart", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: product.price,
      currency: "BRL",
    });
  }
};

export const trackPurchase = (value: number, items: { id: string }[]) => {
  if (window.fbq) {
    window.fbq("track", "Purchase", {
      content_ids: items.map((i) => i.id),
      content_type: "product",
      value,
      currency: "BRL",
      num_items: items.length,
    });
  }
};

export const trackSearch = (searchString: string) => {
  if (window.fbq) {
    window.fbq("track", "Search", {
      search_string: searchString,
    });
  }
};

export const trackViewCategory = (category: string) => {
  if (window.fbq) {
    window.fbq("track", "ViewContent", {
      content_category: category,
      content_type: "product_group",
    });
  }
};
