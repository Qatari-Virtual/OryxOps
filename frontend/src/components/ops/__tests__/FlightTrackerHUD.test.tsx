import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  FlightTrackerHUD,
  calculateTodEta,
} from "../FlightTrackerHUD";

describe("FlightTrackerHUD", () => {
  it("renders route and telemetry values", () => {
    render(
      <FlightTrackerHUD
        currentAltitude={360}
        distanceToTod={124}
        groundSpeed={488}
        trueAirspeed="M0.85"
        todEta="15:42Z"
      />,
    );

    expect(screen.getByText("OTHH")).toBeInTheDocument();
    expect(screen.getByText("EGLL")).toBeInTheDocument();
    expect(screen.getByTestId("altitude-value")).toHaveTextContent("FL360");
    expect(screen.getByTestId("tod-distance")).toHaveTextContent("124 NM");
    expect(screen.getByTestId("ground-speed-value")).toHaveTextContent("488");
    expect(screen.getByTestId("true-airspeed-value")).toHaveTextContent("M0.85");
    expect(screen.getByText("15:42Z")).toBeInTheDocument();
  });

  it("activates the TOD glow at 150 NM or less", () => {
    const { rerender } = render(<FlightTrackerHUD distanceToTod={150} />);

    expect(screen.getByTestId("tod-glow-card")).toHaveAttribute("data-glow", "true");
    expect(screen.getByTestId("tod-status")).toHaveTextContent("TOD approaching");

    rerender(<FlightTrackerHUD distanceToTod={151} />);

    expect(screen.getByTestId("tod-glow-card")).toHaveAttribute("data-glow", "false");
    expect(screen.getByTestId("tod-status")).toHaveTextContent("Cruise");
  });

  it("marks the supplied flight phase as current", () => {
    render(<FlightTrackerHUD currentPhase="TOD / Descent" />);

    expect(
      screen.getByRole("button", {
        name: "TOD / Descent: Current phase",
      }),
    ).toHaveAttribute("aria-current", "step");
  });

  it("forwards phase changes from the PhaseRail", () => {
    const onPhaseChange = vi.fn();

    render(
      <FlightTrackerHUD
        currentPhase="Cruise"
        onPhaseChange={onPhaseChange}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "TOD / Descent: Upcoming",
      }),
    );

    expect(onPhaseChange).toHaveBeenCalledWith("TOD / Descent");
  });

  it("uses monospace tabular typography for numerical readouts", () => {
    render(<FlightTrackerHUD />);

    expect(screen.getByTestId("altitude-value")).toHaveClass("font-mono");
    expect(screen.getByTestId("altitude-value")).toHaveClass("tabular-nums");
    expect(screen.getByTestId("tod-distance")).toHaveClass("font-mono");
    expect(screen.getByTestId("ground-speed-value")).toHaveClass("font-mono");
  });

  it("calculates a UTC top-of-descent ETA", () => {
    const now = new Date("2026-11-27T15:26:00.000Z");

    expect(calculateTodEta(124, 488, now)).toBe("15:41Z");
  });

  it("returns a placeholder when ground speed is zero", () => {
    expect(calculateTodEta(124, 0)).toBe("--:--Z");
  });
});
