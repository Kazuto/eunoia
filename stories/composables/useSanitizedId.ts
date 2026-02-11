import { useAttrs, useId } from "vue";

export function useSanitizedId(
  prefix: string,
  { useAttrId = false }: { useAttrId?: boolean } = {}
): string {
  if (useAttrId) {
    const attrs = useAttrs();

    if (typeof attrs.id === "string" && attrs.id) {
      return attrs.id;
    }
  }

  const id = useId().replace(/[^a-zA-Z0-9]/g, "-");

  return `${prefix}-${id}`;
}
