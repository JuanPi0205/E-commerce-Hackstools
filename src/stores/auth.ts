// src/stores/auth.ts
import { atom } from 'nanostores';

/**
 * Lee una cookie del cliente.
 * Se usa para saber si existe la cookie pública no sensible que indica que estamos logueados.
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null; // Previene errores en el lado del servidor SSR
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

// Inicializamos el estado verificando si existe la cookie que dejamos en /auth/callback
const initialAuthState = getCookie('customer_auth') === '1';

// Almacén global para verificar la autenticación en componentes Vanilla JS o frameworks UI
export const $isAuthenticated = atom<boolean>(initialAuthState);

/**
 * Función genérica de logout desde el UI (para desloguear localmente)
 * Idealmente, también haríamos una llamada a un endpoint /auth/logout para eliminar
 * la cookie segura HttpOnly y revocar el token en Shopify.
 */
export function logout() {
  if (typeof document !== 'undefined') {
    document.cookie = 'customer_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
  $isAuthenticated.set(false);
  window.location.href = '/'; // Redirige tras logout
}
