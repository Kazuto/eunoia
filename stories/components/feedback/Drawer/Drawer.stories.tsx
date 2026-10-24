import { fn } from "storybook/test";
import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Drawer from "./Drawer.vue";
import { Button } from "@/components";

const meta = {
  component: Drawer,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    side: {
      control: "select",
      options: ["left", "right", "top", "bottom"],
    },
    dense: { control: "boolean" },
    persistent: { control: "boolean" },
    default: {
      control: "text",
      description: "Default slot content",
      table: { category: "slots", type: { summary: "html" } },
    },
    footer: {
      table: { category: "slots" },
    },
  },
  args: {
    title: "Drawer Title",
    open: false,
    side: "right",
    default: "This is the drawer content.",
    dense: false,
    persistent: false,
    onClose: fn(),
  },
  render: (args: any) => ({
    setup() {
      const open = ref(false);
      const close = () => {
        open.value = false;
        args.onClose?.();
      };

      return () => (
        <>
          <Button
            dense={args.dense}
            onClick={() => (open.value = true)}
          >
            Open drawer
          </Button>
          <Drawer
            {...args}
            open={open.value}
            onClose={close}
          >
            {{
              default: () => args.default,
              footer: () => (
                <>
                  <Button
                    dense={args.dense}
                    onClick={close}
                  >
                    Cancel
                  </Button>
                  <Button
                    primary
                    dense={args.dense}
                    onClick={close}
                  >
                    Save
                  </Button>
                </>
              ),
            }}
          </Drawer>
        </>
      );
    },
  }),
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {};

export const Left: Story = {
  args: { side: "left" },
};

export const Top: Story = {
  args: { side: "top" },
};

export const Bottom: Story = {
  args: { side: "bottom" },
};

export const Dense: Story = {
  args: { dense: true },
};

export const Persistent: Story = {
  args: {
    persistent: true,
    title: "Unsaved changes",
    default: "Save or cancel to close this drawer.",
  },
};
