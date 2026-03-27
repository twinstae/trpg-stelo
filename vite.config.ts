import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  lint: {
    ignorePatterns: [".astro/**"],
    options: { typeAware: true, typeCheck: true },
  },
});
