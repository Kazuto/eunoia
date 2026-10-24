import { fn } from "storybook/test";
import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Combobox from "./Combobox.vue";

const countries = [
  "Argentina",
  "Australia",
  "Austria",
  "Belgium",
  "Brazil",
  "Canada",
  "Denmark",
  "Finland",
  "France",
  "Germany",
  "Japan",
  "Netherlands",
  "Norway",
  "Portugal",
  "Spain",
  "Sweden",
].map((label) => ({ label, value: label.toLowerCase() }));

const meta = {
  component: Combobox,
  tags: ["autodocs"],
  argTypes: {
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
    default: "Country",
    options: countries,
    dense: false,
    disabled: false,
    invalid: false,
    "onUpdate:modelValue": fn(),
  },
  render: (args: any) => ({
    setup() {
      const value = ref<string | number | null>(args.modelValue ?? null);
      return () => (
        <div class="max-w-xs">
          <Combobox
            {...args}
            v-model={value.value}
          >
            {{
              default: () => {
                return args.default;
              },
            }}
          </Combobox>
        </div>
      );
    },
  }),
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = {
  args: {
    modelValue: "japan",
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
    modelValue: "france",
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
  },
};

export const Teleported: Story = {
  args: {
    teleportTo: "body",
  },
};
