// src/pages/api/search.ts
// Devuelve sugerencias de productos para el autocompletado del buscador.
import type { APIRoute } from 'astro';
import { searchProducts } from '../../utils/search';

export const GET: APIRoute = async ({ url }) => {
  const q = (url.searchParams.get('q') || '').trim();

  if (q.length < 2) {
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const products = await searchProducts(q, 6);
    const results = products.map((p: any) => ({
      title: p.title,
      handle: p.handle,
      image: p?.images?.nodes?.[0]?.url || p?.featuredImage?.url || '',
      price: p?.variants?.nodes?.[0]?.price?.amount || '',
    }));

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('api/search error:', error);
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
