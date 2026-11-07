import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../card";

describe("Card Primitive Suite", () => {
  describe("Subcomponent Structure & Rendering", () => {
    it("renders complete card composite with all subcomponents", () => {
      render(
        <Card data-testid="test-card">
          <CardHeader data-testid="test-header">
            <CardTitle data-testid="test-title">Flight Briefing</CardTitle>
            <CardDescription data-testid="test-desc">
              Operational NOTAMs for OTHH to EGLL
            </CardDescription>
          </CardHeader>
          <CardContent data-testid="test-content">
            <p>Cruising FL380, Step climb to FL400 at RIKET.</p>
          </CardContent>
          <CardFooter data-testid="test-footer">
            <span>Dispatch Signoff: DISP-402</span>
          </CardFooter>
        </Card>
      );

      expect(screen.getByTestId("test-card")).toBeInTheDocument();
      expect(screen.getByTestId("test-header")).toBeInTheDocument();
      expect(screen.getByTestId("test-title")).toHaveTextContent("Flight Briefing");
      expect(screen.getByTestId("test-desc")).toHaveTextContent(
        "Operational NOTAMs for OTHH to EGLL"
      );
      expect(screen.getByTestId("test-content")).toHaveTextContent(
        "Cruising FL380, Step climb to FL400 at RIKET."
      );
      expect(screen.getByTestId("test-footer")).toHaveTextContent(
        "Dispatch Signoff: DISP-402"
      );
    });

    it("forwards ref to underlying DOM elements", () => {
      const cardRef = React.createRef<HTMLDivElement>();
      const headerRef = React.createRef<HTMLDivElement>();
      const titleRef = React.createRef<HTMLHeadingElement>();
      const descRef = React.createRef<HTMLParagraphElement>();
      const contentRef = React.createRef<HTMLDivElement>();
      const footerRef = React.createRef<HTMLDivElement>();

      render(
        <Card ref={cardRef}>
          <CardHeader ref={headerRef}>
            <CardTitle ref={titleRef}>Ref Title</CardTitle>
            <CardDescription ref={descRef}>Ref Desc</CardDescription>
          </CardHeader>
          <CardContent ref={contentRef}>Ref Content</CardContent>
          <CardFooter ref={footerRef}>Ref Footer</CardFooter>
        </Card>
      );

      expect(cardRef.current).toBeInstanceOf(HTMLDivElement);
      expect(headerRef.current).toBeInstanceOf(HTMLDivElement);
      expect(titleRef.current).toBeInstanceOf(HTMLHeadingElement);
      expect(descRef.current).toBeInstanceOf(HTMLParagraphElement);
      expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
      expect(footerRef.current).toBeInstanceOf(HTMLDivElement);
    });

    it("merges custom classNames cleanly without clobbering base classes", () => {
      const { container } = render(
        <Card className="custom-card-class">
          <CardHeader className="custom-header">
            <CardTitle className="custom-title">Title</CardTitle>
            <CardDescription className="custom-desc">Desc</CardDescription>
          </CardHeader>
          <CardContent className="custom-content">Content</CardContent>
          <CardFooter className="custom-footer">Footer</CardFooter>
        </Card>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("custom-card-class");
      expect(card).toHaveClass("rounded-xl");
    });
  });

  describe("Variants", () => {
    it("renders default variant with hairline border and backdrop blur", () => {
      const { container } = render(
        <Card>
          <CardContent>Default Card</CardContent>
        </Card>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute("data-variant", "default");
      expect(card).toHaveClass("border");
      expect(card).toHaveClass("border-border");
      expect(card).toHaveClass("bg-card");
      expect(card).toHaveClass("text-card-foreground");
      expect(card).toHaveClass("backdrop-blur-md");
      expect(card).toHaveClass("rounded-xl");
    });

    it("renders accent-stripe variant with 4px left Al-Annabi burgundy bar without layout shift", () => {
      const { container } = render(
        <Card variant="accent-stripe">
          <CardHeader>
            <CardTitle>NOTAM Alert</CardTitle>
            <CardDescription>Runway 34R localizer degraded</CardDescription>
          </CardHeader>
        </Card>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute("data-variant", "accent-stripe");
      // Accent stripe 4px vertical Al-Annabi bar
      expect(card).toHaveClass("border-l-4");
      expect(card).toHaveClass("border-l-brand");
      // Retains standard hairline perimeter border
      expect(card).toHaveClass("border");
      expect(card).toHaveClass("border-border");
      // Does not render watermark by default
      expect(card.querySelector("[data-watermark]")).toBeNull();
    });

    it("renders fleet variant with deep burgundy canvas and contrast-compliant typography", () => {
      const { container } = render(
        <Card variant="fleet">
          <CardHeader>
            <CardTitle>Boeing 777-300ER</CardTitle>
            <CardDescription>Registration: A7-BAC</CardDescription>
          </CardHeader>
          <CardContent>Long-range flagship fleet operations</CardContent>
        </Card>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute("data-variant", "fleet");
      expect(card).toHaveClass("bg-[#4A0820]");
      expect(card).toHaveClass("text-white");

      // Auto-renders default ICAO watermark (OTHH)
      const watermark = card.querySelector("[data-watermark]");
      expect(watermark).toBeInTheDocument();
      expect(watermark).toHaveTextContent("OTHH");
      expect(watermark).toHaveAttribute("aria-hidden", "true");
      expect(watermark).toHaveClass("font-mono");
    });

    it("supports custom watermark code on fleet and custom cards", () => {
      const { container } = render(
        <Card variant="fleet" watermark="DOH">
          <CardHeader>
            <CardTitle>Fleet Hub</CardTitle>
          </CardHeader>
        </Card>
      );

      const card = container.firstChild as HTMLElement;
      const watermark = card.querySelector("[data-watermark]");
      expect(watermark).toBeInTheDocument();
      expect(watermark).toHaveTextContent("DOH");
    });

    it("allows watermark on any card when explicitly specified", () => {
      const { container } = render(
        <Card watermark="QTR">
          <CardContent>Watermarked default card</CardContent>
        </Card>
      );

      const card = container.firstChild as HTMLElement;
      const watermark = card.querySelector("[data-watermark]");
      expect(watermark).toBeInTheDocument();
      expect(watermark).toHaveTextContent("QTR");
    });
  });

  describe("Interactions & Accessibility", () => {
    it("handles click events and interactive attributes", () => {
      const handleClick = vi.fn();

      render(
        <Card
          onClick={handleClick}
          role="button"
          tabIndex={0}
          data-testid="interactive-card"
        >
          <CardContent>Clickable schedule card</CardContent>
        </Card>
      );

      const card = screen.getByTestId("interactive-card");
      expect(card).toHaveAttribute("role", "button");
      expect(card).toHaveAttribute("tabindex", "0");

      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("watermark element is aria-hidden so screen readers ignore background decoration", () => {
      render(
        <Card variant="fleet" watermark="OTHH">
          <CardContent>Content</CardContent>
        </Card>
      );

      const watermark = screen.getByText("OTHH");
      expect(watermark).toHaveAttribute("aria-hidden", "true");
      expect(watermark).toHaveClass("pointer-events-none");
    });
  });
});
