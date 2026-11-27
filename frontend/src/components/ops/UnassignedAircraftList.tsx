import * as React from "react";
import {
  RiPlaneLine,
  RiMapPinLine,
  RiArrowRightLine,
  RiSearchLine,
} from "@remixicon/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { StatusPill } from "@/components/ui/status-pill";

export type AircraftCategory = "widebody" | "narrowbody" | "cargo";
export type AircraftFilter = "all" | AircraftCategory;

export interface UnassignedAircraft {
  registration: string;
  type: string;
  category: AircraftCategory;
  location: string;
  rangeStatus: string;
}

export interface UnassignedAircraftListProps {
  aircraft?: UnassignedAircraft[];
  onClaim: (registration: string) => void;
  className?: string;
}

const DEMO_AIRCRAFT: UnassignedAircraft[] = [
  {
    registration: "A7-BEB",
    type: "Airbus A350-1000",
    category: "widebody",
    location: "OTHH Stand A12",
    rangeStatus: "Long range",
  },
  {
    registration: "A7-ALA",
    type: "Boeing 777-300ER",
    category: "widebody",
    location: "OTHH Stand B04",
    rangeStatus: "Long range",
  },
  {
    registration: "A7-AHF",
    type: "Airbus A320-200",
    category: "narrowbody",
    location: "OTHH Stand C08",
    rangeStatus: "Medium range",
  },
  {
    registration: "A7-ANE",
    type: "Airbus A321neo",
    category: "narrowbody",
    location: "OTHH Stand C11",
    rangeStatus: "Medium range",
  },
  {
    registration: "A7-BFG",
    type: "Boeing 777F",
    category: "cargo",
    location: "OTHH Stand D02",
    rangeStatus: "Long range",
  },
];

const CATEGORY_LABELS: Record<AircraftFilter, string> = {
  all: "All Fleet",
  widebody: "Widebody",
  narrowbody: "Narrowbody",
  cargo: "Cargo",
};

export function UnassignedAircraftList({
  aircraft = DEMO_AIRCRAFT,
  onClaim,
  className,
}: UnassignedAircraftListProps) {
  const [category, setCategory] = React.useState<AircraftFilter>("all");
  const [search, setSearch] = React.useState("");

  const counts = React.useMemo(() => {
    return {
      all: aircraft.length,
      widebody: aircraft.filter((item) => item.category === "widebody").length,
      narrowbody: aircraft.filter((item) => item.category === "narrowbody").length,
      cargo: aircraft.filter((item) => item.category === "cargo").length,
    };
  }, [aircraft]);

  const filteredAircraft = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    return aircraft.filter((item) => {
      const matchesCategory =
        category === "all" || item.category === category;
      const matchesSearch =
        !query ||
        item.registration.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [aircraft, category, search]);

  const emptyMessage =
    search.trim().length > 0
      ? "No aircraft match your search."
      : category === "all"
        ? "There are currently no unassigned aircraft."
        : `No available ${CATEGORY_LABELS[category].toLowerCase()} aircraft.`;

  return (
    <section
      className={className}
      aria-label="Unassigned aircraft roster"
    >
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="gold">TASK-4.2</Badge>
            <Badge variant="outline">Dispatch Operations</Badge>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            Unassigned Aircraft Roster
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse available airframes by fleet category and claim an aircraft.
          </p>
        </div>

        <div className="relative w-full lg:max-w-xs">
          <RiSearchLine
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search registration or type..."
            aria-label="Search aircraft by registration or type"
            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <Tabs
        value={category}
        onValueChange={(value) => setCategory(value as AircraftFilter)}
        className="w-full"
      >
        <TabsList
          variant="pill"
          className="mb-5 grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4"
        >
          {(Object.keys(CATEGORY_LABELS) as AircraftFilter[]).map((key) => (
            <TabsTrigger
              key={key}
              value={key}
              className="gap-2 px-2 py-2 text-xs sm:text-sm"
            >
              <span>{CATEGORY_LABELS[key]}</span>
              <span className="rounded-full bg-background/70 px-1.5 py-0.5 font-mono text-[10px]">
                {counts[key]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div
        className="grid grid-cols-1 gap-3 xl:grid-cols-2"
        aria-live="polite"
      >
        {filteredAircraft.map((item) => (
          <Card
            key={item.registration}
            className="min-w-0 border-border bg-card transition-colors hover:border-brand/40"
          >
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="font-mono tracking-wide"
                    >
                      {item.registration}
                    </Badge>
                    <StatusPill status="parked" label="PARKED" />
                  </div>

                  <div className="flex min-w-0 items-center gap-2">
                    <RiPlaneLine
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-brand"
                    />
                    <h4 className="truncate text-sm font-semibold text-foreground">
                      {item.type}
                    </h4>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <RiMapPinLine aria-hidden="true" className="h-3.5 w-3.5" />
                      {item.location}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Range: {item.rangeStatus}
                  </p>
                </div>

                <div className="flex shrink-0 sm:justify-end">
                  <Button
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => onClaim(item.registration)}
                    icon={<RiArrowRightLine />}
                    iconPosition="right"
                  >
                    Claim Airframe
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAircraft.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center">
            <RiPlaneLine
              aria-hidden="true"
              className="mx-auto mb-3 h-7 w-7 text-muted-foreground"
            />
            <p className="text-sm font-semibold text-foreground">
              {emptyMessage}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try another category or clear your search.
            </p>
            {search && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setSearch("")}
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default UnassignedAircraftList;
