import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  VerticalTimeline,
  TimelineItem,
} from "@/components/ui/timeline";

function DemoSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function ComponentShowcase() {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [progress, setProgress] = useState(65);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [pilotStatus, setPilotStatus] = useState("Active");

  const handleLoading = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1500);
  };

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="space-y-2">
            <Badge variant="burgundy">Developer tools</Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              Component Showcase
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Explore and interact with the OryxOps design system. These
              components are live previews of the UI primitives used
              throughout the application.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <DemoSection
              title="01. Button"
              description="Interactive buttons with different styles and states."
            >
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleLoading} loading={loading}>
                  {loading ? "Loading..." : "Try loading"}
                </Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="gold">Gold</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </DemoSection>

            <DemoSection
              title="02. Badge"
              description="Status labels used across the OryxOps interface."
            >
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="burgundy">Burgundy</Badge>
                <Badge variant="gold">Gold</Badge>
                <Badge variant="airborne">Airborne</Badge>
                <Badge variant="radar">Radar</Badge>
                <Badge variant="tod">TOD</Badge>
                <Badge variant="stopped">Stopped</Badge>
                <Badge variant="parked">Parked</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Change pilot status:
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setPilotStatus((current) =>
                      current === "Active" ? "Offline" : "Active"
                    )
                  }
                >
                  Toggle status
                </Button>
                <Badge variant={pilotStatus === "Active" ? "airborne" : "outline"}>
                  {pilotStatus}
                </Badge>
              </div>
            </DemoSection>

            <DemoSection
              title="03. Card"
              description="Reusable content containers and card layouts."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Standard card</CardTitle>
                    <CardDescription>
                      A basic OryxOps card.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Standard card content.
                    </p>
                  </CardContent>
                </Card>
                <Card variant="accent-stripe">
                  <CardHeader>
                    <CardTitle>Accent card</CardTitle>
                    <CardDescription>
                      With an accent stripe.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Highlight important information.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm">Explore</Button>
                  </CardFooter>
                </Card>
              </div>
            </DemoSection>

            <DemoSection
              title="04. Input"
              description="Controlled text input with live preview."
            >
              <div className="space-y-3">
                <Input
                  placeholder="Enter a callsign..."
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  {inputValue
                    ? `Your callsign: ${inputValue}`
                    : "Your input will appear here."}
                </p>
              </div>
            </DemoSection>

            <DemoSection
              title="05. Textarea"
              description="Multi-line text entry with a live character count."
            >
              <div className="space-y-3">
                <Textarea
                  placeholder="Write a flight report..."
                  value={textareaValue}
                  onChange={(event) => setTextareaValue(event.target.value)}
                  rows={4}
                />
                <p className="text-right text-xs text-muted-foreground">
                  {textareaValue.length} characters
                </p>
              </div>
            </DemoSection>

            <DemoSection
              title="06. Dialog"
              description="A modal window for important actions and information."
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Open dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm flight request</DialogTitle>
                    <DialogDescription>
                      Are you ready to submit your flight request?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="rounded-lg bg-muted p-4 text-sm">
                    <p>Route: OTHH ? EGLL</p>
                    <p>Aircraft: Airbus A350-900</p>
                  </div>
                  <DialogFooter>
                    <Button variant="gold">Confirm request</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DemoSection>

            <DemoSection
              title="07. Sheet"
              description="A slide-out panel for secondary navigation or details."
            >
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open sheet</Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Flight details</SheetTitle>
                    <SheetDescription>
                      Example information displayed in a side panel.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-3 text-sm">
                    <p><strong>Callsign:</strong> QTR101</p>
                    <p><strong>Aircraft:</strong> A359</p>
                    <p><strong>Departure:</strong> OTHH</p>
                    <p><strong>Arrival:</strong> EGLL</p>
                  </div>
                </SheetContent>
              </Sheet>
            </DemoSection>

            <DemoSection
              title="08. Table"
              description="Structured data with reusable table primitives."
            >
              <Table>
                <TableCaption>Example pilot activity records.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Callsign</TableHead>
                    <TableHead>Aircraft</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>QTR101</TableCell>
                    <TableCell>A359</TableCell>
                    <TableCell><Badge variant="airborne">Airborne</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>QTR202</TableCell>
                    <TableCell>B77W</TableCell>
                    <TableCell><Badge variant="parked">Parked</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>QTR303</TableCell>
                    <TableCell>B788</TableCell>
                    <TableCell><Badge variant="stopped">Stopped</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </DemoSection>

            <DemoSection
              title="09. Tabs"
              description="Switch between different content panels."
            >
              <Tabs defaultValue="flights" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="flights" className="flex-1">
                    Flights
                  </TabsTrigger>
                  <TabsTrigger value="pilots" className="flex-1">
                    Pilots
                  </TabsTrigger>
                  <TabsTrigger value="events" className="flex-1">
                    Events
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="flights" className="rounded-lg border border-border p-4 text-sm">
                  View and manage scheduled flights.
                </TabsContent>
                <TabsContent value="pilots" className="rounded-lg border border-border p-4 text-sm">
                  Browse pilot profiles and activity.
                </TabsContent>
                <TabsContent value="events" className="rounded-lg border border-border p-4 text-sm">
                  Explore upcoming community events.
                </TabsContent>
              </Tabs>
            </DemoSection>

            <DemoSection
              title="10. Tooltip"
              description="Helpful information shown on hover or keyboard focus."
            >
              <div className="flex flex-wrap gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Hover over me</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Helpful information appears here.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </DemoSection>

            <DemoSection
              title="11. Skeleton"
              description="Loading placeholders for content that is not ready."
            >
              <div className="space-y-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowSkeleton((current) => !current)}
                >
                  {showSkeleton ? "Show content" : "Show skeleton"}
                </Button>
                {showSkeleton ? (
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-bold">
                      QTR
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Qatari Virtual</p>
                      <p className="text-xs text-muted-foreground">
                        Pilot profile loaded
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </DemoSection>

            <DemoSection
              title="12. Progress"
              description="Adjust the progress bar using the slider."
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Flight completion</span>
                  <span className="text-sm text-muted-foreground">
                    {progress}%
                  </span>
                </div>
                <Progress value={progress} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(event) => setProgress(Number(event.target.value))}
                  className="w-full accent-[#6A0C2C]"
                  aria-label="Adjust progress"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </DemoSection>

            <DemoSection
              title="13. Accordion"
              description="Expandable sections for additional information."
            >
              <Accordion>
                <AccordionItem>
                  <AccordionTrigger>What is OryxOps?</AccordionTrigger>
                  <AccordionContent>
                    OryxOps is the operational platform used to manage
                    virtual airline activities and pilot workflows.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem>
                  <AccordionTrigger>How do pilots request flights?</AccordionTrigger>
                  <AccordionContent>
                    Pilots can submit flight requests through the platform
                    and follow their request status.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem>
                  <AccordionTrigger>Where can I find events?</AccordionTrigger>
                  <AccordionContent>
                    Community events can be viewed through the event
                    management section.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </DemoSection>

            <DemoSection
              title="14. Vertical Timeline"
              description="Display events and progress in chronological order."
            >
              <VerticalTimeline>
                <TimelineItem
                  title="Flight request submitted"
                  description="Your request has been received."
                  timestamp="09:00"
                  status="completed"
                />
                <TimelineItem
                  title="Staff approval"
                  description="The request is being reviewed."
                  timestamp="09:15"
                  status="active"
                />
                <TimelineItem
                  title="Flight scheduled"
                  description="Waiting for approval to complete."
                  timestamp="Pending"
                  status="pending"
                />
                <TimelineItem
                  title="Previous request"
                  description="An example of a request that could not be completed."
                  timestamp="Yesterday"
                  status="error"
                />
              </VerticalTimeline>
            </DemoSection>
          </div>

          <div className="border-t border-border pt-5 text-center text-xs text-muted-foreground">
            OryxOps Design System · Component Showcase
          </div>
        </div>
      </main>
    </TooltipProvider>
  );
}
