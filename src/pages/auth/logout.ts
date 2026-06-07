// src/pages/auth/logout.ts
import type { APIRoute } from 'astro';
import { getOpenIdConfiguration } from '../../utils/customer';

const siteUrl = import.meta.env.PUBLIC_SITE_URL;

export const GET: APIRoute = async ({ cookies, redirect }) => {
  // Guardamos el id_token antes de borrar las cookies (lo necesita Shopify para el logout).
  const idToken = cookies.get('customer_id_token')?.value;

  // Limpiar todas las cookies de la sesión local
  cookies.delete('customer_access_token', { path: '/' });
  cookies.delete('customer_refresh_token', { path: '/' });
  cookies.delete('customer_id_token', { path: '/' });
  cookies.delete('customer_auth', { path: '/' });

  // Si tenemos id_token, cerramos sesión también en Shopify (single sign-out).
  // post_logout_redirect_uri debe coincidir con el "Logout URI" registrado en Shopify.
  try {
    const config = await getOpenIdConfiguration();
    if (idToken && config.end_session_endpoint && siteUrl) {
      const postLogoutRedirect = `${new URL(siteUrl).origin}/`;
      const logoutUrl = new URL(config.end_session_endpoint);
      logoutUrl.searchParams.append('id_token_hint', idToken);
      logoutUrl.searchParams.append('post_logout_redirect_uri', postLogoutRedirect);
      return redirect(logoutUrl.toString());
    }
  } catch (error) {
    console.error('No se pudo cerrar sesión en Shopify, se hace logout local:', error);
  }

  // Fallback: logout local (cookies ya borradas) y al inicio.
  return redirect('/');
};
