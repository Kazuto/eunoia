import { fn } from "storybook/test";
import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import CommandPalette, { type CommandPaletteItem } from "./CommandPalette.vue";
import { Button, Kbd } from "@/components";

const items: CommandPaletteItem[] = [
  {
    label: "New file",
    value: "new-file",
    group: "Files",
    icon: "file-plus",
    shortcut: "Mod+N",
  },
  {
    label: "Open recent",
    value: "open-recent",
    group: "Files",
    icon: "clock-counter-clockwise",
  },
  {
    label: "Save all",
    value: "save-all",
    group: "Files",
    icon: "floppy-disk",
    shortcut: "Mod+Shift+S",
    disabled: true,
  },
  {
    label: "Toggle theme",
    value: "toggle-theme",
    group: "Preferences",
    icon: "moon",
    keywords: ["dark", "light", "appearance"],
  },
  {
    label: "Settings",
    value: "settings",
    group: "Preferences",
    icon: "gear",
    shortcut: "Mod+,",
  },
  { label: "Help & feedback", value: "help", icon: "question" },
];

const meta = {
  component: CommandPalette,
  tags: ["autodocs"],
  argTypes: {
    items: { control: "object" },
    shortcut: { control: "text" },
    placeholder: { control: "text" },
    dense: { control: "boolean" },
  },
  args: {
    items,
    shortcut: "Mod+K",
    dense: false,
    onSelect: fn(),
  },
  render: (args: any) => ({
    setup() {
      const open = ref(false);
      const selected = ref<string>();
      const onSelect = (value: string) => {
        selected.value = value;
        args.onSelect?.(value);
      };

      return () => (
        <div class="flex items-center gap-3 text-sm dark:text-neutral-100">
          <Button
            dense={args.dense}
            onClick={() => (open.value = true)}
          >
            Open command palette
          </Button>
          {args.shortcut && <Kbd shortcut={args.shortcut} />}
          {selected.value && <span>Selected: {selected.value}</span>}
          <CommandPalette
            {...args}
            open={open.value}
            {...{
              "onUpdate:open": (value: boolean) => (open.value = value),
            }}
            onSelect={onSelect}
          />
        </div>
      );
    },
  }),
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dense: Story = {
  args: {
    dense: true,
  },
};

export const Ungrouped: Story = {
  args: {
    items: items.map(({ group: _group, ...item }) => item),
  },
};
