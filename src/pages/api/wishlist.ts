// src/pages/api/wishlist.ts
import type { APIRoute } from 'astro';
import { getCustomerProfile } from '../../utils/customer';
import { getProductsByIds } from '../../utils/shopify';

const adminToken = import.meta.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const domain = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN;
const apiVersion = import.meta.env.PUBLIC_SHOPIFY_API_VERSION || '2024-01';

const ADMIN_API_URL = `https://${domain}/admin/api/${apiVersion}/graphql.json`;

const CUSTOMER_METAFIELD_QUERY = `#graphql
  query getCustomerMetafield($id: ID!) {
    customer(id: $id) {
      id
      metafield(namespace: "custom", key: "favoritos") {
        id
        value
      }
    }
  }
`;

const CUSTOMER_UPDATE_MUTATION = `#graphql
  mutation updateCustomerMetafield($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        metafield(namespace: "custom", key: "favoritos") {
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// GET: devuelve los favoritos del usuario logueado (para re-hidratar el localStorage
// al iniciar sesión). Lee el metafield de Shopify y resuelve los detalles de producto.
export const GET: APIRoute = async ({ cookies }) => {
  const accessToken = cookies.get('customer_access_token')?.value;
  if (!accessToken) {
    return new Response(JSON.stringify({ favorites: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!adminToken) {
    return new Response(JSON.stringify({ error: 'Missing SHOPIFY_ADMIN_ACCESS_TOKEN' }), { status: 500 });
  }

  try {
    const profile = await getCustomerProfile(accessToken);
    if (!profile?.id) {
      return new Response(JSON.stringify({ favorites: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Leer los IDs de favoritos del metafield del cliente.
    const metaRes = await fetch(ADMIN_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': adminToken },
      body: JSON.stringify({ query: CUSTOMER_METAFIELD_QUERY, variables: { id: profile.id } }),
    });
    const metaData = await metaRes.json();
    const metaValue = metaData?.data?.customer?.metafield?.value;

    let ids: string[] = [];
    if (metaValue) {
      try {
        ids = JSON.parse(metaValue);
      } catch {
        ids = [];
      }
    }

    if (!ids.length) {
      return new Response(JSON.stringify({ favorites: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Resolver detalles de producto y mapear a la forma de WishlistItem.
    const products = await getProductsByIds(ids);
    const favorites = products.map((p: any) => ({
      id: p.id,
      title: p.title,
      handle: p.handle,
      price: parseFloat(p?.variants?.nodes?.[0]?.price?.amount ?? '0'),
      image: p?.images?.nodes?.[0]?.url || p?.featuredImage?.url || '',
    }));

    return new Response(JSON.stringify({ favorites }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Wishlist GET error:', error);
    return new Response(JSON.stringify({ favorites: [], error: error.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  // Verificamos si la variable de entorno está configurada
  if (!adminToken) {
    return new Response(JSON.stringify({ error: 'Missing SHOPIFY_ADMIN_ACCESS_TOKEN in environment variables' }), { status: 500 });
  }

  // 1. Leer la cookie de sesión del usuario
  const accessToken = cookies.get('customer_access_token')?.value;
  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized. No session found.' }), { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  const { productId } = body;
  if (!productId || typeof productId !== 'string') {
    return new Response(JSON.stringify({ error: 'productId is required and must be a string (e.g., gid://shopify/Product/123...)' }), { status: 400 });
  }

  try {
    // 2. Obtener el ID del cliente logueado a través de su token
    const profile = await getCustomerProfile(accessToken);
    if (!profile || !profile.id) {
      return new Response(JSON.stringify({ error: 'Customer not found or invalid session' }), { status: 401 });
    }

    const customerId = profile.id; // Formato esperado: gid://shopify/Customer/...

    // 3. Consultar la Admin API para obtener el metafield actual de favoritos
    const getMetafieldRes = await fetch(ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify({
        query: CUSTOMER_METAFIELD_QUERY,
        variables: { id: customerId },
      }),
    });

    const getMetafieldData = await getMetafieldRes.json();
    if (getMetafieldData.errors) {
      console.error('GraphQL Admin API Errors:', getMetafieldData.errors);
      return new Response(JSON.stringify({ error: 'Error fetching customer metafield from Admin API' }), { status: 500 });
    }

    const metafieldValueStr = getMetafieldData.data.customer?.metafield?.value;
    let favoritesList: string[] = [];

    // Parsear el metafield que viene en formato string JSON de Shopify
    if (metafieldValueStr) {
      try {
        favoritesList = JSON.parse(metafieldValueStr);
      } catch (e) {
        console.warn('Could not parse metafield value, defaulting to empty array.');
        favoritesList = [];
      }
    }

    // 4. Evaluar lógica de Toggle (On / Off)
    let isAdded = false;
    if (favoritesList.includes(productId)) {
      // Toggle Off: Si ya está, lo quitamos
      favoritesList = favoritesList.filter((id) => id !== productId);
    } else {
      // Toggle On: Si no está, lo agregamos
      favoritesList.push(productId);
      isAdded = true;
    }

    // 5. Hacer mutación CustomerUpdate para sobreescribir el Metafield
    const updateRes = await fetch(ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify({
        query: CUSTOMER_UPDATE_MUTATION,
        variables: {
          input: {
            id: customerId,
            metafields: [
              {
                namespace: 'custom',
                key: 'favoritos',
                type: 'list.product_reference', // Mismo tipo que el metafield configurado
                value: JSON.stringify(favoritesList) // Tiene que ser un array en string
              }
            ]
          }
        }
      })
    });

    const updateData = await updateRes.json();
    
    // Manejo de errores en la mutación
    if (updateData.errors || updateData.data.customerUpdate?.userErrors?.length > 0) {
      const errs = updateData.errors || updateData.data.customerUpdate.userErrors;
      console.error('Error updating metafield:', errs);
      return new Response(JSON.stringify({ error: 'Failed to update customer metafield', details: errs }), { status: 500 });
    }

    // 6. Devolver respuesta exitosa
    return new Response(JSON.stringify({
      success: true,
      favorites: favoritesList,
      isAdded
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Wishlist endpoint error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
