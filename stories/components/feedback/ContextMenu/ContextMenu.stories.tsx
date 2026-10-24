import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import ContextMenu from "./ContextMenu.vue";

const items = [
  { value: "open", label: "Open" },
  { value: "rename", label: "Rename" },
  { value: "share", label: "Share", disabled: true },
  { value: "duplicate", label: "Duplicate" },
  {
    value: "delete",
    label: "Delete",
    variant: "danger" as const,
    divider: true,
  },
];

const meta = {
  component: ContextMenu,
  tags: ["autodocs"],
  argTypes: {
    items: { control: "object" },
    label: { control: "text" },
    dense: { control: "boolean" },
    disabled: { control: "boolean" },
    default: {
      control: false,
      description: "The region that opens the menu on right-click or Shift+F10",
      table: { category: "slots", type: { summary: "html" } },
    },
  },
  args: {
    items,
    label: "File actions",
    dense: false,
    disabled: false,
    onSelect: fn(),
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <ContextMenu {...args}>
          <div class="flex h-48 items-center justify-center rounded-[16px] border border-dashed border-neutral-300 text-sm text-neutral-600 squircle dark:border-neutral-600 dark:text-neutral-300">
            Right-click here, or focus and press Shift+F10
          </div>
        </ContextMenu>
      );
    },
  }),
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dense: Story = {
  args: { dense: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
