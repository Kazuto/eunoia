import { fn } from "storybook/test";
import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Dialog from "./Dialog.vue";
import { Button } from "@/components";

const meta = {
  component: Dialog,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    dense: { control: "boolean" },
    persistent: { control: "boolean" },
    default: {
      control: "text",
      description: "Default slot content",
      table: { category: "slots" },
    },
    footer: {
      table: { category: "slots" },
    },
  },
  args: {
    title: "Dialog Title",
    default: "This is the dialog content.",
    dense: false,
    persistent: false,
    onClose: fn(),
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: any) => ({
    components: { Dialog, Button },
    setup() {
      const open = ref(false);

      return { args, open };
    },
    template: `
      <Button @click="open = true">Open Dialog</Button>
      <Dialog v-model="open" v-bind="args">
        {{ args.default }}
        <template #footer>
          <Button @click="open = false">Close</Button>
          <Button primary @click="open = false">Save</Button>
        </template>
      </Dialog>
    `,
  }),
};

export const Dense: Story = {
  args: {
    dense: true,
  },
  render: (args: any) => ({
    components: { Dialog, Button },
    setup() {
      const open = ref(false);

      return { args, open };
    },
    template: `
      <Button dense @click="open = true">Open Dense Dialog</Button>
      <Dialog v-model="open" v-bind="args">
        {{ args.default }}
        <template #footer>
          <Button dense @click="open = false">Close</Button>
          <Button primary dense @click="open = false">Save</Button>
        </template>
      </Dialog>
    `,
  }),
};

export const Persistent: Story = {
  args: {
    persistent: true,
    title: "Accept Terms",
  },
  render: (args: any) => ({
    components: { Dialog, Button },
    setup() {
      const open = ref(false);

      return { args, open };
    },
    template: `
      <Button @click="open = true">Open Persistent Dialog</Button>
      <Dialog v-model="open" v-bind="args">
        You must accept the terms to continue. This dialog cannot be dismissed.
        <template #footer>
          <Button primary @click="open = false">I Accept</Button>
        </template>
      </Dialog>
    `,
  }),
};
