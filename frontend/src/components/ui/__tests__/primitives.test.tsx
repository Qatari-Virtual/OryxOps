import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
import { Skeleton } from "../skeleton";
import { Progress } from "../progress";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../accordion";
import { VerticalTimeline, TimelineItem } from "../timeline";

describe("Tooltip", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("appears on hover after the 200ms delay", async () => {
    vi.useFakeTimers();

    render(
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger>VNAV</TooltipTrigger>
          <TooltipContent>Vertical Navigation</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByRole("button", { name: "VNAV" });

    fireEvent.pointerMove(trigger, { pointerType: "mouse" });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });

    expect(screen.getByRole("tooltip")).toHaveTextContent(
      "Vertical Navigation"
    );
  });

  it("opens when the trigger receives keyboard focus", async () => {
    vi.useFakeTimers();

    render(
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger>ACARS</TooltipTrigger>
          <TooltipContent>Aircraft Communications Addressing</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    fireEvent.focus(screen.getByRole("button", { name: "ACARS" }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });
});

describe("Skeleton", () => {
  it("renders with a subtle pulse animation", () => {
    const { container } = render(<Skeleton />);

    expect(container.firstChild).toHaveClass("animate-pulse");
    expect(container.firstChild).toHaveClass("bg-muted/60");
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("supports custom class names", () => {
    const { container } = render(<Skeleton className="h-10 w-full" />);

    expect(container.firstChild).toHaveClass("h-10", "w-full");
  });
});

describe("Progress", () => {
  it("renders the correct progress percentage", () => {
    render(<Progress value={65} />);

    const progress = screen.getByRole("progressbar");

    expect(progress).toHaveAttribute("aria-valuenow", "65");
    expect(progress).toHaveAttribute("aria-valuemax", "100");
    expect(progress.firstChild).toHaveStyle({ width: "65%" });
  });

  it("supports a custom maximum value", () => {
    render(<Progress value={40} max={80} />);

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "40"
    );
    expect(screen.getByRole("progressbar").firstChild).toHaveStyle({
      width: "50%",
    });
  });

  it("clamps values above the maximum", () => {
    render(<Progress value={150} />);

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100"
    );
    expect(screen.getByRole("progressbar").firstChild).toHaveStyle({
      width: "100%",
    });
  });

  it("supports custom indicator styling", () => {
    render(<Progress value={50} indicatorClassName="custom-indicator" />);

    expect(screen.getByRole("progressbar").firstChild).toHaveClass(
      "custom-indicator"
    );
  });
});

describe("Accordion", () => {
  it("starts closed and expands when its trigger is clicked", () => {
    render(
      <Accordion>
        <AccordionItem>
          <AccordionTrigger>Flight briefing remarks</AccordionTrigger>
          <AccordionContent>
            Check the weather and NOTAMs before departure.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole("button", {
      name: "Flight briefing remarks",
    });

    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByText("Check the weather and NOTAMs before departure.")
    ).toBeVisible();
    expect(trigger.querySelector("svg")).toHaveClass("rotate-180");
  });

  it("supports items that are open by default", () => {
    render(
      <Accordion>
        <AccordionItem defaultOpen>
          <AccordionTrigger>Aircraft specifications</AccordionTrigger>
          <AccordionContent>Airbus A350-900</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(
      screen.getByRole("button", { name: "Aircraft specifications" })
    ).toHaveAttribute("aria-expanded", "true");

    expect(screen.getByText("Airbus A350-900")).toBeVisible();
  });
});

describe("VerticalTimeline", () => {
  it("renders chronological event cards and their statuses", () => {
    render(
      <VerticalTimeline>
        <TimelineItem
          title="Flight requested"
          description="Pilot submitted a flight request."
          timestamp="10:00 UTC"
          status="completed"
        />
        <TimelineItem
          title="Aircraft assigned"
          description="Aircraft registration A7-ABC assigned."
          timestamp="10:05 UTC"
          status="active"
        />
        <TimelineItem
          title="Flight completed"
          timestamp="Pending"
          status="pending"
        />
      </VerticalTimeline>
    );

    expect(screen.getByText("Flight requested")).toBeInTheDocument();
    expect(screen.getByText("Aircraft assigned")).toBeInTheDocument();
    expect(screen.getByText("Flight completed")).toBeInTheDocument();

    expect(screen.getByText("10:00 UTC")).toBeInTheDocument();
    expect(screen.getByText("10:05 UTC")).toBeInTheDocument();

    expect(screen.getByLabelText("completed")).toBeInTheDocument();
    expect(screen.getByLabelText("active")).toBeInTheDocument();
    expect(screen.getByLabelText("pending")).toBeInTheDocument();
  });

  it("renders the continuous burgundy timeline spine", () => {
    const { container } = render(
      <VerticalTimeline>
        <TimelineItem title="ACARS received" status="completed" />
        <TimelineItem title="Aircraft departed" status="active" />
      </VerticalTimeline>
    );

    const spine = container.querySelector(
      '[aria-hidden="true"]'
    );

    expect(spine).toHaveClass("bg-[#6A0C2C]/60");
    expect(spine).toHaveClass("absolute");
  });

  it("supports the error status", () => {
    render(
      <VerticalTimeline>
        <TimelineItem title="Transmission failed" status="error" />
      </VerticalTimeline>
    );

    expect(screen.getByLabelText("error")).toBeInTheDocument();
  });
});