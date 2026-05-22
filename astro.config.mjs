import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
import svelte from "@astrojs/svelte";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),

  integrations: [svelte(), react()],

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['cool-baboons-worry.loca.lt']
    }
  },
});