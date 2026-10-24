<template>
  <div class="flex flex-col gap-1">
    <Label
      v-if="$slots.default"
      :dense
      :for="dropzoneId"
      ><slot
    /></Label>
    <div
      class="relative cursor-pointer rounded-[14px] border-2 border-dashed transition-colors squircle has-focus-visible:ring-2 has-focus-visible:ring-blue-400 has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-white dark:has-focus-visible:ring-offset-neutral-900"
      :class="{
        'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/20':
          isDragging && !disabled,
        'border-neutral-300 bg-white hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600':
          !isDragging && !disabled,
        'cursor-not-allowed border-neutral-200 bg-neutral-50 opacity-60 dark:border-neutral-800 dark:bg-neutral-900':
          disabled,
      }"
      @drop.prevent="handleDrop"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @click="handleClick"
    >
      <div class="px-6 py-8 text-center">
        <div
          v-if="model && isImage && previewUrl"
          class="space-y-3"
        >
          <img
            :src="previewUrl"
            :alt="model.name"
            class="mx-auto max-h-48 rounded-[14px] object-contain squircle"
          />
          <p class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {{ model.name }}
          </p>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            {{ (model.size / 1024).toFixed(1) }} KB
          </p>
          <button
            v-if="!disabled && !required"
            type="button"
            class="text-xs text-red-600 underline hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            @click.stop="clearFile"
          >
            {{ t("remove-file") }}
          </button>
        </div>

        <template v-else>
          <Icon
            :name="model ? 'file-check' : 'upload-simple'"
            size="lg"
            class="mx-auto mb-3"
            :class="{
              'text-blue-500 dark:text-blue-400': isDragging && !disabled,
              'text-neutral-400 dark:text-neutral-500':
                !isDragging && !disabled && !model,
              'text-green-500 dark:text-green-400': model && !disabled,
              'text-neutral-300 dark:text-neutral-600': disabled,
            }"
          />

          <div
            v-if="model"
            class="space-y-2"
          >
            <p
              class="text-sm font-medium text-neutral-900 dark:text-neutral-100"
            >
              {{ model.name }}
            </p>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              {{ (model.size / 1024).toFixed(1) }} KB
            </p>
            <button
              v-if="!disabled && !required"
              type="button"
              class="text-xs text-red-600 underline hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              @click.stop="clearFile"
            >
              {{ t("remove-file") }}
            </button>
          </div>

          <div v-else>
            <p
              class="text-sm font-medium text-neutral-900 dark:text-neutral-100"
            >
              <span
                v-if="isDragging"
                class="text-blue-600 dark:text-blue-400"
              >
                {{ t("drop-file") }}
              </span>
              <span v-else>{{ t("drop-or-browse") }}</span>
            </p>
            <p
              v-if="accept && accept !== '*'"
              class="mt-1 text-xs text-neutral-500 dark:text-neutral-400"
            >
              {{ accept }}
            </p>
          </div>
        </template>
      </div>

      <!-- Hidden only visually, so it can still be focused and opened by keyboard. -->
      <input
        :id="dropzoneId"
        ref="fileInputRef"
        type="file"
        :accept="accept"
        :disabled="disabled"
        :required="required && !model"
        class="sr-only"
        @change="handleFileSelect"
      />
    </div>
    <InputHintRow v-if="helper">
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
import { ref, computed, toRef, watch, onUnmounted } from "vue";
import Label from "../Input/primitives/Label.vue";
import InputHintRow from "../Input/primitives/InputHintRow.vue";
import InputHelper from "../Input/primitives/InputHelper.vue";
import InputError from "../Input/primitives/InputError.vue";
import Icon from "../../core/Icon/Icon.vue";
import { type LocaleMessages, useLocale, useSanitizedId } from "@/composables";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  accept?: string;
  disabled?: boolean;
  required?: boolean;
  dense?: boolean;
  helper?: string;
  errors?: string[];
  locale?: LocaleMessages;
}>();

const t = useLocale(
  "dropzone",
  toRef(() => props.locale)
);

const model = defineModel<File | undefined>();

const dropzoneId = useSanitizedId("dropzone", { useAttrId: true });
const isDragging = ref(false);
const fileInputRef = ref<HTMLInputElement>();
const previewUrl = ref<string>();

const isImage = computed(() => {
  if (!model.value) return false;
  return model.value.type.startsWith("image/");
});

watch(model, (newFile) => {
  // A file cleared from outside has to leave the input as well; otherwise
  // picking the same file again doesn't fire `change`.
  if (!newFile && fileInputRef.value) {
    fileInputRef.value.value = "";
  }

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = undefined;
  }

  if (newFile && newFile.type.startsWith("image/")) {
    previewUrl.value = URL.createObjectURL(newFile);
  }
});

onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});

function handleDrop(event: DragEvent) {
  isDragging.value = false;
  if (props.disabled) return;

  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    model.value = files[0];
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault();
  if (!props.disabled) {
    isDragging.value = true;
  }
}

function handleDragLeave() {
  isDragging.value = false;
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    model.value = input.files[0];
  }
}

function handleClick(event: MouseEvent) {
  // The input's own click, e.g. from the keyboard, opens the picker already.
  if (props.disabled || event.target === fileInputRef.value) return;

  fileInputRef.value?.click();
}

function clearFile() {
  model.value = undefined;
}
</script>
