/** @type {import("prettier").Config} */
export default {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  singleAttributePerLine: true,
  tailwindFunctions: ["tv"],
  tailwindStylesheet: "./stories/storybook.css",
  plugins: ["prettier-plugin-tailwindcss"],
};
