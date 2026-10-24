import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { Avatar, Badge, Icon } from "@/components";
import List from "./List.vue";
import ListItem from "./primitives/ListItem.vue";

const meta = {
  component: List,
  tags: ["autodocs"],
  argTypes: {
    ordered: { control: "boolean" },
    variant: { control: "select", options: ["plain", "divided", "bordered"] },
    dense: { control: "boolean" },
  },
  args: {
    ordered: false,
    variant: "divided",
    dense: false,
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <List {...args}>
          <ListItem>Install the package</ListItem>
          <ListItem>Import the stylesheet</ListItem>
          <ListItem>Register the components you use</ListItem>
        </List>
      );
    },
  }),
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Divided: Story = {};

export const Ordered: Story = {
  args: {
    ordered: true,
    variant: "plain",
  },
};

export const RichItems: Story = {
  args: {
    variant: "bordered",
  },
  render: (args: any) => ({
    setup() {
      const people = [
        { name: "Ada Lovelace", role: "Owner", status: "success" },
        { name: "Grace Hopper", role: "Editor", status: "secondary" },
        { name: "Alan Turing", role: "Viewer", status: "secondary" },
      ];
      return () => (
        <List
          {...args}
          class="max-w-md"
        >
          {people.map((person) => (
            <ListItem key={person.name}>
              {{
                leading: () => (
                  <Avatar
                    name={person.name}
                    size="sm"
                  />
                ),
                default: () => person.name,
                description: () => person.role,
                trailing: () => (
                  <Badge
                    variant={person.status}
                    dense
                  >
                    {person.status === "success" ? "Active" : "Invited"}
                  </Badge>
                ),
              }}
            </ListItem>
          ))}
        </List>
      );
    },
  }),
};

export const WithIcons: Story = {
  render: (args: any) => ({
    setup() {
      return () => (
        <List {...args}>
          {["Documents", "Downloads", "Pictures"].map((folder) => (
            <ListItem key={folder}>
              {{
                leading: () => <Icon name="folder" />,
                default: () => folder,
              }}
            </ListItem>
          ))}
        </List>
      );
    },
  }),
};
