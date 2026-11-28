
import * as React from "react";
import {
  RiArrowRightLine,
  RiCalendarLine,
  RiCheckLine,
  RiPlaneLine,
  RiShieldCheckLine,
  RiTimeLine,
  RiUserLine,
} from "@remixicon/react";
import { QA, GB } from "country-flag-icons/react/3x2";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  StatusPill,
  type FlightStatus,
} from "@/components/ui/status-pill";
import { HoldToConfirmButton } from "@/components/kokonut/hold-to-confirm";

export interface SelfAssignmentPilot {
  callsign: string;
  rank: string;
  totalFlightHours: string;
  status: FlightStatus;
  statusLabel: string;
}

export interface SelfAssignment {
  registration: string;
  aircraft: string;
  homeBase: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  std: string;
  sta: string;
}

export interface SelfAssignmentCardProps {
  pilot?: Partial<SelfAssignmentPilot>;
  assignment?: SelfAssignment | null;
  onBookSchedule?: () => void;
  onRelease?: () => void;
  onConfirmAssignment?: () => void;
  className?: string;
}

const defaultPilot: SelfAssignmentPilot = {
  callsign: "QTR001",
  rank: "Senior First Officer",
  totalFlightHours: "1,240 hours",
  status: "parked",
  statusLabel: "Quiet",
};

const defaultAssignment: SelfAssignment = {
  registration: "A7-APC",
  aircraft: "Airbus A350-900",
  homeBase: "OTHH",
  flightNumber: "QR843",
  departure: "OTHH",
  arrival: "EGLL",
  std: "02:15 UTC",
  sta: "07:25 UTC",
};

function AirportFlag({ code }: { code: string }) {
  if (code === "OTHH") {
    return (
      <QA
        title="Qatar"
        className="h-5 w-8 rounded-[3px] object-cover shadow-sm"
      />
    );
  }

  if (code === "EGLL") {
    return (
      <GB
        title="United Kingdom"
        className="h-5 w-8 rounded-[3px] object-cover shadow-sm"
      />
    );
  }

  return null;
}

function Airport({
  code,
  label,
  time,
  align = "left",
}: {
  code: string;
  label: string;
  time: string;
  align?: "left" | "right";
}) {
  return (
    <div className={`min-w-0 ${align === "right" ? "text-right" : "text-left"}`}>
      <div
        className={`flex min-w-0 items-center gap-1 sm:gap-2 ${
          align === "right" ? "justify-end" : "justify-start"
        }`}
      >
        {align === "left" && <AirportFlag code={code} />}
        <span className="text-xl font-bold tracking-tight text-foreground sm:text-3xl">
          {code}
        </span>
        {align === "right" && <AirportFlag code={code} />}
      </div>
      <p className="mt-1 break-words text-[10px] text-muted-foreground sm:text-xs">{label}</p>
      <p className="mt-2 whitespace-nowrap text-xs font-semibold text-foreground sm:text-sm">{time}</p>
    </div>
  );
}

export function SelfAssignmentCard({
  pilot,
  assignment = defaultAssignment,
  onBookSchedule,
  onRelease,
  onConfirmAssignment,
  className,
}: SelfAssignmentCardProps) {
  const pilotDetails = { ...defaultPilot, ...pilot };

  const [bookingOpen, setBookingOpen] = React.useState(false);
  const [releaseOpen, setReleaseOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmed, setConfirmed] = React.useState(false);

  const handleBookSchedule = () => {
    setBookingOpen(false);
    onBookSchedule?.();
  };

  const handleRelease = () => {
    onRelease?.();
    setReleaseOpen(false);
    setConfirmed(false);
  };

  const handleConfirmAssignment = () => {
    onConfirmAssignment?.();
    setConfirmed(true);
    setConfirmOpen(false);
  };

  return (
    <>
      <Card
        className={`w-full overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-sm ${className ?? ""}`}
      >
        <CardHeader className="space-y-4 border-b border-border pb-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <RiUserLine className="size-5" aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <CardDescription className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Pilot self-assignment
                </CardDescription>
                <CardTitle className="mt-1 text-xl font-bold tracking-tight text-foreground">
                  {pilotDetails.callsign}
                </CardTitle>
              </div>
            </div>

            <Badge variant="gold" className="shrink-0">
              {pilotDetails.rank}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RiTimeLine className="size-4" aria-hidden="true" />
              <span>
                <span className="font-semibold text-foreground">
                  {pilotDetails.totalFlightHours}
                </span>{" "}
                total flight time
              </span>
            </div>

            <StatusPill
              status={pilotDetails.status}
              label={pilotDetails.statusLabel}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-5">
          <section aria-labelledby="assigned-airframe-heading">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3
                id="assigned-airframe-heading"
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
              >
                <RiPlaneLine className="size-4 text-brand" aria-hidden="true" />
                Assigned airframe
              </h3>

              {assignment && <Badge variant="burgundy">Assigned</Badge>}
            </div>

            {assignment ? (
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-2xl font-bold tracking-tight text-card-foreground">
                      {assignment.registration}
                    </p>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">
                      {assignment.aircraft}
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Home base
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <AirportFlag code={assignment.homeBase} />
                      <p className="text-sm font-bold text-foreground">
                        {assignment.homeBase}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-card/60 px-4 py-6 text-center">
                <RiPlaneLine
                  className="mx-auto mb-2 size-6 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="text-sm font-semibold text-foreground">
                  No active airframe assigned
                </p>
                <p className="mt-1 break-words text-[10px] text-muted-foreground sm:text-xs">
                  Book a schedule to get started with an assignment.
                </p>
              </div>
            )}
          </section>

          <section aria-labelledby="booked-schedule-heading">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3
                id="booked-schedule-heading"
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
              >
                <RiCalendarLine className="size-4 text-brand" aria-hidden="true" />
                Selected schedule
              </h3>

              {assignment && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  All times UTC
                </span>
              )}
            </div>

            {assignment ? (
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Flight number
                    </p>
                    <p className="mt-1 text-lg font-bold text-card-foreground">
                      {assignment.flightNumber}
                    </p>
                  </div>

                  {confirmed ? (
                    <Badge variant="gold">
                      <RiCheckLine className="mr-1 size-3" aria-hidden="true" />
                      Confirmed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-border text-muted-foreground">
                      Selected
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 sm:gap-4">
                  <Airport
                    code={assignment.departure}
                    label="Departure"
                    time={assignment.std}
                  />

                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                      <RiArrowRightLine className="size-5 text-brand" aria-hidden="true" />
                    </div>
                    <span className="text-[9px] font-semibold uppercase tracking-wider">
                      Route
                    </span>
                  </div>

                  <Airport
                    code={assignment.arrival}
                    label="Arrival"
                    time={assignment.sta}
                    align="right"
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-card/60 px-4 py-5 text-center">
                <p className="text-sm text-muted-foreground">
                  No booked schedule available.
                </p>
              </div>
            )}
          </section>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 border-t border-border bg-muted/40 pt-4 sm:flex-row sm:flex-wrap">
          {assignment && (
            <Button
              variant="default"
              className="w-full sm:flex-1"
              onClick={() => setConfirmOpen(true)}
            >
              <RiCheckLine className="mr-2 size-4" aria-hidden="true" />
              {confirmed ? "Review Assignment" : "Confirm Assignment"}
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full border-border bg-background text-brand hover:bg-muted sm:flex-1"
            onClick={() => setBookingOpen(true)}
          >
            <RiCalendarLine className="mr-2 size-4" aria-hidden="true" />
            Book New Schedule
          </Button>

          {assignment && (
            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:bg-muted hover:text-brand sm:w-auto"
              onClick={() => setReleaseOpen(true)}
            >
              <RiShieldCheckLine className="mr-2 size-4" aria-hidden="true" />
              Release Airframe
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Selected Assignment</DialogTitle>
            <DialogDescription>
              Review the selected flight before confirming your assignment.
            </DialogDescription>
          </DialogHeader>

          {assignment && (
            <div className="space-y-3 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-card-foreground">
                  {assignment.flightNumber}
                </span>
                <Badge variant="gold">{assignment.registration}</Badge>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-foreground">
                  {assignment.departure} → {assignment.arrival}
                </span>
                <span className="text-xs text-muted-foreground">UTC</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {assignment.std} departure · {assignment.sta} arrival
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Go Back
            </Button>
            <Button onClick={handleConfirmAssignment} disabled={!assignment}>
              <RiCheckLine className="mr-2 size-4" aria-hidden="true" />
              Confirm Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book a New Schedule</DialogTitle>
            <DialogDescription>
              Continue to schedule booking to select an available flight and
              airframe. This preview does not submit a live booking.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-border/70 bg-muted/25 p-4">
            <p className="text-sm font-semibold text-foreground">
              Schedule booking
            </p>
            <p className="mt-1 break-words text-[10px] text-muted-foreground sm:text-xs">
              Booking workflow preview for {pilotDetails.callsign}.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookSchedule}>
              Continue
              <RiArrowRightLine className="ml-2 size-4" aria-hidden="true" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={releaseOpen} onOpenChange={setReleaseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Airframe Release</DialogTitle>
            <DialogDescription>
              You are about to release airframe{" "}
              <strong>{assignment?.registration}</strong>. Confirm only when
              you are sure you want to proceed.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-brand/20 bg-brand/5 p-4">
            <p className="text-sm font-semibold text-foreground">
              Safety confirmation required
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Press and hold the confirmation button for 1.5 seconds. Releasing
              it early cancels the confirmation.
            </p>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => setReleaseOpen(false)}>
              Keep Assignment
            </Button>

            <HoldToConfirmButton
              onConfirm={handleRelease}
              duration={1500}
              className="w-full border-destructive/40 text-destructive hover:bg-destructive/5 sm:w-auto"
            >
              Hold to release airframe
            </HoldToConfirmButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
