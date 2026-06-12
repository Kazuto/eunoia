import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import NumberInput from "./NumberInput.vue";

const meta = {
  component: NumberInput,
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
    min: {
      control: "number",
      description: "Minimum value",
    },
    max: {
      control: "number",
      description: "Maximum value",
    },
    step: {
      control: "number",
      description: "Step increment",
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
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    min: 0,
    max: 100,
    step: 1,
  },
  render: (args) => ({
    components: { NumberInput },
    setup() {
      const value = ref(0);
      return { args, value };
    },
    template: `
      <NumberInput v-bind="args" v-model="value">
        Quantity
      </NumberInput>
      <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Value: {{ value }}</p>
    `,
  }),
};

export const WithHelper: Story = {
  args: {
    min: 0,
    max: 100,
    helper: "Enter a value between 0 and 100",
  },
  render: (args) => ({
    components: { NumberInput },
    setup() {
      const value = ref(50);
      return { args, value };
    },
    template: `
      <NumberInput v-bind="args" v-model="value">
        Amount
      </NumberInput>
    `,
  }),
};

export const WithError: Story = {
  args: {
    min: 0,
    max: 100,
    invalid: true,
    errors: ["Value must be between 0 and 100"],
  },
  render: (args) => ({
    components: { NumberInput },
    setup() {
      const value = ref(150);
      return { args, value };
    },
    template: `
      <NumberInput v-bind="args" v-model="value">
        Invalid Value
      </NumberInput>
    `,
  }),
};

export const Dense: Story = {
  args: {
    dense: true,
    min: 0,
    max: 100,
  },
  render: (args) => ({
    components: { NumberInput },
    setup() {
      const value = ref(25);
      return { args, value };
    },
    template: `
      <NumberInput v-bind="args" v-model="value">
        Compact
      </NumberInput>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    min: 0,
    max: 100,
  },
  render: (args) => ({
    components: { NumberInput },
    setup() {
      const value = ref(50);
      return { args, value };
    },
    template: `
      <NumberInput v-bind="args" v-model="value">
        Disabled
      </NumberInput>
    `,
  }),
};

export const WithPrepend: Story = {
  args: {
    min: 0,
    step: 0.01,
  },
  render: (args) => ({
    components: { NumberInput },
    setup() {
      const value = ref(99.99);
      return { args, value };
    },
    template: `
      <NumberInput v-bind="args" v-model="value">
        <template #prepend>$</template>
        Price
      </NumberInput>
    `,
  }),
};
