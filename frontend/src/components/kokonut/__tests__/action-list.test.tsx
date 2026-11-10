import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ActionList, type ActionListItem } from "../action-list";

const items: ActionListItem[] = [
  { id: "a350", label: "Airbus A350-900", description: "Qatar Airways", badge: "A359" },
  { id: "b777", label: "Boeing 777-300ER", description: "Qatar Airways", badge: "B77W" },
  { id: "a320", label: "Airbus A320", description: "Qatar Airways", badge: "A320" },
];

describe("ActionList", () => {
  it("renders all available items and badges", () => {
    render(<ActionList items={items} onSelect={vi.fn()} />);

    expect(screen.getByText("Airbus A350-900")).toBeInTheDocument();
    expect(screen.getByText("Boeing 777-300ER")).toBeInTheDocument();
    expect(screen.getByText("A359")).toBeInTheDocument();
    expect(screen.getByText("B77W")).toBeInTheDocument();
  });

  it("selects an item when clicked", () => {
    const onSelect = vi.fn();
    render(<ActionList items={items} onSelect={onSelect} />);

    fireEvent.click(screen.getByText("Boeing 777-300ER"));

    expect(onSelect).toHaveBeenCalledWith(items[1]);
  });

  it("moves the active item down with ArrowDown", () => {
    render(<ActionList items={items} onSelect={vi.fn()} />);

    const listbox = screen.getByRole("listbox");
    fireEvent.keyDown(listbox, { key: "ArrowDown" });

    expect(screen.getByText("Boeing 777-300ER").closest('[role="option"]'))
      .toHaveAttribute("aria-selected", "true");
  });

  it("moves the active item up with ArrowUp", () => {
    render(
      <ActionList
        items={items}
        onSelect={vi.fn()}
        defaultActiveId="b777"
      />
    );

    const listbox = screen.getByRole("listbox");
    fireEvent.keyDown(listbox, { key: "ArrowUp" });

    expect(screen.getByText("Airbus A350-900").closest('[role="option"]'))
      .toHaveAttribute("aria-selected", "true");
  });

  it("selects the active item with Enter", () => {
    const onSelect = vi.fn();
    render(<ActionList items={items} onSelect={onSelect} />);

    fireEvent.keyDown(screen.getByRole("listbox"), { key: "Enter" });

    expect(onSelect).toHaveBeenCalledWith(items[0]);
  });

  it("skips disabled items during keyboard navigation", () => {
    const disabledItems: ActionListItem[] = [
      items[0],
      { id: "disabled", label: "Unavailable aircraft", disabled: true },
      items[2],
    ];

    render(<ActionList items={disabledItems} onSelect={vi.fn()} />);

    fireEvent.keyDown(screen.getByRole("listbox"), { key: "ArrowDown" });

    expect(screen.getByText("Airbus A320").closest('[role="option"]'))
      .toHaveAttribute("aria-selected", "true");
  });

  it("does not select disabled items when clicked", () => {
    const onSelect = vi.fn();
    const disabledItems: ActionListItem[] = [
      { id: "disabled", label: "Unavailable aircraft", disabled: true },
    ];

    render(<ActionList items={disabledItems} onSelect={onSelect} />);

    fireEvent.click(screen.getByText("Unavailable aircraft"));

    expect(onSelect).not.toHaveBeenCalled();
  });
});
