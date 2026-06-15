import { fn } from "storybook/test";
import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Input from "./Input.vue";

const meta = {
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "url", "tel", "search"],
    },
    dense: { control: "boolean" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    default: {
      control: "text",
      description: "Default slot content",
      table: {
        category: "slots",
        type: { summary: "html" },
      },
    },
  },
  args: {
    default: "Label",
    onClick: fn(),
    onFocus: fn(),
    onBlur: fn(),
    onChange: fn(),
    "onUpdate:modelValue": fn(),
    dense: false,
  },
  render: (args: any) => ({
    setup() {
      const value = ref<string>();

      return () => (
        <Input
          {...args}
          v-model={value.value}
        >
          {{
            default: () => {
              return args.default;
            },
          }}
        </Input>
      );
    },
  }),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const Text: Story = {
  args: {
    type: "text",
  },
};

export const TextMaxLength: Story = {
  args: {
    type: "text",
    default: "Bio",
    maxlength: 255,
    helper: "Tell us about yourself",
  },
};

export const TextErrors: Story = {
  args: {
    type: "text",
    default: "Email",
    invalid: true,
    errors: ["Please enter a valid email address", "Email is already taken"],
  },
};

export const Password: Story = {
  args: {
    type: "password",
  },
};

export const Search: Story = {
  args: {
    type: "search",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    default: "Email Address",
    placeholder: "you@example.com",
  },
};

export const WithPrepend: Story = {
  args: {
    type: "text",
    default: "Website",
    placeholder: "example.com",
  },
  render: (args: any) => ({
    setup() {
      const value = ref<string>();

      return () => (
        <Input
          {...args}
          v-model={value.value}
        >
          {{
            default: () => args.default,
            prepend: () => "https://",
          }}
        </Input>
      );
    },
  }),
};

export const WithAppend: Story = {
  args: {
    type: "text",
    default: "Domain",
    placeholder: "mysite",
  },
  render: (args: any) => ({
    setup() {
      const value = ref<string>();

      return () => (
        <Input
          {...args}
          v-model={value.value}
        >
          {{
            default: () => args.default,
            append: () => ".com",
          }}
        </Input>
      );
    },
  }),
};
