
import * as React from "react";
import {
  RiFlightTakeoffLine,
  RiFlightLandLine,
  RiPlaneLine,
  RiArrowUpLine,
  RiWindyLine,
  RiTimerLine,
} from "@remixicon/react";

import { cn } from "@/lib/utils";
import { GlowCard } from "@/components/kokonut/glow-card";
import {
  PhaseRail,
  type FlightPhase,
} from "@/components/kokonut/phase-rail";

export interface FlightTrackerHUDProps {
  origin?: string;
  destination?: string;
  progressPercent?: number;
  elapsedTime?: string;
  remainingTime?: string;
  currentAltitude?: number;
  targetAltitude?: number;
  stepClimbInMinutes?: number;
  distanceToTod?: number;
  groundSpeed?: number;
  trueAirspeed?: string;
  windDirection?: number;
  windSpeed?: number;
  windType?: "HEADWIND" | "TAILWIND" | "CROSSWIND";
  todEta?: string;
  currentPhase?: FlightPhase;
  onPhaseChange?: (phase: FlightPhase) => void;
  className?: string;
}

export function calculateTodEta(
  distanceNm: number,
  groundSpeedKts: number,
  now: Date = new Date(),
): string {
  if (
    groundSpeedKts <= 0 ||
    distanceNm < 0 ||
    !Number.isFinite(distanceNm) ||
    !Number.isFinite(groundSpeedKts)
  ) {
    return "--:--Z";
  }

  const minutesToTod = (distanceNm / groundSpeedKts) * 60;
  const eta = new Date(now.getTime() + minutesToTod * 60_000);

  return `${String(eta.getUTCHours()).padStart(2, "0")}:${String(
    eta.getUTCMinutes(),
  ).padStart(2, "0")}Z`;
}

export function FlightTrackerHUD({
  origin = "OTHH",
  destination = "EGLL",
  progressPercent = 64,
  elapsedTime = "05:10",
  remainingTime = "03:05",
  currentAltitude = 360,
  targetAltitude = 380,
  stepClimbInMinutes = 42,
  distanceToTod = 124,
  groundSpeed = 488,
  trueAirspeed = "M0.85",
  windDirection = 270,
  windSpeed = 34,
  windType = "HEADWIND",
  todEta,
  currentPhase = "Cruise",
  onPhaseChange,
  className,
}: FlightTrackerHUDProps) {
  const safeProgress = Math.min(100, Math.max(0, progressPercent));
  const isTodWarning = distanceToTod <= 150;
  const calculatedEta = todEta ?? calculateTodEta(distanceToTod, groundSpeed);

  return (
    <section
      aria-label="Flight tracker HUD"
      className={cn(
        "w-full min-w-0 space-y-6 rounded-2xl border border-border bg-card p-4 text-card-foreground sm:p-6",
        className,
      )}
    >
      {/* Route */}
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <RiFlightTakeoffLine className="shrink-0 text-lg text-brand" />
              <span className="font-mono text-2xl font-bold tracking-tight sm:text-3xl">
                {origin}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Departure</p>
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-center px-2">
            <span className="font-mono text-sm font-bold tabular-nums text-brand">
              {safeProgress.toFixed(0)}%
            </span>

            <div
              className="relative my-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
              aria-label="Route completion"
            >
              <div
                className="h-full rounded-full bg-brand transition-all duration-700 ease-out"
                style={{ width: `${safeProgress}%` }}
              />
            </div>

            <span className="text-[10px] text-muted-foreground">
              Flight progress
            </span>
          </div>

          <div className="min-w-0 text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="font-mono text-2xl font-bold tracking-tight sm:text-3xl">
                {destination}
              </span>
              <RiFlightLandLine className="shrink-0 text-lg text-brand" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Arrival</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="text-muted-foreground">
            <span className="font-mono font-semibold text-foreground">
              {elapsedTime}
            </span>{" "}
            elapsed
          </span>
          <span className="text-muted-foreground">
            <span className="font-mono font-semibold text-foreground">
              {remainingTime}
            </span>{" "}
            remaining
          </span>
        </div>
      </div>

      {/* Top of descent */}
      <GlowCard
        data-testid="tod-glow-card"
        variant="tod"
        intensity="subtle"
        glow={isTodWarning}
        className={cn(
          "min-w-0 border p-4 sm:p-5",
          isTodWarning
            ? "border-[#C5A059]/50"
            : "border-border",
        )}
      >
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <RiTimerLine className="text-brand" />
              Top of descent
            </div>

            <div
              data-testid="tod-distance"
              className="mt-2 font-mono text-4xl font-bold tracking-tight tabular-nums text-foreground sm:text-5xl"
            >
              {distanceToTod}{" "}
              <span className="text-xl font-semibold text-muted-foreground sm:text-2xl">
                NM
              </span>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Estimated TOD time{" "}
              <strong className="font-mono text-foreground">
                {calculatedEta}
              </strong>
            </p>
          </div>

          <div
            data-testid="tod-status"
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold",
              isTodWarning
                ? "border-[#C5A059]/50 bg-[#C5A059]/10 text-[#A47C2D] dark:text-[#D6B66E]"
                : "border-border bg-background text-muted-foreground",
            )}
          >
            {isTodWarning ? "TOD approaching" : "Cruise"}
            <span className="sr-only">
              {isTodWarning ? " within 150 NM" : " more than 150 NM away"}
            </span>
          </div>
        </div>
      </GlowCard>

      {/* Flight data */}
      <div className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-5 border-y border-border py-5 sm:grid-cols-4">
        <div className="min-w-0">
          <div
            data-testid="altitude-value"
            className="font-mono text-xl font-bold tabular-nums sm:text-2xl"
          >
            FL{currentAltitude}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Altitude</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-[#A47C2D] dark:text-[#D6B66E]">
            <RiArrowUpLine />
            <span className="font-mono font-semibold">FL{targetAltitude}</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Step climb in {stepClimbInMinutes} min
          </p>
        </div>

        <div className="min-w-0">
          <div
            data-testid="ground-speed-value"
            className="font-mono text-xl font-bold tabular-nums sm:text-2xl"
          >
            {groundSpeed}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Ground speed</p>
          <p className="mt-2 text-xs text-muted-foreground">KTS</p>
        </div>

        <div className="min-w-0">
          <div
            data-testid="true-airspeed-value"
            className="font-mono text-xl font-bold tabular-nums sm:text-2xl"
          >
            {trueAirspeed}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">True airspeed</p>
          <p className="mt-2 text-xs text-muted-foreground">Mach</p>
        </div>

        <div className="min-w-0">
          <div
            data-testid="wind-value"
            className="flex items-center gap-1 font-mono text-xl font-bold tabular-nums sm:text-2xl"
          >
            <RiWindyLine className="shrink-0 text-base text-brand" />
            {windDirection}° / {windSpeed}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Wind</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {windType} · KT
          </p>
        </div>
      </div>

      {/* Flight phases */}
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold">Flight phase</span>
          <span className="text-sm font-semibold text-brand">
            {currentPhase}
          </span>
        </div>

        <PhaseRail
          currentPhase={currentPhase}
          onPhaseChange={onPhaseChange}
        />
      </div>
    </section>
  );
}

export default FlightTrackerHUD;
