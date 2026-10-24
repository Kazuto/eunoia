import type { ComputedRef, InjectionKey } from "vue";

export const DESCRIPTION_LIST_KEY: InjectionKey<{
  dense: ComputedRef<boolean>;
  orientation: ComputedRef<"horizontal" | "vertical">;
}> = Symbol("eunoia-description-list");
