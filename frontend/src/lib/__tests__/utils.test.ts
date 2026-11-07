import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn utility helper", () => {
  it("merges multiple string classnames correctly", () => {
    expect(cn("px-2", "py-1", "bg-brand")).toBe("px-2 py-1 bg-brand");
  });

  it("resolves tailwind duplicate conflicts correctly with condition", () => {
    const condition = true;
    expect(cn("px-2", condition && "px-4", "text-white")).toBe("px-4 text-white");
  });

  it("handles false conditional values without retaining conflict", () => {
    const condition = false;
    expect(cn("px-2", condition && "px-4", "text-white")).toBe("px-2 text-white");
  });

  it("filters out falsy values like undefined, null, false, and empty strings", () => {
    expect(cn("btn", undefined, null, false, "")).toBe("btn");
  });

  it("supports object and array syntax from clsx", () => {
    expect(
      cn("base-class", ["array-item-1", "array-item-2"], {
        "is-active": true,
        "is-disabled": false,
      })
    ).toBe("base-class array-item-1 array-item-2 is-active");
  });

  it("overrides conflicting tailwind classes with last-wins semantics", () => {
    expect(cn("text-red-500 bg-black", "text-blue-500")).toBe("bg-black text-blue-500");
    expect(cn("p-4", "p-2")).toBe("p-2");
  });
});
