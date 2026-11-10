import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GlowCard } from "@/components/kokonut/glow-card";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

describe("GlowCard (Kokonut UI)", () => {
  it("renders children and default classes cleanly", () => {
    render(
      <GlowCard data-testid="glow-card">
        <div>Operational Callout Content</div>
      </GlowCard>
    );

    const card = screen.getByTestId("glow-card");
    expect(card).toBeInTheDocument();
    expect(screen.getByText("Operational Callout Content")).toBeInTheDocument();
    expect(card).toHaveAttribute("data-variant", "default");
    expect(card).toHaveAttribute("data-intensity", "subtle");
    expect(card).toHaveAttribute("data-glow", "true");
  });

  it("renders hardware-accelerated animated border and ambient layers", () => {
    const { container } = render(
      <GlowCard>
        <p>Active Telemetry</p>
      </GlowCard>
    );

    const gradientEl = container.querySelector(".glow-card-gradient");
    const ambientEl = container.querySelector(".glow-card-ambient");

    expect(gradientEl).toBeInTheDocument();
    expect(ambientEl).toBeInTheDocument();
  });

  it("supports variant prop ('default', 'tod', 'escalation')", () => {
    const { rerender } = render(
      <GlowCard data-testid="glow-card" variant="default">
        <span>Default Flight Card</span>
      </GlowCard>
    );
    expect(screen.getByTestId("glow-card")).toHaveAttribute(
      "data-variant",
      "default"
    );

    rerender(
      <GlowCard data-testid="glow-card" variant="tod">
        <span>TOD Approaching</span>
      </GlowCard>
    );
    expect(screen.getByTestId("glow-card")).toHaveAttribute(
      "data-variant",
      "tod"
    );

    rerender(
      <GlowCard data-testid="glow-card" variant="escalation">
        <span>Escalation Notice</span>
      </GlowCard>
    );
    expect(screen.getByTestId("glow-card")).toHaveAttribute(
      "data-variant",
      "escalation"
    );
  });

  it("supports intensity options ('subtle', 'normal', 'strong') and sets intensity-specific opacity properties", () => {
    const { rerender, container } = render(
      <GlowCard data-testid="glow-card" intensity="subtle">
        <span>Subtle Glow</span>
      </GlowCard>
    );
    expect(screen.getByTestId("glow-card")).toHaveAttribute(
      "data-intensity",
      "subtle"
    );
    let ambient = container.querySelector(".glow-card-ambient") as HTMLElement;
    expect(ambient.style.getPropertyValue("--glow-opacity-min")).toBe("0.15");
    expect(ambient.style.getPropertyValue("--glow-opacity-max")).toBe("0.35");

    rerender(
      <GlowCard data-testid="glow-card" intensity="normal">
        <span>Normal Glow</span>
      </GlowCard>
    );
    expect(screen.getByTestId("glow-card")).toHaveAttribute(
      "data-intensity",
      "normal"
    );
    ambient = container.querySelector(".glow-card-ambient") as HTMLElement;
    expect(ambient.style.getPropertyValue("--glow-opacity-min")).toBe("0.25");
    expect(ambient.style.getPropertyValue("--glow-opacity-max")).toBe("0.5");

    rerender(
      <GlowCard data-testid="glow-card" intensity="strong">
        <span>Strong Glow</span>
      </GlowCard>
    );
    expect(screen.getByTestId("glow-card")).toHaveAttribute(
      "data-intensity",
      "strong"
    );
    ambient = container.querySelector(".glow-card-ambient") as HTMLElement;
    expect(ambient.style.getPropertyValue("--glow-opacity-min")).toBe("0.4");
    expect(ambient.style.getPropertyValue("--glow-opacity-max")).toBe("0.7");
  });

  it("disables glow animation when glow is false", () => {
    const { container } = render(
      <GlowCard data-testid="glow-card" glow={false}>
        <span>Static Alert</span>
      </GlowCard>
    );

    const card = screen.getByTestId("glow-card");
    expect(card).toHaveAttribute("data-glow", "false");

    const gradientEl = container.querySelector(".glow-card-gradient");
    const ambientEl = container.querySelector(".glow-card-ambient");

    expect(gradientEl).not.toBeInTheDocument();
    expect(ambientEl).not.toBeInTheDocument();
  });

  it("renders custom badge when badge prop is provided", () => {
    render(
      <GlowCard
        badge={
          <span data-testid="custom-badge" className="text-xs font-bold">
            CRITICAL ADVISORY
          </span>
        }
      >
        <p>Aircraft A7-APC Escalate</p>
      </GlowCard>
    );

    const badge = screen.getByTestId("custom-badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("CRITICAL ADVISORY");
  });

  it("forwards ref and merges custom className", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <GlowCard ref={ref} className="custom-class-callout">
        <span>Ref Content</span>
      </GlowCard>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("custom-class-callout");
  });

  it("supports accessibility attributes like role='alert'", () => {
    render(
      <GlowCard role="alert" aria-live="polite" data-testid="alert-glow">
        <p>TOD Advisory: 18 NM to Top of Descent into OTHH</p>
      </GlowCard>
    );

    const alert = screen.getByTestId("alert-glow");
    expect(alert).toHaveAttribute("role", "alert");
    expect(alert).toHaveAttribute("aria-live", "polite");
    expect(
      screen.getByText("TOD Advisory: 18 NM to Top of Descent into OTHH")
    ).toBeInTheDocument();
  });

  it("composes seamlessly with CardHeader, CardTitle, CardDescription, and CardContent", () => {
    render(
      <GlowCard variant="tod">
        <CardHeader>
          <CardTitle>Top of Descent (TOD) Inbound</CardTitle>
          <CardDescription>
            Target altitude FL180 reaching DOH VOR
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-xs">COMMENCING DESCENT IN 04:30 MIN</p>
        </CardContent>
      </GlowCard>
    );

    expect(
      screen.getByText("Top of Descent (TOD) Inbound")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Target altitude FL180 reaching DOH VOR")
    ).toBeInTheDocument();
    expect(
      screen.getByText("COMMENCING DESCENT IN 04:30 MIN")
    ).toBeInTheDocument();
  });
});
