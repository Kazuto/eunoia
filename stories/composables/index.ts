export { useForwardedAttrs } from "./useForwardedAttrs";
export { useLinkComponent } from "./useLinkComponent";
// Storybook's docgen takes these (string) => … functions for functional components and
// appends `useLocale.__docgenInfo = …`, which needs a local binding: import, then export.
import {
  useLocale,
  setDefaultLocale,
  type LocaleMessages,
  LOCALE_KEY,
} from "./useLocale";
export { useLocale, setDefaultLocale, type LocaleMessages, LOCALE_KEY };
export { useRelativeTime } from "./useRelativeTime";
export { useSanitizedId } from "./useSanitizedId";
// Only the hook is re-exported: Storybook's docgen mistakes plain helper functions
// re-exported here for components and breaks the module.
export { useShortcut } from "./useShortcut";
export { useSlotContent } from "./useSlotContent";
export { useTheme } from "./useTheme";
export { useTypingPlaceholder } from "./useTypingPlaceholder";
