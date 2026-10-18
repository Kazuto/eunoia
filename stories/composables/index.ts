export { useForwardedAttrs } from "./useForwardedAttrs";
export { useLinkComponent } from "./useLinkComponent";
export {
  useLocale,
  setDefaultLocale,
  type LocaleMessages,
  LOCALE_KEY,
} from "./useLocale";
export { useRelativeTime } from "./useRelativeTime";
export { useSanitizedId } from "./useSanitizedId";
// Only the hook is re-exported: Storybook's docgen mistakes plain helper functions
// re-exported here for components and breaks the module.
export { useShortcut } from "./useShortcut";
export { useSlotContent } from "./useSlotContent";
export { useTheme } from "./useTheme";
export { useTypingPlaceholder } from "./useTypingPlaceholder";
