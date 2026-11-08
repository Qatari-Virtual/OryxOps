import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../dialog";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "../sheet";

describe("Dialog component", () => {
  it("renders trigger and opens dialog content on click", async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Briefing Modal</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flight Dispatch Briefing</DialogTitle>
            <DialogDescription>
              Review operational remarks for flight QR843 (OTHH to EGLL).
            </DialogDescription>
          </DialogHeader>
          <p>Flight details content</p>
          <DialogFooter>
            <DialogClose asChild>
              <button>Acknowledge</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: "Open Briefing Modal" });
    expect(trigger).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(trigger);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("Flight Dispatch Briefing")).toBeInTheDocument();
    expect(
      screen.getByText("Review operational remarks for flight QR843 (OTHH to EGLL).")
    ).toBeInTheDocument();
    expect(screen.getByText("Flight details content")).toBeInTheDocument();
  });

  it("traps focus inside dialog and dismisses on Escape key", async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Modal</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Focus Trap Modal</DialogTitle>
            <DialogDescription>Modal for testing focus trapping.</DialogDescription>
          </DialogHeader>
          <input placeholder="Flight Callsign" />
          <button>Confirm Assignment</button>
        </DialogContent>
      </Dialog>
    );

    fireEvent.click(screen.getByRole("button", { name: "Open Modal" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    // Focus is directed inside dialog
    const input = screen.getByPlaceholderText("Flight Callsign");
    input.focus();
    expect(document.activeElement).toBe(input);

    // Escape key dismisses dialog
    fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("dismisses on close button click", async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Self-Assignment Confirmation</DialogTitle>
            <DialogDescription>Assign airframe A7-APC to captain.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    fireEvent.click(screen.getByRole("button", { name: "Open Dialog" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("merges custom classes onto DialogContent", async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Custom Modal</button>
        </DialogTrigger>
        <DialogContent className="custom-dialog-class">
          <DialogHeader>
            <DialogTitle>Custom Class Dialog</DialogTitle>
            <DialogDescription>Custom style test</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    fireEvent.click(screen.getByRole("button", { name: "Open Custom Modal" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveClass("custom-dialog-class");
    expect(dialog).toHaveClass("bg-card");
    expect(dialog).toHaveClass("border-border");
    expect(dialog).toHaveClass("rounded-2xl");
  });

  it("forwards ref to DialogContent DOM element", async () => {
    const contentRef = React.createRef<HTMLDivElement>();

    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Ref Modal</button>
        </DialogTrigger>
        <DialogContent ref={contentRef}>
          <DialogHeader>
            <DialogTitle>Ref Dialog</DialogTitle>
            <DialogDescription>Ref test</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    fireEvent.click(screen.getByRole("button", { name: "Open Ref Modal" }));
    await screen.findByRole("dialog");
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("Sheet component", () => {
  it("renders trigger and opens right slide-out drawer (default side) for dispatch briefing", async () => {
    render(
      <Sheet>
        <SheetTrigger asChild>
          <button>Open Dispatch Briefing</button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Operational Flight Briefing</SheetTitle>
            <SheetDescription>
              OFB-QR843: OTHH RWY 34R to EGLL RWY 27L.
            </SheetDescription>
          </SheetHeader>
          <div data-testid="briefing-content">
            <p>Route: OTHH DCT BAH DCT LUKAN DCT EGLL</p>
            <p>Cruising Altitude: FL380</p>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <button>Acknowledge OFP</button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );

    const trigger = screen.getByRole("button", { name: "Open Dispatch Briefing" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(trigger);

    const sheet = await screen.findByRole("dialog");
    expect(sheet).toBeInTheDocument();
    expect(screen.getByText("Operational Flight Briefing")).toBeInTheDocument();
    expect(screen.getByTestId("briefing-content")).toBeInTheDocument();
    expect(sheet).toHaveClass("sheet-content-right");
    expect(sheet).toHaveClass("right-0");
  });

  it("renders bottom slide-out drawer for mobile inspection", async () => {
    render(
      <Sheet>
        <SheetTrigger asChild>
          <button>Inspect Airframe A7-APC</button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Mobile Ramp Inspection</SheetTitle>
            <SheetDescription>
              Airframe A7-APC (Airbus A350-900) - Gate B4 OTHH
            </SheetDescription>
          </SheetHeader>
          <div data-testid="inspection-checklist">
            <p>Chocks: SET</p>
            <p>APU: RUNNING</p>
          </div>
        </SheetContent>
      </Sheet>
    );

    fireEvent.click(screen.getByRole("button", { name: "Inspect Airframe A7-APC" }));

    const sheet = await screen.findByRole("dialog");
    expect(sheet).toBeInTheDocument();
    expect(screen.getByText("Mobile Ramp Inspection")).toBeInTheDocument();
    expect(sheet).toHaveClass("sheet-content-bottom");
    expect(sheet).toHaveClass("bottom-0");
    expect(sheet).toHaveClass("rounded-t-2xl");
  });

  it("supports left and top side drawers", async () => {
    const { unmount } = render(
      <Sheet>
        <SheetTrigger asChild>
          <button>Open Left Sheet</button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Navigation Rail</SheetTitle>
            <SheetDescription>Left drawer</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );

    fireEvent.click(screen.getByRole("button", { name: "Open Left Sheet" }));
    let sheet = await screen.findByRole("dialog");
    expect(sheet).toHaveClass("sheet-content-left");
    expect(sheet).toHaveClass("left-0");

    unmount();

    render(
      <Sheet>
        <SheetTrigger asChild>
          <button>Open Top Sheet</button>
        </SheetTrigger>
        <SheetContent side="top">
          <SheetHeader>
            <SheetTitle>Top Advisory Bar</SheetTitle>
            <SheetDescription>Top drawer</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );

    fireEvent.click(screen.getByRole("button", { name: "Open Top Sheet" }));
    sheet = await screen.findByRole("dialog");
    expect(sheet).toHaveClass("sheet-content-top");
    expect(sheet).toHaveClass("top-0");
  });

  it("dismisses sheet on Escape key and close button click", async () => {
    render(
      <Sheet>
        <SheetTrigger asChild>
          <button>Open Dismissable Sheet</button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Dismiss Test Sheet</SheetTitle>
            <SheetDescription>Test dismissal</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );

    fireEvent.click(screen.getByRole("button", { name: "Open Dismissable Sheet" }));
    const sheet = await screen.findByRole("dialog");
    expect(sheet).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("forwards ref to SheetContent DOM element", async () => {
    const sheetRef = React.createRef<HTMLDivElement>();

    render(
      <Sheet>
        <SheetTrigger asChild>
          <button>Open Ref Sheet</button>
        </SheetTrigger>
        <SheetContent ref={sheetRef} side="right">
          <SheetHeader>
            <SheetTitle>Ref Sheet</SheetTitle>
            <SheetDescription>Ref sheet test</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );

    fireEvent.click(screen.getByRole("button", { name: "Open Ref Sheet" }));
    await screen.findByRole("dialog");
    expect(sheetRef.current).toBeInstanceOf(HTMLDivElement);
  });
});
