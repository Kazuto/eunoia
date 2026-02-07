import { type InjectionKey, type Ref, inject, ref } from "vue";

export type LocaleMessages = Record<string, string>;

export const LOCALE_KEY: InjectionKey<Ref<LocaleMessages>> =
  Symbol("eunoia-locale");

const localeFiles = import.meta.glob<LocaleMessages>("../locales/*.json", {
  import: "default",
  eager: true,
});

const locales = Object.fromEntries(
  Object.entries(localeFiles).map(([path, messages]) => [
    path.match(/\/([^/]+)\.json$/)?.[1] ?? path,
    messages,
  ])
);

const defaultMessages = ref<LocaleMessages>(locales["en"] ?? {});

export function setDefaultLocale(locale: string) {
  defaultMessages.value = locales[locale] ?? locales["en"] ?? {};
}

export function useLocale(
  prefix: string,
  overrides?: Ref<LocaleMessages | undefined>
) {
  const provided = inject(LOCALE_KEY, ref<LocaleMessages>({}));

  return (key: string): string => {
    const fullKey = `${prefix}.${key}`;
    return (
      overrides?.value?.[key] ??
      provided.value[fullKey] ??
      defaultMessages.value[fullKey] ??
      fullKey
    );
  };
}
