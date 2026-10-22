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
    "bg-transparent text-neutral-800 not-disabled:hover:bg-black/10 focus-visible:ring-neutral-300 not-disabled:active:bg-black/5",
    "dark:text-neutral-200 dark:not-disabled:hover:bg-white/10 dark:focus-visible:ring-neutral-700 dark:not-disabled:active:bg-white/5",
  ],
});
</script>
