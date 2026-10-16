<template>
  <!-- A label, so the text names the switch and clicking it toggles the switch too. -->
  <label
    :class="[
      'inline-flex items-center gap-2 text-sm',
      disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      classAttr,
    ]"
  >
    <SwitchTrack
      class="shrink-0"
      :dense
      :disabled
      :invalid
      :active="model"
    >
      <input
        type="checkbox"
        role="switch"
        v-bind="forwardedAttrs"
        :checked="model"
        :aria-checked="model ?? false"
        :disabled="disabled"
        class="sr-only"
        @change="onChange"
      />
      <SwitchThumb
        :dense
        :active="model"
      />
    </SwitchTrack>
    <span
      v-if="$slots.default"
      :class="{ 'opacity-40': disabled }"
    >
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
import { useForwardedAttrs } from "@/composables";
import SwitchTrack from "./primitives/SwitchTrack.vue";
import SwitchThumb from "./primitives/SwitchThumb.vue";

defineOptions({ inheritAttrs: false });

const { classAttr, forwardedAttrs } = useForwardedAttrs();

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

// Clicks on the track or the text reach the checkbox through the label, so this is the only toggle path.
function onChange(event: Event) {
  if (props.disabled) return;
  const checked = (event.target as HTMLInputElement).checked;
  model.value = checked;
  emit("change", checked);
}
</script>
