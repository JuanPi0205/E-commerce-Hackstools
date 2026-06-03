// src/pages/auth/logout.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies, redirect }) => {
  // Limpiar todas las cookies de la sesión
  cookies.delete('customer_access_token', { path: '/' });
  cookies.delete('customer_refresh_token', { path: '/' });
  cookies.delete('customer_auth', { path: '/' });

  // Redirigir al inicio o login
  return redirect('/');
};
