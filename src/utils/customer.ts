// src/utils/customer.ts
import { CUSTOMER_PROFILE_QUERY, CUSTOMER_ORDERS_QUERY } from './customer-graphql';

const domain = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN || import.meta.env.PUBLIC_SHOPIFY_SHOP || '';

export interface OpenIDConfiguration {
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint?: string;
}

let openIdConfig: OpenIDConfiguration | null = null;
let customerApiEndpoint: string | null = null;

/**
 * 1. Obtener Endpoints dinámicos para OAuth desde .well-known
 */
export async function getOpenIdConfiguration(): Promise<OpenIDConfiguration> {
  if (openIdConfig) return openIdConfig;
  
  if (!domain) {
    throw new Error('Falta el dominio de Shopify en las variables de entorno (PUBLIC_SHOPIFY_STORE_DOMAIN).');
  }

  const response = await fetch(`https://${domain}/.well-known/openid-configuration`);
  if (!response.ok) {
    throw new Error(`No se pudo obtener la configuración de OpenID. Status: ${response.status}`);
  }
  
  openIdConfig = await response.json();
  return openIdConfig!;
}

/**
 * 2. Obtener Endpoint de GraphQL
 */
export async function getCustomerApiEndpoint(): Promise<string> {
  if (customerApiEndpoint) return customerApiEndpoint;
  
  const response = await fetch(`https://${domain}/.well-known/customer-account-api`);
  if (!response.ok) {
    throw new Error(`No se pudo obtener la configuración de la API de Clientes. Status: ${response.status}`);
  }
  
  const config = await response.json();
  customerApiEndpoint = config.graphql_api || config.customer_account_graphql_api_endpoint;
  return customerApiEndpoint!;
}

/**
 * 3. Función general para hacer fetch a la Customer Account API usando el Access Token
 */
export async function customerFetch<T>(accessToken: string, query: string, variables?: Record<string, any>): Promise<T> {
  const endpoint = await getCustomerApiEndpoint();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken, // Shopify requiere el token tal cual para esta API, pero a veces es Bearer {token}. Según la doc "Authorization: <token>"
    },
    body: JSON.stringify({ query, variables }),
  });

  const body = await response.json();

  if (body.errors) {
    console.error("GraphQL Customer API Errors:", body.errors);
    throw new Error(`Customer API Errors: ${body.errors[0].message}`);
  }

  return body as T;
}

/**
 * 4. Obtener el perfil del cliente
 */
export async function getCustomerProfile(accessToken: string) {
  const data = await customerFetch<any>(accessToken, CUSTOMER_PROFILE_QUERY);
  return data.data.customer;
}

/**
 * 5. Obtener las órdenes del cliente (con fulfillments y precio total)
 */
export async function getCustomerOrders(accessToken: string, first: number = 10) {
  const data = await customerFetch<any>(accessToken, CUSTOMER_ORDERS_QUERY, { first });
  return data.data.customer?.orders?.edges?.map((e: any) => e.node) || [];
}
