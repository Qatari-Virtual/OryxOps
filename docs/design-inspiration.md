# Design Inspiration & Visual Reference 🎨📸

> Visual reference patterns, typography, and component blueprints captured directly from the **Qatar Airways Virtual** landing portal (`qatarivirtual.com`).

---

## 1. Overview & Architectural Role

To ensure OryxOps feels like a native extension of **Qatar Airways Virtual**, the design system borrows layout conventions, color treatments, card radii, and typography scales directly from `qatarivirtual.com`.

The screenshots below serve as the primary visual source of truth for component implementation across all sprints.

---

## 2. Inspiration Gallery & Component Mapping

### 2.1 Hero Navigation, Metric Counters & Fleet Showcase Card

![Hero Header and Navigation](docs/assets/inspiration/01_hero_header_stats.jpg)

![Operational Stats Row and Fleet Card](docs/assets/inspiration/02_stats_and_fleet_card.jpg)

#### Visual Elements & Design Tokens
- **Top Navigation Bar:**
  - Background: Deep Al-Annabi burgundy (`#4A0820` / `#5C0632`).
  - Text: High-contrast white (`#FFFFFF`) with dropdown chevrons (`RiArrowDownSLine`).
  - Action CTA: Rounded pill button (`Apply ↗` with `RiArrowRightUpLine`), deep burgundy background, bold contrast.
- **Operational Metric Counter Strip:**
  - Circular bordered micro-icons above tabular figures.
  - Value Typography: Bold Al-Annabi burgundy (`#6A0C2C`), large tabular figures (`text-2xl font-bold font-mono`).
  - Metric Labels: Uppercase, tracking-wider, muted slate (`text-[10px] font-bold tracking-wider text-slate-500`).
- **Fleet Showcase Card:**
  - High-radius container (`rounded-3xl` / `rounded-2xl`).
  - Deep burgundy background (`#4A0820`) with watermark ICAO aircraft codes in faded burgundy (`CL35`, `A333`, `A320`, `A21N`).
  - Aircraft renders positioned cleanly over cards.

#### OryxOps Component Mapping
- **`BentoGrid` / `MetricCard`:** Metric counters directly inform the dashboard KPI strip (Active Flights, Available Fleet, PIREPs Filed, Hours Logged).
- **`UnassignedAircraftList` & `AirframeRosterCard`:** Fleet cards directly inform the categorized aircraft picker with watermark ICAO types.

---

### 2.2 Horizontal Step Progression Rail (`PhaseRail`)

![Journey Step Rail](docs/assets/inspiration/03_journey_step_rail.png)

#### Visual Elements & Design Tokens
- **Connector Line:** Continuous horizontal line in brand border tone (`#EAD9DF` light / `#3F1E29` dark).
- **Step Nodes:** Circular nodes (`w-12 h-12 rounded-full`) in solid burgundy (`#6A0C2C`) with white icons.
- **Micro-Labels:** Uppercase micro-heading (`STEP 1`, `STEP 2`, `STEP 3`) in soft burgundy text.
- **Step Title:** Bold dark text (`font-bold text-gray-900` light / `text-white` dark).
- **Description:** Two-line supporting text in muted slate (`text-sm text-gray-500`).

#### OryxOps Component Mapping
- **Kokonut `PhaseRail` (`frontend/src/components/kokonut/phase-rail.tsx`):**
  - Maps 1:1 to the live flight progress tracker:
    `PREFLIGHT` $\rightarrow$ `TAXI` $\rightarrow$ `CLIMB` $\rightarrow$ `CRUISE` $\rightarrow$ `TOD / DESCENT` $\rightarrow$ `APPROACH` $\rightarrow$ `LANDED`.
  - Completed phases render with checkmark nodes; the active phase highlights in Al-Annabi burgundy with champagne gold accents.

---

### 2.3 FAQ Accordion & Collapsible Inspection Cards

![FAQ Accordion Cards](docs/assets/inspiration/04_faq_accordion_cards.png)

#### Visual Elements & Design Tokens
- **Card Separation:** Distinct separated rows with vertical gap (`space-y-3` / `space-y-4`) rather than continuous divider lines.
- **Container Styling:** `rounded-2xl`, crisp `1px` hairline border (`#EAD9DF`), pure white background (`#FFFFFF`), subtle hover border transition.
- **Typography:** Bold dark text (`font-semibold text-base text-gray-900`) with generous internal padding (`px-6 py-4`).
- **Chevron Indicator:** Burgundy chevron icon (`RiArrowDownSLine` / `RiArrowUpSLine`) rotating 180° on expansion.

#### OryxOps Component Mapping
- **shadcn `Accordion` & `CollapsibleCard`:**
  - Used for flight briefing packages, SimBrief OFP route sections, aircraft technical specifications, and PIREP review notes.

---

### 2.4 Staff & Pilot Profile Cards

![Staff Hierarchy Cards](docs/assets/inspiration/05_staff_hierarchy_cards.png)

#### Visual Elements & Design Tokens
- **Pilot Card Styling:**
  - Pill / rounded-2xl cards with deep burgundy background (`#5C0632` / `#4A0820`).
  - Circular bordered avatar on the left with 2px accent border.
  - Pilot Name: Bold white (`font-bold text-white text-base`).
  - Pilot Rank / Role: Uppercase micro-label (`text-[10px] font-semibold text-rose-200/80 tracking-wider`).
- **Grouping Containers:** Rounded white cards with soft border lines grouping operational departments.

#### OryxOps Component Mapping
- **`PilotProfileCard` (`frontend/src/components/ui/pilot-profile-card.tsx`):**
  - Used for top bar pilot identity, self-assignment cards, and crew dispatch lists.

---

### 2.5 Aircraft Specification Card & Expandable Technical Table

![Fleet Specification Card Overview](docs/assets/inspiration/06_fleet_spec_card_overview.png)

![Fleet Technical Specification Table Expanded](docs/assets/inspiration/07_fleet_spec_table_expanded.jpg)

#### Visual Elements & Design Tokens
- **Two-Part Card Architecture:**
  - Left side: Deep burgundy container (`#4A0820` / `#5C0632`, `rounded-xl`) framing the high-resolution airframe render.
  - Right side: Title header (`A320`), descriptive role sentence, horizontal row of performance pills (`Pax: 140–186`, `Range: 3,300 nm`, `Mach 0.78`) in pale-burgundy chip backgrounds (`#F8F1F4` with `#6A0C2C` text).
  - Rank Lock Requirement: Bullet indicator (`● Unlocks at Cadet (0–10h)`).
- **Expandable Technical Specifications Table:**
  - Chevron trigger: `View specifications ^` rotating on expand.
  - Two-column dense key-value grid:
    - Left column: Subtle muted slate labels (`Manufacturer`, `Wingspan`, `First Flight`, `MLW`, `MMO`, `Engines`).
    - Right column: Tabular bold dark values (`Airbus`, `117 ft 5 in / 35.8 m`, `171,961 lb / 78,000 kg`, `FL410`).
  - Separated by clean hairline horizontal border dividers (`#EAD9DF`).

#### OryxOps Component Mapping
- **`AirframeDetailCard` (`frontend/src/components/ops/AirframeDetailCard.tsx`):**
  - Used directly for the **Categorized Unassigned Aircraft Roster** and the EFB Aircraft specs tab.
  - Provides pilots with immediate airframe limits (MTOW, MLW, Ceiling, Range) before claiming.

---

### 2.6 Route Database Table & Operational Filter Bar

![Route Database Table and Filters](docs/assets/inspiration/08_route_database_table_filters.png)

#### Visual Elements & Design Tokens
- **Search & Multi-Filter Bar:**
  - Rounded filter inputs (`rounded-xl`, `border border-[#EAD9DF]`, `px-3 py-2`).
  - Dropdowns: `All Airlines v`, `All Aircraft v`, `All Liveries v`, `Under v`.
  - Monospace ICAO search fields: `Departure` and `Arrival` inputs.
  - Action Button: Solid burgundy button (`Search` in `#6A0C2C` with white text).
  - Counter Metadata: Muted monospace counter (`5,376 routes`).
- **Dense Operational Table Design:**
  - **Table Header Banner:** Solid Al-Annabi burgundy background (`#6A0C2C`), white bold uppercase text: `Flt Num`, `Dep`, `Arr`, `Aircraft & Livery`, `Duration ▲`.
  - **Flight Number Cells:** Distinct bordered badges (`QR1 Classic`, `QR1`, `QR3`, `+6`) with small route map icons.
  - **Dep / Arr Cells:** High-contrast tabular monospace ICAO codes (`OTHH`, `EGLL`, `OTBD`, `OMDB`, `LSGG`).
  - **Aircraft & Livery Cells:** Soft rounded pills (`Boeing 777-300ER (Qatar)`, `Airbus A350-900 +4`).
  - **Duration Cells:** Monospace tabular figures aligned cleanly on the right (`7h 0m`, `5h 35m`, `0h 50m`).

#### OryxOps Component Mapping
- **`FlightTable` (`frontend/src/components/ui/table.tsx`):**
  - Standard table pattern for **Schedule Booking**, **Active Live Flights**, **PIREP Log**, and **ACARS Messages**.
  - Solid burgundy header instantly identifies the view as official airline operations data.

---

### 2.7 Callout Banner & Footer Shell

![Footer Callout Banner](docs/assets/inspiration/09_footer_cta_banner.jpg)

#### Visual Elements & Design Tokens
- **Callout Section:**
  - Rich Al-Annabi burgundy canvas with large display heading ("Ready to fly with the best?").
  - Large pill action button (`Apply Now ↗`) with white background and burgundy text.
- **Footer Navigation Shell:**
  - Logo lockup: Qatari Virtual "The Home Of Excellence".
  - Clean two-column link directories with underlined hover states.

#### OryxOps Component Mapping
- **`CalloutBanner` & `Footer`:**
  - Informs the bottom operational banner for flight release triggers and EFB status bars.

---

### 2.8 The Signature Burgundy Left-Accent Stripe Card

![Testimonial Card with Burgundy Accent Stripe](docs/assets/inspiration/10_testimonial_accent_stripe_card.png)

![CEO Vision Message Card](docs/assets/inspiration/11_ceo_vision_accent_card.jpg)

#### Visual Elements & Design Tokens
- **Signature Accent Stripe:**
  - Distinctive `4px` vertical Al-Annabi burgundy bar (`border-l-4 border-brand` / `#6A0C2C` or `#A8244E`) along the left card perimeter.
  - Gives standard white cards high visual distinction without full background saturation.
- **Card Body:**
  - `rounded-2xl` container with subtle border (`border border-[#EAD9DF]`).
  - Pale quote watermark icon in upper-left.
  - Body text in comfortable reading typography (`text-gray-700 italic text-sm leading-relaxed`).
  - Signature attribution footer: Bold Al-Annabi callsign (`Daniel | QRV012` or `@bumy`).

#### OryxOps Component Mapping
- **`Card` Variant (`variant="accent-stripe"` / `frontend/src/components/ui/card.tsx`):**
  - Essential pattern for **NOTAM Warnings**, **Operational Dispatch Advisories**, **TOD Escalation Notices**, and **Flight Release Confirmations**.

---

### 2.9 Vertical Operational Timeline (`VerticalTimeline`)

![Our Story Vertical Timeline](docs/assets/inspiration/12_vertical_story_timeline.png)

#### Visual Elements & Design Tokens
- **Continuous Spine:** Continuous thin vertical line in Al-Annabi burgundy (`w-0.5 bg-brand` / `#6A0C2C`).
- **Timeline Nodes:** Small circular node (`w-4 h-4 rounded-full border-2 border-brand bg-white`) centered along the spine.
- **Card Layout:**
  - Separated `rounded-2xl` cards connected to the spine.
  - Uppercase Monospace Timestamp: `MAY 2023`, `JUNE 2023` in muted brand text (`text-[10px] font-bold font-mono tracking-wider text-brand`).
  - Title: Bold operational milestone (`Qatari Virtual Takes Off`, `Our First Codeshare`).
  - Description: Supporting narrative.

#### OryxOps Component Mapping
- **`VerticalTimeline` (`frontend/src/components/ui/timeline.tsx`):**
  - The exact UI pattern required for **Live ACARS Chronological Events**, **Pilot Career Flight Logs**, **PIREP Status Audit Trails**, and **Aircraft Maintenance Milestones**.

---

## 3. Summary of Core Visual Constants

| Element | Specification from `qatarivirtual.com` | CSS Variable / Class |
| :--- | :--- | :--- |
| **Card Radius** | Generous smooth corners | `rounded-2xl` (`1rem`) to `rounded-3xl` (`1.5rem`) |
| **Borders** | Subtle hairline borders | `1px solid var(--border)` (`#EAD9DF` / `#272A35`) |
| **Primary Burgundy** | Annabi heritage maroon | `var(--brand)` (`#6A0C2C` / `#A8244E`) |
| **Deep Burgundy Surface** | Dark accent cards & pilot badges | `var(--brand-dark)` (`#4A0820` / `#6A0C2C`) |
| **Icon Standard** | Consistent outline and fill icons | `@remixicon/react` (`Ri*`) |
| **Typography Hierarchy** | Bold burgundy titles + dark body + uppercase micro-labels | `tracking-tight font-extrabold` + `tracking-wider font-mono` |
