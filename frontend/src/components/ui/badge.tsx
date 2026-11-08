import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        burgundy:
          "border-transparent bg-brand text-white",
        gold:
          "border-brand-gold/30 bg-brand-gold/15 text-brand-gold",
        airborne:
          "border-status-airborne/20 bg-status-airborne/10 text-status-airborne",
        radar:
          "border-status-radar/20 bg-status-radar/10 text-status-radar",
        tod:
          "border-status-tod/20 bg-status-tod/10 text-status-tod",
        stopped:
          "border-status-stopped/20 bg-status-stopped/10 text-status-stopped",
        parked:
          "border-status-parked/20 bg-status-parked/10 text-status-parked",
        outline:
          "border-border bg-transparent text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
