import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GlowCard } from "@/components/kokonut/glow-card";
import { CardTitle, CardDescription } from "@/components/ui/card";

describe("GlowCard (Kokonut UI)", () => {
  it("renders children with default variant, intensity and glow state", () => {
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

  it("renders a masked aurora wash with two blurred blobs", () => {
    const { container } = render(
      <GlowCard>
        <p>Active Telemetry</p>
      </GlowCard>
    );

    const wash = container.querySelector(".glow-card-wash");
    expect(wash).toBeInTheDocument();
    expect(wash).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".glow-card-blob-a")).toBeInTheDocument();
    expect(container.querySelector(".glow-card-blob-b")).toBeInTheDocument();
  });

  it("renders a compact content column without reserved whitespace", () => {
    const { container } = render(
      <GlowCard>
        <p>Compact Callout</p>
      </GlowCard>
    );

    const content = container.querySelector(".glow-card-content");
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass("px-5", "py-4");
    expect(content).not.toHaveClass("min-h-60", "justify-end");
  });

  it("supports variant prop ('default', 'tod', 'escalation') with distinct wash hues", () => {
    const { rerender, container } = render(
      <GlowCard data-testid="glow-card" variant="default">
        <span>Default Flight Card</span>
      </GlowCard>
    );
    expect(screen.getByTestId("glow-card")).toHaveAttribute(
      "data-variant",
      "default"
    );
    let blob = container.querySelector(".glow-card-blob-a") as HTMLElement;
    expect(blob.style.backgroundImage).toContain("--brand");

    rerender(
      <GlowCard data-testid="glow-card" variant="tod">
        <span>TOD Approaching</span>
      </GlowCard>
    );
    expect(screen.getByTestId("glow-card")).toHaveAttribute(
      "data-variant",
      "tod"
    );
    blob = container.querySelector(".glow-card-blob-a") as HTMLElement;
    expect(blob.style.backgroundImage).toContain("--brand-gold");

    rerender(
      <GlowCard data-testid="glow-card" variant="escalation">
        <span>Escalation Notice</span>
      </GlowCard>
    );
    expect(screen.getByTestId("glow-card")).toHaveAttribute(
      "data-variant",
      "escalation"
    );
    blob = container.querySelector(".glow-card-blob-a") as HTMLElement;
    expect(blob.style.backgroundImage).toContain("--destructive");
  });

  it("supports intensity options ('subtle', 'normal', 'strong') via wash opacity", () => {
    const { rerender, container } = render(
      <GlowCard data-testid="glow-card" intensity="subtle">
        <span>Subtle Glow</span>
      </GlowCard>
    );
    expect(screen.getByTestId("glow-card")).toHaveAttribute(
      "data-intensity",
      "subtle"
    );
    let wash = container.querySelector(".glow-card-wash") as HTMLElement;
    expect(wash.style.getPropertyValue("--glow-wash-opacity")).toBe("0.35");

    rerender(
      <GlowCard data-testid="glow-card" intensity="normal">
        <span>Normal Glow</span>
      </GlowCard>
    );
    expect(screen.getByTestId("glow-card")).toHaveAttribute(
      "data-intensity",
      "normal"
    );
    wash = container.querySelector(".glow-card-wash") as HTMLElement;
    expect(wash.style.getPropertyValue("--glow-wash-opacity")).toBe("0.55");

    rerender(
      <GlowCard data-testid="glow-card" intensity="strong">
        <span>Strong Glow</span>
      </GlowCard>
    );
    expect(screen.getByTestId("glow-card")).toHaveAttribute(
      "data-intensity",
      "strong"
    );
    wash = container.querySelector(".glow-card-wash") as HTMLElement;
    expect(wash.style.getPropertyValue("--glow-wash-opacity")).toBe("0.8");
  });

  it("drifts the wash only while glow is enabled", () => {
    const { container, rerender } = render(
      <GlowCard data-testid="glow-card">
        <span>Animated Wash</span>
      </GlowCard>
    );
    expect(container.querySelector(".glow-card-wash")).toHaveClass(
      "glow-card-drift"
    );

    rerender(
      <GlowCard data-testid="glow-card" glow={false}>
        <span>Static Wash</span>
      </GlowCard>
    );
    expect(screen.getByTestId("glow-card")).toHaveAttribute(
      "data-glow",
      "false"
    );
    const wash = container.querySelector(".glow-card-wash");
    expect(wash).toBeInTheDocument();
    expect(wash).not.toHaveClass("glow-card-drift");
  });

  it("plays a mount entrance animation only when entrance is enabled", () => {
    const { container, rerender } = render(
      <GlowCard data-testid="glow-card">
        <span>Calm Mount</span>
      </GlowCard>
    );
    expect(screen.getByTestId("glow-card")).not.toHaveClass("glow-card-enter");
    expect(screen.getByTestId("glow-card")).toHaveAttribute(
      "data-entrance",
      "false"
    );

    rerender(
      <GlowCard data-testid="glow-card" entrance>
        <span>Live Callout</span>
      </GlowCard>
    );
    expect(screen.getByTestId("glow-card")).toHaveClass("glow-card-enter");
    expect(screen.getByTestId("glow-card")).toHaveAttribute(
      "data-entrance",
      "true"
    );
    expect(container.querySelector(".glow-card-enter")).toBeInTheDocument();
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

  it("composes with CardTitle and CardDescription for quiet callouts", () => {
    render(
      <GlowCard variant="tod">
        <CardTitle>Top of Descent</CardTitle>
        <CardDescription>QR843 begins descent in 02:45.</CardDescription>
      </GlowCard>
    );

    expect(screen.getByText("Top of Descent")).toBeInTheDocument();
    expect(
      screen.getByText("QR843 begins descent in 02:45.")
    ).toBeInTheDocument();
  });
});
