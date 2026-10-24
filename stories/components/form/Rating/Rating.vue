<template>
  <div class="flex flex-col gap-1">
    <Label
      v-if="hasDefaultSlot"
      :id="labelId"
      :dense
    >
      <slot />
    </Label>
    <div
      v-if="readonly"
      v-bind="$attrs"
      role="img"
      :aria-label="t('star', { value: model ?? 0, max })"
      class="inline-flex w-fit items-center gap-0.5"
    >
      <RatingStar
        v-for="star in max"
        :key="star"
        :fill="fillFor(star)"
        :dense
      />
    </div>
    <div
      v-else
      ref="groupRef"
      v-bind="$attrs"
      role="radiogroup"
      :aria-labelledby="hasDefaultSlot ? labelId : undefined"
      :aria-label="hasDefaultSlot ? undefined : t('label')"
      :aria-disabled="disabled ? 'true' : undefined"
      :class="[
        'inline-flex w-fit items-center gap-0.5',
        { 'opacity-40': disabled },
      ]"
      @mouseleave="hoverValue = null"
    >
      <span
        v-for="star in max"
        :key="star"
        class="relative inline-flex"
      >
        <RatingStar
          :fill="fillFor(star)"
          :dense
        />
        <RatingRadio
          v-for="option in optionsFor(star)"
          :key="option.value"
          :data-value="option.value"
          :label="t('star', { value: option.value, max })"
          :checked="model === option.value"
          :focusable="option.value === focusValue"
          :part="option.part"
          :disabled
          @click="select(option.value)"
          @mouseenter="preview(option.value)"
          @keydown="onKeydown($event, option.value)"
        />
      </span>
    </div>
    <input
      v-if="name"
      type="hidden"
      :name
      :value="model ?? ''"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, toRef } from "vue";
import {
  type LocaleMessages,
  useLocale,
  useSanitizedId,
  useSlotContent,
} from "@/composables";
import Label from "../Input/primitives/Label.vue";
import RatingStar from "./primitives/RatingStar.vue";
import RatingRadio from "./primitives/RatingRadio.vue";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    max?: number;
    allowHalf?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    dense?: boolean;
    name?: string;
    locale?: LocaleMessages;
  }>(),
  {
    max: 5,
    name: undefined,
    locale: undefined,
  }
);

const model = defineModel<number | null>();

const emit = defineEmits<{
  (e: "change", value: number): void;
}>();

const { hasSlotContent } = useSlotContent();
const hasDefaultSlot = hasSlotContent("default");

const t = useLocale(
  "rating",
  toRef(() => props.locale)
);

const labelId = useSanitizedId("rating-label");
const groupRef = ref<HTMLElement | null>(null);
const hoverValue = ref<number | null>(null);

const values = computed(() => {
  const step = props.allowHalf ? 0.5 : 1;
  return Array.from({ length: props.max / step }, (_, i) => (i + 1) * step);
});

// The checked radio takes the tab stop; with nothing checked, the first one does.
const focusValue = computed(() =>
  model.value != null && values.value.includes(model.value)
    ? model.value
    : values.value[0]
);

function optionsFor(star: number) {
  if (!props.allowHalf) {
    return [{ value: star, part: "full" as const }];
  }
  return [
    { value: star - 0.5, part: "left" as const },
    { value: star, part: "right" as const },
  ];
}

function fillFor(star: number): "empty" | "half" | "full" {
  const shown = hoverValue.value ?? model.value ?? 0;
  if (shown >= star) return "full";
  if (shown >= star - 0.5) return "half";
  return "empty";
}

function preview(value: number) {
  if (!props.disabled) hoverValue.value = value;
}

async function select(value: number, { focus = false } = {}) {
  if (props.disabled) return;
  if (model.value !== value) {
    model.value = value;
    emit("change", value);
  }
  if (!focus) return;
  await nextTick();
  groupRef.value
    ?.querySelector<HTMLElement>(`[data-value="${value}"]`)
    ?.focus();
}

function onKeydown(event: KeyboardEvent, current: number) {
  if (props.disabled) return;
  const list = values.value;
  const index = list.indexOf(current);
  let next: number | undefined;

  switch (event.key) {
    // Same direction as native radio groups: down and right go forward.
    case "ArrowRight":
    case "ArrowDown":
      next = list[Math.min(list.length - 1, index + 1)];
      break;
    case "ArrowLeft":
    case "ArrowUp":
      next = list[Math.max(0, index - 1)];
      break;
    case "Home":
      next = list[0];
      break;
    case "End":
      next = list[list.length - 1];
      break;
    case " ":
    case "Enter":
      next = current;
      break;
    default:
      return;
  }

  event.preventDefault();
  hoverValue.value = null;
  select(next, { focus: true });
}
</script>
