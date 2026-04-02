// Mock de Shopify - Datos de prueba para desarrollo sin cuenta de Shopify

const mockProducts = [
  {
    id: "1",
    title: "Auriculares Inalámbricos Pro",
    handle: "auriculares-inalambricos-pro",
    description: "Auriculares Bluetooth con cancelación activa de ruido y estuche de carga rápida.",
    priceRange: {
      minVariantPrice: { amount: "199.99", currencyCode: "USD" }
    },
    images: {
      nodes: [
        {
          url: "https://placehold.co/400x400/3b82f6/ffffff?text=Auriculares+Pro",
          width: 400,
          height: 400,
          altText: "Auriculares Inalámbricos Pro"
        }
      ]
    },
    featuredImage: {
      url: "https://placehold.co/400x400/3b82f6/ffffff?text=Auriculares+Pro",
      width: 400,
      height: 400,
      altText: "Auriculares Inalámbricos Pro"
    },
    variants: {
      nodes: [
        {
          id: "variant-1",
          title: "Negro / Estuche inalámbrico",
          availableForSale: true,
          quantityAvailable: 15,
          price: { amount: "199.99", currencyCode: "USD" }
        }
      ]
    }
  },
  {
    id: "2",
    title: "Teclado Mecánico RGB",
    handle: "teclado-mecanico-rgb",
    description: "Teclado mecánico para gaming con switches rojos y retroiluminación RGB.",
    priceRange: {
      minVariantPrice: { amount: "129.99", currencyCode: "USD" }
    },
    images: {
      nodes: [
        {
          url: "https://placehold.co/400x400/10b981/ffffff?text=Teclado+RGB",
          width: 400,
          height: 400,
          altText: "Teclado Mecánico RGB"
        }
      ]
    },
    featuredImage: {
      url: "https://placehold.co/400x400/10b981/ffffff?text=Teclado+RGB",
      width: 400,
      height: 400,
      altText: "Teclado Mecánico RGB"
    },
    variants: {
      nodes: [
        {
          id: "variant-2",
          title: "US / Switch rojo",
          availableForSale: true,
          quantityAvailable: 8,
          price: { amount: "129.99", currencyCode: "USD" }
        }
      ]
    }
  },
  {
    id: "3",
    title: "Monitor 27\" 4K IPS",
    handle: "monitor-27-4k-ips",
    description: "Monitor 27 pulgadas 4K UHD, panel IPS y tasa de refresco de 144 Hz.",
    priceRange: {
      minVariantPrice: { amount: "399.99", currencyCode: "USD" }
    },
    images: {
      nodes: [
        {
          url: "https://placehold.co/400x400/f59e0b/ffffff?text=Monitor+4K",
          width: 400,
          height: 400,
          altText: "Monitor 27 pulgadas 4K IPS"
        }
      ]
    },
    featuredImage: {
      url: "https://placehold.co/400x400/f59e0b/ffffff?text=Monitor+4K",
      width: 400,
      height: 400,
      altText: "Monitor 27 pulgadas 4K IPS"
    },
    variants: {
      nodes: [
        {
          id: "variant-3",
          title: "27\" / Negro",
          availableForSale: true,
          quantityAvailable: 5,
          price: { amount: "399.99", currencyCode: "USD" }
        }
      ]
    }
  },
  {
    id: "4",
    title: "Laptop Ultrabook 14\"",
    handle: "laptop-ultrabook-14",
    description: "Ultrabook de 14\" con procesador Intel i7, 16GB RAM y SSD 512GB.",
    priceRange: {
      minVariantPrice: { amount: "1099.99", currencyCode: "USD" }
    },
    images: {
      nodes: [
        {
          url: "https://placehold.co/400x400/8b5cf6/ffffff?text=Ultrabook+14",
          width: 400,
          height: 400,
          altText: "Laptop Ultrabook 14 pulgadas"
        }
      ]
    },
    featuredImage: {
      url: "https://placehold.co/400x400/8b5cf6/ffffff?text=Ultrabook+14",
      width: 400,
      height: 400,
      altText: "Laptop Ultrabook 14 pulgadas"
    },
    variants: {
      nodes: [
        {
          id: "variant-4",
          title: "i7 / 16GB / 512GB",
          availableForSale: true,
          quantityAvailable: 6,
          price: { amount: "1099.99", currencyCode: "USD" }
        }
      ]
    }
  },
  {
    id: "5",
    title: "Mouse Gaming Inalámbrico",
    handle: "mouse-gaming-inalambrico",
    description: "Mouse inalámbrico con sensor óptico de 26K DPI y 6 botones programables.",
    priceRange: {
      minVariantPrice: { amount: "79.99", currencyCode: "USD" }
    },
    images: {
      nodes: [
        {
          url: "https://placehold.co/400x400/ef4444/ffffff?text=Mouse+Gaming",
          width: 400,
          height: 400,
          altText: "Mouse Gaming Inalámbrico"
        }
      ]
    },
    featuredImage: {
      url: "https://placehold.co/400x400/ef4444/ffffff?text=Mouse+Gaming",
      width: 400,
      height: 400,
      altText: "Mouse Gaming Inalámbrico"
    },
    variants: {
      nodes: [
        {
          id: "variant-5",
          title: "Negro / RGB",
          availableForSale: true,
          quantityAvailable: 18,
          price: { amount: "79.99", currencyCode: "USD" }
        }
      ]
    }
  },
  {
    id: "6",
    title: "Hub USB-C 8-en-1",
    handle: "hub-usb-c-8-en-1",
    description: "Hub USB-C con HDMI 4K, lector de tarjetas, USB 3.0 y carga Power Delivery.",
    priceRange: {
      minVariantPrice: { amount: "59.99", currencyCode: "USD" }
    },
    images: {
      nodes: [
        {
          url: "https://placehold.co/400x400/06b6d4/ffffff?text=Hub+USB-C",
          width: 400,
          height: 400,
          altText: "Hub USB-C 8-en-1"
        }
      ]
    },
    featuredImage: {
      url: "https://placehold.co/400x400/06b6d4/ffffff?text=Hub+USB-C",
      width: 400,
      height: 400,
      altText: "Hub USB-C 8-en-1"
    },
    variants: {
      nodes: [
        {
          id: "variant-6",
          title: "Gris espacial",
          availableForSale: true,
          quantityAvailable: 25,
          price: { amount: "59.99", currencyCode: "USD" }
        }
      ]
    }
  }
];

// ===== INTERFACES =====

interface GetProductsOptions {
  buyerIP?: string;
  first?: number;
  query?: string;
}

interface GetRecommendationsOptions {
  productId: string;
  buyerIP?: string;
}

// ===== FUNCIONES EXPORTADAS =====

export async function getProducts(options: GetProductsOptions = {}) {
  console.log("⚠️ Modo desarrollo: Usando productos mock (tecnología)");
  return mockProducts;
}

export async function getProductRecommendations(options: GetRecommendationsOptions) {
  console.log("⚠️ Modo desarrollo: Recomendaciones mock para producto:", options.productId);
  
  // Devuelve productos diferentes al actual (simulando recomendaciones)
  const recommendations = mockProducts.filter(p => p.id !== options.productId);
  
  // Devuelve máximo 4 recomendaciones
  return recommendations.slice(0, 4);
}

export async function getProductByHandle(handle: string) {
  return mockProducts.find(p => p.handle === handle) || mockProducts[0];
}

export async function getProductById(id: string) {
  return mockProducts.find(p => p.id === id) || null;
}

export async function createCheckout(variantId: string, quantity: number = 1) {
  return {
    id: "mock-checkout-id",
    webUrl: "#checkout-no-disponible",
    lineItems: { edges: [] }
  };
}
