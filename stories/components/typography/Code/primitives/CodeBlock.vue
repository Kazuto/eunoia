<template>
  <div v-bind="forwardedAttrs" :class="wrapperStyles({ class: classAttr })">
    <Button
      ghost
      dense
      :icon="copied ? 'check' : 'copy'"
      :class="copyButtonStyles({ copied })"
      :aria-label="ariaLabel"
      @click="copy"
    />
    <span v-if="filename" :class="filenameStyles()">{{ filename }}</span>
    <pre
      :class="preStyles({ hasFilename: !!filename })"
    ><code :class="codeStyles()"><slot /></code></pre>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { tv } from "tailwind-variants";
import Button from "@/components/core/Button/Button.vue";
import { useForwardedAttrs } from "@/composables/useForwardedAttrs";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

defineProps<{
  ariaLabel: string;
  filename?: string;
}>();

const emit = defineEmits<{
  (e: "copy", text: string): void;
}>();

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
  base: "top-2 right-2 absolute opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100",
  variants: {
    copied: {
      true: "text-green-600 opacity-100",
    },
  },
});

const filenameStyles = tv({
  base: "rounded-t-lg bg-gray-100 px-4 pt-3 pb-0 font-mono text-xs text-gray-500 block",
});

const preStyles = tv({
  base: "rounded-lg bg-gray-100 p-4 overflow-x-auto",
  variants: {
    hasFilename: {
      true: "pt-2 rounded-t-none",
    },
  },
});

const codeStyles = tv({
  base: "font-mono text-sm text-gray-800",
});
</script>
