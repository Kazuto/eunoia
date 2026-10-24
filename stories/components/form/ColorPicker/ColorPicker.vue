<template>
  <div
    ref="containerRef"
    class="relative flex flex-col gap-1"
    @focusout="onFocusOut"
  >
    <Label
      v-if="hasDefaultSlot"
      :dense
      :for="triggerId"
    >
      <slot />
    </Label>
    <ColorPickerTrigger
      v-bind="$attrs"
      :id="triggerId"
      ref="triggerRef"
      :value="model"
      :is-open="isOpen"
      :panel-id="panelId"
      :dense
      :invalid
      :disabled
      :aria-label="hasDefaultSlot ? undefined : t('label')"
      @click="toggle"
      @keydown="onTriggerKeydown"
    />
    <input
      v-if="name"
      type="hidden"
      :name
      :value="model ?? ''"
    />
    <Teleport
      :to="teleportTarget ?? 'body'"
      :disabled="!teleportTo"
    >
      <ColorPickerPanel
        v-if="isOpen"
        :id="panelId"
        ref="panelRef"
        :label="t('label')"
        :dense
        :style="floatingStyles"
        @keydown="onPanelKeydown"
        @focusout="onFocusOut"
      >
        <ColorArea
          ref="areaRef"
          v-model:saturation="saturation"
          v-model:brightness="brightness"
          :label="t('saturation-brightness')"
          :hue="hsva.h"
          :thumb-color="opaqueHex"
          :dense
        />
        <ColorChannelSlider
          v-model="hue"
          :label="t('hue')"
          :max="360"
          :value-text="`${Math.round(hue)}°`"
          :track-background="HUE_GRADIENT"
          :thumb-color="`hsl(${hue} 100% 50%)`"
          :dense
        />
        <ColorChannelSlider
          v-if="alpha"
          v-model="alphaPercent"
          :label="t('alpha')"
          :max="100"
          :value-text="`${Math.round(alphaPercent)}%`"
          :track-background="alphaTrack"
          track-background-size="100% 100%, 8px 8px"
          :thumb-color="opaqueHex"
          :dense
        />
        <div class="flex items-center gap-2">
          <ColorSwatch
            :color="currentHex"
            :size="dense ? 'md' : 'lg'"
          />
          <ColorHexInput
            v-model="hexDraft"
            :label="t('hex')"
            :dense
            @commit="commitHex"
          />
        </div>
        <div
          v-if="normalizedSwatches.length"
          class="flex flex-wrap gap-1.5"
        >
          <button
            v-for="swatch in normalizedSwatches"
            :key="swatch"
            type="button"
            class="cursor-pointer rounded-[8px] outline-none squircle focus-visible:ring-2 focus-visible:ring-primary-500"
            :aria-label="t('swatch', { color: swatch })"
            :aria-pressed="model != null && swatch === currentHex"
            @click="setFromHex(swatch)"
          >
            <ColorSwatch
              :color="swatch"
              :size="dense ? 'md' : 'lg'"
            />
          </button>
        </div>
      </ColorPickerPanel>
    </Teleport>
    <InputHintRow
      v-if="hasHelper"
      :dense
    >
      <InputHelper>
        {{ helper }}
      </InputHelper>
    </InputHintRow>
    <InputError
      v-if="errors?.length"
      :errors="errors"
      :dense
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, toRef, watch } from "vue";
import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/vue";
import {
  type LocaleMessages,
  useLocale,
  useSanitizedId,
  useSlotContent,
} from "@/composables";
import Label from "../Input/primitives/Label.vue";
import InputHintRow from "../Input/primitives/InputHintRow.vue";
import InputHelper from "../Input/primitives/InputHelper.vue";
import InputError from "../Input/primitives/InputError.vue";
import ColorPickerTrigger from "./primitives/ColorPickerTrigger.vue";
import ColorPickerPanel from "./primitives/ColorPickerPanel.vue";
import ColorArea from "./primitives/ColorArea.vue";
import ColorChannelSlider from "./primitives/ColorChannelSlider.vue";
import ColorHexInput from "./primitives/ColorHexInput.vue";
import ColorSwatch from "./primitives/ColorSwatch.vue";
import {
  type Hsva,
  hsvaToHex,
  hsvToRgb,
  normalizeHex,
  parseHex,
} from "./primitives/color";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    alpha?: boolean;
    swatches?: string[];
    dense?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    name?: string;
    helper?: string;
    errors?: string[];
    locale?: LocaleMessages;
    /** Teleport outside overflow containers. Native dialogs own their panels. */
    teleportTo?: string | HTMLElement;
  }>(),
  {
    swatches: () => [],
    name: undefined,
    helper: undefined,
    errors: undefined,
    locale: undefined,
    teleportTo: undefined,
  }
);

const model = defineModel<string | null>();

const HUE_GRADIENT =
  "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)";

const { hasSlotContent } = useSlotContent();
const hasDefaultSlot = hasSlotContent("default");

const t = useLocale(
  "colorpicker",
  toRef(() => props.locale)
);

const triggerId = useSanitizedId("colorpicker-trigger");
const panelId = useSanitizedId("colorpicker-panel");

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const triggerRef = ref<InstanceType<typeof ColorPickerTrigger> | null>(null);
const panelRef = ref<InstanceType<typeof ColorPickerPanel> | null>(null);
const areaRef = ref<InstanceType<typeof ColorArea> | null>(null);
const triggerElement = computed<HTMLElement | null>(
  () => triggerRef.value?.$el ?? null
);
const panelElement = computed<HTMLElement | null>(
  () => panelRef.value?.$el ?? null
);
const teleportTarget = ref<string | HTMLElement>();

const { floatingStyles } = useFloating(triggerElement, panelElement, {
  open: isOpen,
  placement: "bottom-start",
  strategy: computed(() => (props.teleportTo ? "fixed" : "absolute")),
  middleware: [offset(4), flip(), shift({ padding: 8 })],
  whileElementsMounted: autoUpdate,
});

const hasHelper = computed(() => props.helper && !props.errors?.length);

function fromHex(hex: string | null | undefined): Hsva | null {
  const parsed = hex ? parseHex(hex) : null;
  if (!parsed) return null;
  if (!props.alpha) parsed.a = 1;
  return parsed;
}

// Hex can't carry hue for grays, so HSVA stays the source of truth while editing.
const hsva = ref<Hsva>(fromHex(model.value) ?? { h: 0, s: 0, v: 0, a: 1 });

const currentHex = computed(() => hsvaToHex(hsva.value, props.alpha));
const opaqueHex = computed(() => hsvaToHex(hsva.value, false));

const alphaTrack = computed(() => {
  const { r, g, b } = hsvToRgb(hsva.value.h, hsva.value.s, hsva.value.v);
  return `linear-gradient(to right, rgb(${r} ${g} ${b} / 0), rgb(${r} ${g} ${b})), repeating-conic-gradient(#d4d4d4 0 25%, #ffffff 0 50%)`;
});

const normalizedSwatches = computed(() =>
  props.swatches
    .map((swatch) => normalizeHex(swatch, props.alpha))
    .filter((swatch): swatch is string => swatch !== null)
);

function applyHsva(next: Hsva) {
  hsva.value = next;
  model.value = currentHex.value;
}

function setFromHex(hex: string) {
  const parsed = fromHex(hex);
  if (!parsed) return;
  if (parsed.s === 0 || parsed.v === 0) parsed.h = hsva.value.h;
  applyHsva(parsed);
}

const saturation = computed({
  get: () => hsva.value.s,
  set: (s: number) => applyHsva({ ...hsva.value, s }),
});
const brightness = computed({
  get: () => hsva.value.v,
  set: (v: number) => applyHsva({ ...hsva.value, v }),
});
const hue = computed({
  get: () => hsva.value.h,
  set: (h: number) => applyHsva({ ...hsva.value, h }),
});
const alphaPercent = computed({
  get: () => hsva.value.a * 100,
  set: (a: number) => applyHsva({ ...hsva.value, a: a / 100 }),
});

watch(model, (value) => {
  if (!value || normalizeHex(value, props.alpha) === currentHex.value) return;
  const parsed = fromHex(value);
  if (!parsed) return;
  if (parsed.s === 0 || parsed.v === 0) parsed.h = hsva.value.h;
  hsva.value = parsed;
});

const hexDraft = ref(currentHex.value);
watch(currentHex, (hex) => {
  hexDraft.value = hex;
});

function commitHex(value: string) {
  const normalized = normalizeHex(value, props.alpha);
  if (normalized) {
    setFromHex(normalized);
  }
  hexDraft.value = currentHex.value;
}

async function open() {
  if (props.disabled) return;
  // A body portal is inert beneath showModal(). Keep the panel in the dialog's top layer.
  teleportTarget.value =
    triggerElement.value?.closest("dialog") ?? props.teleportTo;
  isOpen.value = true;
  await nextTick();
  (areaRef.value?.$el as HTMLElement | undefined)?.focus();
}

function close({ restoreFocus = false } = {}) {
  if (!isOpen.value) return;
  isOpen.value = false;
  if (restoreFocus) triggerElement.value?.focus();
}

function toggle() {
  if (isOpen.value) close();
  else open();
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowDown" && !isOpen.value) {
    event.preventDefault();
    open();
  } else if (event.key === "Escape" && isOpen.value) {
    event.preventDefault();
    close();
  }
}

function onPanelKeydown(event: KeyboardEvent) {
  if (event.key !== "Escape") return;
  event.preventDefault();
  hexDraft.value = currentHex.value;
  close({ restoreFocus: true });
}

function isInside(node: Node | null) {
  if (!node) return false;
  return (
    !!containerRef.value?.contains(node) || !!panelElement.value?.contains(node)
  );
}

function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null;
  if (!next || isInside(next)) return;
  close();
}

function onClickOutside(event: MouseEvent) {
  if (!isInside(event.target as Node)) close();
}

watch(isOpen, (value) => {
  if (value) {
    document.addEventListener("mousedown", onClickOutside);
  } else {
    document.removeEventListener("mousedown", onClickOutside);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onClickOutside);
});
</script>
