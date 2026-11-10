import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as React from "react";
import { ShimmerInput } from "../shimmer-input";
import { RiPlaneLine } from "@remixicon/react";

describe("ShimmerInput", () => {
  it("renders with search icon and placeholder", () => {
    render(<ShimmerInput placeholder="Search pilot, callsign, or airport (e.g. OTHH)..." />);

    const input = screen.getByPlaceholderText(
      "Search pilot, callsign, or airport (e.g. OTHH)..."
    );
    expect(input).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("updates value and calls onChange when typed into", () => {
    const onChange = vi.fn();
    render(<ShimmerInput placeholder="Search" onChange={onChange} />);

    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "QTR843" } });

    expect(onChange).toHaveBeenCalled();
    expect(input).toHaveValue("QTR843");
  });

  it("activates shimmer state on focus and input", () => {
    const { container } = render(<ShimmerInput placeholder="Search" />);

    const input = screen.getByPlaceholderText("Search");
    const shimmerContainer = container.querySelector("[data-shimmer]");
    expect(shimmerContainer).toHaveAttribute("data-shimmer", "false");

    // Focus activates shimmer
    fireEvent.focus(input);
    expect(shimmerContainer).toHaveAttribute("data-shimmer", "true");

    // Blur without text deactivates shimmer
    fireEvent.blur(input);
    expect(shimmerContainer).toHaveAttribute("data-shimmer", "false");

    // Typing activates shimmer even after blur
    fireEvent.change(input, { target: { value: "OTHH" } });
    expect(shimmerContainer).toHaveAttribute("data-shimmer", "true");
    fireEvent.blur(input);
    expect(shimmerContainer).toHaveAttribute("data-shimmer", "true");
  });

  it("shows clean clear button [x] when input has text and resets on click", () => {
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
});
