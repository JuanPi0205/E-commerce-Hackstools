import {
  ProductsQuery,
  ProductByHandleQuery,
  GetCartQuery,
  CreateCartMutation,
  AddCartLinesMutation,
  RemoveCartLinesMutation,
  UpdateCartLinesMutation,
} from "./graphql";
import {
  ProductsResponseSchema,
  ProductResponseSchema,
  CartResponseSchema,
  CartCreateResponseSchema,
  CartLinesAddResponseSchema,
  CartLinesRemoveResponseSchema,
  CartLinesUpdateResponseSchema,
  CollectionsResponseSchema,
  CollectionResponseSchema
} from "./schemas";
import { COLLECTIONS_QUERY, PRODUCTS_QUERY, COLLECTION_QUERY } from './graphql';

const domain = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN || import.meta.env.PUBLIC_SHOPIFY_SHOP || "";
const storefrontAccessToken = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const endpoint = `https://${domain}/api/2024-01/graphql.json`;


interface ShopifyFetchParams {
  query: string;
  variables?: Record<string, any>;
}

interface CollectionOptions {
  first?: number;
  sortKey?: string;
  reverse?: boolean;
}

interface CollectionResponse {
  collection?: {
    products?: {
      edges: any[];
    };
  };
}

export interface GetProductsOptions {
  first?: number;
  after?: string;
  sortKey?: string;
  reverse?: boolean;
}

async function shopifyFetch<T>({ query, variables }: ShopifyFetchParams): Promise<T> {
  if (!domain || !storefrontAccessToken) {
    throw new Error("Missing Shopify environment variables: PUBLIC_SHOPIFY_STORE_DOMAIN or PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    const body = await response.json();

    if (body.errors) {
      console.error("GraphQL Errors:", body.errors);
      throw new Error(`GraphQL Errors: ${body.errors[0].message}`);
    }

    return body as T;
  } catch (error) {
    console.error("Shopify Fetch Network/Parse Error:", error);
    throw error;
  }
}

// ===== EXPORTED FUNCTIONS =====

export async function getProducts(options: GetProductsOptions = {}) {
  const { first = 10, after, sortKey, reverse } = options;

  const data = await shopifyFetch({
    query: PRODUCTS_QUERY,
    variables: {
      first,
      after,
      sortKey,
      reverse
    }
  });

  // Usamos el esquema de Zod que ya tienes creado para validar y extraer la data correctamente
  const parsedData = ProductsResponseSchema.parse(data);
  return parsedData.data.products.edges.map((edge) => edge.node) || [];
}

export async function getProductByHandle(handle: string) {
  const data = await shopifyFetch({
    query: ProductByHandleQuery,
    variables: { handle },
  });

  const parsedData = ProductResponseSchema.parse(data);
  return parsedData.data.product;
}

export async function getCart(cartId: string) {
  const data = await shopifyFetch({
    query: GetCartQuery,
    variables: { id: cartId },
  });

  const parsedData = CartResponseSchema.parse(data);
  return parsedData.data.cart;
}

export async function createCart(merchandiseId: string, quantity: number = 1) {
  const data = await shopifyFetch({
    query: CreateCartMutation,
    variables: { id: merchandiseId, quantity },
  });

  const parsedData = CartCreateResponseSchema.parse(data);
  return parsedData.data.cartCreate.cart;
}

export async function addCartLines(cartId: string, merchandiseId: string, quantity: number = 1) {
  const data = await shopifyFetch({
    query: AddCartLinesMutation,
    variables: { cartId, merchandiseId, quantity },
  });

  const parsedData = CartLinesAddResponseSchema.parse(data);
  return parsedData.data.cartLinesAdd.cart;
}

export async function removeCartLines(cartId: string, lineIds: string[]) {
  const data = await shopifyFetch({
    query: RemoveCartLinesMutation,
    variables: { cartId, lineIds },
  });

  const parsedData = CartLinesRemoveResponseSchema.parse(data);
  return parsedData.data.cartLinesRemove.cart;
}

export async function updateCartLines(cartId: string, lines: { id: string; quantity: number }[]) {
  const data = await shopifyFetch({
    query: UpdateCartLinesMutation,
    variables: { cartId, lines },
  });

  const parsedData = CartLinesUpdateResponseSchema.parse(data);
  return parsedData.data.cartLinesUpdate.cart;
}

export async function getProductsByCollection(handle: string, options: CollectionOptions = {}) {
  const { first = 10, sortKey = 'COLLECTION_DEFAULT', reverse = false } = options;

  const data = await shopifyFetch({
    query: COLLECTION_QUERY,
    variables: { handle, first, sortKey, reverse }
  });

  const parsedData = CollectionResponseSchema.parse(data);

  return parsedData.data.collection?.products?.edges.map((edge) => edge.node) || [];
}

export async function getCollections(first: number = 10) {
  const data = await shopifyFetch({
    query: COLLECTIONS_QUERY,
    variables: { first }
  });

  const parsedData = CollectionsResponseSchema.parse(data);
  return parsedData.data.collections.edges.map((edge) => edge.node) || [];
}
