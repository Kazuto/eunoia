<template>
  <div
    ref="anchorRef"
    v-bind="forwardedAttrs"
    :class="wrapperStyles({ class: classAttr })"
    @keydown="onKeydown"
  >
    <slot
      name="trigger"
      v-bind="triggerProps"
    >
      <Button
        v-bind="triggerProps"
        :dense
      >
        {{ label }}
      </Button>
    </slot>
    <Teleport
      :to="teleportTarget ?? 'body'"
      :disabled="!teleportTo"
    >
      <PopoverPanel
        v-if="open"
        :id="panelId"
        ref="panelRef"
        :dense
        :aria-label="label"
        :style="floatingStyles"
        @keydown="onKeydown"
      >
        <slot :close="() => close(true)" />
      </PopoverPanel>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  toRef,
  watch,
} from "vue";
import { tv } from "tailwind-variants";
import {
  autoUpdate,
  flip,
  offset as offsetBy,
  shift,
  useFloating,
  type Placement,
} from "@floating-ui/vue";
import { useForwardedAttrs, useSanitizedId } from "@/composables";
import Button from "@/components/core/Button/Button.vue";
import PopoverPanel from "./primitives/PopoverPanel.vue";

export type PopoverPlacement = Placement;

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const wrapperStyles = tv({
  base: "inline-flex",
});

const props = withDefaults(
  defineProps<{
    /** Names the panel for assistive tech, and is the default trigger's text. */
    label: string;
    placement?: PopoverPlacement;
    /** Gap between the trigger and the panel, in pixels. */
    offset?: number;
    dense?: boolean;
    disabled?: boolean;
    /** Teleport outside overflow containers. Native dialogs own their popovers. */
    teleportTo?: string | HTMLElement;
  }>(),
  {
    placement: "bottom-start",
    offset: 6,
    teleportTo: undefined,
  }
);

const open = defineModel<boolean>("open", { default: false });

const panelId = useSanitizedId("popover");
const anchorRef = ref<HTMLElement | null>(null);
const panelRef = ref<InstanceType<typeof PopoverPanel> | null>(null);
const panelElement = computed<HTMLElement | null>(
  () => panelRef.value?.$el ?? null
);
const teleportTarget = ref<string | HTMLElement>();

let triggerElement: HTMLElement | null = null;

const { floatingStyles } = useFloating(anchorRef, panelElement, {
  open,
  placement: toRef(() => props.placement),
  strategy: "fixed",
  middleware: computed(() => [
    offsetBy(props.offset),
    flip(),
    shift({ padding: 8 }),
  ]),
  whileElementsMounted: autoUpdate,
});

const triggerProps = computed(() => ({
  "aria-haspopup": "dialog" as const,
  "aria-expanded": open.value,
  "aria-controls": open.value ? panelId : undefined,
  disabled: props.disabled || undefined,
  onClick: toggle,
}));

function toggle(event?: Event) {
  if (props.disabled) return;
  // Safari does not focus buttons on click, so remember the trigger itself.
  triggerElement = (event?.currentTarget as HTMLElement | null) ?? null;
  open.value = !open.value;
}

/** The trigger in the anchor, for when the popover was opened through v-model rather than a click. */
function findTrigger(): HTMLElement | null {
  const candidates =
    anchorRef.value?.querySelectorAll<HTMLElement>(
      '[aria-haspopup="dialog"]'
    ) ?? [];
  return (
    [...candidates].find((el) => !panelElement.value?.contains(el)) ?? null
  );
}

function close(returnFocus: boolean) {
  if (!open.value) return;
  open.value = false;
  if (returnFocus) (triggerElement ?? findTrigger())?.focus();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== "Escape" || !open.value) return;
  // Keep a surrounding native dialog open; only the popover closes.
  event.preventDefault();
  event.stopPropagation();
  close(true);
}

function onClickOutside(event: MouseEvent) {
  const target = event.target as Node;
  if (anchorRef.value?.contains(target)) return;
  if (panelElement.value?.contains(target)) return;
  close(false);
}

async function onOpen() {
  // A body portal is inert beneath showModal(), so stay in the dialog's top layer.
  teleportTarget.value = anchorRef.value?.closest("dialog") ?? props.teleportTo;
  document.addEventListener("mousedown", onClickOutside);
  await nextTick();
  const panel = panelElement.value;
  const focusable = panel?.querySelector<HTMLElement>(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  (focusable ?? panel)?.focus();
}

watch(open, (value) => {
  if (value) onOpen();
  else document.removeEventListener("mousedown", onClickOutside);
});

onMounted(() => {
  if (open.value) onOpen();
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onClickOutside);
});
</script>
