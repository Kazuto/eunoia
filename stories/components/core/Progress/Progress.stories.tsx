import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Progress from "./Progress.vue";

const meta = {
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    max: { control: "number" },
    variant: {
      control: "select",
      options: ["primary", "success", "warning", "danger"],
    },
    dense: { control: "boolean" },
  },
  args: {
    value: 40,
    max: 100,
    variant: "primary",
    dense: false,
  },
  render: (args: any) => ({
    setup() {
      return () => <Progress {...args} />;
    },
  }),
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Indeterminate: Story = {
  args: {
    value: undefined,
  },
};

export const Variants: Story = {
  render: () => ({
    setup() {
      return () => (
        <div class="flex flex-col gap-4">
          <Progress
            value={50}
            variant="primary"
          />
          <Progress
            value={75}
            variant="success"
          />
          <Progress
            value={30}
            variant="warning"
          />
          <Progress
            value={90}
            variant="danger"
          />
        </div>
      );
    },
  }),
};

export const Dense: Story = {
  args: {
    dense: true,
  },
};
