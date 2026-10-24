import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Spinner from "./Spinner.vue";

const meta = {
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    label: { control: "text" },
  },
  args: {
    size: "md",
  },
  render: (args: any) => ({
    setup() {
      return () => <Spinner {...args} />;
    },
  }),
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => ({
    setup() {
      return () => (
        <div class="flex items-center gap-4">
          <Spinner size="xs" />
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner size="xl" />
        </div>
      );
    },
  }),
};

export const InheritsColor: Story = {
  render: () => ({
    setup() {
      return () => (
        <div class="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
          <Spinner
            size="sm"
            class="text-current dark:text-current"
            label="Saving"
          />
          Saving changes…
        </div>
      );
    },
  }),
};
