<template>
  <DrawerPanel
    v-bind="$attrs"
    :open
    :side
    :persistent
    :dense
    :aria-labelledby="titleId"
    @close="close"
  >
    <DialogHeader :dense>
      <DialogTitle
        :id="titleId"
        :dense
      >
        {{ title }}
      </DialogTitle>
      <Button
        v-if="!persistent"
        ghost
        dense
        :aria-label="t('close')"
        class="aspect-square"
        icon="x"
        @click="close"
      />
    </DialogHeader>
    <DialogBody :dense>
      <slot />
    </DialogBody>
    <DialogFooter
      v-if="$slots.footer"
      :dense
    >
      <slot name="footer" />
    </DialogFooter>
  </DrawerPanel>
</template>

<script setup lang="ts">
import { toRef } from "vue";
import { useSanitizedId, useLocale, type LocaleMessages } from "@/composables";
import { Button } from "@/components";
import DialogHeader from "../Dialog/primitives/DialogHeader.vue";
import DialogTitle from "../Dialog/primitives/DialogTitle.vue";
import DialogBody from "../Dialog/primitives/DialogBody.vue";
import DialogFooter from "../Dialog/primitives/DialogFooter.vue";
import DrawerPanel, { type DrawerSide } from "./primitives/DrawerPanel.vue";

export type { DrawerSide };

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    title: string;
    open: boolean;
    side?: DrawerSide;
    persistent?: boolean;
    dense?: boolean;
    locale?: LocaleMessages;
  }>(),
  {
    side: "right",
    locale: undefined,
  }
);

const t = useLocale(
  "drawer",
  toRef(() => props.locale)
);

const titleId = useSanitizedId("drawer-title");

const emit = defineEmits<{
  (e: "close"): void;
}>();

function close() {
  emit("close");
}
</script>
