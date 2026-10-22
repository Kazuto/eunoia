<template>
  <component
    :is="variantComponent"
    :dense="dense"
    :icon="icon"
    :href="href"
    :target="target"
    :rel="rel"
    :as="as"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import PrimaryButton from "./variants/PrimaryButton.vue";
import SecondaryButton from "./variants/SecondaryButton.vue";
import GhostButton from "./variants/GhostButton.vue";
import DestructiveButton from "./variants/DestructiveButton.vue";
import type { ButtonLinkOptions } from "./primitives/linkOptions";

export type ButtonOptions = ButtonLinkOptions & {
  primary?: boolean;
  ghost?: boolean;
  destructive?: boolean;
  dense?: boolean;
  icon?: string;
};

const props = withDefaults(defineProps<ButtonOptions>(), {
  primary: false,
  ghost: false,
  destructive: false,
  icon: undefined,
  href: undefined,
  target: undefined,
  rel: undefined,
  as: undefined,
});

const variantComponent = computed(() => {
  if (props.destructive) return DestructiveButton;
  if (props.ghost) return GhostButton;
  if (props.primary) return PrimaryButton;

  return SecondaryButton;
});
</script>
