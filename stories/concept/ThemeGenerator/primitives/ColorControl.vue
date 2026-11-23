<template>
  <div class="flex flex-col gap-1.5">
    <ColorPicker v-model="model">{{ label }}</ColorPicker>
    <div
      class="flex h-3 overflow-hidden rounded-field-xs squircle"
      aria-hidden="true"
    >
      <span
        v-for="stop in STOPS"
        :key="stop"
        class="flex-1"
        :style="{ background: `var(--color-${name}-${stop})` }"
      />
    </div>
    <p
      v-if="hint"
      class="text-xs text-neutral-500 dark:text-neutral-400"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { ColorPicker } from "@/components";
import { type ColorName, STOPS, lightness } from "../theme";

const props = defineProps<{
  name: ColorName;
}>();

const model = defineModel<string>({ required: true });

const label = computed(
  () => props.name.charAt(0).toUpperCase() + props.name.slice(1)
);

// The base color sits at 500, so a very dark or very light one leaves the
// shades on its far side little room.
const hint = computed(() => {
  if (!/^#[0-9a-f]{6}$/i.test(model.value)) return undefined;

  const l = lightness(model.value);
  if (l < 0.3) {
    return "Very dark: the shades from 600 to 950 will be hard to tell apart.";
  }
  if (l > 0.9) {
    return "Very light: the shades from 50 to 400 will be hard to tell apart.";
  }

  return undefined;
});
</script>
