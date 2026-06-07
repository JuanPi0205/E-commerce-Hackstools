// src/utils/search.ts
// Búsqueda de productos contra la Storefront API de Shopify.
// Se mantiene aparte de shopify.ts para no interferir con cambios en progreso.
import { SEARCH_PRODUCTS_QUERY } from "./graphql";
import { ProductsResponseSchema } from "./schemas";

const domain =
  import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN ||
  import.meta.env.PUBLIC_SHOPIFY_SHOP ||
  "";
const storefrontAccessToken =
  import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const apiVersion = import.meta.env.PUBLIC_SHOPIFY_API_VERSION || "2024-01";

// Construye la query de búsqueda de Shopify: cada palabra como prefijo (*),
// limpiando caracteres que romperían la sintaxis. Ej: "dji drone" -> "dji* drone*".
function buildSearchQuery(raw: string): string {
  return raw
    .trim()
    .split(/\s+/)
    .map((t) => t.replace(/[^\p{L}\p{N}]/gu, "")) // solo letras/números
    .filter(Boolean)
    .map((t) => `${t}*`)
    .join(" ");
}

export async function searchProducts(term: string, first = 50) {
  const cleaned = buildSearchQuery(term || "");
  if (!domain || !storefrontAccessToken || !cleaned) return [];

  const endpoint = `https://${domain.trim()}/api/${apiVersion}/graphql.json`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken.trim(),
      },
      body: JSON.stringify({
        query: SEARCH_PRODUCTS_QUERY,
        variables: { query: cleaned, first },
      }),
    });

    const body = await res.json();
    if (body.errors) {
      console.error("GraphQL Errors (searchProducts):", body.errors);
      return [];
    }

    const parsed = ProductsResponseSchema.parse(body);
    return parsed.data.products.edges.map((e) => e.node);
  } catch (error) {
    console.error("searchProducts error:", error);
    return [];
  }
}
