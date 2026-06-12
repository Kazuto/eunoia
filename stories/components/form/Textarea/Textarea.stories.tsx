import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Textarea from "./Textarea.vue";

const meta = {
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    dense: {
      control: "boolean",
      description: "Compact sizing",
    },
    invalid: {
      control: "boolean",
      description: "Invalid state",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
    helper: {
      control: "text",
      description: "Helper text",
    },
    errors: {
      control: "object",
      description: "Error messages",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    rows: {
      control: "number",
      description: "Number of visible rows",
    },
    maxlength: {
      control: "number",
      description: "Maximum character length",
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter your text...",
    rows: 4,
  },
  render: (args) => ({
    components: { Textarea },
    setup() {
      return { args };
    },
    template: `
      <Textarea v-bind="args">
        Description
      </Textarea>
    `,
  }),
};

export const WithHelper: Story = {
  args: {
    placeholder: "Enter your bio...",
    helper: "Tell us a bit about yourself",
    rows: 4,
  },
  render: (args) => ({
    components: { Textarea },
    setup() {
      return { args };
    },
    template: `
      <Textarea v-bind="args">
        Bio
      </Textarea>
    `,
  }),
};

export const WithMaxLength: Story = {
  args: {
    placeholder: "Max 200 characters...",
    maxlength: 200,
    rows: 4,
  },
  render: (args) => ({
    components: { Textarea },
    setup() {
      return { args };
    },
    template: `
      <Textarea v-bind="args">
        Comment
      </Textarea>
    `,
  }),
};

export const WithError: Story = {
  args: {
    placeholder: "Enter your message...",
    invalid: true,
    errors: ["This field is required"],
    rows: 4,
  },
  render: (args) => ({
    components: { Textarea },
    setup() {
      return { args };
    },
    template: `
      <Textarea v-bind="args">
        Message
      </Textarea>
    `,
  }),
};

export const Dense: Story = {
  args: {
    dense: true,
    placeholder: "Compact textarea...",
    rows: 3,
  },
  render: (args) => ({
    components: { Textarea },
    setup() {
      return { args };
    },
    template: `
      <Textarea v-bind="args">
        Notes
      </Textarea>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled textarea...",
    rows: 4,
  },
  render: (args) => ({
    components: { Textarea },
    setup() {
      return { args };
    },
    template: `
      <Textarea v-bind="args">
        Disabled
      </Textarea>
    `,
  }),
};
