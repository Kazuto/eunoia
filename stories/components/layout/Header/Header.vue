<script lang="ts" setup>
import { tv } from "tailwind-variants";
import { Button, Tooltip, Headline, Truncate, Text } from "@/components";
import HeaderSecondaryActions from "./primitives/HeaderSecondaryActions.vue";
import type { HeaderAction } from "@/types";

export type HeaderOptions = {
  title?: string;
  description?: string;
  backAction?: HeaderAction;
  copyAction?: HeaderAction;
  primaryAction?: HeaderAction;
  secondaryActions?: HeaderAction[];
  truncateTitleAfter?: number;
};

defineProps<HeaderOptions>();

const headerStyles = tv({
  base: [
    "flex min-h-18 shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b px-4 py-3 font-sans",
    "border-neutral-200 bg-white",
    "dark:border-neutral-800 dark:bg-neutral-900",
  ],
});
</script>

<template>
  <header :class="headerStyles()">
    <div
      v-if="$slots.left"
      class="flex shrink-0 items-center gap-3"
    >
      <slot name="left" />
    </div>
    <div
      v-if="title"
      class="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3"
    >
      <div class="flex min-w-0 items-center gap-3">
        <Tooltip
          v-if="backAction"
          :content="backAction.content"
        >
          <Button
            ghost
            :icon="backAction.icon ?? 'arrow-left'"
            :disabled="backAction.disabled"
            :aria-label="backAction.content"
            @click="backAction.onClick"
          />
        </Tooltip>

        <div class="min-w-0">
          <Headline
            :level="3"
            :scale="6"
          >
            <Truncate
              :content="title"
              :max-length="truncateTitleAfter"
            >
              {{ title }}
            </Truncate>
          </Headline>
          <Text
            v-if="description"
            muted
            size="sm"
            class="truncate"
            :title="description"
          >
            {{ description }}
          </Text>
        </div>

        <Tooltip
          v-if="copyAction"
          :content="copyAction.content"
        >
          <Button
            ghost
            :icon="copyAction.icon ?? 'copy'"
            :disabled="copyAction.disabled"
            :aria-label="copyAction.content"
            @click="copyAction.onClick"
          />
        </Tooltip>
      </div>

      <div
        v-if="primaryAction || secondaryActions?.length"
        class="flex shrink-0 items-center gap-2"
      >
        <Button
          v-if="primaryAction"
          primary
          :icon="primaryAction.icon"
          :disabled="primaryAction.disabled"
          @click="primaryAction.onClick"
        >
          {{ primaryAction.content }}
        </Button>

        <HeaderSecondaryActions
          v-if="secondaryActions?.length"
          :actions="secondaryActions"
        />
      </div>
    </div>
    <div
      v-if="$slots.right"
      class="ml-auto flex shrink-0 items-center gap-3"
    >
      <slot name="right" />
    </div>
  </header>
</template>
