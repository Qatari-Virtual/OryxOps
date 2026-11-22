import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as React from "react";
import { ShimmerInput } from "../shimmer-input";
import { RiPlaneLine } from "@remixicon/react";

const MOCK_OPTIONS = ["QTR843", "QTR844", "A7-APC", "OTHH", "EGLL", "OMDB", "OTHH2"];

describe("ShimmerInput", () => {
  it("renders with search icon and placeholder", () => {
    render(<ShimmerInput placeholder="Search pilot, callsign, or airport (e.g. OTHH)..." />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("updates value and calls onChange when typed into", () => {
    const onChange = vi.fn();
    render(<ShimmerInput placeholder="Search" onChange={onChange} />);
    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "QTR843" } });
    expect(onChange).toHaveBeenCalled();
    expect(input).toHaveValue("QTR843");
  });

  it("applies active styling on focus", () => {
    const { container } = render(<ShimmerInput placeholder="Search" />);
    const input = screen.getByPlaceholderText("Search");
    const wrapper = container.querySelector(".group") as HTMLElement;

    expect(wrapper.className).not.toMatch(/\sborder-brand\s/);

    fireEvent.focus(input);
    expect(wrapper.className).toMatch(/\sborder-brand\s/);

    fireEvent.blur(input);
    expect(wrapper.className).not.toMatch(/\sborder-brand\s/);
  });

  it("applies active styling when input has value", () => {
    const { container } = render(<ShimmerInput placeholder="Search" defaultValue="OTHH" />);
    const wrapper = container.querySelector(".group") as HTMLElement;
    expect(wrapper.className).toMatch(/\sborder-brand\s/);
  });

  it("shows clean clear button when input has text and resets on click", () => {
    const onClear = vi.fn();
    render(<ShimmerInput placeholder="Search" onClear={onClear} defaultValue="A7-APC" />);

    const clearBtn = screen.getByRole("button", { name: /clear/i });
    expect(clearBtn).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Search");
    expect(input).toHaveValue("A7-APC");

    fireEvent.click(clearBtn);
    expect(input).toHaveValue("");
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("button", { name: /clear/i })).not.toBeInTheDocument();
  });

  it("hides clear button when input is empty", () => {
    render(<ShimmerInput placeholder="Search" />);
    expect(screen.queryByRole("button", { name: /clear/i })).not.toBeInTheDocument();
  });

  it("respects clearable={false} to not render clear button", () => {
    render(<ShimmerInput placeholder="Search" defaultValue="EGLL" clearable={false} />);
    expect(screen.queryByRole("button", { name: /clear/i })).not.toBeInTheDocument();
  });

  it("applies tabular monospace class when mono prop is true", () => {
    render(<ShimmerInput placeholder="Callsign" mono />);
    const input = screen.getByPlaceholderText("Callsign");
    expect(input.className).toContain("font-mono");
    expect(input.className).toContain("tabular-nums");
  });

  it("renders custom inline icon when provided", () => {
    render(
      <ShimmerInput
        placeholder="Custom Icon"
        icon={<RiPlaneLine data-testid="plane-icon" className="h-4 w-4" />}
      />
    );
    expect(screen.getByTestId("plane-icon")).toBeInTheDocument();
  });

  it("forwards ref to the underlying HTMLInputElement", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<ShimmerInput ref={ref} placeholder="Search" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("disables input and does not show clear button when disabled", () => {
    render(<ShimmerInput placeholder="Search" defaultValue="Disabled" disabled />);
    const input = screen.getByPlaceholderText("Search");
    expect(input).toBeDisabled();
    expect(screen.queryByRole("button", { name: /clear/i })).not.toBeInTheDocument();
  });

  it("shows filtered dropdown when options provided and focused", () => {
    render(<ShimmerInput placeholder="Search" options={MOCK_OPTIONS} />);
    const input = screen.getByPlaceholderText("Search");

    // No dropdown before focus
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    fireEvent.focus(input);
    // All options visible when input is empty
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(MOCK_OPTIONS.length);

    fireEvent.change(input, { target: { value: "OTHH" } });
    expect(screen.getAllByRole("option")).toHaveLength(2); // OTHH, OTHH2

    fireEvent.change(input, { target: { value: "QTR" } });
    expect(screen.getAllByRole("option")).toHaveLength(2); // QTR843, QTR844

    fireEvent.change(input, { target: { value: "XYZ" } });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("calls onPick and sets value when option is clicked", () => {
    const onPick = vi.fn();
    render(<ShimmerInput placeholder="Search" options={MOCK_OPTIONS} onPick={onPick} />);
    const input = screen.getByPlaceholderText("Search");

    fireEvent.focus(input);
    fireEvent.mouseDown(screen.getByText("OTHH"));

    expect(onPick).toHaveBeenCalledWith("OTHH");
    expect(input).toHaveValue("OTHH");
  });

  it("navigates options with arrow keys and selects with Enter", () => {
    const onPick = vi.fn();
    render(<ShimmerInput placeholder="Search" options={MOCK_OPTIONS} onPick={onPick} />);
    const input = screen.getByPlaceholderText("Search");

    fireEvent.focus(input);
    const options = screen.getAllByRole("option");

    // Arrow down to first item
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(options[0]).toHaveAttribute("aria-selected", "true");

    // Arrow down to second item
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(options[1]).toHaveAttribute("aria-selected", "true");

    // Arrow up back to first
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(options[0]).toHaveAttribute("aria-selected", "true");

    // Enter to select
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onPick).toHaveBeenCalledWith(MOCK_OPTIONS[0]);
  });

  it("closes dropdown on Escape", () => {
    render(<ShimmerInput placeholder="Search" options={MOCK_OPTIONS} />);
    const input = screen.getByPlaceholderText("Search");

    fireEvent.focus(input);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
