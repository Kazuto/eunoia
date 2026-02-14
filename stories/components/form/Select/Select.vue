<template>
  <div
    ref="containerRef"
    class="relative flex flex-col gap-1"
  >
    <Label
      :id="labelId"
      :dense
    >
      <slot />
    </Label>
    <SelectTrigger
      v-bind="$attrs"
      :id="triggerId"
      :selected-labels="selectedLabels"
      :selected-values="selectedValues"
      :multiple
      :dense
      :invalid
      :disabled
      :placeholder="placeholder ?? t('placeholder')"
      :is-open="isOpen"
      :listbox-id="listboxId"
      :active-descendant-id="activeDescendantId"
      :aria-label="ariaLabel"
      :aria-labelledby="ariaLabelledby ?? labelId"
      @toggle="toggleDropdown"
      @keydown="handleTriggerKeydown"
      @remove-chip="removeValue"
    />
    <SelectDropdown
      v-if="isOpen"
      :id="listboxId"
      :multiple
      :dense
    >
      <li
        v-if="options.length === 0"
        role="option"
        :aria-selected="false"
        class="px-3 py-2.5 text-sm text-neutral-400"
      >
        {{ t("no-results") }}
      </li>
      <SelectOption
        v-for="(option, index) in options"
        v-else
        :id="`${listboxId}-option-${index}`"
        :key="option.value"
        :option="option"
        :is-selected="selectedValues.includes(option.value)"
        :is-active="activeIndex === index"
        :dense
        @select="handleOptionSelect"
        @mouseenter="activeIndex = index"
      />
    </SelectDropdown>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, toRef, watch } from "vue";
import { type LocaleMessages, useLocale, useSanitizedId } from "@/composables";
import Label from "../Input/primitives/Label.vue";
import SelectTrigger from "./primitives/SelectTrigger.vue";
import SelectDropdown from "./primitives/SelectDropdown.vue";
import SelectOption from "./primitives/SelectOption.vue";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    options: Array<{ label: string; value: string | number }>;
    multiple?: boolean;
    dense?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    placeholder?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
    locale?: LocaleMessages;
  }>(),
  {
    placeholder: undefined,
    ariaLabel: undefined,
    ariaLabelledby: undefined,
    locale: undefined,
  }
);

const model = defineModel<string | number | Array<string | number>>();

const t = useLocale(
  "select",
  toRef(() => props.locale)
);

const labelId = useSanitizedId("select-label");
const triggerId = useSanitizedId("select-trigger");
const listboxId = useSanitizedId("select-listbox");

const isOpen = ref(false);
const activeIndex = ref(-1);
const containerRef = ref<HTMLElement | null>(null);

const selectedValues = computed<Array<string | number>>(() => {
  if (props.multiple) {
    return Array.isArray(model.value) ? model.value : [];
  }
  return model.value != null && !Array.isArray(model.value)
    ? [model.value]
    : [];
});

const selectedLabels = computed<string[]>(() => {
  return selectedValues.value.map((val) => {
    const opt = props.options.find((o) => o.value === val);
    return opt?.label ?? String(val);
  });
});

const activeDescendantId = computed(() => {
  if (!isOpen.value || activeIndex.value < 0) return undefined;
  return `${listboxId}-option-${activeIndex.value}`;
});

function openDropdown() {
  if (props.disabled) return;
  isOpen.value = true;
  activeIndex.value = -1;
}

function closeDropdown() {
  isOpen.value = false;
  activeIndex.value = -1;
}

function toggleDropdown() {
  if (isOpen.value) {
    closeDropdown();
  } else {
    openDropdown();
  }
}

function handleOptionSelect(option: { label: string; value: string | number }) {
  if (props.multiple) {
    const current = Array.isArray(model.value) ? [...model.value] : [];
    const idx = current.indexOf(option.value);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(option.value);
    }
    model.value = current;
  } else {
    model.value = option.value;
    closeDropdown();
  }
}

function removeValue(value: string | number) {
  if (!props.multiple || !Array.isArray(model.value)) return;
  model.value = model.value.filter((v) => v !== value);
}

function handleTriggerKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (!isOpen.value) {
        openDropdown();
        activeIndex.value = 0;
      } else {
        activeIndex.value = Math.min(
          activeIndex.value + 1,
          props.options.length - 1
        );
      }
      break;

    case "ArrowUp":
      event.preventDefault();
      if (!isOpen.value) {
        openDropdown();
        activeIndex.value = props.options.length - 1;
      } else {
        activeIndex.value = Math.max(activeIndex.value - 1, 0);
      }
      break;

    case "Enter":
      event.preventDefault();
      if (isOpen.value && activeIndex.value >= 0) {
        handleOptionSelect(props.options[activeIndex.value]);
      } else if (!isOpen.value) {
        openDropdown();
      }
      break;

    case " ":
      event.preventDefault();
      if (isOpen.value && activeIndex.value >= 0) {
        handleOptionSelect(props.options[activeIndex.value]);
      } else if (!isOpen.value) {
        openDropdown();
      }
      break;

    case "Escape":
      event.preventDefault();
      closeDropdown();
      break;

    case "Tab":
      closeDropdown();
      break;

    case "Home":
      if (isOpen.value) {
        event.preventDefault();
        activeIndex.value = 0;
      }
      break;

    case "End":
      if (isOpen.value) {
        event.preventDefault();
        activeIndex.value = props.options.length - 1;
      }
      break;
  }
}

function onClickOutside(event: MouseEvent) {
  if (
    containerRef.value &&
    !containerRef.value.contains(event.target as Node)
  ) {
    closeDropdown();
  }
}

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener("mousedown", onClickOutside);
  } else {
    document.removeEventListener("mousedown", onClickOutside);
  }
});

watch(activeIndex, (index) => {
  if (index >= 0 && isOpen.value) {
    const optionEl = document.getElementById(`${listboxId}-option-${index}`);
    optionEl?.scrollIntoView({ block: "nearest" });
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onClickOutside);
});
</script>
