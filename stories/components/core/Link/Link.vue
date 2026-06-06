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
import { computed, resolveComponent } from "vue";
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

const nuxtLink = (() => {
  try {
    const resolved = resolveComponent("NuxtLink");
    return typeof resolved !== "string" ? resolved : null;
  } catch {
    return null;
  }
})();

const linkTag = computed(() => {
  if (isExternal.value) return "a";
  if (nuxtLink) return "NuxtLink";

  return "a";
});

const linkAttrs = computed(() => {
  const attrs: Record<string, unknown> = forwardedAttrs.value ?? {};

  if (nuxtLink && !isExternal.value) {
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
