import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { Button } from "@/components";
import VisuallyHidden from "./VisuallyHidden.vue";

const meta = {
  component: VisuallyHidden,
  tags: ["autodocs"],
  argTypes: {
    as: { control: "text" },
  },
  args: {
    as: "span",
  },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconButtonLabel: Story = {
  render: () => ({
    setup() {
      return () => (
        <Button
          ghost
          icon="trash"
        >
          <VisuallyHidden>Delete project</VisuallyHidden>
        </Button>
      );
    },
  }),
};

export const HiddenHeading: Story = {
  render: () => ({
    setup() {
      return () => (
        <section>
          <VisuallyHidden as="h2">Recent activity</VisuallyHidden>
          <p class="text-sm">
            The heading above is only announced by screen readers.
          </p>
        </section>
      );
    },
  }),
};
