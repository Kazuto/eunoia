import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import ActionMenu from "./ActionMenu.vue";

const items = [
  { value: "edit", label: "Edit", icon: "pencil-simple" },
  {
    value: "translate",
    label: "Translate empty languages",
    icon: "sparkle",
    hint: "Save the default text first",
    disabled: true,
  },
  { value: "copy", label: "Copy to empty languages", icon: "copy" },
  {
    value: "delete",
    label: "Delete",
    icon: "trash",
    variant: "danger" as const,
    divider: true,
  },
];

const meta = {
  component: ActionMenu,
  tags: ["autodocs"],
  argTypes: {
    items: { control: "object" },
    label: { control: "text" },
    icon: { control: "text" },
    placement: { control: "select", options: ["bottom-end", "bottom-start"] },
    dense: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    items,
    label: "Entry actions",
    placement: "bottom-end",
    dense: false,
    disabled: false,
    onSelect: fn(),
  },
  render: (args) => ({
    components: { ActionMenu },
    setup: () => ({ args }),
    template: `<div style="display:flex;justify-content:center;padding:2rem 0 14rem"><ActionMenu v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof ActionMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const StartAligned: Story = {
  args: { placement: "bottom-start" },
};

export const Dense: Story = {
  args: { dense: true },
};
