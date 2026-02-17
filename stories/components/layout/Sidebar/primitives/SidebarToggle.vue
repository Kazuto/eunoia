<template>
  <Tooltip
    :content="collapsed ? t('expand') : t('collapse')"
    placement="right"
    dense
  >
    <button
      type="button"
      v-bind="forwardedAttrs"
      :class="toggleStyles({ class: classAttr })"
      @click="collapsed = !collapsed"
    >
      <Icon
        name="sidebar"
        size="md"
      />
    </button>
  </Tooltip>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import { tv } from "tailwind-variants";
import {
  useForwardedAttrs,
  useLocale,
  type LocaleMessages,
} from "@/composables";
import Tooltip from "@/components/feedback/Tooltip/Tooltip.vue";
import Icon from "@/components/core/Icon/Icon.vue";

defineOptions({
  inheritAttrs: false,
});

const { classAttr, forwardedAttrs } = useForwardedAttrs();

const props = defineProps<{
  locale?: LocaleMessages;
}>();

const t = useLocale(
  "sidebar",
  toRef(() => props.locale)
);

const collapsed = defineModel<boolean>("collapsed", { default: false });

const toggleStyles = tv({
  base: "flex aspect-square w-10 items-center justify-center rounded-md p-1 text-neutral-400 hover:bg-black/10 hover:text-neutral-700 dark:hover:bg-white/10 dark:hover:text-neutral-200",
});
</script>
