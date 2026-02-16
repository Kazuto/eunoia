import { fn } from "storybook/test";
import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Input from "./Input.vue";
import { Link } from "@/components";

const meta = {
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "password", "number", "checkbox", "radio"],
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
      const value = ref<string | number>();

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

export const Number: Story = {
  args: {
    type: "number",
  },
};

export const Checkbox: Story = {
  args: {
    type: "checkbox",
    default: "Terms",
  },
  render: (args: any) => ({
    setup() {
      const checked = ref<boolean>(false);

      return () => (
        <Input
          {...args}
          v-model={checked.value}
        >
          {{
            default: () => args.default,
            description: () => (
              <span>
                I accept the{" "}
                <Link
                  href="#"
                  class="text-primary-500 underline"
                >
                  terms and conditions
                </Link>
              </span>
            ),
          }}
        </Input>
      );
    },
  }),
};

export const Radio: Story = {
  args: {
    type: "radio",
    default: "Preferred Role",
  },
  render: (args: any) => ({
    setup() {
      const selected = ref<string>();

      return () => (
        <div class="flex flex-col gap-1">
          <Input
            {...args}
            v-model={selected.value}
            name="role"
            value="engineer"
          >
            {{
              default: () => args.default,
              description: () => "Engineer",
            }}
          </Input>
          <Input
            {...args}
            v-model={selected.value}
            name="role"
            value="designer"
          >
            {{
              default: () => null,
              description: () => "Designer",
            }}
          </Input>
          <Input
            {...args}
            v-model={selected.value}
            name="role"
            value="manager"
          >
            {{
              default: () => null,
              description: () => "Manager",
            }}
          </Input>
        </div>
      );
    },
  }),
};

export const CheckboxIndeterminate: Story = {
  args: {
    type: "checkbox",
    indeterminate: true,
    default: "Select all",
  },
  render: (args: any) => ({
    setup() {
      const checked = ref<boolean>(false);

      return () => (
        <Input
          {...args}
          v-model={checked.value}
        >
          {{
            default: () => args.default,
          }}
        </Input>
      );
    },
  }),
};
