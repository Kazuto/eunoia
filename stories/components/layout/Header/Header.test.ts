import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/vue";
import { nextTick } from "vue";
import Header from "./Header.vue";

vi.mock("@/components", () => ({
  Button: { template: "<button><slot /></button>" },
  Tooltip: { template: "<span><slot /></span>" },
  Headline: { template: "<h3><slot /></h3>" },
  Truncate: { template: "<span><slot /></span>" },
  Text: { template: "<p><slot /></p>" },
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function rect(left: number, right: number) {
  return {
    left,
    right,
    width: right - left,
    top: 0,
    bottom: 0,
    height: 0,
    x: left,
    y: 0,
  } as DOMRect;
}

function alignedRow(container: Element) {
  return container.querySelector<HTMLElement>("header > .flex-1 > div")!;
}

async function renderAligned(
  main: { left: number; width: number },
  area: { left: number; right: number }
) {
  const target = document.createElement("main");
  Object.defineProperty(target, "clientWidth", { value: main.width });
  Object.defineProperty(target, "clientLeft", { value: 0 });
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      if (this === target) return rect(main.left, main.left + main.width);
      return rect(area.left, area.right);
    }
  );
  const result = render(Header, {
    props: { title: "Locales", width: "extra-wide", alignTo: target },
  });
  await nextTick();
  return result;
}

describe("Header alignment", () => {
  it("lines title and actions up with the page content on wide screens", async () => {
    // main: 200..2200 → page column 360..2040, content 376..2024
    const { container } = await renderAligned(
      { left: 200, width: 2000 },
      { left: 80, right: 2100 }
    );
    const row = alignedRow(container);
    expect(row.style.marginLeft).toBe("296px");
    expect(row.style.width).toBe("1648px");
  });

  it("starts at the content edge and stops before the right slot on narrow screens", async () => {
    // main: 200..1400 → page fills it, content 216..1384; the user menu leaves room until 1250
    const { container } = await renderAligned(
      { left: 200, width: 1200 },
      { left: 80, right: 1250 }
    );
    const row = alignedRow(container);
    expect(row.style.marginLeft).toBe("136px");
    expect(row.style.width).toBe("1034px");
  });

  it("keeps the full-width layout without a width", () => {
    const { container } = render(Header, { props: { title: "Locales" } });
    expect(alignedRow(container).getAttribute("style")).toBeNull();
  });
});

describe("Header transparent", () => {
  it("drops the background and border only when transparent", () => {
    const { container, rerender } = render(Header, {
      props: { title: "Overview" },
    });
    const header = container.querySelector("header")!;
    expect(header.classList.contains("bg-white")).toBe(true);

    return rerender({ title: "Overview", transparent: true }).then(() => {
      expect(header.classList.contains("bg-white")).toBe(false);
      expect(header.classList.contains("bg-transparent")).toBe(true);
      expect(header.classList.contains("border-transparent")).toBe(true);
    });
  });
});
