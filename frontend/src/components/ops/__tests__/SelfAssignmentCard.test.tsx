
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { SelfAssignmentCard } from "../SelfAssignmentCard";

describe("SelfAssignmentCard", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders pilot, airframe, selected schedule, and airport flags", () => {
    render(<SelfAssignmentCard />);

    expect(screen.getByText("QTR001")).toBeInTheDocument();
    expect(screen.getByText("Senior First Officer")).toBeInTheDocument();
    expect(screen.getByText("1,240 hours")).toBeInTheDocument();
    expect(screen.getByText("A7-APC")).toBeInTheDocument();
    expect(screen.getByText("Airbus A350-900")).toBeInTheDocument();
    expect(screen.getAllByText("OTHH").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("QR843")).toBeInTheDocument();
    expect(screen.getByText("EGLL")).toBeInTheDocument();
    expect(screen.getAllByTitle("Qatar")).toHaveLength(2);
    expect(screen.getAllByTitle("United Kingdom")).toHaveLength(1);
    expect(screen.getByText("02:15 UTC")).toBeInTheDocument();
    expect(screen.getByText("07:25 UTC")).toBeInTheDocument();
  });

  it("uses theme-aware classes for card panels and text", () => {
    const { container } = render(<SelfAssignmentCard />);

    const card = container.querySelector(".bg-background");
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("text-foreground");

    const panels = container.querySelectorAll(".bg-card");
    expect(panels.length).toBeGreaterThanOrEqual(2);

    for (const panel of panels) {
      expect(panel).toHaveClass("border-border");
    }

    expect(container.querySelector(".text-muted-foreground")).toBeInTheDocument();
    expect(container.querySelector(".bg-muted")).toBeInTheDocument();
  });

  it("shows an empty state when no airframe is assigned", () => {
    render(<SelfAssignmentCard assignment={null} />);

    expect(screen.getByText(/no active airframe assigned/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /release airframe/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /confirm assignment/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /book new schedule/i })).toBeInTheDocument();
  });

  it("opens the selected assignment confirmation dialog", () => {
    render(<SelfAssignmentCard />);

    fireEvent.click(screen.getByRole("button", { name: /confirm assignment/i }));

    expect(
      screen.getByRole("dialog", { name: /confirm selected assignment/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Review the selected flight before confirming your assignment.")).toBeInTheDocument();
  });

  it("calls onConfirmAssignment when the selected assignment is confirmed", () => {
    const onConfirmAssignment = vi.fn();
    render(<SelfAssignmentCard onConfirmAssignment={onConfirmAssignment} />);

    fireEvent.click(screen.getByRole("button", { name: /confirm assignment/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /^confirm assignment$/i }),
    );

    expect(onConfirmAssignment).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog", { name: /confirm selected assignment/i })).not.toBeInTheDocument();
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
  });

  it("opens the schedule booking dialog and calls its callback", () => {
    const onBookSchedule = vi.fn();
    render(<SelfAssignmentCard onBookSchedule={onBookSchedule} />);

    fireEvent.click(screen.getByRole("button", { name: /book new schedule/i }));

    expect(
      screen.getByRole("dialog", { name: /book a new schedule/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(onBookSchedule).toHaveBeenCalledTimes(1);
  });

  it("opens the release confirmation dialog", () => {
    render(<SelfAssignmentCard />);

    fireEvent.click(screen.getByRole("button", { name: /release airframe/i }));

    expect(
      screen.getByRole("dialog", { name: /confirm airframe release/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /hold to release airframe/i }),
    ).toBeInTheDocument();
  });

  it("calls onRelease only after the confirmation hold completes", () => {
    vi.useFakeTimers();
    const onRelease = vi.fn();
    render(<SelfAssignmentCard onRelease={onRelease} />);

    fireEvent.click(screen.getByRole("button", { name: /release airframe/i }));

    const confirmButton = screen.getByRole("button", {
      name: /hold to release airframe/i,
    });

    fireEvent.pointerDown(confirmButton);

    act(() => vi.advanceTimersByTime(1499));
    expect(onRelease).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(onRelease).toHaveBeenCalledTimes(1);
  });

  it("supports keyboard activation of the release confirmation", () => {
    vi.useFakeTimers();
    const onRelease = vi.fn();
    render(<SelfAssignmentCard onRelease={onRelease} />);

    fireEvent.click(screen.getByRole("button", { name: /release airframe/i }));

    const confirmButton = screen.getByRole("button", {
      name: /hold to release airframe/i,
    });

    confirmButton.focus();
    fireEvent.keyDown(confirmButton, { key: "Enter" });

    act(() => vi.advanceTimersByTime(1500));
    expect(onRelease).toHaveBeenCalledTimes(1);
  });
});
