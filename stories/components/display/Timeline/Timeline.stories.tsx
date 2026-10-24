import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Card } from "@/components";
import Timeline, { type TimelineItem } from "./Timeline.vue";

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000);

const items: TimelineItem[] = [
  {
    title: "Deployed to production",
    description: "Version 2.4.0 is live for everyone.",
    time: minutesAgo(5),
    icon: "rocket-launch",
    variant: "success",
  },
  {
    title: "Build failed",
    description: "A type error in the billing module.",
    time: minutesAgo(42),
    icon: "bug",
    variant: "danger",
  },
  {
    title: "Release tagged",
    time: minutesAgo(60 * 26),
    icon: "tag",
  },
  {
    title: "Merged pull request",
    description: "Add dark mode to the settings page.",
    time: "Last week",
    variant: "secondary",
  },
];

const meta = {
  component: Timeline,
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: "object",
      description:
        "Items as `{ title, description?, time?, icon?, variant? }`. A Date `time` is shown relative to now.",
    },
    timeLocale: {
      control: "text",
      description: "Locale for relative times",
    },
    default: {
      description: "Extra content below an item, receives `{ item, index }`",
      table: {
        category: "slots",
        type: { summary: "{ item: TimelineItem; index: number }" },
      },
    },
  },
  args: {
    items,
    timeLocale: "en",
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <div class="max-w-md">
          <Timeline {...args} />
        </div>
      );
    },
  }),
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dots: Story = {
  args: {
    items: [
      { title: "Order placed", time: "09:12" },
      { title: "Payment confirmed", time: "09:13", variant: "success" },
      { title: "Shipped", time: "14:40", variant: "secondary" },
      { title: "Delivery delayed", time: "Today", variant: "warning" },
    ],
  },
};

export const German: Story = {
  args: { timeLocale: "de" },
};

export const CustomContent: Story = {
  render: (args: any) => ({
    setup() {
      return () => (
        <div class="max-w-md">
          <Timeline {...args}>
            {{
              default: ({ index }: { index: number }) =>
                index === 0 ? (
                  <Card class="mt-2 text-sm">
                    Release notes: dark mode, faster search, and 14 bug fixes.
                  </Card>
                ) : null,
            }}
          </Timeline>
        </div>
      );
    },
  }),
};
