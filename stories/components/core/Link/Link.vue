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
import { useForwardedAttrs, useNuxtLink } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    href: string;
    external?: boolean;
    dense?: boolean;
  }>(),
  {
    external: undefined,
  }
);

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const isExternal = computed(() => {
  if (props.external !== undefined) return props.external;
  return /^(https?:)?\/\//.test(props.href);
});

const { hasNuxtLink } = useNuxtLink();

const linkTag = computed(() => {
  if (isExternal.value) return "a";
  if (hasNuxtLink.value) return "NuxtLink";
  return "a";
});

const linkAttrs = computed(() => {
  const attrs: Record<string, unknown> = forwardedAttrs.value ?? {};

  if (linkTag.value === "NuxtLink") {
    attrs.to = props.href;
  } else {
    attrs.href = props.href;
  }

  if (isExternal.value) {
    attrs.target = "_blank";
    attrs.rel = "noopener noreferrer";
  }

  return attrs;
});
</script>
