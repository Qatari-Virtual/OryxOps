import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "../table";

describe("Table Primitive Suite", () => {
  describe("Subcomponent Structure & Rendering", () => {
    it("renders complete table composite with all subcomponents", () => {
      render(
        <Table data-testid="test-table">
          <TableCaption>Qatar Airways Virtual Route Catalog</TableCaption>
          <TableHeader data-testid="test-thead">
            <TableRow>
              <TableHead>Flight</TableHead>
              <TableHead>Dep</TableHead>
              <TableHead>Arr</TableHead>
              <TableHead align="right">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody data-testid="test-tbody">
            <TableRow data-testid="test-row-1">
              <TableCell mono>QR001</TableCell>
              <TableCell mono>OTHH</TableCell>
              <TableCell mono>EGLL</TableCell>
              <TableCell mono align="right">
                7h 0m
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter data-testid="test-tfoot">
            <TableRow>
              <TableCell colSpan={3}>Total Flights</TableCell>
              <TableCell align="right">1</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      expect(screen.getByTestId("test-table")).toBeInTheDocument();
      expect(screen.getByTestId("test-thead")).toBeInTheDocument();
      expect(screen.getByTestId("test-tbody")).toBeInTheDocument();
      expect(screen.getByTestId("test-tfoot")).toBeInTheDocument();
      expect(
        screen.getByText("Qatar Airways Virtual Route Catalog")
      ).toBeInTheDocument();
      expect(screen.getByText("QR001")).toBeInTheDocument();
      expect(screen.getByText("7h 0m")).toBeInTheDocument();
    });

    it("forwards ref to underlying DOM elements", () => {
      const tableRef = React.createRef<HTMLTableElement>();
      const headerRef = React.createRef<HTMLTableSectionElement>();
      const bodyRef = React.createRef<HTMLTableSectionElement>();
      const rowRef = React.createRef<HTMLTableRowElement>();
      const headRef = React.createRef<HTMLTableCellElement>();
      const cellRef = React.createRef<HTMLTableCellElement>();

      render(
        <Table ref={tableRef}>
          <TableHeader ref={headerRef}>
            <TableRow ref={rowRef}>
              <TableHead ref={headRef}>Header</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody ref={bodyRef}>
            <TableRow>
              <TableCell ref={cellRef}>Data</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(tableRef.current).toBeInstanceOf(HTMLTableElement);
      expect(headerRef.current).toBeInstanceOf(HTMLTableSectionElement);
      expect(bodyRef.current).toBeInstanceOf(HTMLTableSectionElement);
      expect(rowRef.current).toBeInstanceOf(HTMLTableRowElement);
      expect(headRef.current).toBeInstanceOf(HTMLTableCellElement);
      expect(cellRef.current).toBeInstanceOf(HTMLTableCellElement);
    });

    it("wraps table inside an overflow-auto responsive container", () => {
      const { container } = render(
        <Table data-testid="container-test">
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const wrapper = container.querySelector(".overflow-auto");
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass("relative", "w-full", "overflow-auto");
    });
  });

  describe("Header Variants: Solid Burgundy vs Default", () => {
    it("renders solid Al-Annabi burgundy header variant when variant='burgundy' on TableHeader", () => {
      render(
        <Table>
          <TableHeader variant="burgundy" data-testid="burgundy-header">
            <TableRow>
              <TableHead>Flt Num</TableHead>
              <TableHead>Dep</TableHead>
              <TableHead>Arr</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>QR1</TableCell>
              <TableCell>OTHH</TableCell>
              <TableCell>EGLL</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const header = screen.getByTestId("burgundy-header");
      expect(header.className).toMatch(
        /bg-\[#6A0C2C\]|bg-brand|bg-\[var\(--table-header-bg\)\]|bg-table-header-burgundy/
      );
      expect(header.className).toMatch(
        /text-white|text-table-header-burgundy-fg/
      );
    });

    it("supports variant='burgundy' set at Table level propagating to header", () => {
      render(
        <Table variant="burgundy" data-testid="table-burgundy">
          <TableHeader data-testid="propagated-header">
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Body</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const header = screen.getByTestId("propagated-header");
      expect(header.className).toMatch(
        /bg-\[#6A0C2C\]|bg-brand|bg-\[var\(--table-header-bg\)\]|bg-table-header-burgundy/
      );
      expect(header.className).toMatch(
        /text-white|text-table-header-burgundy-fg/
      );
    });

    it("renders standard transparent/muted header variant by default", () => {
      render(
        <Table>
          <TableHeader data-testid="default-header">
            <TableRow>
              <TableHead>Standard Column</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const header = screen.getByTestId("default-header");
      expect(header.className).not.toContain("bg-[#6A0C2C]");
      expect(header.className).not.toContain("bg-table-header-burgundy");
      expect(header.className).not.toContain("bg-[var(--table-header-bg)]");
    });

    it("applies sticky positioning when stickyHeader=true on Table", () => {
      render(
        <Table stickyHeader>
          <TableHeader data-testid="sticky-header">
            <TableRow>
              <TableHead data-testid="sticky-th">Column</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      const header = screen.getByTestId("sticky-header");
      expect(header).toHaveClass("sticky");
      expect(header).toHaveClass("top-0");
      expect(header).toHaveClass("z-20");

      const th = screen.getByTestId("sticky-th");
      expect(th).toHaveClass("sticky");
      expect(th).toHaveClass("top-0");
      expect(th).toHaveClass("z-20");
    });

    it("forwards containerRef to the table scroll container div", () => {
      const containerRef = React.createRef<HTMLDivElement>();
      render(
        <Table containerRef={containerRef}>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(containerRef.current).toBeInstanceOf(HTMLDivElement);
      expect(containerRef.current).toHaveClass("overflow-auto");
    });

    it("applies sticky positioning when sticky=true directly on TableHeader", () => {
      render(
        <Table>
          <TableHeader sticky data-testid="direct-sticky-header">
            <TableRow>
              <TableHead>Column</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      const header = screen.getByTestId("direct-sticky-header");
      expect(header).toHaveClass("sticky");
      expect(header).toHaveClass("top-0");
    });

    it("does not apply sticky positioning by default", () => {
      render(
        <Table>
          <TableHeader data-testid="non-sticky-header">
            <TableRow>
              <TableHead>Column</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      const header = screen.getByTestId("non-sticky-header");
      expect(header).not.toHaveClass("sticky");
    });
  });

  describe("Density & Compact Padding", () => {
    it("applies compact vertical padding when density='compact'", () => {
      render(
        <Table density="compact">
          <TableBody>
            <TableRow>
              <TableCell data-testid="compact-cell">Dense Telemetry</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const cell = screen.getByTestId("compact-cell");
      expect(cell.className).toMatch(/py-2|py-1\.5|p-2/);
    });

    it("supports compact padding prop directly on TableCell", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell compact data-testid="direct-compact-cell">
                Compact
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const cell = screen.getByTestId("direct-compact-cell");
      expect(cell.className).toMatch(/py-2|py-1\.5|p-2/);
    });
  });

  describe("Aviation Tabular Monospace & Alignment", () => {
    it("applies tabular monospace class when mono is true on TableCell", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell mono data-testid="mono-cell">
                OTHH
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const cell = screen.getByTestId("mono-cell");
      expect(cell.className).toContain("font-mono");
      expect(cell.className).toContain("tabular-nums");
    });

    it("aligns right for duration cells", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell align="right" mono data-testid="duration-cell">
                7h 0m
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const cell = screen.getByTestId("duration-cell");
      expect(cell.className).toContain("text-right");
      expect(cell.className).toContain("font-mono");
    });

    it("supports center alignment on TableHead and TableCell", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead align="center" data-testid="center-head">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell align="center" data-testid="center-cell">
                OK
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByTestId("center-head").className).toContain(
        "text-center"
      );
      expect(screen.getByTestId("center-cell").className).toContain(
        "text-center"
      );
    });
  });

  describe("Sortable TableHead & Accessibility", () => {
    it("renders sortable trigger and calls onSort on click", () => {
      const handleSort = vi.fn();
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                sortable
                sortDirection="asc"
                onSort={handleSort}
                data-testid="sortable-head"
              >
                Duration
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      const head = screen.getByTestId("sortable-head");
      expect(head).toHaveAttribute("aria-sort", "ascending");

      const sortBtn = screen.getByRole("button", { name: /Duration/i });
      fireEvent.click(sortBtn);
      expect(handleSort).toHaveBeenCalledTimes(1);
    });

    it("renders correct aria-sort attribute for desc and none", () => {
      const { rerender } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                sortable
                sortDirection="desc"
                data-testid="sortable-head"
              >
                Duration
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      expect(screen.getByTestId("sortable-head")).toHaveAttribute(
        "aria-sort",
        "descending"
      );

      rerender(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                sortable
                sortDirection={null}
                data-testid="sortable-head"
              >
                Duration
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      expect(screen.getByTestId("sortable-head")).toHaveAttribute(
        "aria-sort",
        "none"
      );
    });
  });

  describe("Resizable Column Widths", () => {
    it("supports resizable prop and renders resize handle", () => {
      const handleResize = vi.fn();
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                resizable
                onResize={handleResize}
                data-testid="resizable-head"
                style={{ width: 180 }}
              >
                Aircraft & Livery
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );

      const head = screen.getByTestId("resizable-head");
      expect(head).toHaveStyle({ width: "180px" });
      const handle = head.querySelector("[data-resize-handle]");
      expect(handle).toBeInTheDocument();
    });
  });
});
