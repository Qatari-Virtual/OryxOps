import * as React from "react";
import { RiArrowDownSLine } from "@remixicon/react";

import { cn } from "@/lib/utils";

interface AccordionContextValue {
  open: boolean;
  toggle: () => void;
  contentId: string;
}

const AccordionContext =
  React.createContext<AccordionContextValue | null>(null);

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="accordion"
      className={cn("space-y-3", className)}
      {...props}
    />
  )
);

Accordion.displayName = "Accordion";

interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
}

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  AccordionItemProps
>(({ className, defaultOpen = false, children, ...props }, ref) => {
  const [open, setOpen] = React.useState(defaultOpen);
  const contentId = React.useId();

  const contextValue = React.useMemo(
    () => ({
      open,
      toggle: () => setOpen((current) => !current),
      contentId,
    }),
    [open, contentId]
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div
        ref={ref}
        data-slot="accordion-item"
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-card shadow-sm",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
});

AccordionItem.displayName = "AccordionItem";

const useAccordion = () => {
  const context = React.useContext(AccordionContext);

  if (!context) {
    throw new Error(
      "AccordionTrigger and AccordionContent must be used inside AccordionItem."
    );
  }

  return context;
};

interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => {
  const { open, toggle, contentId } = useAccordion();

  return (
    <button
      ref={ref}
      type="button"
      data-slot="accordion-trigger"
      aria-expanded={open}
      aria-controls={contentId}
      onClick={(event) => {
        props.onClick?.(event);
        if (!event.defaultPrevented) toggle();
      }}
      className={cn(
        "flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A0C2C] focus-visible:ring-inset",
        className
      )}
      {...props}
    >
      {children}
      <RiArrowDownSLine
        aria-hidden="true"
        className={cn(
          "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
          open && "rotate-180"
        )}
      />
    </button>
  );
});

AccordionTrigger.displayName = "AccordionTrigger";

interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ className, children, ...props }, ref) => {
  const { open, contentId } = useAccordion();

  return (
    <div
      ref={ref}
      id={contentId}
      data-slot="accordion-content"
      aria-hidden={!open}
      className={cn(
        "grid transition-[grid-template-rows] duration-200 ease-in-out",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div
          className={cn(
            "border-t border-border px-5 py-4 text-sm text-muted-foreground",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );
});

AccordionContent.displayName = "AccordionContent";

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
};