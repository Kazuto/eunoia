<template>
  <LinkPrimitive
    v-bind="linkAttrs"
    :tag="linkTag"
    :external="isExternal"
    :dense
  >
    <slot />
  </LinkPrimitive>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from "vue";
import LinkPrimitive from "./primitives/Link.vue";

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

const isExternal = computed(() => {
  if (props.external !== undefined) return props.external;
  return /^(https?:)?\/\//.test(props.href);
});

const hasNuxtLink = computed(() => {
  const instance = getCurrentInstance();
  const components = instance?.appContext.components;
  return !!(components?.["NuxtLink"] || components?.["nuxt-link"]);
});

const linkTag = computed(() => {
  if (isExternal.value) return "a";
  if (hasNuxtLink.value) return "NuxtLink";
  return "a";
});

const linkAttrs = computed(() => {
  const attrs: Record<string, unknown> = {};

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
