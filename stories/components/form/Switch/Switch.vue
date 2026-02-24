<template>
  <SwitchTrack
    :dense
    :disabled
    :invalid
    :active="model"
    :class="classAttr"
    aria-hidden="true"
    @click="onClick"
  >
    <input
      ref="checkbox"
      type="checkbox"
      role="switch"
      v-bind="forwardedAttrs"
      :checked="model"
      :aria-checked="String(model ?? false)"
      :disabled="disabled"
      class="sr-only"
      @change="
        emit('update:modelValue', ($event.target as HTMLInputElement).checked)
      "
    />
    <SwitchThumb
      :dense
      :active="model"
    />
  </SwitchTrack>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useForwardedAttrs } from "@/composables";
import SwitchTrack from "./primitives/SwitchTrack.vue";
import SwitchThumb from "./primitives/SwitchThumb.vue";

defineOptions({ inheritAttrs: false });

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const checkbox = ref<HTMLInputElement | null>(null);

const props = defineProps<{
  dense?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}>();

const model = defineModel<boolean>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "change", value: boolean): void;
}>();

function onClick(event: MouseEvent | KeyboardEvent) {
  event.stopPropagation();
  if (props.disabled) return;
  model.value = !model.value;
}
</script>
