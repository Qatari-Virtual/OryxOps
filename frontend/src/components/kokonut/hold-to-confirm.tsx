
import * as React from "react";
import { cn } from "@/lib/utils";

export interface HoldToConfirmButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  onConfirm: () => void;
  duration?: number;
  children: React.ReactNode;
}

export const HoldToConfirmButton = React.forwardRef<
  HTMLButtonElement,
  HoldToConfirmButtonProps
>(function HoldToConfirmButton(
  {
    onConfirm,
    duration = 1500,
    children,
    disabled,
    className,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    onKeyDown,
    onKeyUp,
    ...props
  },
  ref,
) {
  const [holding, setHolding] = React.useState(false);

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const confirmedRef = React.useRef(false);
  const holdingRef = React.useRef(false);
  const disabledRef = React.useRef(disabled);

  // Keep the latest disabled value available to the timer.
  disabledRef.current = disabled;

  const cancelHold = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    holdingRef.current = false;
    setHolding(false);
  }, []);

  const startHold = React.useCallback(() => {
    if (disabledRef.current || holdingRef.current) return;

    holdingRef.current = true;
    confirmedRef.current = false;
    setHolding(true);

    timerRef.current = setTimeout(() => {
      if (
        !holdingRef.current ||
        confirmedRef.current ||
        disabledRef.current
      ) {
        cancelHold();
        return;
      }

      confirmedRef.current = true;
      holdingRef.current = false;
      timerRef.current = null;
      setHolding(false);
      onConfirm();
    }, Math.max(0, duration));
  }, [duration, onConfirm, cancelHold]);

  // Cancel immediately when the button becomes disabled.
  React.useEffect(() => {
    if (disabled) {
      cancelHold();
    }
  }, [disabled, cancelHold]);

  // Clean up the timer when the component unmounts.
  React.useEffect(() => cancelHold, [cancelHold]);

  return (
    <button
      {...props}
      ref={ref}
      type={props.type ?? "button"}
      disabled={disabled}
      className={cn(
        "relative isolate inline-flex min-h-11 items-center justify-center overflow-hidden rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        holding && "border-brand",
        className,
      )}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (!event.defaultPrevented) startHold();
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        cancelHold();
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        cancelHold();
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        cancelHold();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);

        if (
          !event.defaultPrevented &&
          !event.repeat &&
          (event.key === " " || event.key === "Enter")
        ) {
          event.preventDefault();
          startHold();
        }
      }}
      onKeyUp={(event) => {
        onKeyUp?.(event);

        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          cancelHold();
        }
      }}
      onBlur={cancelHold}
    >
      {/* Full-height hold progress fill */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 origin-left scale-x-0 bg-brand/20 transition-transform ease-linear",
          holding && "scale-x-100",
        )}
        style={{
          transitionDuration: holding
            ? `${Math.max(0, duration)}ms`
            : "0ms",
        }}
      />

      {/* Button label stays above the progress fill */}
      <span className="relative z-10">{children}</span>
    </button>
  );
});

HoldToConfirmButton.displayName = "HoldToConfirmButton";
