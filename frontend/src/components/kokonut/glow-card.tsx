import * as React from "react";
import { cn } from "@/lib/utils";

export type GlowCardVariant = "default" | "tod" | "escalation";
export type GlowCardIntensity = "subtle" | "normal" | "strong";

export interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlowCardVariant;
  intensity?: GlowCardIntensity;
  glow?: boolean;
  entrance?: boolean;
  as?: React.ElementType;
}

const variantWashes: Record<GlowCardVariant, { a: string; b: string }> = {
  default: {
    a: "var(--brand, #6A0C2C)",
    b: "var(--brand-gold, #C5A059)",
  },
  tod: {
    a: "var(--brand-gold, #C5A059)",
    b: "var(--brand-light, #8A1840)",
  },
  escalation: {
    a: "var(--destructive, #be123c)",
    b: "var(--brand, #6A0C2C)",
  },
};

const intensityOpacity: Record<GlowCardIntensity, number> = {
  subtle: 0.35,
  normal: 0.55,
  strong: 0.8,
};

const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
  (
    {
      className,
      variant = "default",
      intensity = "subtle",
      glow = true,
      entrance = false,
      children,
      as: Component = "div",
      ...props
    },
    ref
  ) => {
    const { a, b } = variantWashes[variant];

    return (
      <Component
        ref={ref}
        data-variant={variant}
        data-intensity={intensity}
        data-glow={glow ? "true" : "false"}
        data-entrance={entrance ? "true" : "false"}
        className={cn(
          "group/glow-card relative overflow-hidden rounded-xl border border-border bg-card text-card-foreground",
          entrance && "glow-card-enter",
          className
        )}
        {...props}
      >
        <div
          aria-hidden="true"
          className={cn(
            "glow-card-wash pointer-events-none absolute inset-0",
            glow && "glow-card-drift"
          )}
          style={
            {
              "--glow-wash-opacity": intensityOpacity[intensity],
            } as React.CSSProperties
          }
        >
          <div
            className="glow-card-blob glow-card-blob-a absolute -left-8 -top-10 h-24 w-2/3 rounded-full blur-3xl"
            style={{
              backgroundImage: `radial-gradient(closest-side, ${a}, transparent)`,
            }}
          />
          <div
            className="glow-card-blob glow-card-blob-b absolute -right-6 -top-12 h-28 w-3/5 rounded-full blur-3xl"
            style={{
              backgroundImage: `radial-gradient(closest-side, ${b}, transparent)`,
            }}
          />
        </div>

        <div className="glow-card-content relative flex flex-col gap-0.5 px-5 py-4">
          {children}
        </div>
      </Component>
    );
  }
);

GlowCard.displayName = "GlowCard";

export { GlowCard };
