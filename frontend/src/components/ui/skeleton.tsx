import * as React from "react";

import { cn } from "@/lib/utils";

const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    data-slot="skeleton"
    className={cn(
      "animate-pulse rounded-md bg-muted/60",
      className
    )}
    {...props}
  />
));

Skeleton.displayName = "Skeleton";

export { Skeleton };