import { createTV } from "tailwind-variants";

// tailwind-merge only knows Tailwind's own radius sizes. Without the names from
// the @theme in styles.css, a `rounded-none` passed in as a class wouldn't
// replace a component's `rounded-field`, and both would end up on the element.
export const tv = createTV({
  twMergeConfig: {
    extend: {
      theme: {
        radius: ["box", "box-sm", "field", "field-sm", "field-xs", "field-2xs"],
      },
    },
  },
});
