import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export type TabsVariant = "pill" | "underline";

const TabsVariantContext = React.createContext<{ variant: TabsVariant }>({
  variant: "pill",
});

const Tabs = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
    variant?: TabsVariant;
  }
>(({ className, variant = "pill", ...props }, ref) => (
  <TabsVariantContext.Provider value={{ variant }}>
    <TabsPrimitive.Root
      ref={ref}
      className={cn("w-full", className)}
      {...props}
    />
  </TabsVariantContext.Provider>
));
Tabs.displayName = TabsPrimitive.Root.displayName;

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: TabsVariant;
}

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant: propVariant, ...props }, ref) => {
  const context = React.useContext(TabsVariantContext);
  const variant = propVariant || context.variant;

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        variant === "pill"
          ? "inline-flex h-10 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground"
          : "inline-flex h-10 items-center justify-start border-b border-border bg-transparent p-0 text-muted-foreground gap-4",
        className
      )}
      {...props}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  variant?: TabsVariant;
}

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant: propVariant, ...props }, ref) => {
  const context = React.useContext(TabsVariantContext);
  const variant = propVariant || context.variant;

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === "pill"
          ? "rounded-lg px-3 py-1.5 text-muted-foreground hover:text-foreground data-[state=active]:bg-brand data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
          : "px-3 py-2 border-b-2 border-transparent text-muted-foreground hover:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-brand data-[state=active]:text-brand data-[state=active]:font-semibold",
        className
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
