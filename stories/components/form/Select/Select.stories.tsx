import { fn } from "storybook/test";
import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Select from "./Select.vue";

const sampleOptions = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Date", value: "date" },
  { label: "Elderberry", value: "elderberry" },
  { label: "Fig", value: "fig" },
  { label: "Grape", value: "grape" },
  { label: "Honeydew", value: "honeydew" },
];

const meta = {
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    multiple: { control: "boolean" },
    dense: { control: "boolean" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    placeholder: { control: "text" },
    default: {
      control: "text",
      description: "Default slot content (label)",
      table: {
        category: "slots",
        type: { summary: "html" },
      },
    },
  },
  args: {
    default: "Fruit",
    options: sampleOptions,
    placeholder: "Select a fruit...",
    multiple: false,
    dense: false,
    disabled: false,
    invalid: false,
    "onUpdate:modelValue": fn(),
  },
  render: (args: any) => ({
    setup() {
      const value = ref();
      return () => (
        <Select {...args} v-model={value.value}>
          {{
            default: () => {
              return args.default;
            },
          }}
        </Select>
      );
    },
  }),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dense: Story = {
  args: {
    dense: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
  },
};

export const MultiSelect: Story = {
  args: {
    multiple: true,
    placeholder: "Select fruits...",
  },
  render: (args: any) => ({
    setup() {
      const value = ref<Array<string | number>>([]);
      return () => (
        <Select {...args} v-model={value.value}>
          {{
            default: () => {
              return "Fruits";
            },
          }}
        </Select>
      );
    },
  }),
};

export const MultiSelectDense: Story = {
  args: {
    multiple: true,
    dense: true,
    placeholder: "Select fruits...",
  },
  render: (args: any) => ({
    setup() {
      const value = ref<Array<string | number>>([]);
      return () => (
        <Select {...args} v-model={value.value}>
          {{
            default: () => {
              return "Fruits";
            },
          }}
        </Select>
      );
    },
  }),
};

export const PreselectedSingle: Story = {
  render: (args: any) => ({
    setup() {
      const value = ref<string>("cherry");
      return () => (
        <Select {...args} v-model={value.value}>
          {{
            default: () => {
              return "Fruit";
            },
          }}
        </Select>
      );
    },
  }),
};

export const PreselectedMulti: Story = {
  args: {
    multiple: true,
  },
  render: (args: any) => ({
    setup() {
      const value = ref(["apple", "cherry"]);
      return () => (
        <Select {...args} v-model={value.value}>
          {{
            default: () => {
              return "Fruits";
            },
          }}
        </Select>
      );
    },
  }),
};
