// src/utils/wishlist.ts

export interface WishlistItem {
  id: string;
  title: string;
  price: number;
  image: string;
  handle: string;
}

const STORAGE_KEY = "hacktool_wishlist";

function safeParse(json: string | null): WishlistItem[] {
  if (!json) return [];
  try {
    const data = JSON.parse(json);
    if (Array.isArray(data)) return data as WishlistItem[];
    return [];
  } catch {
    return [];
  }
}

function readWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.sessionStorage.getItem(STORAGE_KEY));
}

function writeWishlist(list: WishlistItem[]) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(
    new CustomEvent<WishlistItem[]>("wishlist:updated", { detail: list })
  );
}

export function getWishlist(): WishlistItem[] {
  return readWishlist();
}

export function getWishlistCount(): number {
  return readWishlist().length;
}

export function isInWishlist(id: string): boolean {
  return readWishlist().some((item) => item.id === id);
}

export function toggleWishlist(product: WishlistItem): boolean {
  const list = readWishlist();
  const idx = list.findIndex((item) => item.id === product.id);
  if (idx >= 0) {
    list.splice(idx, 1);
    writeWishlist(list);
    return false; // removed
  } else {
    list.push(product);
    writeWishlist(list);
    return true; // added
  }
}

export function removeFromWishlist(id: string): WishlistItem[] {
  const list = readWishlist().filter((item) => item.id !== id);
  writeWishlist(list);
  return list;
}
