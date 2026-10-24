import type { ComputedRef, InjectionKey } from "vue";

export const LIST_KEY: InjectionKey<{
  dense: ComputedRef<boolean>;
  bordered: ComputedRef<boolean>;
}> = Symbol("eunoia-list");
