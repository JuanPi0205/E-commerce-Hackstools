import { z } from "zod";

export const configSchema = z.object({
  shopifyShop: z.string(),
  publicShopifyAccessToken: z.string(),
  privateShopifyAccessToken: z.string(),
  apiVersion: z.string(),
});

export const MoneyV2Result = z.object({
  amount: z.string(),
  currencyCode: z.string(),
});

export const ImageResult = z
  .object({
    altText: z.string().nullable().optional(),
    url: z.string(),
    width: z.number().positive().int().optional(),
    height: z.number().positive().int().optional(),
  })
  .nullable();

export const CartItemResult = z.object({
  id: z.string(),
  cost: z.object({
    amountPerQuantity: MoneyV2Result,
    subtotalAmount: MoneyV2Result,
    totalAmount: MoneyV2Result,
  }),
  merchandise: z.object({
    id: z.string(),
    title: z.string(),
    product: z.object({
      title: z.string(),
      handle: z.string(),
    }),
    image: ImageResult.nullable(),
  }),
  quantity: z.number().positive().int(),
});

export const CartResult = z
  .object({
    id: z.string(),
    cost: z.object({
      subtotalAmount: MoneyV2Result,
    }),
    checkoutUrl: z.string(),
    totalQuantity: z.number().int(),
    lines: z.object({
      nodes: z.array(CartItemResult),
    }),
  })
  .nullable();

export const VariantResult = z.object({
  id: z.string(),
  title: z.string(),
  availableForSale: z.boolean(),
  quantityAvailable: z.number().int().optional(),
  price: MoneyV2Result,
  compareAtPrice: MoneyV2Result.nullable().optional(), // <-- Añade esta línea
});

export const ProductResult = z
  .object({
    id: z.string(),
    title: z.string(),
    handle: z.string(),
    description: z.string().optional(),
    images: z.object({
      nodes: z.array(ImageResult),
    }),
    variants: z.object({
      nodes: z.array(VariantResult),
    }),
    featuredImage: ImageResult.nullable().optional(),
  })
  .nullable();

export const ProductsResponseSchema = z.object({
  data: z.object({
    products: z.object({
      pageInfo: z.object({
        hasNextPage: z.boolean(),
        endCursor: z.string().nullable().optional(),
      }).optional(),
      edges: z.array(
        z.object({
          node: ProductResult,
        })
      ),
    }),
  }),
});

export const ProductResponseSchema = z.object({
  data: z.object({
    product: ProductResult,
  }),
});

export const CartResponseSchema = z.object({
  data: z.object({
    cart: CartResult,
  }),
});

export const CartCreateResponseSchema = z.object({
  data: z.object({
    cartCreate: z.object({
      cart: CartResult,
      userErrors: z.array(z.any()).optional(),
    }),
  }),
});

export const CartLinesAddResponseSchema = z.object({
  data: z.object({
    cartLinesAdd: z.object({
      cart: CartResult,
      userErrors: z.array(z.any()).optional(),
    }),
  }),
});

export const CartLinesRemoveResponseSchema = z.object({
  data: z.object({
    cartLinesRemove: z.object({
      cart: CartResult,
      userErrors: z.array(z.any()).optional(),
    }),
  }),
});

export const CartLinesUpdateResponseSchema = z.object({
  data: z.object({
    cartLinesUpdate: z.object({
      cart: CartResult,
      userErrors: z.array(z.any()).optional(),
    }),
  }),
});

export const CollectionsResponseSchema = z.object({
  data: z.object({
    collections: z.object({
      edges: z.array(
        z.object({
          node: z.object({
            id: z.string(),
            title: z.string(),
            handle: z.string(),
            image: ImageResult,
          }),
        })
      ),
    }),
  }),
});

export const CollectionResponseSchema = z.object({
  data: z.object({
    collection: z.object({
      products: z.object({
        pageInfo: z.object({
          hasNextPage: z.boolean(),
          endCursor: z.string().nullable().optional(),
        }).optional(),
        edges: z.array(
          z.object({
            node: ProductResult,
          })
        ),
      }).nullable().optional(),
    }).nullable(),
  }),
});
