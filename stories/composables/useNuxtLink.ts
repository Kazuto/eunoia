import { resolveComponent, computed } from "vue";

export function useNuxtLink() {
  const hasNuxtLink = computed(() => {
    try {
      const resolved = resolveComponent("NuxtLink");
      return typeof resolved !== "string";
    } catch {
      return false;
    }
  });

  return { hasNuxtLink };
}
