<template>
  <Chip
    v-bind="$attrs"
    class="inline-flex items-center gap-2"
    :variant
    :dense
    :pill
    @click="emit('click', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  >
    <slot />
    <ChipRemove
      v-if="removable"
      :variant
      :dense
      :pill
      :aria-label="t('remove')"
      @remove="emit('remove', $event)"
    />
  </Chip>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import { type LocaleMessages, useLocale } from "@/composables";
import Chip from "./primitives/Chip.vue";
import ChipRemove from "./primitives/ChipRemove.vue";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "success" | "warning" | "danger";
    dense?: boolean;
    /** Fully round ends instead of the default squircle corners. */
    pill?: boolean;
    removable?: boolean;
    locale?: LocaleMessages;
  }>(),
  {
    variant: "primary",
    locale: undefined,
  }
);

const t = useLocale(
  "chip",
  toRef(() => props.locale)
);

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
  (e: "remove", event: MouseEvent | KeyboardEvent): void;
}>();
</script>
