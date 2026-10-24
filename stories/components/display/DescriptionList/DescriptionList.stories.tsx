import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { Badge, Link } from "@/components";
import DescriptionList from "./DescriptionList.vue";
import DescriptionItem from "./primitives/DescriptionItem.vue";

const meta = {
  component: DescriptionList,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    dense: { control: "boolean" },
  },
  args: {
    orientation: "horizontal",
    dense: false,
    items: [
      { term: "Full name", description: "Ada Lovelace" },
      { term: "Email", description: "ada@example.com" },
      { term: "Role", description: "Administrator" },
      { term: "Joined", description: "10 December 2025" },
    ],
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <DescriptionList
          {...args}
          class="max-w-xl"
        />
      );
    },
  }),
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
};

export const CustomContent: Story = {
  render: (args: any) => ({
    setup() {
      return () => (
        <DescriptionList
          orientation={args.orientation}
          dense={args.dense}
          class="max-w-xl"
        >
          <DescriptionItem term="Status">
            <Badge
              variant="success"
              dense
            >
              Active
            </Badge>
          </DescriptionItem>
          <DescriptionItem term="Repository">
            <Link href="#">github.com/acme/web</Link>
          </DescriptionItem>
          <DescriptionItem term="Notes">
            Deploys run automatically when the main branch changes.
          </DescriptionItem>
        </DescriptionList>
      );
    },
  }),
};
