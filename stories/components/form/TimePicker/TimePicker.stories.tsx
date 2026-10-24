import { fn } from "storybook/test";
import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import TimePicker from "./TimePicker.vue";

const meta = {
  component: TimePicker,
  tags: ["autodocs"],
  argTypes: {
    seconds: { control: "boolean" },
    step: { control: "select", options: [1, 5, 10, 15, 30] },
    hour12: { control: "boolean" },
    dense: { control: "boolean" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    placeholder: { control: "text" },
    teleportTo: {
      control: "text",
      description:
        "Portal target (selector or HTMLElement). Inside native dialogs, the dialog owns the portal to preserve modal focus and stacking.",
    },
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
    default: "Start time",
    seconds: false,
    step: 1,
    hour12: false,
    dense: false,
    disabled: false,
    invalid: false,
    "onUpdate:modelValue": fn(),
  },
  render: (args: any) => ({
    setup() {
      const value = ref<string | null>(args.modelValue ?? null);
      return () => (
        <div class="max-w-xs">
          <TimePicker
            {...args}
            v-model={value.value}
          >
            {{
              default: () => {
                return args.default;
              },
            }}
          </TimePicker>
        </div>
      );
    },
  }),
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    modelValue: "14:30",
  },
};

export const QuarterHourSteps: Story = {
  args: {
    step: 15,
  },
};

export const WithSeconds: Story = {
  args: {
    seconds: true,
    modelValue: "08:05:30",
  },
};

export const TwelveHour: Story = {
  args: {
    hour12: true,
    modelValue: "21:15",
  },
};

export const Dense: Story = {
  args: {
    dense: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    modelValue: "10:00",
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
  },
};
