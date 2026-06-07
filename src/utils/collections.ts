// src/utils/collections.ts
// Utilidad para traer los datos (título, descripción, imagen) de UNA colección por su handle.
// Se mantiene aparte de shopify.ts para no interferir con cambios en progreso de ese archivo.
import { COLLECTION_INFO_QUERY } from "./graphql";

const domain =
  import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN ||
  import.meta.env.PUBLIC_SHOPIFY_SHOP ||
  "";
const storefrontAccessToken =
  import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const apiVersion = import.meta.env.PUBLIC_SHOPIFY_API_VERSION || "2024-01";

export interface CollectionInfo {
  handle: string;
  title: string;
  description: string;
  image: string | null;
}

export async function getCollectionByHandle(
  handle: string
): Promise<CollectionInfo | null> {
  if (!domain || !storefrontAccessToken || !handle) return null;

  const endpoint = `https://${domain.trim()}/api/${apiVersion}/graphql.json`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken.trim(),
      },
      body: JSON.stringify({ query: COLLECTION_INFO_QUERY, variables: { handle } }),
    });

    const body = await res.json();
    if (body.errors) {
      console.error("GraphQL Errors (getCollectionByHandle):", body.errors);
      return null;
    }

    const c = body?.data?.collection;
    if (!c) return null;

    return {
      handle: c.handle,
      title: c.title,
      description: c.description || "",
      image: c.image?.url || null,
    };
  } catch (error) {
    console.error("getCollectionByHandle error:", error);
    return null;
  }
}
