import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { defineComponent, h, ref } from "vue";
import Accordion from "./Accordion.vue";
import AccordionItem from "./primitives/AccordionItem.vue";

afterEach(cleanup);

function renderAccordion(
  props: { multiple?: boolean },
  initial?: string | string[]
) {
  const model = ref<string | string[] | undefined>(initial);
  const Harness = defineComponent({
    setup: () => () =>
      h(
        Accordion,
        {
          ...props,
          modelValue: model.value,
          "onUpdate:modelValue": (v: string | string[] | undefined) => {
            model.value = v;
          },
        },
        () =>
          ["one", "two"].map((value) =>
            h(
              AccordionItem,
              { value },
              {
                summary: () => `Summary ${value}`,
                default: () => `Body ${value}`,
              }
            )
          )
      ),
  });
  render(Harness);
  return model;
}

function summary(name: string) {
  return screen.getByText(`Summary ${name}`).closest("summary")!;
}

describe("Accordion", () => {
  it("opens the item matching the model", () => {
    renderAccordion({}, "two");
    expect(summary("one").getAttribute("aria-expanded")).toBe("false");
    expect(summary("two").getAttribute("aria-expanded")).toBe("true");
  });

  it("closes the open item when another opens", async () => {
    const model = renderAccordion({}, "one");
    await fireEvent.click(summary("two"));
    expect(model.value).toBe("two");
    expect(summary("one").getAttribute("aria-expanded")).toBe("false");
    expect(summary("two").getAttribute("aria-expanded")).toBe("true");
  });

  it("closes an open item when its summary is clicked", async () => {
    const model = renderAccordion({}, "one");
    await fireEvent.click(summary("one"));
    expect(model.value).toBeUndefined();
  });

  it("keeps several items open with multiple", async () => {
    const model = renderAccordion({ multiple: true }, ["one"]);
    await fireEvent.click(summary("two"));
    expect(model.value).toEqual(["one", "two"]);
    await fireEvent.click(summary("one"));
    expect(model.value).toEqual(["two"]);
  });

  it("refuses to render an item outside an Accordion", () => {
    expect(() => render(AccordionItem, { props: { value: "lonely" } })).toThrow(
      "AccordionItem must be used inside an Accordion."
    );
  });
});
