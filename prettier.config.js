/** @type {import("prettier").Config} */
export default {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  tailwindFunctions: ["tv"],
  tailwindStylesheet: "./stories/styles.css",
  plugins: ["prettier-plugin-tailwindcss"],
};
