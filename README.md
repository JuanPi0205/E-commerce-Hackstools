# 🌑 E-commerce Hacking Store - Medellín, Colombia

Bienvenido al repositorio oficial de este plataforma de e-commerce especializada en herramientas, gadgets de hacking y ciberseguridad, con sede en **Medellín, Colombia**.

Este proyecto está diseñado para ofrecer una experiencia y estética inspirada en el mundo del hacking (modo oscuro, estilo terminal y neón) para apasionados de la ciberseguridad, combinada con un alto rendimiento de ventas online.

## 💻 Sobre el Proyecto

Este e-commerce está construido utilizando una arquitectura **Headless**, lo que nos permite separar el frontend del backend para obtener la máxima velocidad y flexibilidad:
- **Frontend Framework:** [Astro](https://astro.build/) - Elegido por su velocidad extrema, su arquitectura de "islas" y Zero-JS por defecto.
- **Backend/E-commerce Engine:** [Shopify](https://www.shopify.com/) - Utilizando la **Storefront API** (GraphQL) para la gestión segura y robusta de productos, inventario y checkout.
- **Estilos:** Vanilla CSS / Tailwind (enfocado en alto rendimiento y control total del diseño).
- **Interactividad local:** Gestión dinámica de ubicaciones adaptada para Colombia (selección encadenada de Departamentos y Municipios), carritos de compra manejados en el cliente y más.

## 🕵️‍♂️ Características Principales

- **Temática Ciberseguridad Estética Premium:** Interfaz de usuario "dark mode" diseñada cuidadosamente para simular un ambiente *underground* pero profesional.
- **Logística Localizada:** Selector de envíos completamente funcional con la base de datos de departamentos y municipios de Colombia (ej. Antioquia -> Medellín).
- **Catálogo Especializado:** Venta de items (simulados/reales) relacionados con Red Team, Blue Team, Gadgets (Drones, Flipper Zero, etc.) y herramientas de software.
- **Experiencia de Compra Fluida:** Carrito lateral dinámico, integración con la pasarela nativa de pagos de Shopify y transiciones de página suaves.

---

## 🧑‍🚀 Guía de Desarrollo

### Requisitos Previos

- Node.js (v18+)
- Cuenta de Shopify con la aplicación de [Headless](https://apps.shopify.com/headless) instalada.

### Instalación

1. Clona el repositorio e instala las dependencias:
   ```bash
   npm install
   # o si prefieres pnpm
   pnpm install
   ```

2. Configura las variables de entorno. Renombra `.env.example` a `.env` (o crea uno nuevo) y agrega tus credenciales de Shopify:
   ```env
   PUBLIC_SHOPIFY_STORE_DOMAIN=tu-tienda.myshopify.com
   PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN=tu_storefront_access_token
   # También asegúrate de definir otras variables como se indique en tu `.env.example` (API versión, etc.)
   ```
   > **Nota:** Asegúrate de que tu access token tenga los permisos `unauthenticated_read_product_listings` y `unauthenticated_read_product_inventory`.

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   *El servidor local generalmente se ejecutará en http://localhost:4321.*

## 🚀 Estructura del Proyecto

Astro sigue una estructura predecible y organizada:

```text
/
├── public/           # Archivos estáticos (imágenes, íconos, robots.txt, etc.)
├── src/
│   ├── components/   # Componentes reusables de interfaz (Header, Cart, Modal, etc.)
│   ├── layouts/      # Estructuras base de las páginas (Head, Footer persistente)
│   ├── pages/        # Rutas de la aplicación (index.astro, about.astro, cart.astro)
│   ├── stores/       # Estados compartidos (manejo del carrito local - nanostores)
│   ├── styles/       # Hojas de estilo globales
│   └── utils/        # Lógica de conexión con Shopify API, ubicaciones (Colombia), etc.
└── package.json
```

## ⚡️ Rendimiento

Al ser impulsado por Astro, este sitio mantiene una puntuación muy alta en métricas como **Lighthouse**, optimizando las conversiones y garantizando una navegación muy rápida para los usuarios a lo largo y ancho de Colombia, independientemente de su conexión a internet.
