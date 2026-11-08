
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { RiLoader4Line } from "@remixicon/react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative isolate inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:hover:brightness-100 disabled:active:scale-100 after:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-l after:from-white/10 after:via-transparent after:to-transparent after:opacity-60 after:transition-opacity after:duration-200 hover:after:opacity-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        gold:
          "bg-brand-gold text-white hover:bg-brand-gold/90",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        white:
          "border border-white/20 bg-white text-gray-900 hover:bg-gray-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      disabled,
      children,
      icon,
      iconPosition = "left",
      ...props
    },
    ref,
  ) => {
    const iconElement = icon && !loading ? icon : null;

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {loading ? (
            <RiLoader4Line className="animate-spin" aria-hidden="true" />
          ) : (
            iconPosition === "left" && iconElement
          )}

          {children}

          {!loading && iconPosition === "right" && iconElement}
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
