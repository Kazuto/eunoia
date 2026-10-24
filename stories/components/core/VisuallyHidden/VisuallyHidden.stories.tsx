import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { Link } from "@/components";
import VisuallyHidden from "./VisuallyHidden.vue";

const meta = {
  component: VisuallyHidden,
  tags: ["autodocs"],
  argTypes: {
    as: { control: "text" },
    focusable: { control: "boolean" },
  },
  args: {
    as: "span",
    focusable: false,
  },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LinkContext: Story = {
  render: () => ({
    setup() {
      return () => (
        <p class="text-sm dark:text-neutral-100">
          The token migration is done.{" "}
          <Link href="#">
            Read more
            <VisuallyHidden> about the token migration</VisuallyHidden>
          </Link>
        </p>
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

export const SkipLink: Story = {
  render: () => ({
    setup() {
      return () => (
        <div class="text-sm dark:text-neutral-100">
          <VisuallyHidden focusable>
            <a
              href="#main"
              class="mb-3 inline-block rounded-[10px] bg-primary-600 px-3 py-2 text-white squircle"
            >
              Skip to content
            </a>
          </VisuallyHidden>
          <p>Press Tab to reveal the skip link above this text.</p>
        </div>
      );
    },
  }),
};
