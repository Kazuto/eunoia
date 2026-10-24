import { afterEach, describe, expect, it } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/vue";
import Stepper from "./Stepper.vue";

afterEach(cleanup);

const steps = [
  { label: "Account" },
  { label: "Payment", disabled: true },
  { label: "Review" },
  { label: "Done" },
];

describe("Stepper", () => {
  it("renders a labelled ordered list with the current step marked", () => {
    render(Stepper, { props: { steps, modelValue: 2 } });
    const list = screen.getByRole("list", { name: "Progress steps" });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(items[2].getAttribute("aria-current")).toBe("step");
    expect(
      items.filter((item) => item.hasAttribute("aria-current"))
    ).toHaveLength(1);
  });

  it("announces completed steps", () => {
    render(Stepper, { props: { steps, modelValue: 2 } });
    const items = screen.getAllByRole("listitem");
    expect(items[0].textContent).toContain("Completed");
    expect(items[2].textContent).not.toContain("Completed");
  });

  it("has no buttons unless clickable", () => {
    render(Stepper, { props: { steps, modelValue: 3 } });
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("lets users go back to enabled completed steps only", async () => {
    const { emitted } = render(Stepper, {
      props: { steps, modelValue: 2, clickable: true },
    });
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0].textContent).toContain("Account");

    await fireEvent.click(buttons[0]);
    expect(emitted()["update:modelValue"]).toEqual([[0]]);
  });
});
