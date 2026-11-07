import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "../input";
import { Textarea } from "../textarea";

describe("Input component", () => {
  it("renders with default attributes and styles", () => {
    render(<Input placeholder="Enter flight number" />);
    const input = screen.getByPlaceholderText("Enter flight number");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("rounded-xl");
    expect(input).toHaveClass("border-input");
  });

  it("applies Al-Annabi focus ring classes without double border clipping", () => {
    render(<Input placeholder="Focus test" />);
    const input = screen.getByPlaceholderText("Focus test");
    expect(input).toHaveClass("focus-visible:outline-none");
    expect(input).toHaveClass("focus-visible:ring-2");
    expect(input).toHaveClass("focus-visible:ring-ring");
    expect(input).toHaveClass("focus-visible:ring-offset-2");
    expect(input).toHaveClass("focus-visible:ring-offset-background");
  });

  it("does not apply monospace styling by default", () => {
    render(<Input placeholder="Standard text" />);
    const input = screen.getByPlaceholderText("Standard text");
    expect(input).not.toHaveClass("font-mono");
    expect(input).not.toHaveClass("tabular-nums");
  });

  it("applies tabular monospace font when mono is true for callsigns, ICAO codes, and flight levels", () => {
    render(<Input mono placeholder="QTR101" />);
    const input = screen.getByPlaceholderText("QTR101");
    expect(input).toHaveClass("font-mono");
    expect(input).toHaveClass("tabular-nums");
  });

  it("handles user typing and change events", () => {
    const handleChange = vi.fn();
    render(<Input placeholder="Callsign" onChange={handleChange} />);
    const input = screen.getByPlaceholderText("Callsign");
    fireEvent.change(input, { target: { value: "QTR843" } });
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue("QTR843");
  });

  it("respects the disabled state", () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText("Disabled input");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:cursor-not-allowed");
    expect(input).toHaveClass("disabled:opacity-50");
  });

  it("forwards ref to the native input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.placeholder).toBe("Ref test");
  });

  it("merges custom classNames cleanly", () => {
    render(<Input className="custom-test-class" placeholder="Custom" />);
    const input = screen.getByPlaceholderText("Custom");
    expect(input).toHaveClass("custom-test-class");
    expect(input).toHaveClass("rounded-xl");
  });
});

describe("Textarea component", () => {
  it("renders with default attributes and styles", () => {
    render(<Textarea placeholder="Enter flight briefing remarks" />);
    const textarea = screen.getByPlaceholderText("Enter flight briefing remarks");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass("rounded-xl");
    expect(textarea).toHaveClass("min-h-[80px]");
    expect(textarea).toHaveClass("focus-visible:ring-ring");
  });

  it("applies tabular monospace font when mono is true", () => {
    render(<Textarea mono placeholder="Route waypoints: OTHH DOH DCT DXB OMDB" />);
    const textarea = screen.getByPlaceholderText("Route waypoints: OTHH DOH DCT DXB OMDB");
    expect(textarea).toHaveClass("font-mono");
    expect(textarea).toHaveClass("tabular-nums");
  });

  it("handles text change on textarea", () => {
    const handleChange = vi.fn();
    render(<Textarea placeholder="Remarks" onChange={handleChange} />);
    const textarea = screen.getByPlaceholderText("Remarks");
    fireEvent.change(textarea, { target: { value: "Cleared direct OTHH" } });
    expect(handleChange).toHaveBeenCalled();
    expect(textarea).toHaveValue("Cleared direct OTHH");
  });

  it("forwards ref to the native textarea element", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} placeholder="Textarea ref" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
