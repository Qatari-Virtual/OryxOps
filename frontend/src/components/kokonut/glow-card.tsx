import * as React from "react";
import { cn } from "@/lib/utils";

export type GlowCardVariant = "default" | "tod" | "escalation";
export type GlowCardIntensity = "subtle" | "normal" | "strong";

export interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlowCardVariant;
  intensity?: GlowCardIntensity;
  glow?: boolean;
  badge?: React.ReactNode;
  as?: React.ElementType;
}

const variantGradients: Record<
  GlowCardVariant,
  {
    conic: string;
    radial: string;
  }
> = {
  default: {
    conic:
      "conic-gradient(from 0deg at 50% 50%, var(--brand, #6A0C2C) 0%, var(--brand-gold, #C5A059) 25%, var(--brand-dark, #4A0820) 50%, var(--brand-gold, #C5A059) 75%, var(--brand, #6A0C2C) 100%)",
    radial:
      "radial-gradient(circle at 50% 50%, var(--brand-gold, #C5A059) 0%, var(--brand, #6A0C2C) 50%, transparent 100%)",
  },
  tod: {
    conic:
      "conic-gradient(from 0deg at 50% 50%, var(--brand-gold, #C5A059) 0%, var(--brand, #6A0C2C) 30%, var(--brand-gold, #C5A059) 60%, var(--brand-light, #8A1840) 80%, var(--brand-gold, #C5A059) 100%)",
    radial:
      "radial-gradient(circle at 50% 50%, var(--brand-gold, #C5A059) 0%, var(--brand, #6A0C2C) 60%, transparent 100%)",
  },
  escalation: {
    conic:
      "conic-gradient(from 0deg at 50% 50%, var(--brand, #6A0C2C) 0%, var(--destructive, #be123c) 30%, var(--brand-gold, #C5A059) 55%, var(--brand-dark, #4A0820) 75%, var(--brand, #6A0C2C) 100%)",
    radial:
      "radial-gradient(circle at 50% 50%, var(--destructive, #be123c) 0%, var(--brand, #6A0C2C) 60%, transparent 100%)",
  },
};

const intensityStyles: Record<
  GlowCardIntensity,
  {
    gradientOpacity: string;
    ambientBlur: string;
    opacityMin: number;
    opacityMax: number;
  }
> = {
  subtle: {
    gradientOpacity: "opacity-70 dark:opacity-85",
    ambientBlur: "blur-xl",
    opacityMin: 0.15,
    opacityMax: 0.35,
  },
  normal: {
    gradientOpacity: "opacity-85 dark:opacity-95",
    ambientBlur: "blur-xl",
    opacityMin: 0.25,
    opacityMax: 0.5,
  },
  strong: {
    gradientOpacity: "opacity-100",
    ambientBlur: "blur-2xl",
    opacityMin: 0.4,
    opacityMax: 0.7,
  },
};

const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
  (
    {
      className,
      variant = "default",
      intensity = "subtle",
      glow = true,
      badge,
      children,
      as: Component = "div",
      ...props
    },
    ref
  ) => {
    const { conic, radial } = variantGradients[variant];
    const { gradientOpacity, ambientBlur, opacityMin, opacityMax } =
      intensityStyles[intensity];

    return (
      <Component
        ref={ref}
        data-variant={variant}
        data-intensity={intensity}
        data-glow={glow ? "true" : "false"}
        className={cn(
          "group/glow-card relative rounded-2xl p-[1.5px] overflow-hidden transition-all duration-300",
          className
        )}
        {...props}
      >
        {glow && (
          <>
            {/* Ambient Breathing Bloom Layer with Intensity-Specific Custom Properties */}
            <div
              aria-hidden="true"
              className={cn(
                "glow-card-ambient pointer-events-none absolute -inset-[20%]",
                ambientBlur
              )}
              style={
                {
                  backgroundImage: radial,
                  "--glow-opacity-min": opacityMin,
                  "--glow-opacity-max": opacityMax,
                } as React.CSSProperties
              }
            />

            {/* Hardware-Accelerated 360-degree Border Gradient */}
            <div
              aria-hidden="true"
              className={cn(
                "glow-card-gradient pointer-events-none absolute -inset-[100%] m-auto aspect-square",
                gradientOpacity
              )}
              style={{
                backgroundImage: conic,
              }}
            />
          </>
        )}

        {/* Fallback Static Border when Glow is Disabled */}
        {!glow && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl border border-border"
          />
        )}

        {/* Inner Content Card (Full Opacity & WCAG AA Contrast) */}
        <div className="relative z-10 flex h-full w-full flex-col rounded-[calc(1rem-1.5px)] bg-card text-card-foreground shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] backdrop-blur-md">
          {badge && (
            <div className="absolute top-4 right-4 z-20 pointer-events-none">
              {badge}
            </div>
          )}
          {children}
        </div>
      </Component>
    );
  }
);

GlowCard.displayName = "GlowCard";

export { GlowCard };
