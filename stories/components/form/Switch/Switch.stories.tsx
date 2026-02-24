import { fn } from "storybook/test";
import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Switch from "./Switch.vue";

const meta = {
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
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
      const value = ref();

      return () => (
        <Switch
          {...args}
          v-model={value.value}
        >
          {{
            default: () => {
              return args.default;
            },
          }}
        </Switch>
      );
    },
  }),
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dense: Story = {
  args: {
    dense: true,
  },
};
