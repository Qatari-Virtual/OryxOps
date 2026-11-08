import * as React from "react";
import { cn } from "@/lib/utils";

export type CardVariant = "default" | "accent-stripe" | "fleet";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  watermark?: string;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    "border-border bg-card text-card-foreground shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] backdrop-blur-md",
  "accent-stripe":
    "border-border border-l-4 border-l-brand bg-card text-card-foreground shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] backdrop-blur-md",
  fleet:
    "border-white/10 bg-[#4A0820] text-white shadow-md dark:border-white/10 dark:bg-[#380618]",
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", watermark, children, ...props }, ref) => {
    const displayWatermark =
      watermark ?? (variant === "fleet" ? "OTHH" : undefined);

    return (
      <div
        ref={ref}
        data-variant={variant}
        className={cn(
          "group/card relative rounded-xl border transition-all duration-200 overflow-hidden",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
        {displayWatermark && (
          <span
            data-watermark
            aria-hidden="true"
            className="pointer-events-none absolute right-4 -bottom-2 select-none font-mono text-5xl md:text-6xl font-black uppercase tracking-widest text-white/[0.04] dark:text-white/[0.04]"
          >
            {displayWatermark}
          </span>
        )}
      </div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-semibold text-base md:text-lg leading-tight tracking-tight text-foreground group-data-[variant=fleet]/card:text-white",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground group-data-[variant=fleet]/card:text-white/70",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
