import { computed, getCurrentInstance } from "vue";

export function useNuxtLink() {
  const hasNuxtLink = computed(() => {
    const instance = getCurrentInstance();
    const components = instance?.appContext.components;
    return !!(components?.["NuxtLink"] || components?.["nuxt-link"]);
  });

  return { hasNuxtLink };
}
