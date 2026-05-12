import type { APIRoute } from 'astro';
// Importamos ambas funciones: la general y la de colecciones
import { getProducts, getProductsByCollection } from '../../../utils/shopify';

export const GET: APIRoute = async ({ params }) => {
  const handle = params.handle;

  if (!handle) {
    return new Response(JSON.stringify({ error: 'Handle is required' }), { status: 400 });
  }

  try {
    let products = [];

    // 1. Caso especial: El tab de New Arrivals
    if (handle === 'new-arrivals') {
      products = await getProducts({
        first: 8,
        sortKey: 'CREATED_AT', // Ordenamos por fecha de creación
        reverse: true          // Los más nuevos primero
      });
    }
    // 2. Caso estándar: Bestsellers, Featured Products o cualquier otra pestaña
    else {
      products = await getProductsByCollection(handle, { first: 8 });
    }

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error(`Error fetching products for tab ${handle}:`, error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}