import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { UnassignedAircraftList } from "../UnassignedAircraftList";
import type { UnassignedAircraft } from "../UnassignedAircraftList";

const testAircraft: UnassignedAircraft[] = [
  {
    registration: "A7-BEB",
    type: "Airbus A350-1000",
    category: "widebody",
    location: "OTHH Stand A12",
    rangeStatus: "Long range",
  },
  {
    registration: "A7-AHF",
    type: "Airbus A320-200",
    category: "narrowbody",
    location: "OTHH Stand C08",
    rangeStatus: "Medium range",
  },
];

describe("UnassignedAircraftList", () => {
  it("renders the aircraft roster and parked status", () => {
    render(
      <UnassignedAircraftList aircraft={testAircraft} onClaim={vi.fn()} />,
    );

    expect(screen.getByText("A7-BEB")).toBeInTheDocument();
    expect(screen.getByText("Airbus A350-1000")).toBeInTheDocument();
    expect(screen.getByText("OTHH Stand A12")).toBeInTheDocument();
    expect(screen.getAllByText("PARKED")).toHaveLength(2);
    expect(screen.queryByText(/fuel/i)).not.toBeInTheDocument();
    expect(screen.getByText("Range: Long range")).toBeInTheDocument();
  });

  it("filters aircraft when a category tab is selected", () => {
    render(
      <UnassignedAircraftList aircraft={testAircraft} onClaim={vi.fn()} />,
    );

    fireEvent.mouseDown(screen.getByRole("tab", { name: /Widebody/i }), { button: 0, ctrlKey: false });

    expect(screen.getByText("A7-BEB")).toBeInTheDocument();
    expect(screen.queryByText("A7-AHF")).not.toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole("tab", { name: /Narrowbody/i }), { button: 0, ctrlKey: false });

    expect(screen.getByText("A7-AHF")).toBeInTheDocument();
    expect(screen.queryByText("A7-BEB")).not.toBeInTheDocument();
  });

  it("shows an empty state when a category has no available aircraft", () => {
    render(
      <UnassignedAircraftList
        aircraft={[testAircraft[0]]}
        onClaim={vi.fn()}
      />,
    );

    fireEvent.mouseDown(screen.getByRole("tab", { name: /Cargo/i }), { button: 0, ctrlKey: false });

    expect(
      screen.getByText("No available cargo aircraft."),
    ).toBeInTheDocument();
  });

  it("filters instantly by registration or aircraft type", () => {
    render(
      <UnassignedAircraftList aircraft={testAircraft} onClaim={vi.fn()} />,
    );

    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "Search aircraft by registration or type",
      }),
      { target: { value: "A320" } },
    );

    expect(screen.getByText("A7-AHF")).toBeInTheDocument();
    expect(screen.queryByText("A7-BEB")).not.toBeInTheDocument();
  });

  it("calls onClaim with the selected aircraft registration", () => {
    const onClaim = vi.fn();

    render(
      <UnassignedAircraftList aircraft={testAircraft} onClaim={onClaim} />,
    );

    const claimButtons = screen.getAllByRole("button", {
      name: /Claim Airframe/i,
    });

    fireEvent.click(claimButtons[0]);

    expect(onClaim).toHaveBeenCalledOnce();
    expect(onClaim).toHaveBeenCalledWith("A7-BEB");
  });

  it("shows all aircraft again when All Fleet is selected", () => {
    render(
      <UnassignedAircraftList aircraft={testAircraft} onClaim={vi.fn()} />,
    );

    fireEvent.mouseDown(screen.getByRole("tab", { name: /Widebody/i }), { button: 0, ctrlKey: false });
    fireEvent.mouseDown(screen.getByRole("tab", { name: /All Fleet/i }), { button: 0, ctrlKey: false });

    expect(screen.getByText("A7-BEB")).toBeInTheDocument();
    expect(screen.getByText("A7-AHF")).toBeInTheDocument();
  });
});
