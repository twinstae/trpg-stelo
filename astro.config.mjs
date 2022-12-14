import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), preact(), mdx(), image({
    serviceEntryPoint: '@astrojs/image/sharp'
  })],
  site: `http://astro.build`,
  output: "server",
  adapter: netlify()
});