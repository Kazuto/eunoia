import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Skeleton from "./Skeleton.vue";

const meta = {
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "circular", "rectangular"],
    },
    rounded: { control: "boolean" },
    width: { control: "text" },
    height: { control: "text" },
  },
  args: {
    variant: "text",
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {};

export const TextMultiline: Story = {
  render: (args: any) => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: `
      <div class="flex flex-col gap-2" style="width: 300px">
        <Skeleton v-bind="args" />
        <Skeleton v-bind="args" />
        <Skeleton v-bind="args" width="60%" />
      </div>
    `,
  }),
};

export const Circular: Story = {
  args: {
    variant: "circular",
    width: 48,
    height: 48,
  },
};

export const Rectangular: Story = {
  args: {
    variant: "rectangular",
    width: 300,
    height: 120,
  },
};

export const RectangularRounded: Story = {
  args: {
    variant: "rectangular",
    rounded: true,
    width: 300,
    height: 120,
  },
};

export const CardSkeleton: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="flex gap-4 rounded-lg border border-gray-200 p-4" style="width: 360px">
        <Skeleton variant="circular" :width="48" :height="48" />
        <div class="flex flex-1 flex-col gap-2">
          <Skeleton height="16px" width="60%" />
          <Skeleton height="14px" />
          <Skeleton height="14px" width="80%" />
        </div>
      </div>
    `,
  }),
};
