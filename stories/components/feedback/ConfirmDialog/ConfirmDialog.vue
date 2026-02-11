<template>
  <DialogPanel
    v-bind="$attrs"
    :open="model"
    :persistent
    :dense
    :aria-labelledby="titleId"
    @close="cancel"
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
        @click="cancel"
      />
    </DialogHeader>
    <DialogBody :dense>
      <slot />
      <div
        v-if="confirmPhrase"
        class="mt-4"
      >
        <Input
          v-model="frictionValue"
          type="text"
          :dense
          :placeholder="confirmPhrase"
        >
          {{ t("confirm-phrase-prompt").replace("{phrase}", confirmPhrase) }}
        </Input>
      </div>
    </DialogBody>
    <DialogFooter :dense>
      <Button
        :dense
        @click="cancel"
      >
        {{ t("cancel") }}
      </Button>
      <Button
        destructive
        :dense
        :disabled="!isConfirmEnabled"
        @click="confirm"
      >
        {{ t("confirm") }}
      </Button>
    </DialogFooter>
  </DialogPanel>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRef } from "vue";
import { useSanitizedId } from "@/composables/useSanitizedId";
import { type LocaleMessages, useLocale } from "@/composables/useLocale";
import Button from "@/components/core/Button/Button.vue";
import Input from "@/components/form/Input/Input.vue";
import DialogPanel from "../Dialog/primitives/DialogPanel.vue";
import DialogHeader from "../Dialog/primitives/DialogHeader.vue";
import DialogTitle from "../Dialog/primitives/DialogTitle.vue";
import DialogBody from "../Dialog/primitives/DialogBody.vue";
import DialogFooter from "../Dialog/primitives/DialogFooter.vue";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    title: string;
    confirmPhrase?: string;
    persistent?: boolean;
    dense?: boolean;
    locale?: LocaleMessages;
  }>(),
  {
    confirmPhrase: undefined,
    locale: undefined,
  }
);

const t = useLocale(
  "dialog",
  toRef(() => props.locale)
);

const model = defineModel<boolean>({ default: false });
const titleId = useSanitizedId("dialog-title");
const frictionValue = ref("");

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

const isConfirmEnabled = computed(() => {
  if (!props.confirmPhrase) return true;
  return frictionValue.value === props.confirmPhrase;
});

function confirm() {
  if (!isConfirmEnabled.value) return;
  model.value = false;
  frictionValue.value = "";
  emit("confirm");
}

function cancel() {
  model.value = false;
  frictionValue.value = "";
  emit("cancel");
}

watch(model, (open) => {
  if (open) {
    frictionValue.value = "";
  }
});
</script>
