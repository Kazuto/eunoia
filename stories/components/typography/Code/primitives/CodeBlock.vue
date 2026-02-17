<template>
  <div
    v-bind="forwardedAttrs"
    :class="wrapperStyles({ class: classAttr })"
  >
    <Button
      ghost
      dense
      :icon="copied ? 'check' : 'copy'"
      :class="copyButtonStyles({ copied })"
      :aria-label="ariaLabel"
      @click="copy"
    />
    <span
      v-if="filename"
      :class="filenameStyles()"
      >{{ filename }}</span
    >
    <span
      v-if="language"
      ref="slotRef"
      hidden
      ><slot
    /></span>
    <pre
      v-if="language"
      :class="preStyles({ hasFilename: !!filename })"
    ><!-- eslint-disable-next-line vue/no-v-html, vue/max-attributes-per-line -->
<code :class="codeStyles()" v-html="highlightedHtml" /></pre>
    <pre
      v-else
      :class="preStyles({ hasFilename: !!filename })"
    >
<code :class="codeStyles()"><slot /></code></pre>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUpdated, ref } from "vue";
import { tv } from "tailwind-variants";
import hljs from "highlight.js/lib/core";
import { Button } from "@/components";
import { useForwardedAttrs } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const props = defineProps<{
  ariaLabel: string;
  filename?: string;
  language?: string;
}>();

const emit = defineEmits<{
  (e: "copy", text: string): void;
}>();

const slotRef = ref<HTMLElement | null>(null);
const rawCode = ref("");

function extractCode() {
  if (slotRef.value) {
    rawCode.value = slotRef.value.textContent ?? "";
  }
}

onMounted(extractCode);
onUpdated(extractCode);

const highlightedHtml = computed(() => {
  if (!props.language || !rawCode.value) return "";
  try {
    return hljs.highlight(rawCode.value, { language: props.language }).value;
  } catch {
    return rawCode.value;
  }
});

const copied = ref(false);
let timeout: ReturnType<typeof setTimeout> | undefined;

function copy(event: MouseEvent) {
  const pre = (event.currentTarget as HTMLElement)
    .closest("div")
    ?.querySelector("pre");
  const text = pre?.textContent ?? "";

  navigator.clipboard.writeText(text).then(() => {
    copied.value = true;

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      copied.value = false;
    }, 2000);

    emit("copy", text);
  });
}

const wrapperStyles = tv({
  base: "group relative",
});

const copyButtonStyles = tv({
  base: "absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100",
  variants: {
    copied: {
      true: "text-green-600 opacity-100 dark:text-green-500",
    },
  },
});

const filenameStyles = tv({
  base: "block rounded-t-lg bg-neutral-50 px-4 pt-3 pb-0 font-mono text-xs text-neutral-500 dark:bg-neutral-950",
});

const preStyles = tv({
  base: "overflow-x-auto rounded-lg bg-neutral-50 p-4 dark:bg-neutral-950",
  variants: {
    hasFilename: {
      true: "rounded-t-none border-t-0 pt-2",
    },
  },
});

const codeStyles = tv({
  base: "font-mono text-sm",
});
</script>
