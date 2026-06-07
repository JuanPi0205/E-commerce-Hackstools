// src/utils/wishlist.ts
import { $isAuthenticated } from '../stores/auth';

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
  // Usamos localStorage para que persista
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

function writeWishlist(list: WishlistItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(
    new CustomEvent<WishlistItem[]>("wishlist:updated", { detail: list })
  );
}

export function getWishlist(): WishlistItem[] {
  return readWishlist();
}

// Vacía la lista de favoritos LOCAL (localStorage). Se usa al cerrar sesión.
// La lista del usuario sigue guardada en Shopify (metafield) para cuando vuelva a entrar.
export function clearWishlist(): void {
  writeWishlist([]);
}

export function getWishlistCount(): number {
  return readWishlist().length;
}

export function isInWishlist(id: string): boolean {
  return readWishlist().some((item) => item.id === id);
}

export async function toggleWishlist(product: WishlistItem): Promise<boolean> {
  // 1. Validar sesión
  if (!$isAuthenticated.get()) {
    // Redirigimos si intenta agregar sin iniciar sesión
    window.location.href = '/auth/login';
    return false;
  }

  // 2. UI Optimista: Guardar en localStorage para respuesta instantánea
  const list = readWishlist();
  const idx = list.findIndex((item) => item.id === product.id);
  let isAdded = false;

  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(product);
    isAdded = true;
  }
  
  writeWishlist(list);

  // 3. Sincronizar en background con Shopify Admin API (Metafield)
  try {
    const res = await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id })
    });
    
    if (!res.ok) {
      console.error('No se pudo guardar el favorito en Shopify');
    }
  } catch (error) {
    console.error('Error de red al guardar en la wishlist', error);
  }

  return isAdded;
}

export async function removeFromWishlist(id: string): Promise<WishlistItem[]> {
  const list = readWishlist().filter((item) => item.id !== id);
  writeWishlist(list);
  
  // Sincronizar eliminación en background
  if ($isAuthenticated.get()) {
    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id })
      });
    } catch (e) {
      console.error(e);
    }
  }
  
  return list;
}
