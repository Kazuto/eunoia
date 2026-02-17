import type { InjectionKey, Ref } from "vue";

export const sidebarCollapsedKey = Symbol("sidebar-collapsed") as InjectionKey<
  Ref<boolean>
>;
