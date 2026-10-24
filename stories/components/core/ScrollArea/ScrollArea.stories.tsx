import type { Meta, StoryObj } from "@storybook/vue3-vite";

import ScrollArea from "./ScrollArea.vue";

const meta = {
  component: ScrollArea,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal", "both"],
    },
    maxHeight: { control: "text" },
  },
  args: {
    orientation: "vertical",
    maxHeight: "12rem",
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <ScrollArea
          {...args}
          aria-label="Release notes"
          class="max-w-sm border border-neutral-200 p-3 text-sm dark:border-neutral-700 dark:text-neutral-100"
        >
          {Array.from({ length: 20 }, (_, i) => (
            <p class="py-1">Release note {i + 1}</p>
          ))}
        </ScrollArea>
      );
    },
  }),
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {};

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
    maxHeight: undefined,
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <ScrollArea
          {...args}
          aria-label="Tags"
          class="max-w-sm"
        >
          <div class="flex w-max gap-2 p-2">
            {Array.from({ length: 20 }, (_, i) => (
              <span class="rounded-full bg-neutral-100 px-3 py-1 text-xs dark:bg-neutral-800 dark:text-neutral-100">
                Tag {i + 1}
              </span>
            ))}
          </div>
        </ScrollArea>
      );
    },
  }),
};
