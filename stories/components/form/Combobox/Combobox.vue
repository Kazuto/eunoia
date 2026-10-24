<template>
  <div
    ref="containerRef"
    class="relative flex flex-col gap-1"
  >
    <Label
      v-if="hasDefaultSlot"
      :id="labelId"
      :for="inputId"
      :dense
    >
      <slot />
    </Label>
    <ComboboxInput
      v-bind="$attrs"
      :id="inputId"
      ref="inputRef"
      :query
      :dense
      :invalid
      :disabled
      :placeholder="placeholder ?? t('placeholder')"
      :is-open="isOpen"
      :clearable="model != null || query !== ''"
      :clear-label="t('clear')"
      :listbox-id="listboxId"
      :active-descendant-id="activeDescendantId"
      :aria-label="ariaLabel"
      :aria-labelledby="ariaLabelledby"
      @update:query="onQueryInput"
      @open="openListbox"
      @toggle="toggleListbox"
      @clear="clear"
      @keydown="handleKeydown"
      @blur="onBlur"
    />
    <Teleport
      :to="teleportTarget ?? 'body'"
      :disabled="!teleportTo"
    >
      <SelectDropdown
        v-if="isOpen"
        :id="listboxId"
        ref="dropdownRef"
        :dense
        :aria-labelledby="hasDefaultSlot ? labelId : ariaLabelledby"
        :aria-label="hasDefaultSlot ? undefined : ariaLabel"
        :placement="teleportTo ? undefined : dropdownPlacement"
        :floating="!!teleportTo"
        :style="teleportTo ? floatingStyles : undefined"
      >
        <li
          v-if="filteredOptions.length === 0"
          role="option"
          aria-disabled="true"
          :aria-selected="false"
          class="px-3 py-2.5 text-sm text-neutral-400 dark:text-neutral-500"
        >
          {{ t("no-results") }}
        </li>
        <SelectOption
          v-for="(option, index) in filteredOptions"
          v-else
          :id="`${listboxId}-option-${index}`"
          :key="option.value"
          :option="option"
          :is-selected="option.value === model"
          :is-active="activeIndex === index"
          :dense
          @select="selectOption"
          @mouseenter="activeIndex = index"
        />
      </SelectDropdown>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, ref, toRef, watch } from "vue";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/vue";
import {
  type LocaleMessages,
  useLocale,
  useSanitizedId,
  useSlotContent,
} from "@/composables";
import Label from "../Input/primitives/Label.vue";
import SelectDropdown from "../Select/primitives/SelectDropdown.vue";
import SelectOption from "../Select/primitives/SelectOption.vue";
import ComboboxInput from "./primitives/ComboboxInput.vue";

export type ComboboxOption = { label: string; value: string | number };

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    options: ComboboxOption[];
    dense?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    placeholder?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
    locale?: LocaleMessages;
    /** Teleport outside overflow containers. Native dialogs own their dropdowns. */
    teleportTo?: string | HTMLElement;
  }>(),
  {
    placeholder: undefined,
    ariaLabel: undefined,
    ariaLabelledby: undefined,
    locale: undefined,
    teleportTo: undefined,
  }
);

const model = defineModel<string | number | null>();

const { hasSlotContent } = useSlotContent();
const hasDefaultSlot = hasSlotContent("default");

const t = useLocale(
  "combobox",
  toRef(() => props.locale)
);

const labelId = useSanitizedId("combobox-label");
const inputId = useSanitizedId("combobox-input");
const listboxId = useSanitizedId("combobox-listbox");

const isOpen = ref(false);
const activeIndex = ref(-1);
// Typing narrows the list; reopening without typing shows every option again.
const filtering = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const inputRef = ref<InstanceType<typeof ComboboxInput> | null>(null);
const dropdownRef = ref<InstanceType<typeof SelectDropdown> | null>(null);
const inputElement = computed<HTMLElement | null>(
  () => inputRef.value?.$el ?? null
);
const dropdownElement = computed<HTMLElement | null>(
  () => dropdownRef.value?.$el ?? null
);
const teleportTarget = ref<string | HTMLElement>();
const dropdownPlacement = ref<"bottom" | "top">("bottom");

const selectedOption = computed(() =>
  props.options.find((option) => option.value === model.value)
);

const query = ref(selectedOption.value?.label ?? "");

const filteredOptions = computed(() => {
  const needle = query.value.trim().toLowerCase();
  if (!filtering.value || !needle) return props.options;
  return props.options.filter((option) =>
    option.label.toLowerCase().includes(needle)
  );
});

const activeDescendantId = computed(() => {
  if (!isOpen.value || activeIndex.value < 0) return undefined;
  return `${listboxId}-option-${activeIndex.value}`;
});

const { floatingStyles } = useFloating(inputElement, dropdownElement, {
  open: isOpen,
  placement: "bottom-start",
  strategy: "fixed",
  middleware: computed(() =>
    props.teleportTo
      ? [
          offset(4),
          flip(),
          shift({ padding: 8 }),
          size({
            padding: 8,
            apply({ rects, availableHeight, elements }) {
              Object.assign(elements.floating.style, {
                width: `${rects.reference.width}px`,
                maxHeight: `${Math.max(0, Math.min(240, availableHeight))}px`,
              });
            },
          }),
        ]
      : []
  ),
  whileElementsMounted(reference, floating, update) {
    if (props.teleportTo) return autoUpdate(reference, floating, update);
    return () => {};
  },
});

watch(selectedOption, (option) => {
  if (!filtering.value) query.value = option?.label ?? "";
});

async function openListbox() {
  if (props.disabled || isOpen.value) return;

  // A body portal is inert beneath showModal(). Keep the listbox in the
  // dialog's top layer, but outside its scrolling body.
  teleportTarget.value =
    inputElement.value?.closest("dialog") ?? props.teleportTo;
  isOpen.value = true;
  activeIndex.value = filteredOptions.value.findIndex(
    (option) => option.value === model.value
  );

  await nextTick();

  if (!props.teleportTo) updatePlacement();
}

function updatePlacement() {
  if (!containerRef.value) return;

  const rect = containerRef.value.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const dropdownHeight = dropdownElement.value?.offsetHeight ?? 200;

  dropdownPlacement.value =
    spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove ? "bottom" : "top";
}

function closeListbox() {
  isOpen.value = false;
  activeIndex.value = -1;
  filtering.value = false;
  query.value = selectedOption.value?.label ?? "";
}

function toggleListbox() {
  if (isOpen.value) {
    closeListbox();
  } else {
    inputRef.value?.focus();
    openListbox();
  }
}

function onQueryInput(value: string) {
  query.value = value;
  filtering.value = true;
  openListbox();
  activeIndex.value = value.trim() && filteredOptions.value.length > 0 ? 0 : -1;
}

function selectOption(option: ComboboxOption) {
  model.value = option.value;
  closeListbox();
  // The model may update on the parent's next render; show the pick now.
  query.value = option.label;
}

function clear() {
  model.value = null;
  closeListbox();
  query.value = "";
  inputRef.value?.focus();
}

function handleKeydown(event: KeyboardEvent) {
  const lastIndex = filteredOptions.value.length - 1;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (!isOpen.value) {
        openListbox();
        if (activeIndex.value < 0 && lastIndex >= 0) activeIndex.value = 0;
      } else {
        activeIndex.value = Math.min(activeIndex.value + 1, lastIndex);
      }
      break;

    case "ArrowUp":
      event.preventDefault();
      if (!isOpen.value) {
        openListbox();
        activeIndex.value = lastIndex;
      } else {
        activeIndex.value = Math.max(activeIndex.value - 1, 0);
      }
      break;

    case "Home":
      if (isOpen.value && lastIndex >= 0) {
        event.preventDefault();
        activeIndex.value = 0;
      }
      break;

    case "End":
      if (isOpen.value && lastIndex >= 0) {
        event.preventDefault();
        activeIndex.value = lastIndex;
      }
      break;

    case "Enter":
      if (isOpen.value && activeIndex.value >= 0) {
        event.preventDefault();
        selectOption(filteredOptions.value[activeIndex.value]);
      }
      break;

    case "Escape":
      if (isOpen.value) {
        event.preventDefault();
        event.stopPropagation();
        closeListbox();
      }
      break;

    case "Tab":
      closeListbox();
      break;
  }
}

function onBlur(event: FocusEvent) {
  const next = event.relatedTarget as Node | null;
  if (next && containerRef.value?.contains(next)) return;
  if (next && dropdownElement.value?.contains(next)) return;
  if (isOpen.value || filtering.value) closeListbox();
}

function onClickOutside(event: MouseEvent) {
  const path = event.composedPath();
  if (
    !path.includes(containerRef.value as EventTarget) &&
    !path.includes(dropdownElement.value as EventTarget)
  ) {
    closeListbox();
  }
}

watch(isOpen, (open, _, onCleanup) => {
  if (open) {
    document.addEventListener("mousedown", onClickOutside);
    const dialog = inputElement.value?.closest("dialog");
    dialog?.addEventListener("close", closeListbox);
    onCleanup(() => {
      document.removeEventListener("mousedown", onClickOutside);
      dialog?.removeEventListener("close", closeListbox);
    });
  }
});

watch(
  activeIndex,
  (index) => {
    if (index < 0 || !isOpen.value) return;
    const optionEl = document.getElementById(`${listboxId}-option-${index}`);
    const dropdown = dropdownElement.value;
    if (!optionEl || !dropdown) return;
    // Scroll only the listbox, never the surrounding dialog or page.
    const optionRect = optionEl.getBoundingClientRect();
    const dropdownRect = dropdown.getBoundingClientRect();
    const top = dropdownRect.top + dropdown.clientTop;
    const bottom = top + dropdown.clientHeight;
    if (optionRect.top < top) dropdown.scrollTop -= top - optionRect.top;
    else if (optionRect.bottom > bottom)
      dropdown.scrollTop += optionRect.bottom - bottom;
  },
  { flush: "post" }
);

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onClickOutside);
});
</script>
