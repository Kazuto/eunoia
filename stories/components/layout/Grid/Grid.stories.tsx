import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Grid from "./Grid.vue";

const meta = {
  component: Grid,
  tags: ["autodocs"],
  argTypes: {
    cols: { control: "select", options: [1, 2, 3, 4, 6, 12] },
    gap: { control: "select", options: [0, 1, 2, 3, 4, 6, 8] },
    minItemWidth: { control: "text" },
    as: { control: "text" },
  },
  args: {
    cols: 3,
    gap: 4,
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <Grid {...args}>
          {Array.from({ length: 6 }, (_, i) => (
            <div class="rounded-[16px] bg-primary-100 p-4 text-sm text-primary-900 squircle dark:bg-primary-900 dark:text-primary-100">
              Item {i + 1}
            </div>
          ))}
        </Grid>
      );
    },
  }),
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeColumns: Story = {};

export const TwoColumnsWideGap: Story = {
  args: {
    cols: 2,
    gap: 8,
  },
};

export const AutoFill: Story = {
  args: {
    minItemWidth: "12rem",
  },
};
