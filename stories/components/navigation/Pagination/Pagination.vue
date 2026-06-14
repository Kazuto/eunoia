<script setup lang="ts">
import { computed, toRef } from "vue";
import { Select, Icon, Tooltip } from "@/components";
import PaginationButton from "./primitives/PaginationButton.vue";
import { useLocale, type LocaleMessages } from "@/composables";

const props = withDefaults(
  defineProps<{
    total?: number;
    dense?: boolean;
    perPageOptions?: Array<{ label: string; value: string | number }>;
    locale?: LocaleMessages;
  }>(),
  {
    total: 0,
    current: 1,
    dense: false,
    perPageOptions: () => [
      { label: "10", value: 10 },
      { label: "25", value: 25 },
      { label: "50", value: 50 },
      { label: "100", value: 100 },
    ],
    locale: undefined,
  }
);

const currentModel = defineModel<number>("current", { default: 1 });

const perPageModel = defineModel<number>("perPage", { default: 10 });

const emit = defineEmits<{
  (e: "update:current", page: number): void;
  (e: "update:perPage", perPage: number): void;
}>();

const visiblePages = computed<Array<number | "...">>(() => {
  const total = props.total;
  const cur = currentModel.value;

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (cur <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }

  if (cur >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "...", cur - 1, cur, cur + 1, "...", total];
});

function goTo(page: number) {
  if (page < 1 || page > props.total) return;
  if (page === currentModel.value) return;

  emit("update:current", page);
}

const t = useLocale(
  "pagination",
  toRef(() => props.locale)
);
</script>

<template>
  <nav
    :aria-label="t('navigation')"
    class="flex items-center justify-between gap-2"
  >
    <Select
      v-model="perPageModel"
      :dense
      :options="perPageOptions"
    />

    <div class="flex items-center gap-2">
      <Tooltip
        :disabled="currentModel <= 1"
        :content="t('previous')"
      >
        <PaginationButton
          icon="arrow-left"
          :aria-label="t('previous')"
          :dense
          :disabled="currentModel <= 1"
          @click="goTo(currentModel - 1)"
        />
      </Tooltip>

      <template
        v-for="page in visiblePages"
        :key="page"
      >
        <Icon
          v-if="page === '...'"
          name="dots-three"
          aria-hidden="true"
        />

        <PaginationButton
          v-else
          :aria-label="t('go-to', { page })"
          :aria-current="page === currentModel ? 'page' : undefined"
          :aria-disabled="page === currentModel ? 'true' : undefined"
          :dense
          :active="page === currentModel"
          @click="goTo(page)"
        >
          {{ page }}
        </PaginationButton>
      </template>

      <Tooltip
        :disabled="currentModel >= props.total"
        :content="t('next')"
      >
        <PaginationButton
          icon="arrow-right"
          :aria-label="t('next')"
          :dense
          :disabled="currentModel >= props.total"
          @click="goTo(currentModel + 1)"
        />
      </Tooltip>
    </div>
  </nav>
</template>
