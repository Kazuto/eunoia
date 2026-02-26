/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  "*.{ts,tsx,vue}": [
    "eslint --cache --cache-strategy content --fix",
    "prettier --write",
  ],
  "*.{js,json,css,md,mdx}": ["prettier --write"],
};
