
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RiAddLine,
  RiArrowRightLine,
  RiSettings3Line,
} from "@remixicon/react";

export default function Showcase() {
  const [loading, setLoading] = useState(false);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-xl font-bold text-white">
              O
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                OryxOps
              </h1>
              <p className="text-sm text-muted-foreground">
                Component Showcase
              </p>
            </div>
            <div className="ml-auto">
              <Badge variant="burgundy">Task 2.1</Badge>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
              Design System
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              UI Components
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              A preview of OryxOps reusable interface components,
              featuring the Al-Annabi burgundy and champagne-gold theme.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        {/* BUTTON VARIANTS */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold">Button Variants</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Six visual styles for different actions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="gold">Gold</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </section>

        {/* ADVANCED BUTTON OPTIONS */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xl font-bold">Advanced Button Options</h3>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">
            Customizable icons, colours and interactive effects.
          </p>

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-semibold">Icon on the Left</p>
              <div className="flex flex-wrap gap-3">
                <Button icon={<RiAddLine />}>Add Aircraft</Button>
                <Button variant="gold" icon={<RiSettings3Line />}>
                  Settings
                </Button>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold">Icon on the Right</p>
              <div className="flex flex-wrap gap-3">
                <Button
                  icon={<RiArrowRightLine />}
                  iconPosition="right"
                >
                  Continue
                </Button>
                <Button
                  variant="outline"
                  icon={<RiArrowRightLine />}
                  iconPosition="right"
                >
                  View Details
                </Button>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold">White Buttons</p>
              <div className="flex flex-wrap gap-3 rounded-lg bg-brand-dark p-4">
                <Button variant="white">White Button</Button>
                <Button variant="white" icon={<RiAddLine />}>
                  Add New
                </Button>
                <Button
                  variant="white"
                  icon={<RiArrowRightLine />}
                  iconPosition="right"
                >
                  Continue
                </Button>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold">Icon Only</p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="icon"
                  icon={<RiAddLine />}
                  aria-label="Add"
                />
                <Button
                  size="icon"
                  variant="gold"
                  icon={<RiSettings3Line />}
                  aria-label="Settings"
                />
                <Button
                  size="icon"
                  variant="outline"
                  icon={<RiArrowRightLine />}
                  aria-label="Continue"
                />
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold">
                Hover and Press Effects
              </p>
              <p className="mb-3 text-xs text-muted-foreground">
                Hover over and click these buttons to test the animations.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button>Hover Me</Button>
                <Button variant="gold">Press Me</Button>
                <Button variant="white">Try White</Button>
              </div>
            </div>
          </div>
        </section>

        {/* BUTTON SIZES */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xl font-bold">Button Sizes</h3>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">
            Four sizes for different interface requirements.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
           <Button
  size="icon"
  icon={<RiAddLine />}
  aria-label="Add"
/>
          </div>
        </section>

        {/* BUTTON STATES */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xl font-bold">Button States</h3>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">
            Disabled and loading states.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button disabled>Disabled</Button>

            <Button
              loading={loading}
              onClick={simulateLoading}
            >
              {loading ? "Processing..." : "Test Loading"}
            </Button>

            <Button variant="outline" disabled>
              Unavailable
            </Button>
          </div>
        </section>

        {/* BADGE VARIANTS */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-xl font-bold">Badge Variants</h3>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">
            Status indicators and labels for OryxOps.
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

        {/* THEME COLORS */}
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

        <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
          OryxOps Design System · Component Showcase · Task 2.1
        </footer>
      </div>
    </main>
  );
}
