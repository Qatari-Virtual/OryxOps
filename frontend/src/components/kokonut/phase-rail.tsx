import * as React from "react";
import { motion } from "framer-motion";

export const FLIGHT_PHASES = [
  "Preflight",
  "Taxi",
  "Climb",
  "Cruise",
  "TOD / Descent",
  "Approach",
  "Landed",
] as const;

export type FlightPhase = (typeof FLIGHT_PHASES)[number];

export interface PhaseRailProps {
  currentPhase: FlightPhase;
  onPhaseChange?: (phase: FlightPhase) => void;
  className?: string;
}

export function PhaseRail({
  currentPhase,
  onPhaseChange,
  className = "",
}: PhaseRailProps) {
  const currentIndex = FLIGHT_PHASES.indexOf(currentPhase);
  const instanceId = React.useId();

  return (
    <div
      className={`w-full min-w-0 overflow-x-auto pb-3 ${className}`}
      aria-label="Flight phase progress"
    >
      <div
        className="flex min-w-[680px] items-start"
        role="group"
        aria-label="Flight phases"
      >
        {FLIGHT_PHASES.map((phase, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <React.Fragment key={phase}>
              <button
                type="button"
                
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`${phase}: ${
                  isCompleted
                    ? "Completed"
                    : isCurrent
                      ? "Current phase"
                      : "Upcoming"
                }`}
                onClick={() => onPhaseChange?.(phase)}
                className="group flex w-24 shrink-0 flex-col items-center gap-3 rounded-lg text-center outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                <span className="relative flex h-9 w-9 items-center justify-center">
                  {isCurrent && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-brand-gold/25"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0.2, 0.7] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  <motion.span
                    layout
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${
                      isCompleted
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : isCurrent
                          ? "border-brand-gold bg-brand text-brand-gold shadow-lg shadow-brand/20"
                          : "border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                    animate={{
                      scale: isCurrent ? 1.12 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 22,
                    }}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </motion.span>
                </span>

                <span
                  className={`text-xs font-semibold leading-tight ${
                    isCompleted
                      ? "text-emerald-600 dark:text-emerald-400"
                      : isCurrent
                        ? "text-brand"
                        : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {phase}
                </span>
              </button>

              {index < FLIGHT_PHASES.length - 1 && (
                <div className="relative mt-4 h-0.5 min-w-3 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <motion.div
                    className={`absolute inset-y-0 left-0 ${
                      index < currentIndex
                        ? "bg-emerald-500"
                        : "bg-brand-gold"
                    }`}
                    initial={false}
                    animate={{
                      width: index < currentIndex ? "100%" : "0%",
                    }}
                    transition={{
                      duration: 0.45,
                      ease: "easeInOut",
                    }}
                    layoutId={`${instanceId}-connector-${index}`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default PhaseRail;