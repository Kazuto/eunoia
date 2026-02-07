import { useId } from "vue";

export function useSanitizedId(prefix: string): string {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "-");

  return `${prefix}-${id}`;
}
