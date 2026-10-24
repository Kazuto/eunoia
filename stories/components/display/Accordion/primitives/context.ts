import type { ComputedRef, InjectionKey } from "vue";

export type AccordionContext = {
  dense: ComputedRef<boolean>;
  isOpen: (value: string) => boolean;
  setOpen: (value: string, open: boolean) => void;
};

export const ACCORDION_KEY: InjectionKey<AccordionContext> =
  Symbol("eunoia-accordion");
