# Eunoia Guidelines

## Component architecture — primitives, variants, orchestrators

Every component is split into up to three layers:

```
Button/
├── Button.vue              ← orchestrator
├── primitives/
│   └── Button.vue          ← primitive
└── variants/
    ├── PrimaryButton.vue   ← variant
    └── GhostButton.vue     ← variant
```

### Primitives

A primitive is a single DOM-level building block. It owns one element (or a small, fixed template), its `tv()` styling, and nothing else. Primitives are deliberately dumb — no business logic, no state management, no awareness of siblings.

Why: isolating the DOM and styling in one place means every visual change is a single-file edit. It also makes the component trivially testable and reusable across different orchestrators.

### Variants

A variant wraps a primitive and locks in a specific visual treatment (colors, shadows, hover states) via its own `tv()` block merged on top. The variant does not add new DOM — it just narrows the primitive's appearance.

Why: a `PrimaryButton` and a `GhostButton` share the same structure and behavior but look completely different. Encoding each look as a dedicated file keeps the primitive clean and lets consumers import the exact variant they need without passing a `variant` prop everywhere.

### Orchestrators

The orchestrator is the public-facing component that consumers actually import. It composes one or more primitives (and optionally picks a variant), owns reactive state, handles events, manages slots, and wires up accessibility attributes.

Why: keeping composition and logic in a separate layer means primitives stay reusable and variants stay purely visual. The orchestrator is the only file that knows how the pieces fit together, so swapping out a primitive or adding a new variant never ripples through consumer code.

### When to skip a layer

- No dark/variant split needed → skip `variants/`, style everything in the primitive.
- Component is a single element with no composition → the orchestrator and primitive can be the same file (rare, prefer the split for consistency).

## Styling — `tv()` class formatting

Long class strings that mix layout utilities, light-mode colors, and `dark:` overrides are hard to scan. You have to mentally parse which classes belong to which mode. Splitting them into an array of three lines groups classes by intent, so you can instantly see what applies universally, what's light-only, and what's dark-only. It also makes diffs cleaner when adding or changing a single mode.

When a `tv()` base or variant value contains both light-mode and dark-mode classes, split the string into an array with up to three lines:

```ts
const styles = tv({
  base: [
    "rounded-lg shadow-md", // default (both modes)
    "border-neutral-200 bg-white", // light
    "dark:bg-neutral-900 dark:shadow-lg", // dark
  ],
});
```

| Line | Contains                                                           | Example classes                                      |
| ---- | ------------------------------------------------------------------ | ---------------------------------------------------- |
| 1    | Mode-agnostic classes (no `dark:` prefix, no light-only semantics) | `flex`, `rounded-lg`, `px-4`, `font-sans`            |
| 2    | Light-only classes (colors/borders that only apply in light mode)  | `bg-white`, `text-neutral-900`, `border-neutral-200` |
| 3    | All `dark:` prefixed classes                                       | `dark:bg-neutral-900`, `dark:text-neutral-100`       |

### Rules

- If a line would be empty, omit it (e.g. a variant with only light + dark colors needs just 2 lines).
- Apply the same split inside `variants` values when they contain mixed light/dark classes.
- Keep `compoundVariants` strings as-is — they're usually short enough to stay on one line.
- If a value has no `dark:` classes at all, leave it as a plain string.
