<script lang="ts" setup>
import { Button, Tooltip, Headline, Truncate, Text } from "@/components";
import PageSecondaryActions from "./PageSecondaryActions.vue";
import type { HeaderAction } from "@/types";

export type PageHeaderOptions = {
  title: string;
  description?: string;
  backAction?: HeaderAction;
  copyAction?: HeaderAction;
  primaryAction?: HeaderAction;
  secondaryActions?: HeaderAction[];
  truncateTitleAfter?: number;
};

withDefaults(defineProps<PageHeaderOptions & { compact?: boolean }>(), {
  compact: false,
  description: undefined,
  backAction: undefined,
  copyAction: undefined,
  primaryAction: undefined,
  secondaryActions: undefined,
  truncateTitleAfter: undefined,
});
</script>

<template>
  <component :is="compact ? 'div' : 'header'">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex min-w-0 items-center gap-3">
        <template v-if="backAction">
          <Tooltip :content="backAction.content">
            <Button
              ghost
              :dense="compact"
              :icon="backAction.icon ?? 'arrow-left'"
              :disabled="backAction.disabled"
              :aria-label="backAction.content"
              @click="backAction.onClick"
            />
          </Tooltip>
        </template>

        <div class="min-w-0">
          <Headline
            :level="compact ? 1 : 3"
            :class="compact ? 'truncate text-lg' : undefined"
          >
            <Truncate
              :content="title"
              :max-length="truncateTitleAfter"
            >
              {{ title }}
            </Truncate>
          </Headline>
          <Text
            v-if="compact && description"
            muted
            size="sm"
            class="truncate"
            :title="description"
          >
            {{ description }}
          </Text>
        </div>

        <template v-if="copyAction">
          <Tooltip :content="copyAction.content">
            <Button
              ghost
              :dense="compact"
              :icon="copyAction.icon ?? 'copy'"
              :disabled="copyAction.disabled"
              :aria-label="copyAction.content"
              @click="copyAction.onClick"
            />
          </Tooltip>
        </template>
      </div>

      <div
        v-if="primaryAction || secondaryActions?.length"
        class="flex shrink-0 items-center gap-2"
      >
        <Button
          v-if="primaryAction"
          primary
          :dense="compact"
          :icon="primaryAction.icon"
          :disabled="primaryAction.disabled"
          @click="primaryAction.onClick"
        >
          {{ primaryAction.content }}
        </Button>

        <PageSecondaryActions
          v-if="secondaryActions?.length"
          :actions="secondaryActions"
          :dense="compact"
        />
      </div>
    </div>

    <Text
      v-if="!compact && description"
      muted
      size="sm"
      class="pt-3"
    >
      {{ description }}
    </Text>
  </component>
</template>
