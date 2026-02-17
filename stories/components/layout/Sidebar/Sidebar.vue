<template>
  <SidebarRoot
    v-bind="$attrs"
    :collapsed
  >
    <div class="flex-1 overflow-y-auto">
      <slot />
    </div>

    <SidebarFooter v-if="$slots.footer">
      <slot name="footer" />
    </SidebarFooter>
  </SidebarRoot>
</template>

<script lang="ts" setup>
import SidebarRoot from "./primitives/SidebarRoot.vue";
import SidebarFooter from "./primitives/SidebarFooter.vue";

defineOptions({
  inheritAttrs: false,
});

defineModel<boolean>("collapsed", { default: false });
</script>
