import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/vue";
import Timeline from "./Timeline.vue";

afterEach(cleanup);

describe("Timeline", () => {
  it("renders items in order with titles, descriptions and times", () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const { container } = render(Timeline, {
      props: {
        items: [
          { title: "Created", description: "Draft started", time: "Monday" },
          { title: "Published", time: fiveMinutesAgo, icon: "rocket-launch" },
        ],
      },
    });

    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain("Created");
    expect(items[0].textContent).toContain("Draft started");
    expect(items[0].textContent).toContain("Monday");

    const time = container.querySelector("time")!;
    expect(time.getAttribute("datetime")).toBe(fiveMinutesAgo.toISOString());
    expect(time.textContent?.trim()).toBe("5 minutes ago");
  });

  it("renders custom content from the slot", () => {
    render(Timeline, {
      props: { items: [{ title: "Commented" }] },
      slots: {
        default:
          '<template #default="{ item }">Extra for {{ item.title }}</template>',
      },
    });
    expect(screen.getByText("Extra for Commented")).toBeTruthy();
  });
});
