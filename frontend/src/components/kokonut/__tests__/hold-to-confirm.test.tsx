import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { HoldToConfirmButton } from "../hold-to-confirm";

describe("HoldToConfirmButton", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not confirm before the hold duration", () => {
    vi.useFakeTimers();
    const onConfirm = vi.fn();

    render(
      <HoldToConfirmButton onConfirm={onConfirm}>
        Hold to confirm
      </HoldToConfirmButton>,
    );

    fireEvent.pointerDown(screen.getByRole("button"));

    act(() => {
      vi.advanceTimersByTime(1499);
    });

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("confirms after 1500ms", () => {
    vi.useFakeTimers();
    const onConfirm = vi.fn();

    render(
      <HoldToConfirmButton onConfirm={onConfirm}>
        Hold to confirm
      </HoldToConfirmButton>,
    );

    fireEvent.pointerDown(screen.getByRole("button"));

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("cancels when released early", () => {
    vi.useFakeTimers();
    const onConfirm = vi.fn();

    render(
      <HoldToConfirmButton onConfirm={onConfirm}>
        Hold to confirm
      </HoldToConfirmButton>,
    );

    const button = screen.getByRole("button");
    fireEvent.pointerDown(button);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    fireEvent.pointerUp(button);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("cancels when the pointer leaves the button", () => {
    vi.useFakeTimers();
    const onConfirm = vi.fn();

    render(
      <HoldToConfirmButton onConfirm={onConfirm}>
        Hold to confirm
      </HoldToConfirmButton>,
    );

    const button = screen.getByRole("button");
    fireEvent.pointerDown(button);
    fireEvent.pointerLeave(button);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("supports keyboard holding", () => {
    vi.useFakeTimers();
    const onConfirm = vi.fn();

    render(
      <HoldToConfirmButton onConfirm={onConfirm}>
        Hold to confirm
      </HoldToConfirmButton>,
    );

    const button = screen.getByRole("button");
    fireEvent.keyDown(button, { key: " " });

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("cancels an active hold when the button becomes disabled", () => {
    vi.useFakeTimers();
    const onConfirm = vi.fn();

    const { rerender } = render(
      <HoldToConfirmButton onConfirm={onConfirm}>
        Hold to confirm
      </HoldToConfirmButton>,
    );

    const button = screen.getByRole("button");
    fireEvent.pointerDown(button);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    rerender(
      <HoldToConfirmButton onConfirm={onConfirm} disabled>
        Hold to confirm
      </HoldToConfirmButton>,
    );

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not start a hold when already disabled", () => {
    vi.useFakeTimers();
    const onConfirm = vi.fn();

    render(
      <HoldToConfirmButton onConfirm={onConfirm} disabled>
        Hold to confirm
      </HoldToConfirmButton>,
    );

    fireEvent.pointerDown(screen.getByRole("button"));

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onConfirm).not.toHaveBeenCalled();
  });
});
