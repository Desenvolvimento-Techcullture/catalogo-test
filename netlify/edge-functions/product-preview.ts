export const config = {
  path: "/product/*",
};

type EdgeContext = {
  next: () => Promise<Response>;
};

type Product = {
  id?: string | number;
  name?: string;
  short?: string;
  description?: string;
  price?: number;
  images?: unknown;
};

type MetaTag = {
  property?: string;
  name?: string;
  content: string;
};

const CRAWLER_AGENT = /facebookexternalhit|whatsapp|twitterbot|linkedinbot|slackbot|telegrambot|discordbot|googlebot|bingbot/i;
const DEFAULT_DESCRIPTION = "Distrimov atacarejo: móveis e produtos com preços especiais em Belo Horizonte.";
const DEFAULT_API = "https://techculture.portaldeanuncios.com/distrimov/api/";
const EMPTY_DOCUMENT = '<!doctype html><html lang="pt-BR"><head></head><body><div id="root"></div></body></html>';

function env(key: string): string | undefined {
  const runtime = globalThis as unknown as {
    Netlify?: { env: { get(name: string): string | undefined } };
    Deno?: { env: { get(name: string): string | undefined } };
  };
  try {
    return runtime.Netlify?.env.get(key) ?? runtime.Deno?.env.get(key);
  } catch {
    return undefined;
  }
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function plainText(value: unknown): string {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatPrice(value: unknown): string | null {
  const price = Number(value);
  if (!Number.isFinite(price) || price <= 0) return null;
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  } catch {
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  }
}

function asProductList(data: unknown): Product[] {
  if (Array.isArray(data)) return data as Product[];
  if (data && typeof data === "object") {
    const object = data as Record<string, unknown>;
    for (const key of ["data", "products", "results", "reg", "items"]) {
      if (Array.isArray(object[key])) return object[key] as Product[];
    }
  }
  return [];
}

function firstImage(value: unknown): string | undefined {
  const candidates = Array.isArray(value) ? value : value ? [value] : [];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && !candidate.startsWith("data:")) {
      return candidate;
    }
    if (candidate && typeof candidate === "object") {
      const object = candidate as Record<string, unknown>;
      const url = object.url ?? object.image ?? object.src;
      if (typeof url === "string" && !url.startsWith("data:")) return url;
    }
  }
  return undefined;
}

function absoluteImage(raw: string | undefined, origin: string, imageBase: string): string | undefined {
  if (!raw) return undefined;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;
  if (raw.startsWith("/")) return new URL(raw, origin).href;
  return `${imageBase}${raw}`;
}

function buildDocument(baseHtml: string, title: string, tags: MetaTag[]): string {
  const head = tags
    .map((tag) => {
      const attribute = tag.property
        ? `property="${escapeHtml(tag.property)}"`
        : `name="${escapeHtml(tag.name)}"`;
      return `<meta ${attribute} content="${escapeHtml(tag.content)}" />`;
    })
    .join("\n    ");

  let html = baseHtml
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta\b[^>]*\b(?:property|name)\s*=\s*["'](?:og:|twitter:)[^"']*["'][^>]*>/gi, "")
    .replace(/<meta\b[^>]*\bname\s*=\s*["']description["'][^>]*>/gi, "");

  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `    ${head}\n  </head>`);
  } else if (/<head\b[^>]*>/i.test(html)) {
    html = html.replace(/<head\b[^>]*>/i, `$&\n    ${head}`);
  } else {
    html = `${head}\n${html}`;
  }

  return html;
}

export default async function productPreview(request: Request, context: EdgeContext): Promise<Response> {
  const userAgent = request.headers.get("user-agent") ?? "";
  if (!CRAWLER_AGENT.test(userAgent)) return context.next();

  const url = new URL(request.url);
  const id = url.pathname.split("/").filter(Boolean)[1] ?? "";
  const origin = url.origin;

  const configuredSite = env("SITE_URL")?.trim();
  const siteUrl = (
    configuredSite
      ? /^https?:\/\//i.test(configuredSite)
        ? configuredSite
        : `https://${configuredSite}`
      : origin
  ).replace(/\/+$/, "");

  const apiBase = `${(env("API_BASE_URL") ?? DEFAULT_API).replace(/\/+$/, "")}/`;
  const imageBase = `${(env("PRODUCT_IMAGE_BASE_URL") ?? apiBase.replace(/api\/$/, "")).replace(/\/+$/, "")}/`;
  const fallbackImage = `${siteUrl}/logo.jpg`;
  const productUrl = `${siteUrl}/product/${id}`;

  let baseHtml = EMPTY_DOCUMENT;
  try {
    const page = await fetch(new URL("/index.html", request.url));
    if (page.ok) baseHtml = await page.text();
  } catch {
    baseHtml = EMPTY_DOCUMENT;
  }

  let title = "Distrimov";
  let description = DEFAULT_DESCRIPTION;
  let image = fallbackImage;

  try {
    // const token = env("PRODUCT_API_TOKEN") ?? "";
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AZW1haWwuY29tIiwic3lzIjoiY2F0YWxvZyIsIm93bmVyIjoidGVjaGN1bHR1cmUiLCJpYXQiOjE3Njk1MjQ5NzksImV4cCI6MTc2OTUyODU3OX0=.jZP+Ek0Ojx5JuF7EOTO2C48Y0BgX76JV2STJ5aku2ec=';
    const headers: Record<string, string> = { Accept: "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    let product: Product | undefined;
    const detail = await fetch(`${apiBase}produtos/${encodeURIComponent(id)}/`, { headers });

    if (detail.ok) {
      const data = await detail.json();
      product = Array.isArray(data) ? data[0] : (data as Product);
    } else {
      const list = await fetch(`${apiBase}produtos/`, { headers });
      if (list.ok) {
        product = asProductList(await list.json()).find(
          (item) => String(item.id) === String(id)
        );
      }
    }

    if (product) {
      title = `${product.name ?? "Produto"} | Distrimov`;
      const price = formatPrice(product.price);
      const text = plainText(product.short || product.description);
      description = [price, text].filter(Boolean).join(" — ").slice(0, 200) || description;
      image = absoluteImage(firstImage(product.images), origin, imageBase) ?? fallbackImage;
    }
  } catch {
    title = "Distrimov";
    description = DEFAULT_DESCRIPTION;
    image = fallbackImage;
  }

  const tags: MetaTag[] = [
    { name: "description", content: description },
    { property: "og:site_name", content: "Distrimov" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:image:secure_url", content: image },
    { property: "og:url", content: productUrl },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];

  return new Response(buildDocument(baseHtml, title, tags), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
