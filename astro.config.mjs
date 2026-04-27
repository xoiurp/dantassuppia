// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: "https://dantasesuppia.com.br",
  output: "static",
  adapter: netlify(),
  integrations: [mdx(), sitemap({ filter: (p) => !p.includes("/api/") })],
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: { prefetchAll: false, defaultStrategy: "viewport" },
});
