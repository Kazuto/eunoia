import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Code from "./Code.vue";

const meta = {
  component: Code,
  tags: ["autodocs"],
  argTypes: {
    block: { control: "boolean" },
    filename: { control: "text" },
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
    block: false,
    default: "console.log('hello')",
    onCopy: fn(),
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <Code {...args}>
          {args.default}
        </Code>
      );
    },
  }),
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  args: {
    default: "npm install eunoia",
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <p style={{ fontFamily: "var(--font-sans)" }}>
          Run <Code {...args}>{args.default}</Code> to get started.
        </p>
      );
    },
  }),
};

export const Block: Story = {
  args: {
    block: true,
    default: `function greet(name: string) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("World"));`,
  },
};

export const BlockMultiline: Story = {
  args: {
    block: true,
    default: `import { ref } from "vue";\n\nconst count = ref(0);\n\nfunction increment() {\n  count.value++;\n}\n\nfunction decrement() {\n  count.value--;\n}`,
  },
};

export const WithFilename: Story = {
  args: {
    block: true,
    filename: "src/composables/useCounter.ts",
    default: `import { ref } from "vue";\n\nexport function useCounter(initial = 0) {\n  const count = ref(initial);\n  const increment = () => count.value++;\n  const decrement = () => count.value--;\n  return { count, increment, decrement };\n}`,
  },
};
