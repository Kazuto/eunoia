import { fn } from "storybook/test";
import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import DatePicker from "./DatePicker.vue";
import { Weekday } from "@/types";

const meta = {
  component: DatePicker,
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: { type: "radio" },
      options: ["single", "range"],
      table: {
        category: "props",
      },
    },
    dense: {
      control: "boolean",
      table: {
        category: "props",
      },
    },
    invalid: {
      control: "boolean",
      table: {
        category: "props",
      },
    },
    disabled: {
      control: "boolean",
      table: {
        category: "props",
      },
    },
    placeholder: {
      control: "text",
      table: {
        category: "props",
      },
    },
    helper: {
      control: "text",
      table: {
        category: "props",
      },
    },
    errors: {
      control: "object",
      table: {
        category: "props",
      },
    },
    default: {
      control: "text",
      table: {
        category: "slots",
      },
    },
    placement: {
      control: "select",
      options: ["top", "bottom"],
      table: {
        category: "props",
      },
    },
    firstDayOfWeek: {
      control: "select",
      options: Object.values(Weekday).filter((v) => typeof v === "number"),
      labels: Object.fromEntries(
        Object.entries(Weekday).filter(([, v]) => typeof v === "number")
      ),
      table: {
        category: "props",
      },
    },
  },
  args: {
    default: "Select Date",
    "onUpdate:modelValue": fn(),
  },
  render: (args: any) => ({
    setup() {
      const value = ref();
      return () => (
        <DatePicker
          {...args}
          v-model={value.value}
        >
          {{
            default: () => {
              return args.default;
            },
          }}
        </DatePicker>
      );
    },
  }),
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: {
    mode: "single",
  },
};

export const Range: Story = {
  args: {
    mode: "range",
  },
};

export const Dense: Story = {
  args: {
    dense: true,
    mode: "single",
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    mode: "single",
    errors: ["Please select a valid date"],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    mode: "single",
  },
};

export const WithHelper: Story = {
  args: {
    helper: "Select your preferred date",
    mode: "single",
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: "Choose a date...",
    mode: "single",
  },
};

export const WeekStartingSunday: Story = {
  args: {
    mode: "single",
    firstDayOfWeek: Weekday.Sunday,
  },
};
