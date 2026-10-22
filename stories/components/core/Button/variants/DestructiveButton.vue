<template>
  <Button
    :dense="dense"
    :icon="icon"
    :href="href"
    :target="target"
    :rel="rel"
    :as="as"
    class="bg-red-500 text-red-50 not-disabled:hover:bg-red-600 focus-visible:ring-red-500 not-disabled:active:bg-red-700 dark:bg-red-700 dark:not-disabled:hover:bg-red-800 dark:focus-visible:ring-red-600 dark:not-disabled:active:bg-red-900"
  >
    <slot />
  </Button>
</template>

<script lang="ts" setup>
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
</script>
