<template>
  <div
    v-bind="forwardedAttrs"
    :class="['flex flex-col', dense ? 'gap-1.5' : 'gap-2', classAttr]"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, provide } from "vue";
import { useForwardedAttrs } from "@/composables";
import { ACCORDION_KEY } from "./primitives/context";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const props = defineProps<{
  /** Allow several items to be open at once; the model becomes an array. */
  multiple?: boolean;
  dense?: boolean;
}>();

const model = defineModel<string | string[] | undefined>();

function openValues(): string[] {
  if (Array.isArray(model.value)) return model.value;
  return model.value == null ? [] : [model.value];
}

provide(ACCORDION_KEY, {
  dense: computed(() => props.dense),
  isOpen: (value) => openValues().includes(value),
  setOpen(value, open) {
    const others = openValues().filter((v) => v !== value);
    if (props.multiple) {
      model.value = open ? [...others, value] : others;
    } else {
      model.value = open ? value : undefined;
    }
  },
});
</script>
