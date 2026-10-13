import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Select from "./Select.vue";
import Dialog from "../../feedback/Dialog/Dialog.vue";
import Button from "../../core/Button/Button.vue";

const sampleOptions = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Date", value: "date" },
  { label: "Elderberry", value: "elderberry" },
  { label: "Fig", value: "fig" },
  { label: "Grape", value: "grape" },
  { label: "Honeydew", value: "honeydew" },
];

const meta = {
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    multiple: { control: "boolean" },
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
    default: "Fruit",
    options: sampleOptions,
    placeholder: "Select a fruit...",
    multiple: false,
    dense: false,
    disabled: false,
    invalid: false,
    "onUpdate:modelValue": fn(),
  },
  render: (args: any) => ({
    setup() {
      const value = ref();
      return () => (
        <Select
          {...args}
          v-model={value.value}
        >
          {{
            default: () => {
              return args.default;
            },
          }}
        </Select>
      );
    },
  }),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dense: Story = {
  args: {
    dense: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
  },
};

export const MultiSelect: Story = {
  args: {
    multiple: true,
    placeholder: "Select fruits...",
  },
  render: (args: any) => ({
    setup() {
      const value = ref<Array<string | number>>([]);
      return () => (
        <Select
          {...args}
          v-model={value.value}
        >
          {{
            default: () => {
              return "Fruits";
            },
          }}
        </Select>
      );
    },
  }),
};

export const MultiSelectDense: Story = {
  args: {
    multiple: true,
    dense: true,
    placeholder: "Select fruits...",
  },
  render: (args: any) => ({
    setup() {
      const value = ref<Array<string | number>>([]);
      return () => (
        <Select
          {...args}
          v-model={value.value}
        >
          {{
            default: () => {
              return "Fruits";
            },
          }}
        </Select>
      );
    },
  }),
};

export const PreselectedSingle: Story = {
  render: (args: any) => ({
    setup() {
      const value = ref<string>("cherry");
      return () => (
        <Select
          {...args}
          v-model={value.value}
        >
          {{
            default: () => {
              return "Fruit";
            },
          }}
        </Select>
      );
    },
  }),
};

export const PreselectedMulti: Story = {
  args: {
    multiple: true,
  },
  render: (args: any) => ({
    setup() {
      const value = ref(["apple", "cherry"]);
      return () => (
        <Select
          {...args}
          v-model={value.value}
        >
          {{
            default: () => {
              return "Fruits";
            },
          }}
        </Select>
      );
    },
  }),
};

export const Teleported: Story = {
  args: { teleportTo: "body" },
  parameters: {
    docs: {
      description: {
        story:
          "The dropdown escapes overflow containers and follows its trigger when scrolling or resizing.",
      },
    },
  },
};

export const InScrollableDialog: Story = {
  args: {
    multiple: true,
    teleportTo: "body",
    options: Array.from({ length: 30 }, (_, index) => ({
      label: `Scope ${index + 1}`,
      value: index + 1,
    })),
  },
  render: (args: any) => ({
    components: { Select, Dialog, Button },
    setup() {
      const open = ref(false);
      const value = ref<Array<string | number>>([]);
      return { args, open, value };
    },
    template: `
      <Button @click="open = true">Open scrollable dialog</Button>
      <Dialog :open="open" title="Choose scopes" class="h-[min(480px,calc(100dvh-2rem))]" @close="open = false">
        <div class="flex min-h-[600px] flex-col justify-end gap-4">
          <p>Scroll to the bottom, then open the Select. The dropdown should escape the scrolling body without changing its scroll height.</p>
          <Select v-model="value" v-bind="args">Scopes</Select>
        </div>
        <template #footer>
          <Button @click="open = false">Done</Button>
        </template>
      </Dialog>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Open scrollable dialog" })
    );
    const dialog = canvas.getByRole("dialog");
    const trigger = within(dialog).getByRole("combobox");
    const scroller = trigger.closest(".overflow-y-auto") as HTMLElement;
    scroller.scrollTop = scroller.scrollHeight;
    const scrollHeight = scroller.scrollHeight;

    await userEvent.click(trigger);
    const listbox = within(dialog).getByRole("listbox");
    await waitFor(() => {
      expect(listbox.parentElement).toBe(dialog);
      expect(listbox.style.position).toBe("fixed");
      expect(listbox.getBoundingClientRect().width).toBeCloseTo(
        trigger.getBoundingClientRect().width,
        0
      );
    });
    expect(scroller.scrollHeight).toBe(scrollHeight);
    const rect = listbox.getBoundingClientRect();
    expect(rect.top).toBeGreaterThanOrEqual(8);
    expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight - 8);
    expect(
      listbox.contains(document.elementFromPoint(rect.left + 10, rect.top + 10))
    ).toBe(true);

    await userEvent.click(
      within(listbox).getByRole("option", { name: "Scope 1", exact: true })
    );
    expect(dialog.hasAttribute("open")).toBe(true);
    expect(
      within(listbox)
        .getByRole("option", { name: "Scope 1", exact: true })
        .getAttribute("aria-selected")
    ).toBe("true");
    trigger.focus({ preventScroll: true });
    const scrollTop = scroller.scrollTop;
    await userEvent.keyboard("{End}");
    expect(listbox.scrollTop).toBeGreaterThan(0);
    expect(scroller.scrollTop).toBe(scrollTop);
    await userEvent.keyboard("{Enter}");
    expect(
      within(listbox)
        .getByRole("option", { name: "Scope 30", exact: true })
        .getAttribute("aria-selected")
    ).toBe("true");
    await userEvent.keyboard("{Escape}");
    expect(within(dialog).queryByRole("listbox")).toBeNull();
    expect(dialog.hasAttribute("open")).toBe(true);
    await userEvent.keyboard("{ArrowDown}{Tab}");
    expect(within(dialog).queryByRole("listbox")).toBeNull();
    expect(document.activeElement?.closest("dialog")).toBe(dialog);
    await userEvent.click(within(dialog).getByRole("button", { name: "Done" }));
  },
};
