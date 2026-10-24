import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import Accordion from "./Accordion.vue";
import AccordionItem from "./primitives/AccordionItem.vue";

const faq = [
  {
    value: "shipping",
    summary: "How long does shipping take?",
    body: "Orders ship within two business days and usually arrive within a week.",
  },
  {
    value: "returns",
    summary: "Can I return an item?",
    body: "Unused items can be returned within 30 days for a full refund.",
  },
  {
    value: "support",
    summary: "How do I reach support?",
    body: "Write to us from your account page and we reply within one business day.",
  },
];

const meta = {
  component: Accordion,
  tags: ["autodocs"],
  argTypes: {
    multiple: { control: "boolean" },
    dense: { control: "boolean" },
  },
  args: {
    multiple: false,
    dense: false,
  },
  render: (args: any) => ({
    setup() {
      const open = ref<string | string[] | undefined>(
        args.multiple ? ["shipping"] : "shipping"
      );
      return () => (
        <Accordion
          {...args}
          v-model={open.value}
        >
          {faq.map((item) => (
            <AccordionItem
              key={item.value}
              value={item.value}
            >
              {{
                summary: () => item.summary,
                default: () => item.body,
              }}
            </AccordionItem>
          ))}
        </Accordion>
      );
    },
  }),
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleOpen: Story = {};

export const Multiple: Story = {
  args: {
    multiple: true,
  },
};

export const Dense: Story = {
  args: {
    dense: true,
  },
};
