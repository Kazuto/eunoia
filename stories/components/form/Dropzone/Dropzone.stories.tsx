import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Dropzone from "./Dropzone.vue";

const meta = {
  component: Dropzone,
  tags: ["autodocs"],
  argTypes: {
    accept: {
      control: "text",
      description: "Accepted file types",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
    required: {
      control: "boolean",
      description: "Required field",
    },
    dense: {
      control: "boolean",
      description: "Compact sizing",
    },
    helper: {
      control: "text",
      description: "Helper text",
    },
    errors: {
      control: "object",
      description: "Error messages",
    },
  },
} satisfies Meta<typeof Dropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => ({
    components: { Dropzone },
    setup() {
      return { args };
    },
    template: `
      <Dropzone v-bind="args">
        Upload File
      </Dropzone>
    `,
  }),
};

export const WithAccept: Story = {
  args: {
    accept: ".json,application/json",
  },
  render: (args) => ({
    components: { Dropzone },
    setup() {
      return { args };
    },
    template: `
      <Dropzone v-bind="args">
        Upload JSON File
      </Dropzone>
    `,
  }),
};

export const WithHelper: Story = {
  args: {
    helper: "Select a file to upload or drag and drop it here",
  },
  render: (args) => ({
    components: { Dropzone },
    setup() {
      return { args };
    },
    template: `
      <Dropzone v-bind="args">
        Upload Document
      </Dropzone>
    `,
  }),
};

export const WithError: Story = {
  args: {
    errors: ["This file type is not supported"],
  },
  render: (args) => ({
    components: { Dropzone },
    setup() {
      return { args };
    },
    template: `
      <Dropzone v-bind="args">
        Upload File
      </Dropzone>
    `,
  }),
};

export const Required: Story = {
  args: {
    required: true,
  },
  render: (args) => ({
    components: { Dropzone },
    setup() {
      return { args };
    },
    template: `
      <Dropzone v-bind="args">
        Upload Required File
      </Dropzone>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => ({
    components: { Dropzone },
    setup() {
      return { args };
    },
    template: `
      <Dropzone v-bind="args">
        Upload File (Disabled)
      </Dropzone>
    `,
  }),
};

export const ImageOnly: Story = {
  args: {
    accept: "image/*",
    helper: "Upload an image to see the preview",
  },
  render: (args) => ({
    components: { Dropzone },
    setup() {
      return { args };
    },
    template: `
      <Dropzone v-bind="args">
        Upload Image
      </Dropzone>
    `,
  }),
};
