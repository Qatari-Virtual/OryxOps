import * as React from "react";
import { cn } from "@/lib/utils";

export type FlightStatus = "airborne" | "radar" | "tod" | "stopped" | "parked";

const statusConfig: Record<
  FlightStatus,
  { code: string; label: string; color: string }
> = {
  airborne: {
    code: "AIR",
    label: "Airborne",
    color: "bg-status-airborne",
  },
  radar: {
    code: "RAD",
    label: "Radar",
    color: "bg-status-radar",
  },
  tod: {
    code: "TOD",
    label: "TOD Advisory",
    color: "bg-status-tod",
  },
  stopped: {
    code: "STOP",
    label: "Stopped",
    color: "bg-status-stopped",
  },
  parked: {
    code: "PARK",
    label: "Parked",
    color: "bg-status-parked",
  },
};

export interface StatusDotProps {
  status: FlightStatus;
  className?: string;
  label?: string;
}

export function StatusDot({ status, className, label }: StatusDotProps) {
  const config = statusConfig[status];

  return (
    <span
      role="img"
      aria-label={label ?? config.label}
      className={cn(
        "inline-block h-1.5 w-1.5 shrink-0 rounded-full",
        config.color,
        className,
      )}
    />
  );
}

export interface StatusPillProps {
  status: FlightStatus;
  label?: string;
  className?: string;
}

export function StatusPill({ status, label, className }: StatusPillProps) {
  const config = statusConfig[status];

  return (
    <span
      role="status"
      aria-label={label ?? config.label}
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-border/70 bg-muted/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground",
        className,
      )}
    >
      <StatusDot status={status} />
      <span className="tabular-nums">{label ?? config.code}</span>
    </span>
  );
}
