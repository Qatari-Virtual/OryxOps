import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusDot, StatusPill, type FlightStatus } from "../status-pill";

const statuses: FlightStatus[] = [
  "airborne",
  "radar",
  "tod",
  "stopped",
  "parked",
];

describe("StatusDot", () => {
  it.each(statuses)("renders the %s status dot", (status) => {
    render(<StatusDot status={status} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("uses a fixed 6px dot without animation", () => {
    const { container } = render(<StatusDot status="airborne" />);
    const dot = container.querySelector("span");

    expect(dot).toHaveClass("h-1.5", "w-1.5");
    expect(dot?.className).not.toMatch(/animate-|transition-/);
  });
});

describe("StatusPill", () => {
  it.each([
    ["airborne", "AIR", "Airborne"],
    ["radar", "RAD", "Radar"],
    ["tod", "TOD", "TOD Advisory"],
    ["stopped", "STOP", "Stopped"],
    ["parked", "PARK", "Parked"],
  ] as const)("renders %s as %s", (status, code, accessibleLabel) => {
    render(<StatusPill status={status} />);

    expect(screen.getByRole("status", { name: accessibleLabel })).toHaveTextContent(code);
  });

  it("supports a custom visible label", () => {
    render(<StatusPill status="airborne" label="IN FLIGHT" />);
    expect(screen.getByRole("status", { name: "IN FLIGHT" })).toHaveTextContent("IN FLIGHT");
  });

  it("has no animation or transition classes", () => {
    const { container } = render(<StatusPill status="radar" />);
    expect(container.firstElementChild?.className).not.toMatch(/animate-|transition-/);
  });
});
