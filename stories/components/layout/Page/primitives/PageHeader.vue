<script lang="ts" setup>
import { Button, Tooltip } from "@/components";
import {
  default as PageSecondaryActions,
  type HeaderAction,
} from "./PageSecondaryActions.vue";
import { tv } from "tailwind-variants";

export type PageHeaderOptions = {
  title: string;
  backAction?: HeaderAction;
  copyAction?: HeaderAction;
  primaryAction?: HeaderAction;
  secondaryActions?: HeaderAction[];
  truncateTitleAfter?: number;
};

withDefaults(defineProps<PageHeaderOptions>(), {
  backAction: undefined,
  copyAction: undefined,
  primaryAction: undefined,
  secondaryActions: undefined,
  truncateTitleAfter: undefined,
});

const headerStyles = tv({
  base: ["flex items-center justify-between py-3"],
});
</script>

<template>
  <header :class="headerStyles()">
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

      <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {{ title }}
      </h3>

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
  </header>
</template>
