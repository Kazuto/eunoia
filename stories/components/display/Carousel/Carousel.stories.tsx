import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Carousel from "./Carousel.vue";

type Slide = { title: string; text: string; tone: string };

const slides: Slide[] = [
  {
    title: "Write",
    text: "Draft in a calm, distraction-free editor.",
    tone: "bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100",
  },
  {
    title: "Review",
    text: "Leave comments right where they matter.",
    tone: "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
  },
  {
    title: "Publish",
    text: "Ship it to every channel at once.",
    tone: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
  },
  {
    title: "Measure",
    text: "See what resonated and what didn't.",
    tone: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100",
  },
];

const meta = {
  component: Carousel,
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: "object",
      description: "One entry per slide, passed to the default slot as `item`",
    },
    loop: {
      control: "boolean",
      description: "Wrap from the last slide to the first and back",
    },
    autoplay: {
      control: "number",
      description:
        "Milliseconds between slides. Pauses on hover and focus, and stays off for users who prefer reduced motion.",
    },
    ariaLabel: { control: "text" },
    default: {
      description: "Slide content, receives `{ item, index, active }`",
      table: {
        category: "slots",
        type: { summary: "{ item: T; index: number; active: boolean }" },
      },
    },
  },
  args: {
    items: slides,
    loop: false,
    autoplay: undefined,
    "onUpdate:modelValue": fn(),
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <div class="max-w-xl">
          <Carousel {...args}>
            {{
              default: ({ item }: { item: Slide }) => (
                <div
                  class={`flex h-56 flex-col justify-center gap-2 p-8 ${item.tone}`}
                >
                  <h3 class="text-xl font-bold">{item.title}</h3>
                  <p class="text-sm">{item.text}</p>
                </div>
              ),
            }}
          </Carousel>
        </div>
      );
    },
  }),
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loop: Story = {
  args: { loop: true },
};

export const Autoplay: Story = {
  args: { autoplay: 3000 },
  parameters: {
    docs: {
      description: {
        story:
          "Rotates every 3 seconds and always wraps. Hovering or focusing the carousel pauses it, and the first button stops it for good.",
      },
    },
  },
};

export const Images: Story = {
  args: {
    items: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
    ],
    ariaLabel: "Landscapes",
  },
  render: (args: any) => ({
    setup() {
      return () => (
        <div class="max-w-xl">
          <Carousel {...args}>
            {{
              default: ({ item, index }: { item: string; index: number }) => (
                <img
                  src={item}
                  alt={`Landscape ${index + 1}`}
                  class="aspect-video w-full object-cover"
                />
              ),
            }}
          </Carousel>
        </div>
      );
    },
  }),
};
