import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/vue";
import AspectRatio from "./AspectRatio.vue";

afterEach(cleanup);

describe("AspectRatio", () => {
  it("sets the ratio", () => {
    render(AspectRatio, {
      props: { ratio: "4 / 3" },
      slots: { default: "Media" },
    });
    expect(screen.getByText("Media").style.aspectRatio).toBe("4 / 3");
  });

  it("lets a width class replace the full width", () => {
    render(AspectRatio, {
      attrs: { class: "w-24" },
      slots: { default: "Media" },
    });
    const el = screen.getByText("Media");
    expect(el.classList.contains("w-24")).toBe(true);
    expect(el.classList.contains("w-full")).toBe(false);
  });
});
