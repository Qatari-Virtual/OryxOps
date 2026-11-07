
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../button";

describe("Button", () => {
  it("renders with the default variant and size", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-primary");
    expect(button).toHaveClass("h-10");
  });

  it.each([
    ["default", "bg-primary"],
    ["secondary", "bg-secondary"],
    ["outline", "border-input"],
    ["gold", "bg-brand-gold"],
    ["ghost", "hover:bg-accent"],
    ["destructive", "bg-destructive"],
  ] as const)("supports the %s variant", (variant, expectedClass) => {
    render(<Button variant={variant}>Test</Button>);

    expect(screen.getByRole("button")).toHaveClass(expectedClass);
  });

  it.each([
    ["sm", "h-9"],
    ["default", "h-10"],
    ["lg", "h-11"],
    ["icon", "w-10"],
  ] as const)("supports the %s size", (size, expectedClass) => {
    render(<Button size={size}>Test</Button>);

    expect(screen.getByRole("button")).toHaveClass(expectedClass);
  });

  it("can be disabled", () => {
    render(<Button disabled>Disabled</Button>);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("disables itself and displays a spinner when loading", () => {
    render(<Button loading>Saving</Button>);

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button.querySelector("svg")).toHaveClass("animate-spin");
  });

  it("supports custom class names", () => {
    render(<Button className="custom-class">Custom</Button>);

    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("includes the burgundy keyboard focus ring", () => {
    render(<Button>Focus me</Button>);

    expect(screen.getByRole("button")).toHaveClass(
      "focus-visible:ring-ring",
    );
  });
});
