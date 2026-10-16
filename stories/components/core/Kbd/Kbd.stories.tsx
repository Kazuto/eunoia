import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Kbd from "./Kbd.vue";

const meta = {
  component: Kbd,
  tags: ["autodocs"],
  argTypes: {
    shortcut: {
      control: "text",
      description:
        'e.g. "/" or "Mod+K". "Mod" shows ⌘ on macOS and Ctrl elsewhere.',
    },
    dense: { control: "boolean" },
  },
  args: {
    shortcut: "Mod+K",
    dense: false,
  },
  render: (args: any) => ({
    setup() {
      return () => <Kbd {...args} />;
    },
  }),
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleKey: Story = {
  args: { shortcut: "/" },
};

export const Dense: Story = {
  args: { dense: true },
};
