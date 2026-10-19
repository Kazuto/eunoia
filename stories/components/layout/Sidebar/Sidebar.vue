<template>
  <SidebarRoot
    v-bind="$attrs"
    :collapsed
  >
    <div class="flex-1 overflow-y-auto">
      <slot />
    </div>

    <SidebarFooter v-if="$slots.footer && !collapsed">
      <slot name="footer" />
    </SidebarFooter>
  </SidebarRoot>
</template>

<script lang="ts" setup>
import { provide } from "vue";
import SidebarRoot from "./primitives/SidebarRoot.vue";
import SidebarFooter from "./primitives/SidebarFooter.vue";
import { sidebarCollapsedKey } from "./keys";

defineOptions({
  inheritAttrs: false,
});

const collapsed = defineModel<boolean>("collapsed", { default: false });

provide(sidebarCollapsedKey, collapsed);
</script>
