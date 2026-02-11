import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

import Code from "./Code.vue";

const meta = {
  component: Code,
  tags: ["autodocs"],
  argTypes: {
    block: { control: "boolean" },
    language: { control: "text" },
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
      return () => <Code {...args}>{args.default}</Code>;
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

export const Highlighted: Story = {
  args: {
    block: true,
    language: "typescript",
    default: `function greet(name: string): string {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("World"));`,
  },
};

export const HighlightedWithFilename: Story = {
  args: {
    block: true,
    language: "typescript",
    filename: "src/composables/useCounter.ts",
    default: `import { ref } from "vue";\n\nexport function useCounter(initial = 0) {\n  const count = ref(initial);\n  const increment = () => count.value++;\n  const decrement = () => count.value--;\n  return { count, increment, decrement };\n}`,
  },
};

export const HighlightedCSS: Story = {
  args: {
    block: true,
    language: "css",
    filename: "styles.css",
    default: `.container {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: 2rem;\n  background-color: #f9fafb;\n  border-radius: 0.5rem;\n}`,
  },
};

export const WithFilename: Story = {
  args: {
    block: true,
    filename: "src/composables/useCounter.ts",
    default: `import { ref } from "vue";\n\nexport function useCounter(initial = 0) {\n  const count = ref(initial);\n  const increment = () => count.value++;\n  const decrement = () => count.value--;\n  return { count, increment, decrement };\n}`,
  },
};
