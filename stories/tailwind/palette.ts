import plugin from "tailwindcss/plugin";
import type { PluginAPI } from "tailwindcss/types/config";

type ShadeStep = { l: number; c: number };

const STEPS: Record<number, ShadeStep> = {
  950: { l: 0.42, c: 0.42 },
  900: { l: 0.6, c: 0.6 },
  800: { l: 0.67, c: 0.76 },
  700: { l: 0.77, c: 0.93 },
  600: { l: 0.88, c: 1.04 },
  500: { l: 1, c: 1 },
  400: { l: 1.12, c: 0.82 },
  300: { l: 1.27, c: 0.53 },
  200: { l: 1.38, c: 0.29 },
  100: { l: 1.45, c: 0.15 },
  50: { l: 1.5, c: 0.06 },
};

export default plugin(function ({ addBase }: PluginAPI) {
  const output: Record<string, string> = {};

  // Generate all the shade variables
  // These should match what you have in your CSS
  const colors = ["primary", "red", "green", "yellow", "gray"];

  for (const colorName of colors) {
    for (const [shadeKey, { l, c }] of Object.entries(STEPS)) {
      const shade = Number(shadeKey);

      if (shade === 500) {
        // For 500, reference the base color variable
        output[`--color-${colorName}-${shade}`] = `var(--color-${colorName})`;
      } else {
        // For other shades, generate the oklch formula
        output[`--color-${colorName}-${shade}`] =
          `oklch(from var(--color-${colorName}) calc(l * ${l}) calc(c * ${c}) h)`;
      }
    }
  }

  addBase({
    ":root": output,
  });
});
