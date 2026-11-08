import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../table";

describe("Table", () => {
  it("renders table headers and cells", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Callsign</TableHead>
            <TableHead>Aircraft</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>QRV101</TableCell>
            <TableCell>A350-900</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Callsign")).toBeInTheDocument();
    expect(screen.getByText("Aircraft")).toBeInTheDocument();
    expect(screen.getByText("QRV101")).toBeInTheDocument();
    expect(screen.getByText("A350-900")).toBeInTheDocument();
  });

  it("renders a table caption", () => {
    render(
      <Table>
        <TableCaption>Active pilots</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>QRV101</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByText("Active pilots")).toBeInTheDocument();
  });
});
