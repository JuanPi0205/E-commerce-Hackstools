import type { z } from "zod";
import { atom } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import {
  getCart,
  addCartLines,
  createCart,
  removeCartLines,
  updateCartLines,
} from "../utils/shopify";
import type { CartResult } from "../utils/schemas";

// Cart drawer state (open or closed) with initial value (false) and no persistent state (local storage)
export const isCartDrawerOpen = atom(false);

// Cart is updating state (true or false) with initial value (false) and no persistent state (local storage)
export const isCartUpdating = atom(false);

const emptyCart: z.infer<typeof CartResult> = {
  id: "",
  checkoutUrl: "",
  totalQuantity: 0,
  lines: { nodes: [] },
  cost: { subtotalAmount: { amount: "0.0", currencyCode: "USD" } },
};

// Cart store with persistent state (local storage) and initial value
export const cart = persistentAtom<z.infer<typeof CartResult>>(
  "cart",
  emptyCart,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

// Fetch cart data if a cart exists in local storage
export async function initCart() {
  const localCart = cart.get();
  const cartId = localCart?.id;

  if (cartId) {
    isCartUpdating.set(true);
    try {
      const data = await getCart(cartId);
      if (data) {
        cart.set({
          id: data.id,
          cost: data.cost,
          checkoutUrl: data.checkoutUrl,
          totalQuantity: data.totalQuantity,
          lines: data.lines,
        });
      } else {
        // If the cart doesn't exist in Shopify (expired or invalid), reset the cart store
        cart.set(emptyCart);
      }
    } catch (error) {
      console.error("Error initializing cart:", error);
      cart.set(emptyCart);
    } finally {
      isCartUpdating.set(false);
    }
  }
}

// Add item to cart or create a new cart if it doesn't exist yet
export async function addCartItem({ variantId, quantity }: { variantId: string; quantity: number }) {
  const localCart = cart.get();
  const cartId = localCart?.id;

  isCartUpdating.set(true);

  try {
    if (!cartId) {
      const cartData = await createCart(variantId, quantity);
      if (cartData) {
        cart.set({
          id: cartData.id,
          cost: cartData.cost,
          checkoutUrl: cartData.checkoutUrl,
          totalQuantity: cartData.totalQuantity,
          lines: cartData.lines,
        });
        isCartDrawerOpen.set(true);
      }
    } else {
      const cartData = await addCartLines(cartId, variantId, quantity);
      if (cartData) {
        cart.set({
          id: cartData.id,
          cost: cartData.cost,
          checkoutUrl: cartData.checkoutUrl,
          totalQuantity: cartData.totalQuantity,
          lines: cartData.lines,
        });
        isCartDrawerOpen.set(true);
      } else {
        // Fallback: If addCartLines fails (e.g., cart expired), create a new one
        console.warn("Existing cart is invalid or expired, creating a new one.");
        const newCartData = await createCart(variantId, quantity);
        if (newCartData) {
          cart.set({
            id: newCartData.id,
            cost: newCartData.cost,
            checkoutUrl: newCartData.checkoutUrl,
            totalQuantity: newCartData.totalQuantity,
            lines: newCartData.lines,
          });
          isCartDrawerOpen.set(true);
        }
      }
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
  } finally {
    isCartUpdating.set(false);
  }
}

export async function removeCartItem(lineId: string) {
  const localCart = cart.get();
  const cartId = localCart?.id;

  if (!cartId) return;

  isCartUpdating.set(true);

  try {
    const cartData = await removeCartLines(cartId, [lineId]);
    if (cartData) {
      cart.set({
        id: cartData.id,
        cost: cartData.cost,
        checkoutUrl: cartData.checkoutUrl,
        totalQuantity: cartData.totalQuantity,
        lines: cartData.lines,
      });
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
  } finally {
    isCartUpdating.set(false);
  }
}

export async function updateCartItemQuantity(lineId: string, quantity: number) {
  const localCart = cart.get();
  const cartId = localCart?.id;

  if (!cartId) return;

  isCartUpdating.set(true);

  try {
    const cartData = await updateCartLines(cartId, [{ id: lineId, quantity }]);
    if (cartData) {
      cart.set({
        id: cartData.id,
        cost: cartData.cost,
        checkoutUrl: cartData.checkoutUrl,
        totalQuantity: cartData.totalQuantity,
        lines: cartData.lines,
      });
    }
  } catch (error) {
    console.error("Error updating item quantity:", error);
  } finally {
    isCartUpdating.set(false);
  }
}
