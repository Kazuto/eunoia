import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { defineComponent, nextTick, ref } from "vue";
import Tabs from "./Tabs.vue";

afterEach(cleanup);

const items = [
  { value: "overview", label: "Overview" },
  { value: "activity", label: "Activity", disabled: true },
  { value: "settings", label: "Settings" },
];

function renderTabs(initial = "overview") {
  const Host = defineComponent({
    components: { Tabs },
    setup() {
      const tab = ref(initial);
      return { tab, items };
    },
    template: `
      <Tabs v-model="tab" :items="items" aria-label="Sections">
        <template #default="{ item }">Panel {{ item.label }}</template>
      </Tabs>
      <output data-testid="value">{{ tab }}</output>
    `,
  });
  return render(Host);
}

describe("Tabs", () => {
  it("links the selected tab to its panel", () => {
    renderTabs();
    const tab = screen.getByRole("tab", { name: "Overview" });
    const panel = screen.getByRole("tabpanel");
    expect(tab.getAttribute("aria-selected")).toBe("true");
    expect(tab.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
    expect(panel.textContent).toBe("Panel Overview");
  });

  it("keeps only the selected tab in the tab order", () => {
    renderTabs();
    const tabIndexes = screen
      .getAllByRole("tab")
      .map((tab) => tab.getAttribute("tabindex"));
    expect(tabIndexes).toEqual(["0", "-1", "-1"]);
  });

  it("moves with arrow keys, skipping disabled tabs and wrapping", async () => {
    renderTabs();
    const list = screen.getByRole("tablist");
    await fireEvent.keyDown(list, { key: "ArrowRight" });
    await nextTick();
    expect(screen.getByTestId("value").textContent).toBe("settings");
    expect(document.activeElement).toBe(
      screen.getByRole("tab", { name: "Settings" })
    );
    await fireEvent.keyDown(list, { key: "ArrowRight" });
    expect(screen.getByTestId("value").textContent).toBe("overview");
    await fireEvent.keyDown(list, { key: "End" });
    expect(screen.getByTestId("value").textContent).toBe("settings");
    await fireEvent.keyDown(list, { key: "Home" });
    expect(screen.getByTestId("value").textContent).toBe("overview");
  });

  it("ignores clicks on disabled tabs", async () => {
    renderTabs();
    await fireEvent.click(screen.getByRole("tab", { name: "Activity" }));
    expect(screen.getByTestId("value").textContent).toBe("overview");
  });

  it("falls back to the first enabled tab for an unknown value", () => {
    renderTabs("missing");
    expect(
      screen
        .getByRole("tab", { name: "Overview" })
        .getAttribute("aria-selected")
    ).toBe("true");
  });
});
