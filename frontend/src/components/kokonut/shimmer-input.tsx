import * as React from "react";
import { cn } from "@/lib/utils";
import { RiSearchLine, RiCloseLine } from "@remixicon/react";

export interface ShimmerInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Tabular monospace typography for callsigns, ICAO codes, and flight figures */
  mono?: boolean;
  /** Custom inline icon on the left (defaults to Remix Icon search) */
  icon?: React.ReactNode;
  /** Whether the clean clear [x] button is enabled (defaults to true) */
  clearable?: boolean;
  /** Callback fired when the clear button is clicked */
  onClear?: () => void;
  /** Whether the animated shimmer sweep border is enabled (defaults to true) */
  shimmer?: boolean;
  /** Extra class names applied to the outer container */
  containerClassName?: string;
  /** Size variant */
  sizeVariant?: "default" | "sm" | "lg";
}

export const ShimmerInput = React.forwardRef<HTMLInputElement, ShimmerInputProps>(
  (
    {
      className,
      containerClassName,
      type = "text",
      mono = false,
      icon,
      clearable = true,
      onClear,
      shimmer = true,
      sizeVariant = "default",
      value: controlledValue,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      disabled,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = React.useState<string>(
      (defaultValue as string) ?? ""
    );
    const [isFocused, setIsFocused] = React.useState(false);

    const inputRef = React.useRef<HTMLInputElement | null>(null);

    // Synchronize ref forwarding with internal inputRef
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const currentValue = isControlled
      ? String(controlledValue ?? "")
      : internalValue;
    const hasValue = currentValue.length > 0;
    const isShimmerActive = shimmer && !disabled && (isFocused || hasValue);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isControlled) {
        setInternalValue("");
      }

      if (inputRef.current) {
        // Trigger React synthetic change event for controlled or bound components
        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )?.set;
        if (nativeSetter) {
          nativeSetter.call(inputRef.current, "");
        } else {
          inputRef.current.value = "";
        }
        const event = new Event("input", { bubbles: true });
        inputRef.current.dispatchEvent(event);
        inputRef.current.focus();
      }

      onClear?.();
    };

    const sizeStyles = {
      sm: {
        container: "h-8 text-xs",
        input: "py-1.5 pl-8 pr-7 text-xs",
        iconLeft: "left-2.5",
        iconSize: "h-3.5 w-3.5",
        clearRight: "right-1.5",
      },
      default: {
        container: "h-10 text-sm",
        input: "py-2 pl-9 pr-8 text-sm",
        iconLeft: "left-3",
        iconSize: "h-4 w-4",
        clearRight: "right-2",
      },
      lg: {
        container: "h-12 text-base",
        input: "py-3 pl-10 pr-9 text-base",
        iconLeft: "left-3.5",
        iconSize: "h-5 w-5",
        clearRight: "right-2.5",
      },
    }[sizeVariant];

    return (
      <div
        data-shimmer={isShimmerActive ? "true" : "false"}
        data-focused={isFocused ? "true" : "false"}
        data-has-value={hasValue ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
        className={cn(
          "group/shimmer-input relative flex items-center rounded-xl p-[1.5px] transition-all duration-300",
          disabled && "opacity-60 cursor-not-allowed",
          containerClassName
        )}
      >
        {/* Static Base Border */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-xl border border-input transition-opacity duration-300",
            isShimmerActive ? "opacity-0" : "opacity-100"
          )}
        />

        {/* Animated Shimmer Light Sweep Layer */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-xl overflow-hidden transition-opacity duration-300",
            isShimmerActive ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Conic light sweep beam cycling through Al-Annabi Burgundy & Champagne Gold */}
          <div
            className="shimmer-animated absolute -inset-[150%]"
            style={{
              background:
                "conic-gradient(from 0deg at 50% 50%, transparent 0%, var(--brand, #6A0C2C) 15%, var(--brand-gold, #C5A059) 25%, var(--brand-light, #8A1840) 35%, transparent 50%, transparent 100%)",
              animation: isShimmerActive
                ? "shimmerRotate 3.5s linear infinite"
                : "none",
            }}
          />
        </div>

        {/* Subtle Ambient Shimmer Glow */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-xl blur-sm transition-opacity duration-300 -z-10",
            isShimmerActive ? "opacity-25 dark:opacity-40" : "opacity-0"
          )}
          style={{
            background:
              "radial-gradient(circle at 50% 50%, var(--brand-gold, #C5A059) 0%, var(--brand, #6A0C2C) 70%, transparent 100%)",
          }}
        />

        {/* Inner Input Surface Container */}
        <div
          className={cn(
            "relative flex items-center w-full rounded-[calc(var(--radius,0.75rem)-1.5px)] bg-card text-card-foreground shadow-xs transition-colors",
            sizeStyles.container
          )}
        >
          {/* Left Inline Search Icon */}
          <span
            className={cn(
              "pointer-events-none absolute flex items-center justify-center text-muted-foreground transition-colors group-focus-within/shimmer-input:text-brand",
              sizeStyles.iconLeft
            )}
          >
            {icon ? (
              icon
            ) : (
              <RiSearchLine className={sizeStyles.iconSize} aria-hidden="true" />
            )}
          </span>

          {/* Actual Input Element */}
          <input
            ref={inputRef}
            type={type}
            value={currentValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            className={cn(
              "w-full rounded-[calc(var(--radius,0.75rem)-1.5px)] bg-transparent text-foreground placeholder:text-muted-foreground",
              "focus:outline-none disabled:cursor-not-allowed",
              mono && "font-mono tabular-nums",
              sizeStyles.input,
              className
            )}
            {...props}
          />

          {/* Clean Clear Button [x] */}
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              aria-label="Clear input"
              onClick={handleClear}
              className={cn(
                "absolute flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors",
                "hover:bg-muted hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
                sizeStyles.clearRight
              )}
            >
              <RiCloseLine className={sizeStyles.iconSize} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

ShimmerInput.displayName = "ShimmerInput";
