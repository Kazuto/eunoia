<template>
  <DialogPanel
    v-bind="$attrs"
    :open
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
  </DialogPanel>
</template>

<script setup lang="ts">
import { toRef } from "vue";
import { useSanitizedId, useLocale, type LocaleMessages } from "@/composables";
import { Button } from "@/components";
import DialogPanel from "./primitives/DialogPanel.vue";
import DialogHeader from "./primitives/DialogHeader.vue";
import DialogTitle from "./primitives/DialogTitle.vue";
import DialogBody from "./primitives/DialogBody.vue";
import DialogFooter from "./primitives/DialogFooter.vue";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    title: string;
    open: boolean;
    persistent?: boolean;
    dense?: boolean;
    locale?: LocaleMessages;
  }>(),
  {
    locale: undefined,
  }
);

const t = useLocale(
  "dialog",
  toRef(() => props.locale)
);

const titleId = useSanitizedId("dialog-title");

const emit = defineEmits<{
  (e: "close"): void;
}>();

function close() {
  emit("close");
}
</script>
