import type { Meta, StoryObj } from "@storybook/vue3-vite";

import AspectRatio from "./AspectRatio.vue";

const meta = {
  component: AspectRatio,
  tags: ["autodocs"],
  argTypes: {
    ratio: { control: "text" },
  },
  args: {
    ratio: "16 / 9",
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <div class="max-w-md">
          <AspectRatio
            {...args}
            class="rounded-[16px] squircle"
          >
            <div class="flex items-center justify-center bg-primary-100 text-sm text-primary-900 dark:bg-primary-900 dark:text-primary-100">
              {String(args.ratio)}
            </div>
          </AspectRatio>
        </div>
      );
    },
  }),
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Widescreen: Story = {};

export const Square: Story = {
  args: {
    ratio: 1,
  },
};

export const FourByThree: Story = {
  args: {
    ratio: "4 / 3",
  },
};
