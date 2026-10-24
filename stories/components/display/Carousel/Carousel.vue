<template>
  <section
    v-bind="forwardedAttrs"
    role="region"
    aria-roledescription="carousel"
    :aria-label="ariaLabel ?? t('label')"
    :class="['flex flex-col gap-3', classAttr]"
    @keydown="onKeydown"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @focusin="onFocusIn"
  >
    <div
      :id="viewportId"
      ref="viewportRef"
      tabindex="0"
      :aria-live="running ? 'off' : 'polite'"
      class="relative flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-[16px] outline-none [scrollbar-width:none] squircle focus-visible:ring-2 focus-visible:ring-primary-500 [&::-webkit-scrollbar]:hidden"
      @scroll="onScroll"
    >
      <CarouselSlide
        v-for="(item, index) in items"
        :key="index"
        :label="t('slide', { index: index + 1, total: items.length })"
        :active="index === current"
      >
        <slot
          :item="item"
          :index="index"
          :active="index === current"
        />
      </CarouselSlide>
    </div>

    <div
      v-if="items.length > 1"
      class="flex items-center justify-center gap-2"
    >
      <!-- The icon is replaced on every press; keeping it out of hit testing
           stops Chrome from losing the hover and never sending mouseleave. -->
      <Button
        v-if="autoplayEnabled"
        ghost
        dense
        data-rotation
        class="aspect-square [&_svg]:pointer-events-none"
        :icon="playing ? 'pause' : 'play'"
        :aria-label="playing ? t('pause') : t('play')"
        @click="playing = !playing"
      />
      <Button
        ghost
        dense
        class="aspect-square"
        icon="caret-left"
        :aria-label="t('previous')"
        :aria-controls="viewportId"
        :disabled="!canGoPrevious"
        @click="previous"
      />
      <div class="flex items-center gap-1.5">
        <CarouselIndicator
          v-for="(_, index) in items"
          :key="index"
          :label="t('go-to', { index: index + 1 })"
          :active="index === current"
          @select="goTo(index)"
        />
      </div>
      <Button
        ghost
        dense
        class="aspect-square"
        icon="caret-right"
        :aria-label="t('next')"
        :aria-controls="viewportId"
        :disabled="!canGoNext"
        @click="next"
      />
    </div>
  </section>
</template>

<script setup lang="ts" generic="T">
import { computed, onBeforeUnmount, onMounted, ref, toRef, watch } from "vue";
import {
  useForwardedAttrs,
  useLocale,
  useSanitizedId,
  type LocaleMessages,
} from "@/composables";
import { Button } from "@/components/core";
import CarouselSlide from "./primitives/CarouselSlide.vue";
import CarouselIndicator from "./primitives/CarouselIndicator.vue";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const props = withDefaults(
  defineProps<{
    items: T[];
    /** Wraps from the last slide to the first and back. */
    loop?: boolean;
    /** Milliseconds between slides; autoplay always wraps around. */
    autoplay?: number;
    ariaLabel?: string;
    locale?: LocaleMessages;
  }>(),
  {
    autoplay: undefined,
    ariaLabel: undefined,
    locale: undefined,
  }
);

defineSlots<{
  default?: (props: { item: T; index: number; active: boolean }) => unknown;
}>();

const model = defineModel<number>({ default: 0 });

const t = useLocale(
  "carousel",
  toRef(() => props.locale)
);

const viewportId = useSanitizedId("carousel-viewport");
const viewportRef = ref<HTMLElement | null>(null);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const lastIndex = computed(() => Math.max(props.items.length - 1, 0));
const current = computed(() =>
  Math.min(Math.max(model.value, 0), lastIndex.value)
);

const canGoPrevious = computed(() => props.loop || current.value > 0);
const canGoNext = computed(() => props.loop || current.value < lastIndex.value);

function goTo(index: number) {
  model.value = Math.min(Math.max(index, 0), lastIndex.value);
}

function previous() {
  if (current.value > 0) goTo(current.value - 1);
  else if (props.loop) goTo(lastIndex.value);
}

function next() {
  if (current.value < lastIndex.value) goTo(current.value + 1);
  else if (props.loop) goTo(0);
}

function onKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement;
  if (target.closest("input, textarea, select, [contenteditable='true']"))
    return;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    previous();
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    next();
  }
}

// Scrolling (programmatic or a swipe) only reports a slide once it settles, so
// a smooth scroll across several slides doesn't feed intermediate indexes back.
let settleTimer: ReturnType<typeof setTimeout> | undefined;
let scrolledTo: number | undefined;

function onScroll() {
  clearTimeout(settleTimer);
  settleTimer = setTimeout(() => {
    const viewport = viewportRef.value;
    if (!viewport || !viewport.clientWidth) return;
    const index = Math.round(viewport.scrollLeft / viewport.clientWidth);
    if (index !== current.value) {
      scrolledTo = index;
      goTo(index);
    }
  }, 100);
}

// The viewport is `relative`, so a slide's offsetLeft is measured from it and
// not from whatever positioned ancestor the carousel sits in.
function scrollToCurrent(behavior: "auto" | "smooth") {
  const viewport = viewportRef.value;
  const slide = viewport?.children[current.value] as HTMLElement | undefined;
  if (!viewport || !slide) return;
  viewport.scrollTo({ left: slide.offsetLeft, behavior });
}

// The outgoing slide turns inert, which would drop focus held inside it to the
// page, so hand focus to the viewport before that happens.
watch(current, (_, previousIndex) => {
  const viewport = viewportRef.value;
  const outgoing = viewport?.children[previousIndex];
  if (viewport && outgoing?.contains(document.activeElement)) {
    viewport.focus({ preventScroll: true });
  }
});

// After the DOM update, so a slide added and selected together can be found.
watch(
  current,
  (index) => {
    if (scrolledTo === index) {
      scrolledTo = undefined;
      return;
    }
    scrolledTo = undefined;
    scrollToCurrent(prefersReducedMotion() ? "auto" : "smooth");
  },
  { flush: "post" }
);

const autoplayEnabled = computed(
  () => !!props.autoplay && props.autoplay > 0 && props.items.length > 1
);
const playing = ref(false);
const hovered = ref(false);
const pageHidden = ref(false);
const running = computed(
  () =>
    autoplayEnabled.value &&
    playing.value &&
    !hovered.value &&
    !pageHidden.value
);

// Focus on anything but the rotation control stops autoplay until the user
// starts it again; hovering only pauses it.
function onFocusIn(event: FocusEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest("[data-rotation]")) playing.value = false;
}

function onVisibilityChange() {
  pageHidden.value = document.visibilityState === "hidden";
}

let autoplayTimer: ReturnType<typeof setInterval> | undefined;

watch([running, () => props.autoplay], ([isRunning]) => {
  clearInterval(autoplayTimer);
  autoplayTimer = undefined;
  if (!isRunning) return;
  autoplayTimer = setInterval(() => {
    goTo(current.value < lastIndex.value ? current.value + 1 : 0);
  }, props.autoplay);
});

watch(autoplayEnabled, (enabled) => {
  playing.value = enabled && !prefersReducedMotion();
});

onMounted(() => {
  scrollToCurrent("auto");
  playing.value = autoplayEnabled.value && !prefersReducedMotion();
  onVisibilityChange();
  document.addEventListener("visibilitychange", onVisibilityChange);
});

onBeforeUnmount(() => {
  clearTimeout(settleTimer);
  clearInterval(autoplayTimer);
  document.removeEventListener("visibilitychange", onVisibilityChange);
});
</script>
