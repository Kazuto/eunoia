import type { Meta, StoryObj } from "@storybook/vue3-vite";

import ThemeToggle from "./ThemeToggle.vue";

const meta = {
  component: ThemeToggle,
  tags: ["autodocs"],
  args: {},
  render: (args: any) => ({
    setup() {
      return () => <ThemeToggle {...args}></ThemeToggle>;
    },
  }),
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
