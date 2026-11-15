
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PhaseRail, FLIGHT_PHASES } from "../phase-rail";

describe("PhaseRail", () => {
  it("renders all seven flight phases", () => {
    render(<PhaseRail currentPhase="Cruise" />);

    for (const phase of FLIGHT_PHASES) {
      expect(screen.getByText(phase)).toBeInTheDocument();
    }
  });

  it("marks the current phase correctly", () => {
    render(<PhaseRail currentPhase="Cruise" />);

    expect(
      screen.getByRole("button", { name: "Cruise: Current phase" })
    ).toHaveAttribute("aria-current", "step");
  });

  it("marks previous phases as completed", () => {
    render(<PhaseRail currentPhase="Cruise" />);

    expect(
      screen.getByRole("button", { name: "Preflight: Completed" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Taxi: Completed" })
    ).toBeInTheDocument();
  });

  it("marks later phases as upcoming", () => {
    render(<PhaseRail currentPhase="Cruise" />);

    expect(
      screen.getByRole("button", { name: "Approach: Upcoming" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Landed: Upcoming" })
    ).toBeInTheDocument();
  });

  it("calls onPhaseChange when a phase is clicked", () => {
    const onPhaseChange = vi.fn();

    render(
      <PhaseRail
        currentPhase="Cruise"
        onPhaseChange={onPhaseChange}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Approach: Upcoming" })
    );

    expect(onPhaseChange).toHaveBeenCalledWith("Approach");
  });
});
