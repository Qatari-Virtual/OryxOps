import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../select";

describe("Select Primitive Suite", () => {
  it("renders trigger with placeholder", () => {
    render(
      <Select defaultValue="all">
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an airline" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Airlines</SelectItem>
          <SelectItem value="qatar">Qatar Airways</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId("select-trigger");
    expect(trigger).toBeInTheDocument();
  });

  it("forwards ref to trigger element", () => {
    const triggerRef = React.createRef<HTMLButtonElement>();

    render(
      <Select>
        <SelectTrigger ref={triggerRef}>
          <SelectValue placeholder="Pick an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
  });
});
