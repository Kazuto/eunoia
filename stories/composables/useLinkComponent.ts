import { inject, type Component } from "vue";

export function useLinkComponent() {
  const linkComponent = inject<Component | string>("eunoiaLinkComponent", "a");

  return { linkComponent };
}
