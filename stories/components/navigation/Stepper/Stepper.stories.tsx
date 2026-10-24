import { ref } from "vue";
import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Button } from "@/components/core";
import Stepper, { type StepperStepItem } from "./Stepper.vue";

const steps: StepperStepItem[] = [
  { label: "Account", description: "Name and email" },
  { label: "Workspace", description: "Choose a plan" },
  { label: "Invite", description: "Add your team" },
  { label: "Done" },
];

const meta = {
  component: Stepper,
  tags: ["autodocs"],
  argTypes: {
    steps: {
      control: "object",
      description: "Steps as `{ label, description?, disabled? }`",
    },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
    clickable: {
      control: "boolean",
      description: "Lets users jump back to completed steps",
    },
    dense: { control: "boolean" },
  },
  args: {
    steps,
    orientation: "horizontal",
    clickable: false,
    dense: false,
    "onUpdate:modelValue": fn(),
  },
  render: (args: any) => ({
    setup() {
      const current = ref(1);
      return () => (
        <div class="flex flex-col gap-6">
          <Stepper
            {...args}
            modelValue={current.value}
            onUpdate:modelValue={(value: number) => {
              current.value = value;
              args["onUpdate:modelValue"]?.(value);
            }}
          />
          <div class="flex gap-2">
            <Button
              disabled={current.value === 0}
              onClick={() => (current.value -= 1)}
            >
              Back
            </Button>
            <Button
              primary
              disabled={current.value === args.steps.length - 1}
              onClick={() => (current.value += 1)}
            >
              Next
            </Button>
          </div>
        </div>
      );
    },
  }),
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Vertical: Story = {
  args: { orientation: "vertical" },
};

export const Clickable: Story = {
  args: { clickable: true },
  parameters: {
    docs: {
      description: {
        story: "Completed steps become buttons that move back to that step.",
      },
    },
  },
};

export const Dense: Story = {
  args: { dense: true },
};

export const WithDisabledStep: Story = {
  args: {
    clickable: true,
    steps: [
      { label: "Account" },
      { label: "Payment", disabled: true },
      { label: "Review" },
      { label: "Done" },
    ],
  },
};
