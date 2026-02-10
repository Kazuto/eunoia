import { Comment, Fragment, computed, Text, useSlots, type VNode } from "vue";

export function useSlotContent() {
  const slots = useSlots();

  function isNonEmpty(vNode: VNode): boolean {
    if (vNode.type === Comment) return false;

    if (vNode.type === Text) {
      const text = vNode.children as string;

      return !!text && text.trim().length > 0;
    }

    if (vNode.type === Fragment) {
      const children = vNode.children as VNode[];

      return Array.isArray(children) && children.some(isNonEmpty);
    }

    return true;
  }

  function hasSlotContent(slot: string) {
    return computed(() => {
      const slotContent = slots[slot];

      if (!slotContent) return false;

      const vNodes = slotContent();

      if (!vNodes || vNodes.length === 0) return false;

      return vNodes.some(isNonEmpty);
    });
  }

  return {
    hasSlotContent,
  };
}
