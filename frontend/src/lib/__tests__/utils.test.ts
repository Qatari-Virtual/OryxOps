import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn utility helper - core clsx and tailwind-merge capabilities", () => {
  it("merges multiple string classnames correctly", () => {
    expect(cn("px-2", "py-1", "bg-brand")).toBe("px-2 py-1 bg-brand");
  });

  it("resolves tailwind duplicate conflicts correctly with condition", () => {
    const condition = true;
    expect(cn("px-2", condition && "px-4", "text-white")).toBe("px-4 text-white");
  });

  it("handles false conditional values without retaining conflict", () => {
    const condition = false;
    expect(cn("px-2", condition && "px-4", "text-white")).toBe("px-2 text-white");
  });

  it("filters out falsy values like undefined, null, false, and empty strings", () => {
    expect(cn("btn", undefined, null, false, "")).toBe("btn");
  });

  it("supports object and array syntax from clsx", () => {
    expect(
      cn("base-class", ["array-item-1", "array-item-2"], {
        "is-active": true,
        "is-disabled": false,
      })
    ).toBe("base-class array-item-1 array-item-2 is-active");
  });

  it("handles nested arrays and deep objects", () => {
    expect(
      cn(["flex", ["items-center", ["justify-between"]]], {
        "opacity-100": true,
        "opacity-0": false,
      })
    ).toBe("flex items-center justify-between opacity-100");
  });

  it("overrides conflicting tailwind classes with last-wins semantics", () => {
    expect(cn("text-red-500 bg-black", "text-blue-500")).toBe("bg-black text-blue-500");
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("m-4", "m-0")).toBe("m-0");
    expect(cn("block", "inline-block", "flex")).toBe("flex");
    expect(cn("font-sans", "font-serif", "font-mono")).toBe("font-mono");
    expect(cn("font-normal", "font-semibold", "font-bold")).toBe("font-bold");
  });
});

describe("cn utility helper - Qatar Al-Annabi brand tokens & conflict resolution", () => {
  it("resolves conflicting brand background utilities with last-wins semantics", () => {
    expect(cn("bg-brand", "bg-brand-dark")).toBe("bg-brand-dark");
    expect(cn("bg-brand-dark", "bg-brand-light")).toBe("bg-brand-light");
    expect(cn("bg-brand", "bg-brand-pale")).toBe("bg-brand-pale");
    expect(cn("bg-red-500", "bg-brand")).toBe("bg-brand");
  });

  it("resolves conflicting brand text color utilities with last-wins semantics", () => {
    expect(cn("text-brand", "text-brand-dark")).toBe("text-brand-dark");
    expect(cn("text-brand", "text-brand-gold")).toBe("text-brand-gold");
    expect(cn("text-white", "text-brand")).toBe("text-brand");
  });

  it("resolves conflicting brand border utilities with last-wins semantics", () => {
    expect(cn("border-brand", "border-brand-border")).toBe("border-brand-border");
    expect(cn("border-gray-200", "border-brand")).toBe("border-brand");
  });

  it("preserves responsive, pseudo-class, and dark variant modifiers without collision", () => {
    const evaluated = cn(
      "bg-brand",
      "dark:bg-brand-dark",
      "hover:bg-brand-light",
      "focus:ring-brand",
      "md:text-brand-gold"
    );
    expect(evaluated).toContain("bg-brand");
    expect(evaluated).toContain("dark:bg-brand-dark");
    expect(evaluated).toContain("hover:bg-brand-light");
    expect(evaluated).toContain("focus:ring-brand");
    expect(evaluated).toContain("md:text-brand-gold");
  });

  it("supports champagne gold glow utilities alongside brand elements", () => {
    const buttonClass = cn(
      "bg-brand",
      "text-brand-gold",
      "shadow-[0_0_15px_rgba(197,160,89,0.15)]",
      "border-brand-gold"
    );
    expect(buttonClass).toBe(
      "bg-brand text-brand-gold shadow-[0_0_15px_rgba(197,160,89,0.15)] border-brand-gold"
    );
  });
});

describe("cn utility helper - shadcn/ui semantic tokens & conflict resolution", () => {
  it("resolves semantic layout and card background classes", () => {
    expect(cn("bg-background", "bg-card")).toBe("bg-card");
    expect(cn("bg-card", "bg-popover")).toBe("bg-popover");
    expect(cn("bg-popover", "bg-muted")).toBe("bg-muted");
    expect(cn("bg-muted", "bg-accent")).toBe("bg-accent");
    expect(cn("bg-accent", "bg-secondary")).toBe("bg-secondary");
  });

  it("resolves semantic foreground and text color classes", () => {
    expect(cn("text-foreground", "text-muted-foreground")).toBe("text-muted-foreground");
    expect(cn("text-card-foreground", "text-destructive-foreground")).toBe("text-destructive-foreground");
    expect(cn("text-secondary-foreground", "text-accent-foreground")).toBe("text-accent-foreground");
  });

  it("resolves semantic border, input, and ring classes", () => {
    expect(cn("border-border", "border-input")).toBe("border-input");
    expect(cn("ring-ring", "ring-primary")).toBe("ring-primary");
  });

  it("resolves semantic radius classes with last-wins semantics", () => {
    expect(cn("rounded-sm", "rounded-md")).toBe("rounded-md");
    expect(cn("rounded-md", "rounded-lg")).toBe("rounded-lg");
    expect(cn("rounded-lg", "rounded-xl")).toBe("rounded-xl");
  });

  it("correctly merges composite shadcn button and card class combinations", () => {
    const cardClass = cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      "border-brand-border bg-brand-pale text-brand-dark"
    );
    expect(cardClass).toContain("rounded-lg");
    expect(cardClass).toContain("border");
    expect(cardClass).toContain("shadow-sm");
    expect(cardClass).toContain("border-brand-border");
    expect(cardClass).toContain("bg-brand-pale");
    expect(cardClass).toContain("text-brand-dark");
    expect(cardClass).not.toContain("bg-card");
    expect(cardClass).not.toContain("text-card-foreground");
  });
});

describe("cn utility helper - flight operations status tokens", () => {
  it("resolves airborne status tokens and overrides default states", () => {
    const flightState = "airborne";
    const statusBadge = cn(
      "bg-status-parked text-white",
      flightState === "airborne" && "bg-status-airborne text-status-airborne"
    );
    expect(statusBadge).toBe("bg-status-airborne text-status-airborne");
  });

  it("supports all flight status badge classes (airborne, radar, tod, stopped, parked)", () => {
    const states = [
      { status: "airborne", bg: "bg-status-airborne" },
      { status: "radar", bg: "bg-status-radar" },
      { status: "tod", bg: "bg-status-tod" },
      { status: "stopped", bg: "bg-status-stopped" },
      { status: "parked", bg: "bg-status-parked" },
    ];

    states.forEach(({ bg }) => {
      expect(cn("bg-muted", bg)).toBe(bg);
    });
  });

  it("resolves operational table header classes", () => {
    expect(cn("bg-table-header-bg text-table-header-fg")).toBe(
      "bg-table-header-bg text-table-header-fg"
    );
    expect(cn("bg-gray-100", "bg-table-header-bg")).toBe("bg-table-header-bg");
  });
});

describe("CSS variable classes DOM application & evaluation", () => {
  it("applies evaluated brand classes to DOM elements without error", () => {
    const el = document.createElement("div");
    el.className = cn(
      "bg-brand",
      "text-brand-gold",
      "border",
      "border-brand-border",
      "rounded-lg",
      "p-4"
    );
    document.body.appendChild(el);

    expect(el).toHaveClass("bg-brand");
    expect(el).toHaveClass("text-brand-gold");
    expect(el).toHaveClass("border-brand-border");
    expect(el).toHaveClass("rounded-lg");
    expect(el).toHaveClass("p-4");

    document.body.removeChild(el);
  });

  it("applies flight telemetry status classes to DOM badges cleanly", () => {
    const badge = document.createElement("span");
    badge.className = cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium",
      "bg-status-airborne text-status-airborne"
    );
    document.body.appendChild(badge);

    expect(badge).toHaveClass("bg-status-airborne");
    expect(badge).toHaveClass("text-status-airborne");
    expect(badge).toHaveClass("font-mono");

    document.body.removeChild(badge);
  });
});

describe("CSS theme variables verification in style.css", () => {
  let cssContent = "";

  it("reads style.css synchronously using fs in node test runner", async () => {
    // @ts-expect-error Dynamic import of Node.js builtin module in test runner
    const fs = await import("fs");
    // @ts-expect-error Dynamic import of Node.js builtin module in test runner
    const path = await import("path");

    const primaryPath = path.resolve("src/style.css");
    const fallbackPath = path.resolve("frontend/src/style.css");
    const cssPath = fs.existsSync(primaryPath) ? primaryPath : fallbackPath;
    cssContent = fs.readFileSync(cssPath, "utf-8");
    expect(cssContent.length).toBeGreaterThan(0);
  });

  it("declares @theme static block with all brand and shadcn color tokens", () => {
    const expectedThemeTokens = [
      "--color-brand: var(--brand);",
      "--color-brand-dark: var(--brand-dark);",
      "--color-brand-light: var(--brand-light);",
      "--color-brand-pale: var(--brand-pale);",
      "--color-brand-border: var(--brand-border);",
      "--color-brand-hover-bg: var(--brand-hover-bg);",
      "--color-brand-gold: var(--brand-gold);",
      "--color-brand-gold-glow: var(--brand-gold-glow);",
      "--color-background: var(--background);",
      "--color-foreground: var(--foreground);",
      "--color-card: var(--card);",
      "--color-card-foreground: var(--card-foreground);",
      "--color-popover: var(--popover);",
      "--color-popover-foreground: var(--popover-foreground);",
      "--color-primary: var(--primary);",
      "--color-primary-foreground: var(--primary-foreground);",
      "--color-secondary: var(--secondary);",
      "--color-secondary-foreground: var(--secondary-foreground);",
      "--color-muted: var(--muted);",
      "--color-muted-foreground: var(--muted-foreground);",
      "--color-accent: var(--accent);",
      "--color-accent-foreground: var(--accent-foreground);",
      "--color-destructive: var(--destructive);",
      "--color-destructive-foreground: var(--destructive-foreground);",
      "--color-border: var(--border);",
      "--color-input: var(--input);",
      "--color-ring: var(--ring);",
      "--color-status-airborne: var(--status-airborne);",
      "--color-status-radar: var(--status-radar);",
      "--color-status-tod: var(--status-tod);",
      "--color-status-stopped: var(--status-stopped);",
      "--color-status-parked: var(--status-parked);",
      "--color-table-header-bg: var(--table-header-bg);",
      "--color-table-header-fg: var(--table-header-fg);",
    ];

    expectedThemeTokens.forEach((token) => {
      expect(cssContent).toContain(token);
    });
  });

  it("declares :root light theme variables matching Qatar Airways Virtual brand specs", () => {
    const lightTokens = [
      "--brand: #6a0c2c;",
      "--brand-dark: #4a0820;",
      "--brand-light: #8a1840;",
      "--brand-pale: #fdf8f9;",
      "--brand-border: #ead9df;",
      "--brand-hover-bg: #f8f1f4;",
      "--brand-gold: #c5a059;",
      "--background: #fdf8f9;",
      "--card: #ffffff;",
      "--primary: #6a0c2c;",
      "--ring: #6a0c2c;",
      "--status-airborne: #10b981;",
      "--status-radar: #0284c7;",
      "--status-tod: #f59e0b;",
      "--status-stopped: #e11d48;",
      "--status-parked: #6366f1;",
      "--table-header-bg: #6a0c2c;",
    ];

    lightTokens.forEach((token) => {
      expect(cssContent).toContain(token);
    });
  });

  it("declares .dark dark theme variables matching Qatar Airways Virtual night cockpit specs", () => {
    const darkTokens = [
      "--brand: #a8244e;",
      "--brand-dark: #6a0c2c;",
      "--brand-light: #c23867;",
      "--brand-pale: #1a0e12;",
      "--brand-border: #3f1e29;",
      "--brand-hover-bg: #2b141c;",
      "--brand-gold: #e5c378;",
      "--background: #0d0e12;",
      "--card: #161920;",
      "--primary: #a8244e;",
      "--ring: #a8244e;",
      "--status-airborne: #34d399;",
      "--status-radar: #38bdf8;",
      "--status-tod: #fbbf24;",
      "--status-stopped: #fb7185;",
      "--status-parked: #818cf8;",
      "--table-header-bg: #4a0820;",
    ];

    darkTokens.forEach((token) => {
      expect(cssContent).toContain(token);
    });
  });

  it("declares semantic border radius tokens in @theme static", () => {
    expect(cssContent).toContain("--radius-sm: calc(var(--radius) - 4px);");
    expect(cssContent).toContain("--radius-md: calc(var(--radius) - 2px);");
    expect(cssContent).toContain("--radius-lg: var(--radius);");
    expect(cssContent).toContain("--radius-xl: calc(var(--radius) + 4px);");
  });
});

