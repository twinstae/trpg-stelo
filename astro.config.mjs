import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import searchIndex from "./src/integrations/searchIndex";

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), mdx(), searchIndex()],

  vite: {
    plugins: [tailwindcss()],
  },

  site: "http://astro.build",
});
