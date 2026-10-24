import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/vue";
import Progress from "./Progress.vue";

afterEach(cleanup);

describe("Progress", () => {
  it("reports its value to assistive tech", () => {
    render(Progress, { props: { value: 30, max: 60 } });
    const bar = screen.getByRole("progressbar", { name: "Progress" });
    expect(bar.getAttribute("aria-valuenow")).toBe("30");
    expect(bar.getAttribute("aria-valuemax")).toBe("60");
  });

  it("clamps out-of-range values", () => {
    render(Progress, { props: { value: 150 } });
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
      "100"
    );
  });

  it("omits aria-valuenow when indeterminate", () => {
    render(Progress);
    expect(screen.getByRole("progressbar").hasAttribute("aria-valuenow")).toBe(
      false
    );
  });

  it("lets a passed aria-label replace the default name", () => {
    render(Progress, {
      props: { value: 10 },
      attrs: { "aria-label": "Upload" },
    });
    expect(screen.getByRole("progressbar", { name: "Upload" })).toBeTruthy();
  });
});
