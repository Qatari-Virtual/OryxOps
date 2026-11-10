
import * as React from "react";
import { motion } from "framer-motion";

export interface ActionListItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface ActionListProps {
  items: ActionListItem[];
  onSelect: (item: ActionListItem) => void;
  defaultActiveId?: string;
  ariaLabel?: string;
  className?: string;
}

export function ActionList({
  items,
  onSelect,
  defaultActiveId,
  ariaLabel = "Available actions",
  className = "",
}: ActionListProps) {
  const initialItem =
    items.find(
      (item) => item.id === defaultActiveId && !item.disabled
    ) ?? items.find((item) => !item.disabled);

  const [activeId, setActiveId] = React.useState<string | undefined>(
    initialItem?.id
  );

  const instanceId = React.useId();
  const activeItem = items.find((item) => item.id === activeId);
  const activeIndex = items.findIndex((item) => item.id === activeId);

  const moveActive = (direction: 1 | -1) => {
    if (items.length === 0) return;

    let nextIndex =
      activeIndex >= 0
        ? activeIndex
        : direction === 1
          ? -1
          : 0;

    for (let i = 0; i < items.length; i += 1) {
      nextIndex =
        (nextIndex + direction + items.length) % items.length;

      if (!items[nextIndex].disabled) {
        setActiveId(items[nextIndex].id);
        return;
      }
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
    } else if (
      event.key === "Enter" &&
      activeItem &&
      !activeItem.disabled
    ) {
      event.preventDefault();
      onSelect(activeItem);
    }
  };

  return (
    <div
      role="listbox"
      aria-label={ariaLabel}
      aria-activedescendant={
        activeItem ? `${instanceId}-${activeItem.id}` : undefined
      }
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative space-y-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${className}`}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        const isDisabled = Boolean(item.disabled);
        const hasImage = Boolean(item.image);

        return (
          <motion.div
            key={item.id}
            id={`${instanceId}-${item.id}`}
            role="option"
            aria-selected={isActive}
            aria-disabled={isDisabled || undefined}
            onClick={() => {
              if (isDisabled) return;
              setActiveId(item.id);
              onSelect(item);
            }}
            whileHover={isDisabled ? undefined : { y: -2 }}
            whileTap={isDisabled ? undefined : { scale: 0.99 }}
            transition={{
              layout: {
                type: "spring",
                stiffness: 350,
                damping: 30,
              },
              y: { duration: 0.18 },
              scale: { duration: 0.12 },
            }}
            className={`relative flex cursor-pointer items-stretch gap-5 overflow-hidden rounded-xl border ${
              isDisabled
                ? "cursor-not-allowed opacity-40"
                : isActive
                  ? "border-brand/40 text-foreground"
                  : "border-border text-foreground hover:border-brand/30"
            }`}
          >
            {isActive && !isDisabled && (
              <motion.div
                layoutId={`action-list-indicator-${instanceId}`}
                initial={false}
                className="pointer-events-none absolute inset-0 z-0 rounded-xl border border-brand/40 bg-brand/10 shadow-sm"
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 34,
                  mass: 0.7,
                }}
              />
            )}

            {item.image && (
              <motion.img
                src={item.image}
                alt={item.imageAlt ?? item.label}
                draggable={false}
                loading="lazy"
                initial={false}
                className="w-32 shrink-0 self-stretch object-cover"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.2 }}
              />
            )}

            <div
              className={`relative z-10 flex min-w-0 flex-1 justify-between gap-4 ${
                hasImage
                  ? "items-start px-5 py-5"
                  : "items-center p-4"
              }`}
            >
              <div
                className={`flex min-w-0 flex-1 flex-col items-start text-left ${
                  hasImage
                    ? "justify-start gap-2 pt-1"
                    : "justify-center gap-1"
                }`}
              >
                {!hasImage && item.icon && (
                  <span className="flex h-12 w-8 shrink-0 items-center justify-center text-brand [&>svg]:h-6 [&>svg]:w-6">
                    {item.icon}
                  </span>
                )}

                <span
                  className={`block leading-tight tracking-tight text-foreground ${
                    hasImage
                      ? "text-lg font-bold"
                      : "text-sm font-bold"
                  }`}
                >
                  {item.label}
                </span>

                {item.description && (
                  <span className="block text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </span>
                )}
              </div>

              {item.badge && (
                <span className="shrink-0">
                  {item.badge}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default ActionList;
