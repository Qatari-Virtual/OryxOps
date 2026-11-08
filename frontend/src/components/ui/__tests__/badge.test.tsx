import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../badge";

describe("Badge", () => {
  it("renders with the default variant", () => {
    render(<Badge>Active</Badge>);

    const badge = screen.getByText("Active");

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-primary");
  });

  it.each([
    ["default", "bg-primary"],
    ["burgundy", "bg-brand"],
    ["gold", "bg-brand-gold/15"],
    ["airborne", "bg-status-airborne/10"],
    ["radar", "bg-status-radar/10"],
    ["tod", "bg-status-tod/10"],
    ["stopped", "bg-status-stopped/10"],
    ["parked", "bg-status-parked/10"],
    ["outline", "border-border"],
  ] as const)("supports the %s variant", (variant, expectedClass) => {
    render(<Badge variant={variant}>Status</Badge>);

    expect(screen.getByText("Status")).toHaveClass(expectedClass);
  });

  it("supports custom class names", () => {
    render(<Badge className="custom-class">Custom</Badge>);

    expect(screen.getByText("Custom")).toHaveClass("custom-class");
  });

  it("includes the burgundy keyboard focus ring", () => {
    render(<Badge>Focus me</Badge>);

    expect(screen.getByText("Focus me")).toHaveClass(
      "focus-visible:ring-ring",
    );
  });
});
