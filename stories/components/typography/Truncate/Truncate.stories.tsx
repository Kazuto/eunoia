import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Truncate from "./Truncate.vue";

const text =
  "Quarterly planning notes for the design system team, covering the token migration, the new form components, accessibility fixes and the documentation site.";

const meta = {
  component: Truncate,
  tags: ["autodocs"],
  argTypes: {
    content: { control: "text" },
    maxLength: { control: "number" },
    lines: { control: { type: "number", min: 1, max: 6 } },
  },
  args: {
    content: text,
    maxLength: 40,
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <div class="text-sm text-neutral-900 dark:text-neutral-100">
          <Truncate {...args}>{args.content}</Truncate>
        </div>
      );
    },
  }),
} satisfies Meta<typeof Truncate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleLine: Story = {};

export const MultipleLines: Story = {
  args: {
    lines: 2,
  },
};

export const FitsWithoutTruncating: Story = {
  args: {
    content: "Short title",
  },
};
