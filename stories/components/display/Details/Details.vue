<template>
  <DetailsPrimitive
    v-bind="$attrs"
    :dense
    :open="model"
    :native-open="nativeOpen"
    :expanded
    :content-id="contentId"
    @toggle="toggle"
    @transitionend="onTransitionEnd"
  >
    <template #summary>
      <slot name="summary" />
    </template>
    <slot />
  </DetailsPrimitive>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from "vue";
import { useSanitizedId } from "@/composables/useSanitizedId";
import DetailsPrimitive from "./primitives/Details.vue";

defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    dense?: boolean;
  }>(),
  {}
);

const model = defineModel<boolean>({ default: false });

const contentId = useSanitizedId("details-content");
const nativeOpen = ref(model.value);
const expanded = ref(model.value);

function toggle() {
  model.value = !model.value;
}

watch(model, (open) => {
  if (open) {
    nativeOpen.value = true;
    nextTick(() => {
      requestAnimationFrame(() => {
        if (model.value) {
          expanded.value = true;
        }
      });
    });
  } else {
    expanded.value = false;
  }
});

function onTransitionEnd() {
  if (!model.value) {
    nativeOpen.value = false;
  }
}
</script>
