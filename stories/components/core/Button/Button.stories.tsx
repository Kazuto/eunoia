import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Button from "./Button.vue";

const meta = {
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    dense: { control: "boolean" },
    icon: { control: "text" },
    href: {
      control: "text",
      description: "Renders the button as a link to this URL",
    },
    target: {
      control: "select",
      options: [undefined, "_self", "_blank"],
      description: "Where the link opens",
    },
    rel: {
      control: "text",
      description:
        'Defaults to "noopener noreferrer" when the link opens in a new tab',
    },
    as: {
      control: false,
      description:
        "Element or component to render, e.g. a router's link component",
    },
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
    primary: false,
    ghost: false,
    destructive: false,
    default: "Button",
    onClick: fn(),
    onFocus: fn(),
    onBlur: fn(),
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <Button {...args}>
          {{
            default: () => {
              return args.default;
            },
          }}
        </Button>
      );
    },
  }),
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
  },
};

export const Secondary: Story = {
  args: {
    primary: false,
  },
};

export const Ghost: Story = {
  args: {
    ghost: true,
  },
};

export const Destructive: Story = {
  args: {
    destructive: true,
  },
};

export const Dense: Story = {
  args: {
    dense: true,
  },
};

export const WithIcon: Story = {
  args: {
    primary: true,
    icon: "plus",
    default: "Add Item",
  },
};

export const WithIconDense: Story = {
  args: {
    primary: true,
    dense: true,
    icon: "plus",
    default: "Add Item",
  },
};

export const IconOnly: Story = {
  args: {
    ghost: true,
    icon: "x",
    default: "",
  },
};

export const AsLink: Story = {
  args: {
    primary: true,
    icon: "arrow-right",
    href: "#",
    default: "Open entries",
  },
};

export const LinkInNewTab: Story = {
  args: {
    href: "https://example.com",
    target: "_blank",
    icon: "arrow-square-out",
    default: "Open in new tab",
  },
};

export const IconOnlyLink: Story = {
  args: {
    ghost: true,
    icon: "eye",
    href: "#",
    default: "",
    "aria-label": "View",
  } as any,
};

export const DisabledLink: Story = {
  args: {
    primary: true,
    href: "#",
    disabled: true,
    default: "Unavailable",
  } as any,
};
