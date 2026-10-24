import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Popover from "./Popover.vue";
import Button from "../../core/Button/Button.vue";

const placements = [
  "top",
  "top-start",
  "top-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "left",
  "left-start",
  "left-end",
  "right",
  "right-start",
  "right-end",
];

const meta = {
  component: Popover,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placement: { control: "select", options: placements },
    offset: { control: "number" },
    dense: { control: "boolean" },
    disabled: { control: "boolean" },
    open: { control: "boolean" },
    default: {
      control: false,
      description: "Panel content; receives `close` to dismiss from inside",
      table: { category: "slots", type: { summary: "{ close: () => void }" } },
    },
    trigger: {
      control: false,
      description:
        "Custom trigger; bind its slot props to the element that opens the popover",
      table: {
        category: "slots",
        type: { summary: "aria-* attributes, disabled, onClick" },
      },
    },
  },
  args: {
    label: "Share",
    placement: "bottom-start",
    offset: 6,
    dense: false,
    disabled: false,
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <div style="display:flex;justify-content:center;padding:2rem 0 12rem">
          <Popover {...args}>
            {{
              default: ({ close }: { close: () => void }) => (
                <div class="flex flex-col gap-3">
                  <p>Anyone with the link can view this page.</p>
                  <div class="flex justify-end">
                    <Button
                      dense
                      onClick={close}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              ),
            }}
          </Popover>
        </div>
      );
    },
  }),
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dense: Story = {
  args: { dense: true },
};

export const Top: Story = {
  args: { placement: "top" },
  render: (args: any) => ({
    setup() {
      return () => (
        <div style="display:flex;justify-content:center;padding:10rem 0 2rem">
          <Popover {...args}>
            {{
              default: () => <p>Opens above the trigger when there is room.</p>,
            }}
          </Popover>
        </div>
      );
    },
  }),
};

export const CustomTrigger: Story = {
  args: { label: "Filters" },
  render: (args: any) => ({
    setup() {
      return () => (
        <div style="display:flex;justify-content:center;padding:2rem 0 12rem">
          <Popover {...args}>
            {{
              trigger: (triggerProps: Record<string, unknown>) => (
                <Button
                  ghost
                  icon="funnel"
                  {...triggerProps}
                >
                  Filters
                </Button>
              ),
              default: () => (
                <label class="flex items-center gap-2">
                  <input type="checkbox" />
                  Only show unread
                </label>
              ),
            }}
          </Popover>
        </div>
      );
    },
  }),
};
