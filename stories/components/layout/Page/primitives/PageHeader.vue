<script lang="ts" setup>
import { Button, Tooltip, Headline, Truncate, Text } from "@/components";
import {
  default as PageSecondaryActions,
  type HeaderAction,
} from "./PageSecondaryActions.vue";

export type PageHeaderOptions = {
  title: string;
  description?: string;
  backAction?: HeaderAction;
  copyAction?: HeaderAction;
  primaryAction?: HeaderAction;
  secondaryActions?: HeaderAction[];
  truncateTitleAfter?: number;
};

withDefaults(defineProps<PageHeaderOptions>(), {
  description: undefined,
  backAction: undefined,
  copyAction: undefined,
  primaryAction: undefined,
  secondaryActions: undefined,
  truncateTitleAfter: undefined,
});
</script>

<template>
  <header>
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <template v-if="backAction">
          <Tooltip :content="backAction.content">
            <Button
              ghost
              :icon="backAction.icon"
              @click="backAction.onClick"
            >
            </Button>
          </Tooltip>
        </template>

        <Headline :level="3">
          <Truncate
            :content="title"
            :max-length="truncateTitleAfter"
          >
            {{ title }}
          </Truncate>
        </Headline>

        <template v-if="copyAction">
          <Tooltip :content="copyAction.content">
            <Button
              ghost
              :icon="copyAction.icon"
              @click="copyAction.onClick"
            >
            </Button>
          </Tooltip>
        </template>
      </div>

      <div class="flex items-center gap-2">
        <Button
          v-if="primaryAction"
          primary
          :icon="primaryAction.icon"
          @click="primaryAction.onClick"
        >
          {{ primaryAction.content }}
        </Button>

        <PageSecondaryActions
          v-if="secondaryActions"
          :actions="secondaryActions"
        />
      </div>
    </div>

    <Text
      v-if="description"
      muted
      size="sm"
      class="pt-3"
    >
      {{ description }}
    </Text>
  </header>
</template>
