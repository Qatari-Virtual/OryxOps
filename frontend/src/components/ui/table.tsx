import * as React from "react";
import { cn } from "@/lib/utils";
import {
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiArrowUpDownLine,
} from "@remixicon/react";

interface TableContextValue {
  variant?: "default" | "burgundy";
  density?: "default" | "compact";
  fixedLayout?: boolean;
  stickyHeader?: boolean;
}

const TableContext = React.createContext<TableContextValue>({
  variant: "default",
  density: "default",
  fixedLayout: false,
  stickyHeader: false,
});

interface TableHeaderContextValue {
  variant?: "default" | "burgundy";
  sticky?: boolean;
}

const TableHeaderContext = React.createContext<TableHeaderContextValue>({});

export interface TableProps
  extends React.HTMLAttributes<HTMLTableElement> {
  variant?: "default" | "burgundy";
  density?: "default" | "compact";
  fixedLayout?: boolean;
  stickyHeader?: boolean;
  containerRef?: React.Ref<HTMLDivElement>;
  containerClassName?: string;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      containerClassName,
      containerRef,
      variant = "default",
      density = "default",
      fixedLayout = false,
      stickyHeader = false,
      ...props
    },
    ref
  ) => (
    <TableContext.Provider
      value={{ variant, density, fixedLayout, stickyHeader }}
    >
      <div
        ref={containerRef}
        className={cn(
          "relative w-full overflow-auto",
          containerClassName
        )}
      >
        <table
          ref={ref}
          className={cn(
            "w-full caption-bottom text-sm border-separate border-spacing-0",
            fixedLayout && "table-fixed",
            className
          )}
          {...props}
        />
      </div>
    </TableContext.Provider>
  )
);
Table.displayName = "Table";

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  variant?: "default" | "burgundy";
  sticky?: boolean;
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, variant: propVariant, sticky, ...props }, ref) => {
    const context = React.useContext(TableContext);
    const isBurgundy = (propVariant || context.variant) === "burgundy";
    const isSticky = sticky ?? context.stickyHeader ?? false;

    return (
      <TableHeaderContext.Provider
        value={{ variant: isBurgundy ? "burgundy" : "default", sticky: isSticky }}
      >
        <thead
          ref={ref}
          className={cn(
            isSticky && "sticky top-0 z-20 shadow-xs",
            isBurgundy
              ? "bg-table-header-burgundy text-table-header-burgundy-fg font-bold [&_tr]:border-b-0"
              : "[&_tr]:border-b border-border bg-card/95 backdrop-blur-xs text-muted-foreground",
            className
          )}
          style={{
            position: isSticky ? "sticky" : undefined,
            top: isSticky ? 0 : undefined,
            zIndex: isSticky ? 20 : undefined,
          }}
          {...props}
        />
      </TableHeaderContext.Provider>
    );
  }
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-border bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  hoverable?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, hoverable = true, ...props }, ref) => (
    <tr
      ref={ref}
      data-state={selected ? "selected" : undefined}
      className={cn(
        "border-b border-border transition-colors",
        hoverable && "hover:bg-muted/50",
        selected && "bg-muted/80",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
  mono?: boolean;
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
  resizable?: boolean;
  onResize?: (newWidth: number) => void;
  sticky?: boolean;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      className,
      align = "left",
      mono = false,
      sortable = false,
      sortDirection = null,
      onSort,
      resizable = false,
      onResize,
      sticky,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(TableContext);
    const headerContext = React.useContext(TableHeaderContext);
    const isCompact = context.density === "compact";
    const isSticky = sticky ?? headerContext.sticky ?? context.stickyHeader ?? false;
    const isBurgundy = (headerContext.variant || context.variant) === "burgundy";
    const [isResizing, setIsResizing] = React.useState(false);

    // High-precision pointer-event column resize handler
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const thElement = (e.currentTarget.parentElement as HTMLElement);
      const startWidth = thElement?.getBoundingClientRect().width || 120;
      setIsResizing(true);

      const onPointerMove = (moveEvent: PointerEvent) => {
        const delta = moveEvent.clientX - startX;
        const newWidth = Math.max(60, Math.round(startWidth + delta));
        if (onResize) {
          onResize(newWidth);
        }
      };

      const onPointerUp = () => {
        setIsResizing(false);
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    };

    // Fallback mouse listener for test environments
    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const thElement = (e.currentTarget.parentElement as HTMLElement);
      const startWidth = thElement?.offsetWidth || 100;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX;
        const newWidth = Math.max(50, startWidth + delta);
        if (onResize) {
          onResize(newWidth);
        }
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const sortIcon =
      sortDirection === "asc" ? (
        <RiArrowUpSLine className="h-4 w-4 shrink-0 transition-transform" />
      ) : sortDirection === "desc" ? (
        <RiArrowDownSLine className="h-4 w-4 shrink-0 transition-transform" />
      ) : (
        <RiArrowUpDownLine className="h-4 w-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
      );

    const alignmentClass =
      align === "right"
        ? "text-right justify-end"
        : align === "center"
        ? "text-center justify-center"
        : "text-left justify-start";

    return (
      <th
        ref={ref}
        aria-sort={
          sortable
            ? sortDirection === "asc"
              ? "ascending"
              : sortDirection === "desc"
              ? "descending"
              : "none"
            : undefined
        }
        className={cn(
          "select-none font-semibold transition-colors",
          isSticky ? "sticky top-0 z-20 shadow-xs" : "relative",
          isBurgundy ? "bg-table-header-burgundy text-table-header-burgundy-fg" : "bg-card text-muted-foreground",
          isCompact ? "h-9 px-3 py-1.5" : "h-11 px-4 py-2.5",
          align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left",
          mono && "font-mono tabular-nums",
          "[&:has([role=checkbox])]:pr-0",
          className
        )}
        style={{
          ...style,
          ...(isSticky ? { position: "sticky", top: 0, zIndex: 20 } : {}),
        }}
        {...props}
      >
        <div
          className={cn(
            "flex items-center gap-1.5",
            alignmentClass,
            sortable && "cursor-pointer group"
          )}
          onClick={sortable ? onSort : undefined}
          role={sortable ? "button" : undefined}
          tabIndex={sortable ? 0 : undefined}
          onKeyDown={
            sortable
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSort?.();
                  }
                }
              : undefined
          }
        >
          <span className="truncate">{children}</span>
          {sortable && sortIcon}
        </div>

        {resizable && (
          <div
            data-resize-handle
            role="separator"
            aria-orientation="vertical"
            tabIndex={0}
            onPointerDown={handlePointerDown}
            onMouseDown={handleMouseDown}
            className={cn(
              "absolute -right-1.5 top-0 z-30 h-full w-3 cursor-col-resize select-none touch-none flex items-center justify-center group/resizer",
              isResizing && "bg-brand-gold/30"
            )}
            title="Drag to resize column"
          >
            <div
              className={cn(
                "h-4/5 w-[2px] rounded-full transition-all duration-150",
                isResizing
                  ? "bg-brand-gold w-[3px]"
                  : "bg-white/30 group-hover/resizer:bg-brand-gold group-hover/resizer:w-[3px]"
              )}
            />
          </div>
        )}
      </th>
    );
  }
);
TableHead.displayName = "TableHead";

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
  mono?: boolean;
  compact?: boolean;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  (
    { className, align = "left", mono = false, compact, children, ...props },
    ref
  ) => {
    const context = React.useContext(TableContext);
    const isCompact = compact ?? context.density === "compact";

    return (
      <td
        ref={ref}
        className={cn(
          "align-middle transition-colors [&:has([role=checkbox])]:pr-0",
          isCompact ? "px-3 py-2" : "px-4 py-3.5",
          align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left",
          mono && "font-mono tabular-nums",
          className
        )}
        {...props}
      >
        {children}
      </td>
    );
  }
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
