import * as React from "react";
import { cn } from "@/lib/utils";
import { RiSearchLine, RiCloseLine, RiCheckLine } from "@remixicon/react";

export interface ShimmerInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  mono?: boolean;
  icon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  containerClassName?: string;
  sizeVariant?: "default" | "sm" | "lg";
  options?: string[];
  onPick?: (value: string) => void;
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
      sizeVariant = "default",
      options,
      onPick,
      value: controlledValue,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
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
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const dropdownRef = React.useRef<HTMLDivElement | null>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const currentValue = isControlled ? String(controlledValue ?? "") : internalValue;
    const hasValue = currentValue.length > 0;
    const isActive = isFocused || hasValue;

    const filtered = React.useMemo(() => {
      if (!options?.length) return [];
      if (!currentValue.trim()) return options;
      const q = currentValue.toLowerCase();
      return options.filter((o) => o.toLowerCase().includes(q));
    }, [options, currentValue]);

    const showDropdown = !!options?.length && isFocused && filtered.length > 0;

    React.useEffect(() => {
      if (!showDropdown) { setActiveIndex(-1); return; }
      setActiveIndex((prev) => (prev >= filtered.length ? filtered.length - 1 : prev));
    }, [showDropdown, filtered.length]);

    React.useEffect(() => {
      if (!showDropdown || activeIndex < 0) return;
      const handler = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setActiveIndex(-1);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [showDropdown]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
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
      if (!isControlled) setInternalValue("");
      inputRef.current?.focus();
      onClear?.();
    };

    const selectOption = (opt: string) => {
      if (!isControlled) setInternalValue(opt);
      onPick?.(opt);
      inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;

      if (!showDropdown) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        if (activeIndex >= 0 && activeIndex < filtered.length) {
          e.preventDefault();
          selectOption(filtered[activeIndex]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setActiveIndex(-1);
        setIsFocused(false);
      }
    };

    const sizes = {
      sm: { wrapper: "h-8", input: "py-1.5 pl-7 pr-7 text-xs", icon: "h-3.5 w-3.5", iconPos: "left-2", clearPos: "right-2" },
      default: { wrapper: "h-10", input: "py-2 pl-8 pr-8 text-sm", icon: "h-4 w-4", iconPos: "left-2.5", clearPos: "right-2" },
      lg: { wrapper: "h-12", input: "py-3 pl-9 pr-9 text-base", icon: "h-5 w-5", iconPos: "left-3", clearPos: "right-2.5" },
    }[sizeVariant];

    return (
      <div className="relative">
        <div
          className={cn(
            "group relative flex items-center overflow-hidden rounded-xl border transition-colors duration-200",
            isActive ? "border-brand" : "border-input",
            !isActive && "hover:border-brand/30",
            disabled && "opacity-60 cursor-not-allowed",
            sizes.wrapper,
            containerClassName
          )}
        >
          <span className={cn("pointer-events-none absolute flex items-center transition-colors", isActive ? "text-brand" : "text-muted-foreground", sizes.iconPos)}>
            {icon ?? <RiSearchLine className={sizes.icon} aria-hidden="true" />}
          </span>

          <input
            ref={inputRef}
            type={type}
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls="shimmer-dropdown"
            aria-activedescendant={activeIndex >= 0 ? `shimmer-opt-${activeIndex}` : undefined}
            value={currentValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={cn(
              "h-full w-full bg-transparent placeholder:text-muted-foreground/60 focus:outline-none disabled:cursor-not-allowed",
              mono && "font-mono tabular-nums",
              sizes.input,
              className
            )}
            {...props}
          />

          {clearable && hasValue && !disabled && (
            <button
              type="button"
              aria-label="Clear input"
              onClick={handleClear}
              className={cn(
                "absolute flex items-center justify-center rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
                sizes.clearPos
              )}
            >
              <RiCloseLine className={sizes.icon} aria-hidden="true" />
            </button>
          )}
        </div>

        {showDropdown && (
          <div
            ref={dropdownRef}
            id="shimmer-dropdown"
            role="listbox"
            className={cn(
              "absolute z-50 mt-1 w-full overflow-auto rounded-xl border border-border bg-card py-1 shadow-lg",
              "max-h-56"
            )}
          >
            {filtered.map((opt, i) => (
              <button
                key={opt}
                id={`shimmer-opt-${i}`}
                type="button"
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectOption(opt);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
                  mono && "font-mono",
                  i === activeIndex
                    ? "bg-brand/10 text-brand"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {i === activeIndex && <RiCheckLine className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />}
                <span className={cn(i === activeIndex ? "font-medium" : "ml-5")}>{opt}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ShimmerInput.displayName = "ShimmerInput";
