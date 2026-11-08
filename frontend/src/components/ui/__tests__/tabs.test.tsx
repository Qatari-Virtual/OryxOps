import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../tabs";

describe("Tabs", () => {
  it("renders the default selected tab and its content", () => {
    render(
      <Tabs defaultValue="flights">
        <TabsList>
          <TabsTrigger value="flights">Flights</TabsTrigger>
          <TabsTrigger value="pilots">Pilots</TabsTrigger>
        </TabsList>
        <TabsContent value="flights">Flight schedule</TabsContent>
        <TabsContent value="pilots">Pilot directory</TabsContent>
      </Tabs>
    );

    expect(screen.getByRole("tab", { name: "Flights" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByText("Flight schedule")).toBeInTheDocument();
  });

  it("switches content when another tab is clicked", () => {
    render(
      <Tabs defaultValue="flights">
        <TabsList>
          <TabsTrigger value="flights">Flights</TabsTrigger>
          <TabsTrigger value="pilots">Pilots</TabsTrigger>
        </TabsList>
        <TabsContent value="flights">Flight schedule</TabsContent>
        <TabsContent value="pilots">Pilot directory</TabsContent>
      </Tabs>
    );

    act(() => {
      fireEvent.mouseDown(screen.getByRole("tab", { name: "Pilots" }), {
        button: 0,
        ctrlKey: false,
      });
    });

    expect(screen.getByRole("tab", { name: "Pilots" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByText("Pilot directory")).toBeInTheDocument();
  });
});
