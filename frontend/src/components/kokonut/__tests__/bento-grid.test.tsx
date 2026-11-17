import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BentoGrid, BentoCard } from "../bento-grid";
import { RiPlaneLine, RiAlertLine, RiDashboardLine } from "@remixicon/react";

describe("BentoGrid & BentoCard Suite", () => {
  describe("BentoGrid Container", () => {
    it("renders grid container with default responsive grid classes", () => {
      const { container } = render(
        <BentoGrid data-testid="bento-grid">
          <div>Card 1</div>
          <div>Card 2</div>
        </BentoGrid>
      );

      const grid = screen.getByTestId("bento-grid");
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass("grid");
      expect(grid).toHaveClass("grid-cols-1");
      expect(grid).toHaveClass("gap-4");
      // Responsive column classes
      expect(grid.className).toMatch(/md:grid-cols-2/);
      expect(grid.className).toMatch(/lg:grid-cols-3/);
    });

    it("supports custom column configurations via cols prop", () => {
      const { container } = render(
        <BentoGrid cols={4} data-testid="bento-grid-4">
          <div>Card</div>
        </BentoGrid>
      );

      const grid = screen.getByTestId("bento-grid-4");
      expect(grid.className).toMatch(/xl:grid-cols-4/);
    });

    it("forwards ref and merges custom className", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <BentoGrid ref={ref} className="custom-grid-class">
          <div>Child</div>
        </BentoGrid>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass("custom-grid-class");
      expect(ref.current).toHaveClass("grid");
    });
  });

  describe("BentoCard Layout & Span Configurations", () => {
    it("renders default single cell (col-span-1)", () => {
      render(
        <BentoCard
          title="Active Flights"
          value="14"
          data-testid="bento-card-default"
        />
      );

      const card = screen.getByTestId("bento-card-default");
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass("col-span-1");
    });

    it("supports colSpan=2 configuration", () => {
      render(
        <BentoCard
          colSpan={2}
          title="Wide Operational Strip"
          value="5,376 Routes"
          data-testid="bento-card-col2"
        />
      );

      const card = screen.getByTestId("bento-card-col2");
      expect(card.className).toMatch(/col-span-1/);
      expect(card.className).toMatch(/md:col-span-2/);
    });

    it("supports rowSpan=2 configuration", () => {
      render(
        <BentoCard
          rowSpan={2}
          title="Live ACARS Feed"
          data-testid="bento-card-row2"
        />
      );

      const card = screen.getByTestId("bento-card-row2");
      expect(card).toHaveClass("row-span-2");
    });

    it("supports simultaneous colSpan and rowSpan configurations", () => {
      render(
        <BentoCard
          colSpan={2}
          rowSpan={2}
          title="Primary Radar Matrix"
          data-testid="bento-card-col2-row2"
        />
      );

      const card = screen.getByTestId("bento-card-col2-row2");
      expect(card.className).toMatch(/md:col-span-2/);
      expect(card).toHaveClass("row-span-2");
    });
  });

  describe("BentoCard Slots & Operational Data Content", () => {
    it("renders structured slots: title, value, description, icon, badge, and footer", () => {
      render(
        <BentoCard
          title="Active Flights"
          value="14"
          description="Monitored in real-time via OryxGate"
          icon={<RiPlaneLine data-testid="plane-icon" className="h-5 w-5" />}
          badge={<span data-testid="airborne-badge">AIRBORNE</span>}
          footer={<span>Last sync: 14:32Z</span>}
          data-testid="bento-metric-card"
        />
      );

      expect(screen.getByText("Active Flights")).toBeInTheDocument();
      expect(screen.getByText("14")).toBeInTheDocument();
      expect(
        screen.getByText("Monitored in real-time via OryxGate")
      ).toBeInTheDocument();
      expect(screen.getByTestId("plane-icon")).toBeInTheDocument();
      expect(screen.getByTestId("airborne-badge")).toBeInTheDocument();
      expect(screen.getByText("Last sync: 14:32Z")).toBeInTheDocument();
    });

    it("renders value in tabular monospace typography for aviation numbers", () => {
      render(<BentoCard title="PIREPs Logged" value="124" />);

      const valueEl = screen.getByText("124");
      expect(valueEl.className).toContain("font-mono");
      expect(valueEl.className).toContain("tabular-nums");
    });

    it("renders children directly for custom composable bento layouts", () => {
      render(
        <BentoCard data-testid="custom-children-card">
          <div data-testid="custom-child">Custom Content Inside Bento</div>
        </BentoCard>
      );

      expect(screen.getByTestId("custom-child")).toBeInTheDocument();
      expect(
        screen.getByText("Custom Content Inside Bento")
      ).toBeInTheDocument();
    });

    it("forwards ref to the underlying card element", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <BentoCard ref={ref} title="Referenced Card" value="100" />
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("handles click events and interactive states", () => {
      const handleClick = vi.fn();
      render(
        <BentoCard
          title="Interactive Tile"
          value="Clickable"
          onClick={handleClick}
          role="button"
          tabIndex={0}
        />
      );

      const card = screen.getByRole("button");
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("supports Card variants like accent-stripe and fleet", () => {
      const { container: stripeContainer } = render(
        <BentoCard
          variant="accent-stripe"
          title="TOD Alert"
          value="1"
          data-testid="stripe-bento-card"
        />
      );
      const stripeCard = screen.getByTestId("stripe-bento-card");
      expect(stripeCard).toHaveAttribute("data-variant", "accent-stripe");
      expect(stripeCard).toHaveClass("border-l-4");
      expect(stripeCard).toHaveClass("border-l-brand");

      const { container: fleetContainer } = render(
        <BentoCard
          variant="fleet"
          title="Fleet Roster"
          value="8"
          data-testid="fleet-bento-card"
        />
      );
      const fleetCard = screen.getByTestId("fleet-bento-card");
      expect(fleetCard).toHaveAttribute("data-variant", "fleet");
      expect(fleetCard).toHaveClass("bg-[#4A0820]");
    });
  });
});
