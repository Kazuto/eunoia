import type { Meta, StoryObj } from "@storybook/vue3-vite";

import ThemeGenerator from "./ThemeGenerator.vue";

const meta = {
  component: ThemeGenerator,
  title: "concept/Theme Generator",
  parameters: {
    layout: "fullscreen",
    unwrapped: true,
  },
} satisfies Meta<typeof ThemeGenerator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
