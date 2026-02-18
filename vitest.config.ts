import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        extends: "./vite.config.ts",
        test: {
          name: "unit",
          environment: "jsdom",
        },
      },
    ],
  },
});
