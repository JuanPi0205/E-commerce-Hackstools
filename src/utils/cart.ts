// src/utils/cart.ts

export interface CartItem {
  id: string;
  title: string;
  handle: string;
  price: number;
  image: string;
  quantity: number;
}

const STORAGE_KEY = "hacktool_cart";

function safeParse(json: string | null): CartItem[] {
  if (!json) return [];
  try {
    const data = JSON.parse(json);
    if (Array.isArray(data)) return data as CartItem[];
    return [];
  } catch {
    return [];
  }
}

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  return safeParse(raw);
}

function writeCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(
    new CustomEvent<CartItem[]>("cart:updated", { detail: cart })
  );
}

export function getCart(): CartItem[] {
  return readCart();
}

export function getCartCount(cart?: CartItem[]): number {
  const data = cart ?? readCart();
  return data.reduce((sum, item) => sum + item.quantity, 0);
}

interface AddToCartInput {
  id: string;
  title: string;
  handle: string;
  price: number;
  image: string;
}

export function addToCart(product: AddToCartInput, quantity = 1): CartItem[] {
  const cart = readCart();

  const existingIndex = cart.findIndex((item) => item.id === product.id);

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      handle: product.handle,
      price: product.price,
      image: product.image,
      quantity,
    });
  }

  writeCart(cart);
  return cart;
}

export function removeFromCart(id: string): CartItem[] {
  const cart = readCart().filter((item) => item.id !== id);
  writeCart(cart);
  return cart;
}

export function updateQuantity(id: string, delta: number): CartItem[] {
  const cart = readCart();
  const idx = cart.findIndex((item) => item.id === id);
  if (idx < 0) return cart;
  cart[idx].quantity += delta;
  if (cart[idx].quantity <= 0) {
    cart.splice(idx, 1);
  }
  writeCart(cart);
  return cart;
}

export function clearCart(): CartItem[] {
  const cart: CartItem[] = [];
  writeCart(cart);
  return cart;
}
