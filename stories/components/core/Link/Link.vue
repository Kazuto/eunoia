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
import { useForwardedAttrs, useLinkComponent } from "@/composables";

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

const { linkComponent } = useLinkComponent();

const linkTag = computed(() => {
  if (isExternal.value) return "a";

  return linkComponent;
});

const linkAttrs = computed(() => {
  const attrs: Record<string, unknown> = {};

  if (isExternal.value) {
    attrs.href = props.href;
    attrs.target = "_blank";
    attrs.rel = "noopener noreferrer";
  } else if (linkComponent === "a") {
    attrs.href = props.href;
  } else {
    attrs.to = props.href;
  }

  return attrs;
});
</script>
