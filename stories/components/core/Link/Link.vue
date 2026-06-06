<template>
  <LinkPrimitive
    v-bind="{ ...forwardedAttrs, ...linkAttrs }"
    :class="classAttr"
    :tag="linkTag"
    :external="isExternal"
    :dense
  >
    <slot />
  </LinkPrimitive>
</template>

<script setup lang="ts">
import { computed } from "vue";
import LinkPrimitive from "./primitives/Link.vue";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    href: string;
    external?: boolean;
    dense?: boolean;
    to?: string;
  }>(),
  { external: undefined, to: undefined }
);

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const isExternal = computed(() => {
  if (props.external !== undefined) return props.external;

  return /^(https?:)?\/\//.test(props.href);
});

const linkTag = computed(() => {
  if (isExternal.value) return "a";
  if (props.to) return "NuxtLink";

  return "a";
});

const linkAttrs = computed(() => {
  if (isExternal.value) {
    return {
      href: props.href,
      target: "_blank",
      rel: "noopener noreferrer",
    };
  }

  if (props.to) {
    return { to: props.to };
  }

  return { href: props.href };
});
</script>
