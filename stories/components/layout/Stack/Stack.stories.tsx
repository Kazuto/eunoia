import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Stack from "./Stack.vue";

const meta = {
  component: Stack,
  tags: ["autodocs"],
  argTypes: {
    direction: { control: "select", options: ["row", "column"] },
    gap: { control: "select", options: [0, 1, 2, 3, 4, 6, 8] },
    align: {
      control: "select",
      options: [undefined, "start", "center", "end", "stretch", "baseline"],
    },
    justify: {
      control: "select",
      options: [
        undefined,
        "start",
        "center",
        "end",
        "between",
        "around",
        "evenly",
      ],
    },
    wrap: { control: "boolean" },
    as: { control: "text" },
  },
  args: {
    direction: "column",
    gap: 4,
    wrap: false,
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <Stack {...args}>
          {["First", "Second", "Third"].map((label) => (
            <div class="rounded-[16px] bg-primary-100 px-4 py-3 text-sm text-primary-900 squircle dark:bg-primary-900 dark:text-primary-100">
              {label}
            </div>
          ))}
        </Stack>
      );
    },
  }),
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {};

export const Horizontal: Story = {
  args: {
    direction: "row",
  },
};

export const SpaceBetween: Story = {
  args: {
    direction: "row",
    justify: "between",
    align: "center",
  },
};
