import * as React from "react";
import { ActionList } from "@/components/kokonut/action-list";
import { useState, useMemo, useRef, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  RiAddLine,
  RiArrowRightLine,
  RiSettings3Line,
  RiMap2Line,
  RiSearchLine,
  RiRefreshLine,
  RiPlaneLine,
  RiRouteLine,
  RiTimeLine,
  RiFilter3Line,
  RiSpeedUpLine,
  RiCheckLine,
  RiCheckboxLine,
  RiCheckboxBlankLine,
  RiEyeLine,
  RiEyeOffLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiDashboardLine,
  RiCompass3Line,
  RiPushpinLine,
  RiFlashlightLine,
  RiCalendarLine,
  RiAwardLine,
} from "@remixicon/react";

// =============================================================================
// ROUTE DATA GENERATOR (5,379 REALISTIC QATAR AIRWAYS ROUTES)
// =============================================================================

export interface RouteItem {
  id: string;
  callsigns: string[];
  hasClassicBadge?: boolean;
  extraCallsignsCount?: number;
  dep: string;
  arr: string;
  depCity: string;
  arrCity: string;
  aircraftLiveries: string[];
  extraLiveriesCount?: number;
  duration: string;
  durationHours: number;
  durationMinutes: number;
  airline: string;
  aircraftType: string;
  livery: string;
}

const DESTINATIONS = [
  { icao: "EGLL", city: "London (Heathrow)", hours: 7, mins: 15 },
  { icao: "KJFK", city: "New York (JFK)", hours: 14, mins: 20 },
  { icao: "LFPG", city: "Paris (CDG)", hours: 6, mins: 50 },
  { icao: "OMDB", city: "Dubai (Int'l)", hours: 0, mins: 50 },
  { icao: "WSSS", city: "Singapore (Changi)", hours: 7, mins: 45 },
  { icao: "EDDF", city: "Frankfurt (Rhein-Main)", hours: 6, mins: 30 },
  { icao: "YSSY", city: "Sydney (Kingsford Smith)", hours: 14, mins: 55 },
  { icao: "RJTT", city: "Tokyo (Haneda)", hours: 9, mins: 40 },
  { icao: "LSGG", city: "Geneva (Cointrin)", hours: 5, mins: 35 },
  { icao: "VABB", city: "Mumbai (Chhatrapati Shivaji)", hours: 3, mins: 40 },
  { icao: "FAOR", city: "Johannesburg (O.R. Tambo)", hours: 8, mins: 15 },
  { icao: "SBGR", city: "São Paulo (Guarulhos)", hours: 15, mins: 30 },
  { icao: "KLAX", city: "Los Angeles (Int'l)", hours: 16, mins: 10 },
  { icao: "OERK", city: "Riyadh (King Khalid)", hours: 1, mins: 25 },
  { icao: "VIDP", city: "Delhi (Indira Gandhi)", hours: 3, mins: 50 },
];

const AIRCRAFT_MODELS = [
  "Airbus A350-1000",
  "Boeing 777-300ER",
  "Airbus A350-900",
  "Airbus A380-800",
  "Airbus A340-600",
  "Boeing 787-9",
  "Boeing 777F Cargo",
  "Airbus A320-200",
];

const LIVERIES = [
  "Qatar Airways standard",
  "FIFA World Cup",
  "Oneworld Alliance",
  "Retro 25th Anniversary",
];

const AIRLINES = ["Qatar Airways", "Qatar Executive", "Qatar Cargo"];

// Generate deterministic catalog of 5,379 routes starting with exact screenshot rows
function generateRouteDatabase(): RouteItem[] {
  const routes: RouteItem[] = [
    {
      id: "route-1",
      callsigns: ["QR1 Classic"],
      hasClassicBadge: true,
      dep: "OTBD",
      arr: "EGLL",
      depCity: "Doha (Doha Int'l)",
      arrCity: "London (Heathrow)",
      aircraftLiveries: ["Airbus A340-600 (Qatar Airways)"],
      duration: "7h 0m",
      durationHours: 7,
      durationMinutes: 0,
      airline: "Qatar Airways",
      aircraftType: "Airbus A340-600",
      livery: "Qatar Airways standard",
    },
    {
      id: "route-2",
      callsigns: ["QR1", "QR3"],
      extraCallsignsCount: 6,
      dep: "OTHH",
      arr: "EGLL",
      depCity: "Doha (Hamad Int'l)",
      arrCity: "London (Heathrow)",
      aircraftLiveries: [
        "Boeing 777-300ER (Qatar)",
        "Airbus A380 (Qatar Airways)",
      ],
      extraLiveriesCount: 2,
      duration: "7h 0m",
      durationHours: 7,
      durationMinutes: 0,
      airline: "Qatar Airways",
      aircraftType: "Boeing 777-300ER",
      livery: "Qatar Airways standard",
    },
    {
      id: "route-3",
      callsigns: ["QR100", "QR102"],
      dep: "LSGG",
      arr: "OTHH",
      depCity: "Geneva (Cointrin)",
      arrCity: "Doha (Hamad Int'l)",
      aircraftLiveries: ["Airbus A359 (Qatar Airways)"],
      duration: "5h 35m",
      durationHours: 5,
      durationMinutes: 35,
      airline: "Qatar Airways",
      aircraftType: "Airbus A350-900",
      livery: "Qatar Airways standard",
    },
    {
      id: "route-4",
      callsigns: ["QR1002", "QR1006"],
      extraCallsignsCount: 3,
      dep: "OTHH",
      arr: "OMDB",
      depCity: "Doha (Hamad Int'l)",
      arrCity: "Dubai (Int'l)",
      aircraftLiveries: [
        "Boeing 777-300ER (Qatar)",
        "Airbus A359 (Qatar Airways)",
      ],
      extraLiveriesCount: 4,
      duration: "0h 50m",
      durationHours: 0,
      durationMinutes: 50,
      airline: "Qatar Airways",
      aircraftType: "Boeing 777-300ER",
      livery: "Qatar Airways standard",
    },
    {
      id: "route-5",
      callsigns: ["QR1003", "QR1007"],
      extraCallsignsCount: 3,
      dep: "OMDB",
      arr: "OTHH",
      depCity: "Dubai (Int'l)",
      arrCity: "Doha (Hamad Int'l)",
      aircraftLiveries: [
        "Boeing 777-300ER (Qatar)",
        "Airbus A359 (Qatar Airways)",
      ],
      extraLiveriesCount: 4,
      duration: "0h 50m",
      durationHours: 0,
      durationMinutes: 50,
      airline: "Qatar Airways",
      aircraftType: "Boeing 777-300ER",
      livery: "Qatar Airways standard",
    },
  ];

  // Fill up to 5,379 routes with realistic Qatar Airways network flights
  const TOTAL_TARGET = 5379;
  for (let i = routes.length + 1; i <= TOTAL_TARGET; i++) {
    const dest = DESTINATIONS[i % DESTINATIONS.length];
    const isOutbound = i % 2 === 0;
    const dep = isOutbound ? "OTHH" : dest.icao;
    const arr = isOutbound ? dest.icao : "OTHH";
    const depCity = isOutbound ? "Doha (Hamad Int'l)" : dest.city;
    const arrCity = isOutbound ? dest.city : "Doha (Hamad Int'l)";
    const fltNumber = `QR${(i % 990) + 10}`;
    const aircraft = AIRCRAFT_MODELS[i % AIRCRAFT_MODELS.length];
    const livery = LIVERIES[i % LIVERIES.length];
    const airline = AIRLINES[i % AIRLINES.length];

    const extraCalls = (i % 5 === 0) ? 2 : (i % 9 === 0) ? 4 : 0;
    const extraLiv = (i % 4 === 0) ? 2 : 0;

    routes.push({
      id: `route-${i}`,
      callsigns: [fltNumber],
      extraCallsignsCount: extraCalls > 0 ? extraCalls : undefined,
      dep,
      arr,
      depCity,
      arrCity,
      aircraftLiveries: [`${aircraft} (Qatar)`],
      extraLiveriesCount: extraLiv > 0 ? extraLiv : undefined,
      duration: `${dest.hours}h ${dest.mins}m`,
      durationHours: dest.hours,
      durationMinutes: dest.mins,
      airline,
      aircraftType: aircraft,
      livery,
    });
  }

  return routes;
}

// Simple Fleet Data for Example 1
const SIMPLE_FLEET_DATA = [
  { reg: "A7-APA", type: "Airbus A350-1000", base: "OTHH (Doha)", hours: "3,420h", status: "airborne" as const },
  { reg: "A7-APB", type: "Airbus A350-1000", base: "OTHH (Doha)", hours: "2,980h", status: "radar" as const },
  { reg: "A7-APC", type: "Airbus A350-900", base: "OTHH (Doha)", hours: "4,150h", status: "airborne" as const },
  { reg: "A7-BAA", type: "Boeing 777-300ER", base: "OTHH (Doha)", hours: "7,820h", status: "parked" as const },
  { reg: "A7-BAB", type: "Boeing 777-300ER", base: "OTHH (Doha)", hours: "6,940h", status: "tod" as const },
  { reg: "A7-BFA", type: "Boeing 777F Cargo", base: "OTHH (Doha)", hours: "5,310h", status: "stopped" as const },
];

// Complex Operations Dispatch Data for Example 3
const COMPLEX_DISPATCH_DATA = [
  {
    id: "DSP-001",
    callsign: "QTR843",
    route: "OTHH → EGLL",
    acft: "A350-900 (A7-APC)",
    altitude: "FL380",
    speed: "485 kts",
    mach: "M0.85",
    fuel: "42,500 kg",
    pic: "CPT. Al-Kuwari (QR-014)",
    pax: 283,
    status: "airborne" as const,
    remarks: "Step climb to FL400 at RIKET. EGLL expect OCKHAM holding due to peak traffic.",
    eta: "14:25 UTC",
  },
  {
    id: "DSP-002",
    callsign: "QTR001",
    route: "OTHH → KJFK",
    acft: "B777-300ER (A7-BAN)",
    altitude: "FL340",
    speed: "472 kts",
    mach: "M0.84",
    fuel: "98,200 kg",
    pic: "CPT. Sterling (QR-088)",
    pax: 358,
    status: "airborne" as const,
    remarks: "North Atlantic Track Whiskey. Clear air turbulence reported FL330-360 over Shanwick.",
    eta: "21:10 UTC",
  },
  {
    id: "DSP-003",
    callsign: "QTR1002",
    route: "OTHH → OMDB",
    acft: "A350-1000 (A7-ANA)",
    altitude: "FL140",
    speed: "290 kts",
    mach: "M0.65",
    fuel: "8,900 kg",
    pic: "FO. Hassan (QR-302)",
    pax: 327,
    status: "tod" as const,
    remarks: "Descent cleared via DESDI 2E arrival into Dubai 12L.",
    eta: "09:40 UTC",
  },
  {
    id: "DSP-004",
    callsign: "QTR8818",
    route: "OTHH → EDDF",
    acft: "B777F Cargo (A7-BFG)",
    altitude: "FL000",
    speed: "0 kts",
    mach: "M0.00",
    fuel: "68,400 kg",
    pic: "CPT. Weber (QR-112)",
    pax: 0,
    status: "parked" as const,
    remarks: "Cargo loading main deck pallets in progress at Hamad Ramp Stand F4.",
    eta: "04:15 UTC (DEP)",
  },
];

export default function Showcase() {
  const [selectedAction, setSelectedAction] = useState("Airbus A350-900");
  // All 5,379 routes loaded once
  const allRoutes = useMemo(() => generateRouteDatabase(), []);

  // Filter States for Route Database (using shadcn Select & Input)
  const [selectedAirline, setSelectedAirline] = useState("all");
  const [selectedAircraft, setSelectedAircraft] = useState("all");
  const [selectedLivery, setSelectedLivery] = useState("all");
  const [filterDep, setFilterDep] = useState("");
  const [filterArr, setFilterArr] = useState("");
  const [durationCondition, setDurationCondition] = useState("under");
  const [durationHours, setDurationHours] = useState("");

  // Table controls
  const [sortField, setSortField] = useState<"flt" | "dep" | "arr" | "duration">("duration");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [density, setDensity] = useState<"default" | "compact">("compact");
  const [isStickyHeader, setIsStickyHeader] = useState(true);
  const [selectedRouteForMap, setSelectedRouteForMap] = useState<RouteItem | null>(null);

  // Column Width Management (Draggable with pointer events + width presets)
  const [colWidths, setColWidths] = useState<{ [key: string]: number }>({
    flt: 210,
    dep: 110,
    arr: 110,
    aircraft: 380,
    duration: 130,
  });

  const handleColumnResize = useCallback((col: string, newWidth: number) => {
    const minWidth = col === "flt" ? 170 : col === "aircraft" ? 220 : 80;
    setColWidths((prev) => ({
      ...prev,
      [col]: Math.max(minWidth, Math.min(600, newWidth)),
    }));
  }, []);

  const handleResetWidths = (preset: "default" | "wide" | "compact") => {
    if (preset === "wide") {
      setColWidths({ flt: 280, dep: 140, arr: 140, aircraft: 460, duration: 160 });
    } else if (preset === "compact") {
      setColWidths({ flt: 170, dep: 90, arr: 90, aircraft: 320, duration: 110 });
    } else {
      setColWidths({ flt: 210, dep: 110, arr: 110, aircraft: 380, duration: 130 });
    }
  };

  const handleResetFilters = () => {
    setSelectedAirline("all");
    setSelectedAircraft("all");
    setSelectedLivery("all");
    setFilterDep("");
    setFilterArr("");
    setDurationCondition("under");
    setDurationHours("");
  };

  const handleSort = (field: "flt" | "dep" | "arr" | "duration") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filtered and Sorted 5,379 routes
  const filteredRoutes = useMemo(() => {
    return allRoutes
      .filter((route) => {
        if (selectedAirline !== "all" && route.airline !== selectedAirline) {
          return false;
        }
        if (selectedAircraft !== "all" && !route.aircraftType.includes(selectedAircraft)) {
          return false;
        }
        if (selectedLivery !== "all" && route.livery !== selectedLivery) {
          return false;
        }
        if (filterDep.trim() && !route.dep.toLowerCase().includes(filterDep.trim().toLowerCase())) {
          return false;
        }
        if (filterArr.trim() && !route.arr.toLowerCase().includes(filterArr.trim().toLowerCase())) {
          return false;
        }
        if (durationHours.trim()) {
          const targetHours = parseFloat(durationHours);
          if (!isNaN(targetHours)) {
            const totalHours = route.durationHours + route.durationMinutes / 60;
            if (durationCondition === "under" && totalHours > targetHours) return false;
            if (durationCondition === "over" && totalHours < targetHours) return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortField === "flt") {
          diff = a.callsigns[0].localeCompare(b.callsigns[0]);
        } else if (sortField === "dep") {
          diff = a.dep.localeCompare(b.dep);
        } else if (sortField === "arr") {
          diff = a.arr.localeCompare(b.arr);
        } else if (sortField === "duration") {
          const totalA = a.durationHours * 60 + a.durationMinutes;
          const totalB = b.durationHours * 60 + b.durationMinutes;
          diff = totalA - totalB;
        }
        return sortDirection === "asc" ? diff : -diff;
      });
  }, [
    allRoutes,
    selectedAirline,
    selectedAircraft,
    selectedLivery,
    filterDep,
    filterArr,
    durationCondition,
    durationHours,
    sortField,
    sortDirection,
  ]);

  // Virtualization Scroll Container Ref
  const parentScrollRef = useRef<HTMLDivElement>(null);

  // TanStack Virtualizer for 5,379 rows
  const rowVirtualizer = useVirtualizer({
    count: filteredRoutes.length,
    getScrollElement: () => parentScrollRef.current,
    estimateSize: () => (density === "compact" ? 44 : 54),
    overscan: 12,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? rowVirtualizer.getTotalSize() - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0;

  // Example 1 Simple Table State
  const [simpleSearch, setSimpleSearch] = useState("");
  const filteredSimpleFleet = useMemo(() => {
    return SIMPLE_FLEET_DATA.filter(
      (f) =>
        f.reg.toLowerCase().includes(simpleSearch.toLowerCase()) ||
        f.type.toLowerCase().includes(simpleSearch.toLowerCase())
    );
  }, [simpleSearch]);

  // Example 3 Complex Table States (Expandable rows, row selection, column toggles)
  const [expandedRows, setExpandedRows] = useState<{ [id: string]: boolean }>({});
  const [selectedRowIds, setSelectedRowIds] = useState<{ [id: string]: boolean }>({});
  const [visibleCols, setVisibleCols] = useState<{ [col: string]: boolean }>({
    altitude: true,
    speed: true,
    mach: true,
    fuel: true,
    pic: true,
  });

  const toggleRowExpanded = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds((prev) => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (Object.keys(selectedRowIds).length === COMPLEX_DISPATCH_DATA.length) {
      setSelectedRowIds({});
    } else {
      const all: { [id: string]: boolean } = {};
      COMPLEX_DISPATCH_DATA.forEach((d) => (all[d.id] = true));
      setSelectedRowIds(all);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-xl font-bold text-white shadow-sm">
              O
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">OryxOps</h1>
              <p className="text-sm text-muted-foreground">
                Electronic Flight Bag & Operational Portal
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="outline">React 19 + Tailwind v4</Badge>
              <Badge variant="burgundy">Sprint 2 · High-Density Tables</Badge>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
              Component Showcase
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
              Aviation Table Primitives Suite
            </h2>
            <p className="mt-2 max-w-3xl text-muted-foreground">
              Production-ready shadcn/ui components customized for Qatar Airways Virtual.
              Featuring 100% shadcn primitives (Buttons, Inputs, Selects, Badges), resizable fixed-layout columns,
              and <strong>@tanstack/react-virtual</strong> handling 5,379 routes at 60fps.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-12 px-6 py-10">
        {/* ========================================================================= */}
        {/* TABS SELECTOR (THREE TABLE EXAMPLES: VIRTUALIZED ROUTE DB, SIMPLE, COMPLEX) */}
        {/* ========================================================================= */}
        <Tabs defaultValue="route-db" className="w-full">
          <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
            <TabsList variant="pill" aria-label="Table showcase examples">
              <TabsTrigger value="route-db" className="flex items-center gap-2">
                <RiRouteLine className="h-4 w-4" />
                Route Database (5,379 Virtualized)
              </TabsTrigger>
              <TabsTrigger value="simple" className="flex items-center gap-2">
                <RiPlaneLine className="h-4 w-4" />
                Example 1: Simple & Clean Table
              </TabsTrigger>
              <TabsTrigger value="complex" className="flex items-center gap-2">
                <RiDashboardLine className="h-4 w-4" />
                Example 3: Complex Cockpit Ops
              </TabsTrigger>
              <TabsTrigger value="underline-tabs" className="flex items-center gap-2">
                <RiSettings3Line className="h-4 w-4" />
                Underline Tab Variant
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant={isStickyHeader ? "default" : "outline"}
                onClick={() => setIsStickyHeader((prev) => !prev)}
                title="Toggle sticky table header"
                className="flex items-center gap-1.5"
              >
                <RiPushpinLine className="h-3.5 w-3.5" />
                <span>Sticky Header: {isStickyHeader ? "ON" : "OFF"}</span>
              </Button>

              <span className="text-xs font-semibold text-muted-foreground ml-2">Density:</span>
              <Button
                size="sm"
                variant={density === "compact" ? "default" : "outline"}
                onClick={() => setDensity("compact")}
              >
                Compact
              </Button>
              <Button
                size="sm"
                variant={density === "default" ? "default" : "outline"}
                onClick={() => setDensity("default")}
              >
                Standard
              </Button>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* TAB 1: 5,379 VIRTUALIZED ROUTE DATABASE WITH COLUMN RESIZING */}
          {/* ======================================================================= */}
          <TabsContent value="route-db" className="mt-6 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              {/* HEADER MATCHING IMAGE */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-brand dark:text-brand-light tracking-tight">
                    Route Database
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Explore our complete route network. Search and filter by airline, departure, or arrival.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedRouteForMap(allRoutes[0])}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand dark:text-brand-light hover:underline"
                  >
                    <RiMap2Line className="h-4 w-4" />
                    View Route Map &rarr;
                  </button>
                </div>

                <div className="flex items-center text-xs text-muted-foreground font-mono">
                  <span className="text-brand dark:text-brand-light">Home</span>
                  <span className="mx-1.5">/</span>
                  <span>Route Database</span>
                </div>
              </div>

              {/* FILTER BAR BUILT WITH 100% SHADCN PRIMITIVES */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
                {/* 1. All Airlines (shadcn Select) */}
                <div className="lg:col-span-1">
                  <Select value={selectedAirline} onValueChange={setSelectedAirline}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Airlines" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Airlines</SelectItem>
                      <SelectItem value="Qatar Airways">Qatar Airways</SelectItem>
                      <SelectItem value="Qatar Executive">Qatar Executive</SelectItem>
                      <SelectItem value="Qatar Cargo">Qatar Cargo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. All Aircraft (shadcn Select) */}
                <div className="lg:col-span-1">
                  <Select value={selectedAircraft} onValueChange={setSelectedAircraft}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Aircraft" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Aircraft</SelectItem>
                      <SelectItem value="Airbus A340-600">Airbus A340-600</SelectItem>
                      <SelectItem value="Boeing 777-300ER">Boeing 777-300ER</SelectItem>
                      <SelectItem value="Airbus A350-900">Airbus A350-900</SelectItem>
                      <SelectItem value="Airbus A380-800">Airbus A380-800</SelectItem>
                      <SelectItem value="Boeing 787-9">Boeing 787-9</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 3. All Liveries (shadcn Select) */}
                <div className="lg:col-span-1">
                  <Select value={selectedLivery} onValueChange={setSelectedLivery}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Liveries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Liveries</SelectItem>
                      <SelectItem value="Qatar Airways standard">Qatar Airways</SelectItem>
                      <SelectItem value="FIFA World Cup">FIFA World Cup</SelectItem>
                      <SelectItem value="Oneworld Alliance">Oneworld</SelectItem>
                      <SelectItem value="Retro 25th Anniversary">Retro Livery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 4. Departure ICAO (shadcn Input) */}
                <div className="lg:col-span-1">
                  <Input
                    placeholder="Departure"
                    mono
                    value={filterDep}
                    onChange={(e) => setFilterDep(e.target.value.toUpperCase())}
                    className="uppercase placeholder:normal-case"
                  />
                </div>

                {/* 5. Arrival ICAO (shadcn Input) */}
                <div className="lg:col-span-1">
                  <Input
                    placeholder="Arrival"
                    mono
                    value={filterArr}
                    onChange={(e) => setFilterArr(e.target.value.toUpperCase())}
                    className="uppercase placeholder:normal-case"
                  />
                </div>

                {/* 6. Under / Over (shadcn Select) */}
                <div className="lg:col-span-1">
                  <Select value={durationCondition} onValueChange={setDurationCondition}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Under" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under">Under</SelectItem>
                      <SelectItem value="over">Over</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 7. Hours (shadcn Input) */}
                <div className="lg:col-span-1">
                  <Input
                    type="number"
                    placeholder="Hours"
                    mono
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                  />
                </div>

                {/* 8. Search Button (shadcn Button) */}
                <div className="flex gap-2 lg:col-span-1">
                  <Button variant="default" className="w-full font-semibold">
                    Search
                  </Button>
                  {(selectedAirline !== "all" ||
                    selectedAircraft !== "all" ||
                    selectedLivery !== "all" ||
                    filterDep ||
                    filterArr ||
                    durationHours) && (
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleResetFilters}
                      title="Clear Filters"
                      aria-label="Clear Filters"
                    >
                      <RiRefreshLine className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* COLUMN WIDTH RESIZE CONTROLS & VIRTUALIZATION STATUS */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">Column Width Presets:</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs px-2.5"
                    onClick={() => handleResetWidths("default")}
                  >
                    Default
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs px-2.5"
                    onClick={() => handleResetWidths("wide")}
                  >
                    Wide
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs px-2.5"
                    onClick={() => handleResetWidths("compact")}
                  >
                    Compact
                  </Button>
                  <span className="text-muted-foreground ml-2 hidden md:inline">
                    (or drag any column border in the burgundy header)
                  </span>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <Badge variant="outline" className="flex items-center gap-1 text-[11px] font-mono">
                    <RiFlashlightLine className="h-3 w-3 text-brand-gold" />
                    <span>Virtualized 60fps</span>
                  </Badge>
                  <p className="text-muted-foreground">
                    <span className="font-bold text-foreground">
                      {filteredRoutes.length.toLocaleString()}
                    </span>{" "}
                    routes
                  </p>
                </div>
              </div>

              {/* VIRTUALIZED TABLE CONTAINER */}
              <Table
                variant="burgundy"
                density={density}
                fixedLayout
                stickyHeader={isStickyHeader}
                containerRef={parentScrollRef}
                containerClassName="mt-3 max-h-[560px] overflow-auto rounded-xl border border-border bg-card shadow-xs"
              >
                  <TableHeader variant="burgundy">
                      <TableRow>
                        <TableHead
                          sortable
                          sortDirection={sortField === "flt" ? sortDirection : null}
                          onSort={() => handleSort("flt")}
                          resizable
                          onResize={(w) => handleColumnResize("flt", w)}
                          style={{ width: `${colWidths.flt}px` }}
                        >
                          Flt Num
                        </TableHead>
                        <TableHead
                          sortable
                          sortDirection={sortField === "dep" ? sortDirection : null}
                          onSort={() => handleSort("dep")}
                          resizable
                          onResize={(w) => handleColumnResize("dep", w)}
                          style={{ width: `${colWidths.dep}px` }}
                        >
                          Dep
                        </TableHead>
                        <TableHead
                          sortable
                          sortDirection={sortField === "arr" ? sortDirection : null}
                          onSort={() => handleSort("arr")}
                          resizable
                          onResize={(w) => handleColumnResize("arr", w)}
                          style={{ width: `${colWidths.arr}px` }}
                        >
                          Arr
                        </TableHead>
                        <TableHead
                          resizable
                          onResize={(w) => handleColumnResize("aircraft", w)}
                          style={{ width: `${colWidths.aircraft}px` }}
                        >
                          Aircraft & Livery
                        </TableHead>
                        <TableHead
                          align="right"
                          sortable
                          sortDirection={sortField === "duration" ? sortDirection : null}
                          onSort={() => handleSort("duration")}
                          resizable
                          onResize={(w) => handleColumnResize("duration", w)}
                          style={{ width: `${colWidths.duration}px` }}
                        >
                          Duration
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {/* Virtualized Top Spacer */}
                      {paddingTop > 0 && (
                        <tr>
                          <td style={{ height: `${paddingTop}px` }} colSpan={5} />
                        </tr>
                      )}

                      {/* Visible Virtual Rows */}
                      {virtualRows.map((virtualRow) => {
                        const route = filteredRoutes[virtualRow.index];
                        if (!route) return null;

                        return (
                          <TableRow key={route.id} className="group">
                            {/* Callsign Badges (Authentic Light Burgundy Outline, NEVER Black) */}
                            <TableCell style={{ width: `${colWidths.flt}px` }}>
                              <div className="flex flex-wrap items-center gap-1.5">
                                {route.callsigns.map((cs) => (
                                  <Badge
                                    key={cs}
                                    variant="outline"
                                    className="font-bold tracking-tight text-brand border-brand/40 shadow-2xs"
                                  >
                                    {cs}
                                  </Badge>
                                ))}

                                {route.extraCallsignsCount && (
                                  <Badge variant="outline" className="font-mono text-[11px] text-muted-foreground">
                                    +{route.extraCallsignsCount}
                                  </Badge>
                                )}

                                <button
                                  type="button"
                                  onClick={() => setSelectedRouteForMap(route)}
                                  title="View Route Map"
                                  aria-label={`View map for ${route.dep} to ${route.arr}`}
                                  className="ml-1 text-muted-foreground/60 hover:text-brand transition-colors p-0.5 rounded hover:bg-muted"
                                >
                                  <RiRouteLine className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </TableCell>

                            {/* Departure ICAO */}
                            <TableCell mono style={{ width: `${colWidths.dep}px` }}>
                              <span className="font-bold tracking-wider text-foreground">
                                {route.dep}
                              </span>
                            </TableCell>

                            {/* Arrival ICAO */}
                            <TableCell mono style={{ width: `${colWidths.arr}px` }}>
                              <span className="font-bold tracking-wider text-foreground">
                                {route.arr}
                              </span>
                            </TableCell>

                            {/* Aircraft & Livery Pills (Authentic Soft Burgundy Pill, NEVER Black) */}
                            <TableCell style={{ width: `${colWidths.aircraft}px` }}>
                              <div className="flex flex-wrap items-center gap-1.5">
                                {route.aircraftLiveries.map((liv) => (
                                  <Badge
                                    key={liv}
                                    variant="outline"
                                    className="font-medium text-muted-foreground"
                                  >
                                    {liv}
                                  </Badge>
                                ))}

                                {route.extraLiveriesCount && (
                                  <Badge variant="outline" className="font-mono text-[11px] text-muted-foreground">
                                    +{route.extraLiveriesCount}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>

                            {/* Duration Cell (Right Aligned Tabular Monospace) */}
                            <TableCell
                              align="right"
                              mono
                              style={{ width: `${colWidths.duration}px` }}
                            >
                              <span className="font-mono text-xs text-muted-foreground font-semibold">
                                {route.duration}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}

                      {/* Virtualized Bottom Spacer */}
                      {paddingBottom > 0 && (
                        <tr>
                          <td style={{ height: `${paddingBottom}px` }} colSpan={5} />
                        </tr>
                      )}

                      {filteredRoutes.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <RiFilter3Line className="h-8 w-8 text-muted-foreground/40" />
                              <p className="font-medium">No routes found matching your criteria.</p>
                              <Button size="sm" variant="outline" onClick={handleResetFilters}>
                                Clear All Filters
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
            </div>
          </TabsContent>

          {/* ======================================================================= */}
          {/* TAB 2: EXAMPLE 1 - SIMPLE & CLEAN TABLE (EASY TO CREATE FOR ANY PURPOSE) */}
          {/* ======================================================================= */}
          <TabsContent value="simple" className="mt-6 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold">Active Fleet Airframe Directory</h3>
                  <p className="text-sm text-muted-foreground">
                    A simple, clean 5-column table created with minimal markup for lightweight operational lists.
                  </p>
                </div>

                <div className="w-full sm:w-64">
                  <Input
                    placeholder="Search registration or type..."
                    value={simpleSearch}
                    onChange={(e) => setSimpleSearch(e.target.value)}
                  />
                </div>
              </div>

              <Table
                density={density}
                stickyHeader={isStickyHeader}
                containerClassName="max-h-[360px] overflow-auto rounded-xl border border-border bg-card shadow-xs"
              >
                  <TableHeader>
                    <TableRow>
                      <TableHead mono>Registration</TableHead>
                      <TableHead>Aircraft Model</TableHead>
                      <TableHead>Home Base</TableHead>
                      <TableHead mono align="right">Airframe Hours</TableHead>
                      <TableHead align="center">Flight Status</TableHead>
                      <TableHead align="right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSimpleFleet.map((airframe) => (
                      <TableRow key={airframe.reg}>
                        <TableCell mono className="font-bold text-brand">
                          {airframe.reg}
                        </TableCell>
                        <TableCell>{airframe.type}</TableCell>
                        <TableCell>{airframe.base}</TableCell>
                        <TableCell mono align="right">
                          {airframe.hours}
                        </TableCell>
                        <TableCell align="center">
                          <Badge variant={airframe.status}>
                            {airframe.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell align="right">
                          <Button size="sm" variant="outline">
                            Inspect
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </div>
          </TabsContent>

          {/* ======================================================================= */}
          {/* TAB 3: EXAMPLE 3 - COMPLEX COCKPIT OPERATIONS TABLE (EXPANDABLE + SELECT) */}
          {/* ======================================================================= */}
          <TabsContent value="complex" className="mt-6 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-xl font-bold">Live Flight Dispatch & Telemetry Cockpit</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced operational table with multi-row checkbox selection, expandable flight dispatch dossiers, and column toggles.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant={Object.keys(selectedRowIds).length > 0 ? "default" : "outline"}
                    disabled={Object.keys(selectedRowIds).length === 0}
                  >
                    Batch Dispatch ({Object.keys(selectedRowIds).length})
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setVisibleCols((p) => ({ ...p, mach: !p.mach, fuel: !p.fuel }))
                    }
                  >
                    Toggle Perf Columns
                  </Button>
                </div>
              </div>

              <Table
                density={density}
                stickyHeader={isStickyHeader}
                containerClassName="max-h-[460px] overflow-auto rounded-xl border border-border bg-card shadow-xs"
              >
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: 44 }}>
                        <button
                          type="button"
                          onClick={toggleSelectAll}
                          className="flex items-center justify-center text-muted-foreground hover:text-foreground"
                          title="Select all rows"
                        >
                          {Object.keys(selectedRowIds).length === COMPLEX_DISPATCH_DATA.length ? (
                            <RiCheckboxLine className="h-4 w-4 text-brand" />
                          ) : (
                            <RiCheckboxBlankLine className="h-4 w-4" />
                          )}
                        </button>
                      </TableHead>
                      <TableHead mono>Callsign</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Airframe</TableHead>
                      {visibleCols.altitude && <TableHead mono align="right">Altitude</TableHead>}
                      {visibleCols.speed && <TableHead mono align="right">GS</TableHead>}
                      {visibleCols.mach && <TableHead mono align="right">Mach</TableHead>}
                      {visibleCols.fuel && <TableHead mono align="right">FOB</TableHead>}
                      {visibleCols.pic && <TableHead>Pilot in Command</TableHead>}
                      <TableHead align="center">Phase</TableHead>
                      <TableHead align="right">ETA (UTC)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {COMPLEX_DISPATCH_DATA.map((flight) => {
                      const isExpanded = expandedRows[flight.id];
                      const isSelected = selectedRowIds[flight.id];

                      return (
                        <React.Fragment key={flight.id}>
                          <TableRow
                            selected={isSelected}
                            className="cursor-pointer"
                            onClick={() => toggleRowExpanded(flight.id)}
                          >
                            <TableCell onClick={(e) => { e.stopPropagation(); toggleSelectRow(flight.id); }}>
                              {isSelected ? (
                                <RiCheckboxLine className="h-4 w-4 text-brand" />
                              ) : (
                                <RiCheckboxBlankLine className="h-4 w-4 text-muted-foreground" />
                              )}
                            </TableCell>
                            <TableCell mono className="font-bold text-brand">
                              <div className="flex items-center gap-1.5">
                                <span>{flight.callsign}</span>
                                {isExpanded ? (
                                  <RiArrowUpSLine className="h-3.5 w-3.5 opacity-60" />
                                ) : (
                                  <RiArrowDownSLine className="h-3.5 w-3.5 opacity-60" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell mono className="font-medium">{flight.route}</TableCell>
                            <TableCell>{flight.acft}</TableCell>
                            {visibleCols.altitude && <TableCell mono align="right">{flight.altitude}</TableCell>}
                            {visibleCols.speed && <TableCell mono align="right">{flight.speed}</TableCell>}
                            {visibleCols.mach && <TableCell mono align="right">{flight.mach}</TableCell>}
                            {visibleCols.fuel && <TableCell mono align="right">{flight.fuel}</TableCell>}
                            {visibleCols.pic && <TableCell>{flight.pic}</TableCell>}
                            <TableCell align="center">
                              <Badge variant={flight.status}>{flight.status.toUpperCase()}</Badge>
                            </TableCell>
                            <TableCell mono align="right" className="font-semibold text-muted-foreground">
                              {flight.eta}
                            </TableCell>
                          </TableRow>

                          {/* Expandable Flight Dossier Row */}
                          {isExpanded && (
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                              <TableCell colSpan={11} className="py-3 px-6">
                                <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                                  <div className="flex items-center justify-between border-b border-border pb-2">
                                    <div className="flex items-center gap-2">
                                      <RiPlaneLine className="h-4 w-4 text-brand" />
                                      <span className="font-bold text-sm">Operational Flight Plan Remarks · {flight.callsign}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground font-mono">Pax Onboard: {flight.pax}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground font-mono">
                                    {flight.remarks}
                                  </p>
                                  <div className="flex justify-end gap-2 pt-2">
                                    <Button size="sm" variant="outline">
                                      View OFP PDF
                                    </Button>
                                    <Button size="sm" variant="default">
                                      Send ACARS Advisory
                                    </Button>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
            </div>
          </TabsContent>

          {/* ======================================================================= */}
          {/* TAB 4: UNDERLINE TAB VARIANT */}
          {/* ======================================================================= */}
          <TabsContent value="underline-tabs" className="mt-6 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <h3 className="text-xl font-bold">Tabs Underline Indicator Variant</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Minimal bottom-border indicator variant in Al-Annabi burgundy.
              </p>

              <Tabs defaultValue="specs">
                <TabsList variant="underline" aria-label="Aircraft spec views">
                  <TabsTrigger variant="underline" value="specs">
                    Airframe Specs
                  </TabsTrigger>
                  <TabsTrigger variant="underline" value="fuel">
                    Fuel & Performance
                  </TabsTrigger>
                  <TabsTrigger variant="underline" value="dispatch">
                    Dispatch Remarks
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="specs" className="p-4 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">Airbus A350-900 (A7-APC)</p>
                  <p className="mt-1">
                    Powered by 2x Rolls-Royce Trent XWB-84 engines. Max Takeoff Weight: 280,000 kg. Range: 8,100 nm.
                  </p>
                </TabsContent>
                <TabsContent value="fuel" className="p-4 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">Estimated Fuel on Board</p>
                  <p className="mt-1">
                    Block Fuel: 42,500 kg. Trip: 34,200 kg. Contingency: 1,800 kg. Alternate (EGKK): 3,200 kg. Final Reserve: 3,300 kg.
                  </p>
                </TabsContent>
                <TabsContent value="dispatch" className="p-4 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">Operational NOTAMs</p>
                  <p className="mt-1">
                    EGLL runway 27L closed between 01:00Z and 04:30Z for resurfacing. Expect holding at OCKHAM or BIGGIN.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>

        {/* ========================================================================= */}
        {/* EXISTING SHOWCASE PRIMITIVES (BUTTONS, BADGES, COLORS) */}
        {/* ========================================================================= */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold">shadcn Button Variants</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Official shadcn/ui buttons customized with Qatar Airways Virtual tokens.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="default">Default (Al-Annabi)</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="gold">Gold (Champagne)</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </section>

        {/* BADGE VARIANTS */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xl font-bold">shadcn Badge Variants</h3>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">
            Status indicators and operational badges for OryxOps.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="burgundy">Burgundy</Badge>
            <Badge variant="gold">Gold</Badge>
            <Badge variant="airborne">Airborne</Badge>
            <Badge variant="radar">Radar</Badge>
            <Badge variant="tod">TOD</Badge>
            <Badge variant="stopped">Stopped</Badge>
            <Badge variant="parked">Parked</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </section>

        
        {/* INTERACTIVE ACTION LIST */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-8">
            <h3 className="text-xl font-bold">Interactive ActionList</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Animated, keyboard-accessible lists with support for images,
              icons, descriptions and badges.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* IMAGE VARIANT */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Image variant</h4>
                <p className="text-sm text-muted-foreground">
                  Items with thumbnail images on the left.
                </p>
              </div>

              <ActionList
                ariaLabel="Aircraft image selection"
                defaultActiveId="image-a350"
                onSelect={(item) => setSelectedAction(item.label)}
                items={[
                  {
                    id: "image-a350",
                    label: "Airbus A350-900",
                    description: "Long-haul aircraft",
                    image:
                      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=160&h=160&q=80",
                    imageAlt: "Aircraft in flight",
                    badge: <Badge variant="burgundy">A359</Badge>,
                  },
                  {
                    id: "image-b777",
                    label: "Boeing 777-300ER",
                    description: "Wide-body aircraft",
                    image:
                      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=160&h=160&q=80",
                    imageAlt: "Aircraft in flight",
                    badge: <Badge variant="gold">B77W</Badge>,
                  },
                ]}
              />
            </div>

            {/* ICON VARIANT */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Icon variant</h4>
                <p className="text-sm text-muted-foreground">
                  Minimal icons without surrounding background boxes.
                </p>
              </div>

              <ActionList
                ariaLabel="Flight management actions"
                defaultActiveId="flights"
                onSelect={(item) => setSelectedAction(item.label)}
                items={[
                  {
                    id: "flights",
                    label: "My Flights",
                    description: "View your flight history",
                    icon: <RiPlaneLine />,
                    badge: <Badge variant="burgundy">Flights</Badge>,
                  },
                  {
                    id: "schedule",
                    label: "Flight Schedule",
                    description: "Manage upcoming flights",
                    icon: <RiCalendarLine />,
                    badge: <Badge variant="outline">Schedule</Badge>,
                  },
                  {
                    id: "rewards",
                    label: "Pilot Rewards",
                    description: "Check your earned rewards",
                    icon: <RiAwardLine />,
                    badge: <Badge variant="gold">Rewards</Badge>,
                  },
                ]}
              />
            </div>
          </div>

          <div className="mt-8 rounded-lg bg-muted/60 p-4 text-sm">
            <span className="text-muted-foreground">
              Last selected item:{" "}
            </span>
            <span className="font-semibold text-brand">
              {selectedAction}
            </span>
          </div>
        </section>


        {/* BRAND COLORS */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xl font-bold">Brand Colors</h3>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">
            OryxOps Al-Annabi visual identity.
          </p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <div className="h-20 rounded-lg bg-brand" />
              <p className="mt-2 text-sm font-semibold">Al-Annabi</p>
              <p className="text-xs text-muted-foreground">#6A0C2C</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-brand-dark" />
              <p className="mt-2 text-sm font-semibold">Dark Burgundy</p>
              <p className="text-xs text-muted-foreground">#4A0820</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-brand-light" />
              <p className="mt-2 text-sm font-semibold">Light Burgundy</p>
              <p className="text-xs text-muted-foreground">#8A1840</p>
            </div>
            <div>
              <div className="h-20 rounded-lg bg-brand-gold" />
              <p className="mt-2 text-sm font-semibold">Champagne Gold</p>
              <p className="text-xs text-muted-foreground">#C5A059</p>
            </div>
          </div>
        </section>

        {/* ROUTE MAP DIALOG PREVIEW */}
        {selectedRouteForMap && (
          <Dialog
            open={Boolean(selectedRouteForMap)}
            onOpenChange={(open) => !open && setSelectedRouteForMap(null)}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-brand">
                  <RiRouteLine className="h-5 w-5" />
                  Route Map: {selectedRouteForMap.callsigns[0]}
                </DialogTitle>
                <DialogDescription>
                  Flight trajectory and routing specifications for Qatar Airways Virtual.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div className="text-center">
                    <p className="font-mono text-xl font-black text-brand">
                      {selectedRouteForMap.dep}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedRouteForMap.depCity}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-mono text-xs text-muted-foreground">
                      {selectedRouteForMap.duration}
                    </span>
                    <RiArrowRightLine className="h-5 w-5 text-brand" />
                    <span className="text-[10px] text-muted-foreground uppercase">Great Circle</span>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-xl font-black text-brand">
                      {selectedRouteForMap.arr}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedRouteForMap.arrCity}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assigned Aircraft:</span>
                    <span className="font-semibold">{selectedRouteForMap.aircraftLiveries[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Flight Time:</span>
                    <span className="font-mono font-semibold">
                      {selectedRouteForMap.duration}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Flight Callsigns:</span>
                    <span className="font-mono font-semibold">
                      {selectedRouteForMap.callsigns.join(", ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="default">Close</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
          OryxOps Design System · Component Showcase · Task 2.5
        </footer>
      </div>
    </main>
  );
}
