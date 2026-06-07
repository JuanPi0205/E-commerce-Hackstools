// src/pages/auth/login.ts
import type { APIRoute } from 'astro';
import { getOpenIdConfiguration } from '../../utils/customer';
import { generateRandomString, generateCodeChallenge } from '../../utils/pkce';

const clientId = import.meta.env.PUBLIC_SHOPIFY_CUSTOMER_CLIENT_ID;
// Traemos la URL base del .env
const siteUrl = import.meta.env.PUBLIC_SITE_URL;

export const GET: APIRoute = async ({ cookies, redirect, url }) => {
  if (!clientId || !siteUrl) {
    return new Response('Error: Variables de entorno no configuradas', { status: 500 });
  }

  try {
    const config = await getOpenIdConfiguration();

    // Generar state y PKCE challenge
    const state = generateRandomString(32);
    const codeVerifier = generateRandomString(64);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const nonce = generateRandomString(32); // Recomendado para OIDC

    // Guardar en cookies HttpOnly para validar luego en el callback
    const cookieOpts = { httpOnly: true, secure: true, path: '/', maxAge: 60 * 10 }; // 10 min expiración
    cookies.set('oauth_state', state, cookieOpts);
    cookies.set('oauth_verifier', codeVerifier, cookieOpts);
    cookies.set('oauth_nonce', nonce, cookieOpts);

    // Normalizamos el origen (quita "/" final o paths) para que coincida
    // EXACTAMENTE con el Callback URI y el JavaScript origin registrados en Shopify.
    const siteOrigin = new URL(siteUrl).origin;
    const redirectUri = `${siteOrigin}/auth/callback`;

    // Construir la URL de autorización
    const authUrl = new URL(config.authorization_endpoint);
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('scope', 'openid email customer-account-api:full');
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');
    authUrl.searchParams.append('nonce', nonce);
    authUrl.searchParams.append('prompt', 'login');

    return redirect(authUrl.toString());
  } catch (error: any) {
    console.error('Error en el endpoint de login:', error);
    return new Response(`Error interno: ${error.message}`, { status: 500 });
  }
};