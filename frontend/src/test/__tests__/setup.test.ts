import { describe, it, expect } from "vitest";

describe("Vitest & jest-dom test environment", () => {
  it("renders DOM elements and uses jest-dom matchers in jsdom", () => {
    const el = document.createElement("div");
    el.textContent = "OryxOps EFB";
    el.className = "brand-element";
    document.body.appendChild(el);

    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent("OryxOps EFB");
    expect(el).toHaveClass("brand-element");

    document.body.removeChild(el);
  });
});
