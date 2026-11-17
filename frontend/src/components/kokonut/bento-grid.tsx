import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { CardVariant, CardProps } from "@/components/ui/card";

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
}

const gridColsMap: Record<1 | 2 | 3 | 4, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  ({ className, cols = 3, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-4 auto-rows-fr",
          gridColsMap[cols] ?? gridColsMap[3],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
BentoGrid.displayName = "BentoGrid";

export interface BentoCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2;
  title?: React.ReactNode;
  description?: React.ReactNode;
  value?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  trend?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: CardVariant;
  watermark?: string;
}

const colSpanMap: Record<1 | 2 | 3 | 4, string> = {
  1: "col-span-1",
  2: "col-span-1 md:col-span-2",
  3: "col-span-1 md:col-span-2 lg:col-span-3",
  4: "col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4",
};

const rowSpanMap: Record<1 | 2, string> = {
  1: "row-span-1",
  2: "row-span-2",
};

export const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  (
    {
      className,
      colSpan = 1,
      rowSpan = 1,
      title,
      description,
      value,
      icon,
      badge,
      trend,
      header,
      footer,
      variant = "default",
      watermark,
      children,
      ...props
    },
    ref
  ) => {
    const hasStructuredContent = Boolean(
      title || value || description || icon || badge || trend || header || footer
    );

    return (
      <Card
        ref={ref}
        variant={variant}
        watermark={watermark}
        className={cn(
          "flex flex-col justify-between p-5 transition-all duration-200 hover:border-brand/30 hover:shadow-sm",
          colSpanMap[colSpan] ?? colSpanMap[1],
          rowSpanMap[rowSpan] ?? rowSpanMap[1],
          className
        )}
        {...props}
      >
        {header && <div className="mb-3">{header}</div>}

        {hasStructuredContent && (
          <div className="flex flex-1 flex-col justify-between space-y-4">
            {/* Top Bar: Icon + Title + Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                {icon && (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-brand dark:text-brand-light">
                    {icon}
                  </span>
                )}
                {title && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
                    {title}
                  </span>
                )}
              </div>
              {badge && <div className="shrink-0">{badge}</div>}
            </div>

            {/* Middle: Metric Value + Trend */}
            {(value !== undefined || trend) && (
              <div className="space-y-1">
                {value !== undefined && (
                  <div className="text-2xl md:text-3xl font-extrabold font-mono tabular-nums tracking-tight text-foreground">
                    {value}
                  </div>
                )}
                {trend && <div className="text-xs">{trend}</div>}
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Custom children (if any) */}
        {children && (
          <div className={cn(hasStructuredContent && "mt-4")}>{children}</div>
        )}

        {/* Footer */}
        {footer && (
          <div className="mt-4 pt-3 border-t border-border/60 text-xs text-muted-foreground">
            {footer}
          </div>
        )}
      </Card>
    );
  }
);
BentoCard.displayName = "BentoCard";

export default BentoGrid;
