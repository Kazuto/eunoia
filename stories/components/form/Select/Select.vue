<template>
  <div
    ref="containerRef"
    class="relative flex flex-col gap-1"
  >
    <Label
      v-if="hasDefaultSlot"
      :id="labelId"
      :dense
    >
      <slot />
    </Label>
    <SelectTrigger
      v-bind="$attrs"
      :id="triggerId"
      ref="triggerRef"
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
    <Teleport
      :to="teleportTarget ?? 'body'"
      :disabled="!teleportTo"
    >
      <SelectDropdown
        v-if="isOpen"
        :id="listboxId"
        ref="dropdownRef"
        :multiple
        :dense
        :placement="teleportTo ? undefined : dropdownPlacement"
        :floating="!!teleportTo"
        :style="teleportTo ? floatingStyles : undefined"
        @keydown="handleTriggerKeydown"
      >
        <li
          v-if="options.length === 0"
          role="option"
          :aria-selected="false"
          class="px-3 py-2.5 text-sm text-neutral-400 dark:text-neutral-500"
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
import { type LocaleMessages, useLocale, useSanitizedId } from "@/composables";
import Label from "../Input/primitives/Label.vue";
import SelectTrigger from "./primitives/SelectTrigger.vue";
import SelectDropdown from "./primitives/SelectDropdown.vue";
import SelectOption from "./primitives/SelectOption.vue";
import { useSlotContent } from "@/composables";

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

const model = defineModel<string | number | Array<string | number>>();

const { hasSlotContent } = useSlotContent();
const hasDefaultSlot = hasSlotContent("default");

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
const triggerRef = ref<InstanceType<typeof SelectTrigger> | null>(null);
const dropdownRef = ref<InstanceType<typeof SelectDropdown> | null>(null);
const triggerElement = computed<HTMLElement | null>(
  () => triggerRef.value?.$el ?? null
);
const dropdownElement = computed<HTMLElement | null>(
  () => dropdownRef.value?.$el ?? null
);
const teleportTarget = ref<string | HTMLElement>();

const { floatingStyles } = useFloating(triggerElement, dropdownElement, {
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

const dropdownPlacement = ref<"bottom" | "top">("bottom");

async function openDropdown() {
  if (props.disabled) return;

  // A body portal is inert beneath showModal(). Keep the dropdown in the
  // dialog's top layer, but outside its scrolling body.
  teleportTarget.value =
    triggerElement.value?.closest("dialog") ?? props.teleportTo;
  isOpen.value = true;
  activeIndex.value = -1;

  await nextTick();

  if (!props.teleportTo) updatePlacement();
}

function updatePlacement() {
  if (!containerRef.value) return;

  const rect = containerRef.value.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  const dropdownEl = containerRef.value.querySelector(
    "[role='listbox']"
  ) as HTMLElement | null;

  const dropdownHeight = dropdownEl?.offsetHeight ?? 200;

  dropdownPlacement.value =
    spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove ? "bottom" : "top";
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
      if (isOpen.value) {
        event.preventDefault();
        event.stopPropagation();
        closeDropdown();
        triggerElement.value?.focus({ preventScroll: true });
      }
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
    !event.composedPath().includes(containerRef.value as EventTarget) &&
    !event.composedPath().includes(dropdownElement.value as EventTarget)
  ) {
    closeDropdown();
  }
}

watch(isOpen, (open, _, onCleanup) => {
  if (open) {
    document.addEventListener("mousedown", onClickOutside);
    const dialog = triggerElement.value?.closest("dialog");
    dialog?.addEventListener("close", closeDropdown);
    onCleanup(() => {
      document.removeEventListener("mousedown", onClickOutside);
      dialog?.removeEventListener("close", closeDropdown);
    });
  }
});

watch(
  activeIndex,
  (index) => {
    if (index >= 0 && isOpen.value) {
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
    }
  },
  { flush: "post" }
);

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onClickOutside);
});
</script>
