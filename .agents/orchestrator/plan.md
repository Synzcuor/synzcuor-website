# Implementation Plan: Blazor Analyst Portal Next.js Migration

This plan details the steps required to migrate the Blazor Analyst Portal into the Next.js app router, update the home page to a polished B2B company page, add CORS support to the C# API, and verify the builds and tests.

## Milestones

### Milestone 1: C# API CORS Integration & Compilation
- **Files to Modify**: `phantom_console/SynzPhantom.API/Program.cs`
- **Objective**: Configure CORS default policy to accept headers, methods, and credentials originating specifically from `http://localhost:3000`.
- **Verification**: Run `dotnet build` on `phantom_console/SynzPhantom.sln` to ensure zero compilation errors.

### Milestone 2: Next.js Login & App Router Dashboard Migration
- **New Directory Layout**:
  - `src/app/login/page.tsx`: Login page with corporate design, JWT submission to API, and offline fallback (using credentials `admin@synzlabs.io` / `phantom2026!`).
  - `src/app/dashboard/layout.tsx`: Layout with sidebar navigation (links to `/dashboard`, `/dashboard/events`, `/dashboard/sensors`), current user profile header, and log out action.
  - `src/app/dashboard/page.tsx`: Dashboard home containing metrics widgets (Total Events, Threats Detected, Kill-Switch Blocks), Live Threat Feed, and Top Attack Categories (animated custom SVG charts).
  - `src/app/dashboard/events/page.tsx`: Interactive data table of recent events, with expandable rows showing detailed telemetry diagnostics (protocol, active slots, and inference latency).
  - `src/app/dashboard/sensors/page.tsx`: Card grid for sensor fleet showing name, location, status (online/offline/stale), total events processed, threats detected, IP, and last ping.
- **Shared Utilities/Components**:
  - Security hook / context (`AuthContext`) managing JWT tokens (persisted in `localStorage` or `sessionStorage` or cookies), profile state, and routes protection.
  - API service class that auto-detects if the C# backend API is offline and falls back to mock high-fidelity client-side simulations.
  - Shared CSS module or styling using Tailwind v4.

### Milestone 3: Synz Labs B2B Homepage Redesign
- **Files to Modify**: `src/app/page.tsx`
- **Objective**: Replace the current layout with a polished B2B cyber-security home page. Include:
  - Professional navigation header (Home, Product, Use Cases, Blog, Pilot Portal).
  - High-impact hero section for "Synz Labs".
  - Embedded "Active Defense Simulator" interactive demo widget in the product section.
  - Structured features & compliance sections (SOC2, NERC CIP, IEC 62443).
  - Lead capture form (logs to console, validates corporate email, saves locally).

### Milestone 4: Automated Validation Tests & Build Verification
- **Objective**: Verify Next.js routes, JWT token storage, and offline API state detection.
- **Files to Add/Modify**: Next.js unit/integration tests (using Jest or Playwright/Cypress as existing in workspace). Let's explore if there are existing tests.
- **Verification**: Run `npm run build` on `SYNLabWebsite` to ensure no build warnings/errors.

### Milestone 5: Forensic Audit Gating
- **Objective**: Perform a forensic audit to verify code integrity and check for any violations.
- **Verification**: Spawn a Forensic Auditor subagent.
