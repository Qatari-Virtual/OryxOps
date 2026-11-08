import * as React from "react";

import { cn } from "@/lib/utils";

type TimelineStatus = "completed" | "active" | "pending" | "error";

interface VerticalTimelineProps
  extends React.HTMLAttributes<HTMLDivElement> {}

interface TimelineItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  timestamp?: string;
  status?: TimelineStatus;
}

const statusStyles: Record<TimelineStatus, string> = {
  completed: "bg-emerald-500 border-emerald-500",
  active: "bg-[#6A0C2C] border-[#6A0C2C] ring-4 ring-[#6A0C2C]/15",
  pending: "bg-muted border-border",
  error: "bg-red-500 border-red-500",
};

const VerticalTimeline = React.forwardRef<
  HTMLDivElement,
  VerticalTimelineProps
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="vertical-timeline"
    className={cn("relative space-y-6", className)}
    {...props}
  >
    <div
      aria-hidden="true"
      className="absolute bottom-3 left-[11px] top-3 w-0.5 rounded-full bg-[#6A0C2C]/60"
    />
    {children}
  </div>
));

VerticalTimeline.displayName = "VerticalTimeline";

const TimelineItem = React.forwardRef<
  HTMLDivElement,
  TimelineItemProps
>(
  (
    {
      className,
      title,
      description,
      timestamp,
      status = "pending",
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      data-slot="timeline-item"
      data-status={status}
      className="relative flex gap-4"
      {...props}
    >
      <div className="relative z-10 flex w-6 shrink-0 justify-center pt-1">
        <span
          aria-label={status}
          className={cn(
            "h-3 w-3 rounded-full border-2 border-background",
            statusStyles[status]
          )}
        />
      </div>

      <div
        className={cn(
          "min-w-0 flex-1 rounded-xl border border-border bg-card p-4 shadow-sm",
          className
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">
            {title}
          </h3>

          {timestamp && (
            <time className="text-xs text-muted-foreground">
              {timestamp}
            </time>
          )}
        </div>

        {description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {children && (
          <div className="mt-3 text-sm text-muted-foreground">
            {children}
          </div>
        )}
      </div>
    </div>
  )
);

TimelineItem.displayName = "TimelineItem";

export { VerticalTimeline, TimelineItem };