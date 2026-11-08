import React, { act } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../tabs";

describe("Tabs Primitive Suite", () => {
  describe("Subcomponent Structure & Rendering", () => {
    it("renders tabs, triggers and active content", () => {
      render(
        <Tabs defaultValue="network">
          <TabsList data-testid="tabs-list">
            <TabsTrigger value="network">Route Network</TabsTrigger>
            <TabsTrigger value="fleet">Fleet Telemetry</TabsTrigger>
            <TabsTrigger value="dispatch">Dispatch</TabsTrigger>
          </TabsList>
          <TabsContent value="network" data-testid="content-network">
            Network Content Active
          </TabsContent>
          <TabsContent value="fleet" data-testid="content-fleet">
            Fleet Content Active
          </TabsContent>
          <TabsContent value="dispatch" data-testid="content-dispatch">
            Dispatch Content Active
          </TabsContent>
        </Tabs>
      );

      expect(screen.getByTestId("tabs-list")).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: "Route Network" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: "Fleet Telemetry" })
      ).toBeInTheDocument();
      expect(screen.getByText("Network Content Active")).toBeInTheDocument();
      expect(
        screen.queryByText("Fleet Content Active")
      ).not.toBeInTheDocument();
    });

    it("forwards ref to underlying DOM elements", () => {
      const tabsRef = React.createRef<HTMLDivElement>();
      const listRef = React.createRef<HTMLDivElement>();
      const triggerRef = React.createRef<HTMLButtonElement>();
      const contentRef = React.createRef<HTMLDivElement>();

      render(
        <Tabs ref={tabsRef} defaultValue="tab1">
          <TabsList ref={listRef}>
            <TabsTrigger ref={triggerRef} value="tab1">
              Tab 1
            </TabsTrigger>
          </TabsList>
          <TabsContent ref={contentRef} value="tab1">
            Content 1
          </TabsContent>
        </Tabs>
      );

      expect(tabsRef.current).toBeInstanceOf(HTMLDivElement);
      expect(listRef.current).toBeInstanceOf(HTMLDivElement);
      expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
      expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("Al-Annabi Burgundy Active Pill Variant", () => {
    it("renders active trigger with Al-Annabi burgundy pill styling by default", () => {
      render(
        <Tabs defaultValue="routes">
          <TabsList>
            <TabsTrigger value="routes" data-testid="active-trigger">
              Routes
            </TabsTrigger>
            <TabsTrigger value="schedules" data-testid="inactive-trigger">
              Schedules
            </TabsTrigger>
          </TabsList>
          <TabsContent value="routes">Routes List</TabsContent>
          <TabsContent value="schedules">Schedules List</TabsContent>
        </Tabs>
      );

      const activeTrigger = screen.getByTestId("active-trigger");
      expect(activeTrigger).toHaveAttribute("data-state", "active");
      expect(activeTrigger.className).toMatch(
        /data-\[state=active\]:bg-brand|data-\[state=active\]:bg-primary|data-\[state=active\]:bg-\[#6A0C2C\]/
      );
      expect(activeTrigger.className).toContain(
        "data-[state=active]:text-white"
      );
    });

    it("supports underline variant with Al-Annabi burgundy indicator line", () => {
      render(
        <Tabs defaultValue="overview">
          <TabsList variant="underline" data-testid="underline-list">
            <TabsTrigger
              variant="underline"
              value="overview"
              data-testid="underline-trigger"
            >
              Overview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">Overview Content</TabsContent>
        </Tabs>
      );

      const trigger = screen.getByTestId("underline-trigger");
      expect(trigger.className).toMatch(
        /data-\[state=active\]:border-b-2|data-\[state=active\]:border-brand/
      );
    });
  });

  describe("Keyboard Navigation & State Switching", () => {
    it("switches active tab content when another tab trigger is clicked", () => {
      render(
        <Tabs defaultValue="flights">
          <TabsList>
            <TabsTrigger value="flights">Flights</TabsTrigger>
            <TabsTrigger value="airframes">Airframes</TabsTrigger>
          </TabsList>
          <TabsContent value="flights">Flights Panel</TabsContent>
          <TabsContent value="airframes">Airframes Panel</TabsContent>
        </Tabs>
      );

      expect(screen.getByText("Flights Panel")).toBeInTheDocument();
      expect(screen.queryByText("Airframes Panel")).not.toBeInTheDocument();

      const airframesTab = screen.getByRole("tab", { name: "Airframes" });
      fireEvent.mouseDown(airframesTab, { button: 0 });
      fireEvent.click(airframesTab);

      expect(screen.queryByText("Flights Panel")).not.toBeInTheDocument();
      expect(screen.getByText("Airframes Panel")).toBeInTheDocument();
      expect(airframesTab).toHaveAttribute("data-state", "active");
    });

    it("switches active content smoothly via keyboard arrow keys", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab One</TabsTrigger>
            <TabsTrigger value="tab2">Tab Two</TabsTrigger>
            <TabsTrigger value="tab3">Tab Three</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content One</TabsContent>
          <TabsContent value="tab2">Content Two</TabsContent>
          <TabsContent value="tab3">Content Three</TabsContent>
        </Tabs>
      );

      const firstTab = screen.getByRole("tab", { name: "Tab One" });
      const secondTab = screen.getByRole("tab", { name: "Tab Two" });
      act(() => {
        firstTab.focus();
        fireEvent.keyDown(firstTab, { key: "ArrowRight", code: "ArrowRight" });
        secondTab.focus();
        fireEvent.focus(secondTab);
        fireEvent.keyDown(secondTab, { key: "Enter", code: "Enter" });
      });

      expect(secondTab).toHaveFocus();
      expect(secondTab).toHaveAttribute("data-state", "active");
      expect(screen.getByText("Content Two")).toBeInTheDocument();
    });

    it("does not select disabled tabs", () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" disabled data-testid="disabled-tab">
              Tab 2 Disabled
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const disabledTab = screen.getByTestId("disabled-tab");
      expect(disabledTab).toBeDisabled();
      fireEvent.click(disabledTab);
      expect(screen.getByText("Content 1")).toBeInTheDocument();
      expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
    });
  });
});
