<template>
  <Button
    :dense="dense"
    :icon="icon"
    :href="href"
    :target="target"
    :rel="rel"
    :as="as"
    :class="buttonStyles()"
  >
    <slot />
  </Button>
</template>

<script lang="ts" setup>
import { tv } from "tailwind-variants";
import Button from "../primitives/Button.vue";
import type { ButtonLinkOptions } from "../primitives/linkOptions";

withDefaults(
  defineProps<ButtonLinkOptions & { dense?: boolean; icon?: string }>(),
  {
    icon: undefined,
    href: undefined,
    target: undefined,
    rel: undefined,
    as: undefined,
  }
);

const buttonStyles = tv({
  base: [
    "bg-primary-500 text-primary-50 not-disabled:hover:bg-primary-600 focus-visible:ring-primary-500 not-disabled:active:bg-primary-700",
    "dark:bg-primary-700 dark:not-disabled:hover:bg-primary-800 dark:focus-visible:ring-primary-700 dark:not-disabled:active:bg-primary-900",
  ],
});
</script>
