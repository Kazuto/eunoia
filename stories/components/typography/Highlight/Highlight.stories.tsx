import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { computed, ref } from "vue";

import { Input } from "@/components";
import Highlight from "./Highlight.vue";

const meta = {
  component: Highlight,
  tags: ["autodocs"],
  argTypes: {
    text: { control: "text" },
    query: { control: "text" },
    caseSensitive: { control: "boolean" },
  },
  args: {
    text: "Typography is the craft of endowing human language with a durable visual form.",
    query: "form",
    caseSensitive: false,
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <p class="text-sm text-neutral-900 dark:text-neutral-100">
          <Highlight {...args} />
        </p>
      );
    },
  }),
} satisfies Meta<typeof Highlight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SeveralTerms: Story = {
  args: {
    query: ["craft", "language", "visual"],
  },
};

export const LiveSearch: Story = {
  render: () => ({
    setup() {
      const search = ref("ta");
      const terms = computed(() => search.value.split(/\s+/));
      const items = ["Data table", "Date picker", "Tabs", "Textarea", "Toast"];
      return () => (
        <div class="flex max-w-xs flex-col gap-3 text-sm text-neutral-900 dark:text-neutral-100">
          <Input
            v-model={search.value}
            aria-label="Search components"
          />
          <ul class="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item}>
                <Highlight
                  text={item}
                  query={terms.value}
                />
              </li>
            ))}
          </ul>
        </div>
      );
    },
  }),
};
