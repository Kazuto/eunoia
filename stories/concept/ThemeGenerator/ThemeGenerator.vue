<template>
  <div
    class="grid gap-8 p-6 font-sans lg:grid-cols-[20rem_minmax(0,1fr)] lg:p-8"
  >
    <aside class="flex flex-col gap-8 lg:sticky lg:top-8 lg:self-start">
      <header class="flex flex-col gap-2">
        <h1 class="text-xl font-semibold text-neutral-950 dark:text-neutral-50">
          Theme generator
        </h1>
        <p class="text-sm text-neutral-600 dark:text-neutral-300">
          Pick the base colors and corners. Every shade and smaller radius is
          derived from them, so the preview shows the whole theme.
        </p>
      </header>

      <section
        class="flex flex-col gap-4"
        aria-labelledby="theme-colors"
      >
        <h2
          id="theme-colors"
          :class="headingStyles"
        >
          Colors
        </h2>
        <ColorControl
          v-for="name in COLORS"
          :key="name"
          v-model="theme.colors[name]"
          :name
        />
      </section>

      <section
        class="flex flex-col gap-4"
        aria-labelledby="theme-corners"
      >
        <h2
          id="theme-corners"
          :class="headingStyles"
        >
          Corners
        </h2>
        <Slider
          v-model="theme.field"
          :min="0"
          :max="24"
        >
          Fields: {{ theme.field }}px
        </Slider>
        <Slider
          v-model="theme.box"
          :min="0"
          :max="40"
        >
          Boxes: {{ theme.box }}px
        </Slider>
        <Switch v-model="theme.squircle">Smooth corners</Switch>
      </section>

      <section
        class="flex flex-col gap-4"
        aria-labelledby="theme-css"
      >
        <h2
          id="theme-css"
          :class="headingStyles"
        >
          CSS
        </h2>
        <p class="text-sm text-neutral-600 dark:text-neutral-300">
          Add this after the Eunoia import in the app's stylesheet.
        </p>
        <Code
          block
          language="css"
          >{{ css }}</Code
        >
        <Button
          class="self-start"
          :disabled="Object.keys(changes).length === 0"
          @click="reset"
        >
          Reset
        </Button>
      </section>
    </aside>

    <div class="flex min-w-0 flex-col gap-6">
      <ThemePreview />
      <ThemePreview dark />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, reactive, watchEffect } from "vue";
import { Button, Code, Slider, Switch } from "@/components";
import ColorControl from "./primitives/ColorControl.vue";
import ThemePreview from "./primitives/ThemePreview.vue";
import { COLORS, type ColorName } from "./theme";

type Theme = {
  colors: Record<ColorName, string>;
  field: number;
  box: number;
  squircle: boolean;
};

const headingStyles =
  "text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400";

const root = document.documentElement;
const VARIABLES = [
  ...COLORS.map((name) => `--color-${name}`),
  "--radius-field",
  "--radius-box",
  "--corner-shape",
];

// Read from the stylesheet so the defaults can't drift from styles.css.
// The overrides are cleared first, in case a previous visit left some behind.
VARIABLES.forEach((name) => root.style.removeProperty(name));
const defaults = readTheme();
const theme = reactive<Theme>(structuredClone(defaults));

function readTheme(): Theme {
  const style = getComputedStyle(root);
  const read = (name: string) => style.getPropertyValue(name).trim();

  return {
    colors: Object.fromEntries(
      COLORS.map((name) => [name, read(`--color-${name}`)])
    ) as Record<ColorName, string>,
    field: parseFloat(read("--radius-field")),
    box: parseFloat(read("--radius-box")),
    squircle: read("--corner-shape") !== "round",
  };
}

// Only what differs from the defaults, so the CSS stays as short as it can.
const changes = computed(() => {
  const result: Record<string, string> = {};

  for (const name of COLORS) {
    const color = theme.colors[name];
    if (color && color !== defaults.colors[name]) {
      result[`--color-${name}`] = color;
    }
  }
  if (theme.field !== defaults.field) {
    result["--radius-field"] = `${theme.field}px`;
  }
  if (theme.box !== defaults.box) {
    result["--radius-box"] = `${theme.box}px`;
  }
  if (theme.squircle !== defaults.squircle) {
    result["--corner-shape"] = theme.squircle ? "squircle" : "round";
  }

  return result;
});

const css = computed(() => {
  const lines = Object.entries(changes.value).map(
    ([name, value]) => `  ${name}: ${value};`
  );

  return lines.length
    ? `@theme {\n${lines.join("\n")}\n}`
    : "/* Nothing changed yet, so Eunoia's defaults apply. */";
});

// The derived shades and radii resolve on :root, so the overrides go there.
watchEffect(() => {
  for (const name of VARIABLES) {
    const value = changes.value[name];
    if (value) root.style.setProperty(name, value);
    else root.style.removeProperty(name);
  }
});

onBeforeUnmount(() => {
  VARIABLES.forEach((name) => root.style.removeProperty(name));
});

function reset() {
  Object.assign(theme, structuredClone(defaults));
}
</script>
