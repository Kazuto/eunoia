import { fn } from "storybook/test";
import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import ConfirmDialog from "./ConfirmDialog.vue";
import { Button } from "@/components";

const meta = {
  component: ConfirmDialog,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    dense: { control: "boolean" },
    persistent: { control: "boolean" },
    confirmPhrase: { control: "text" },
    default: {
      control: "text",
      description: "Default slot content",
      table: { category: "slots" },
    },
  },
  args: {
    title: "Confirm Action",
    default: "Are you sure you want to proceed?",
    dense: false,
    persistent: false,
    onConfirm: fn(),
    onCancel: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: any) => ({
    components: { ConfirmDialog, Button },
    setup() {
      const open = ref(false);

      return { args, open };
    },
    template: `
      <Button destructive @click="open = true">Delete Item</Button>
      <ConfirmDialog
        :open
        v-bind="args"
        @confirm="open = false"
        @cancel="open = false"
        @close="open = false"
      >
        {{ args.default }}
      </ConfirmDialog>
    `,
  }),
};

export const WithFriction: Story = {
  args: {
    title: "Delete Repository",
    confirmPhrase: "delete my repository",
  },
  render: (args: any) => ({
    components: { ConfirmDialog, Button },
    setup() {
      const open = ref(false);

      return { args, open };
    },
    template: `
      <Button destructive @click="open = true">Delete Repository</Button>
      <ConfirmDialog
        :open
        v-bind="args"
        @confirm="open = false"
        @cancel="open = false"
        @close="open = false"
      >
        This will permanently delete the repository and all its data. This action cannot be undone.
      </ConfirmDialog>
    `,
  }),
};

export const Persistent: Story = {
  args: {
    title: "Irreversible Action",
    confirmPhrase: "I understand",
    persistent: true,
  },
  render: (args: any) => ({
    components: { ConfirmDialog, Button },
    setup() {
      const open = ref(false);

      return { args, open };
    },
    template: `
      <Button destructive @click="open = true">Dangerous Action</Button>
      <ConfirmDialog
        :open
        v-bind="args"
        @confirm="open = false"
        @cancel="open = false"
        @close="open = false"
      >
        This action is irreversible. You must type the confirmation phrase to proceed.
      </ConfirmDialog>
    `,
  }),
};
