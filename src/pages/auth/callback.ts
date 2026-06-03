// src/pages/auth/callback.ts
import type { APIRoute } from 'astro';
import { getOpenIdConfiguration } from '../../utils/customer';

const clientId = import.meta.env.PUBLIC_SHOPIFY_CUSTOMER_CLIENT_ID;
// Traemos la URL base del .env
const siteUrl = import.meta.env.PUBLIC_SITE_URL;

export const GET: APIRoute = async ({ request, url, cookies, redirect }) => {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const savedState = cookies.get('oauth_state')?.value;
  const codeVerifier = cookies.get('oauth_verifier')?.value;

  if (!code || !state || !savedState || !codeVerifier) {
    return new Response('Parámetros OAuth inválidos o sesión expirada', { status: 400 });
  }

  if (state !== savedState) {
    return new Response('State mismatch, posible ataque CSRF', { status: 403 });
  }

  try {
    const config = await getOpenIdConfiguration();
    
    // Usamos la variable de entorno aquí
    const redirectUri = `${siteUrl}/auth/callback`;

    // Intercambiar el código por los tokens
    const tokenBody = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      redirect_uri: redirectUri,
      code,
      code_verifier: codeVerifier
    });

    const tokenResponse = await fetch(config.token_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenBody.toString(),
    });

    if (!tokenResponse.ok) {
      const err = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${err}`);
    }

    const tokenData = await tokenResponse.json();

    // 1. Guardar tokens de forma segura
    cookies.set('customer_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: tokenData.expires_in || 3600 // Usualmente 1-2 horas
    });

    if (tokenData.refresh_token) {
      cookies.set('customer_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 días
      });
    }

    // 2. Cookie pública para Nanostores 
    cookies.set('customer_auth', '1', {
      httpOnly: false, 
      secure: import.meta.env.PROD, 
      path: '/',
      maxAge: tokenData.expires_in || 3600
    });

    // 3. Limpiar cookies temporales del OAuth
    cookies.delete('oauth_state', { path: '/' });
    cookies.delete('oauth_verifier', { path: '/' });
    cookies.delete('oauth_nonce', { path: '/' });

    // Redirigir al dashboard del cliente (por ahora redirigimos al home)
    return redirect('/');
  } catch (error: any) {
    console.error('Error procesando callback de OAuth:', error);
    return new Response(`Error interno: ${error.message}`, { status: 500 });
  }
};