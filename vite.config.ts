/// <reference types="vitest" />

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue(), vueJsx({}), tailwindcss()],
  resolve: {
    alias: {
      "@/components": resolve(__dirname, "stories/components"),
      "@/composables": resolve(__dirname, "stories/composables"),
    },
  },
  build: {
    minify: "esbuild",
    lib: {
      entry: resolve(__dirname, "stories/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        /^vue/,
        /^tailwind-variants/,
        /^tailwind-merge/,
        /^vue-icons-plus/,
        /^highlight\.js/,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: "stories",
        entryFileNames: "[name].js",
      },
    },
  },
});
