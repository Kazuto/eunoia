<script lang="ts" setup>
import { useTemplateRef } from "vue";
import { Button, Tooltip, Headline, Truncate, Text } from "@/components";
import HeaderActions from "@/components/layout/Header/primitives/HeaderActions.vue";
import type { HeaderAction } from "@/types";

export type PageHeaderOptions = {
  title: string;
  description?: string;
  backAction?: HeaderAction;
  copyAction?: HeaderAction;
  /**
   * Shown as buttons next to the primary action. When they don't fit, they
   * move into the "More actions" menu, last first; after them the primary
   * action shrinks to its icon, then moves into the menu as well.
   */
  actions?: HeaderAction[];
  primaryAction?: HeaderAction;
  /** Always in the "More actions" menu, below any actions that moved there. */
  secondaryActions?: HeaderAction[];
  truncateTitleAfter?: number;
};

withDefaults(defineProps<PageHeaderOptions & { compact?: boolean }>(), {
  compact: false,
  description: undefined,
  backAction: undefined,
  copyAction: undefined,
  actions: undefined,
  primaryAction: undefined,
  secondaryActions: undefined,
  truncateTitleAfter: undefined,
});

const row = useTemplateRef<HTMLElement>("row");
const titleGroup = useTemplateRef<HTMLElement>("titleGroup");
</script>

<template>
  <component :is="compact ? 'div' : 'header'">
    <div
      ref="row"
      class="flex items-center justify-between gap-3"
    >
      <div
        ref="titleGroup"
        class="flex min-w-0 items-center gap-3"
      >
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

      <HeaderActions
        :actions
        :primary-action
        :secondary-actions
        :dense="compact"
        :row
        :title-group
      />
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
