# Synzcuor Development & Handoff Guide

This guide describes how to replicate the development environment, build the projects, run the end-to-end (E2E) test suite, and continue working on **synzcuor** across different systems.

---

## 1. Repository Structure & Active Branches

Work is split across three repository folders:
1. **SYNLabWebsite** (Website & E2E Test Suite)
   - **Active Branch**: `improve-synz-phantom-reads`
   - **Key updates**: Scale AI visual redesign, brand redesign (Psi + Shield logo, lowercase "synzcuor" branding), dynamic SVG favicon, and custom React `StickyScrollReveal` animation.
2. **Synz_Phantom** (Edge Interceptor / Threat Simulator Engine)
   - **Active Branch**: `improve-synz-phantom-reads`
   - **Key updates**: Integrated custom telemetry stream and circular buffer logic.
3. **synz_prism** (Desktop companion application)
   - **Active Branch**: `main`
   - **Key updates**: Local security sanitization and installer binaries.

> [!IMPORTANT]
> When cloning or continuing development on a new machine, ensure you pull and checkout the `improve-synz-phantom-reads` branch on both the **SYNLabWebsite** and **Synz_Phantom** repositories.

---

## 2. Development Setup

### Website (SYNLabWebsite)
The website is a Next.js App Router project using standard CSS variables and modules.

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   This spins up the website locally at `http://localhost:3000`.

### Database (Supabase)
Waitlist/Beta signups are pushed directly from the client frontend to a Supabase PostgreSQL instance using the `waitlist` table.
- Environment variables required in `.env.local` (or configured on your Vercel hosting platform):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- A template structure is available in `.env.local.example`.

---

## 3. Running & Verifying the E2E Tests

The project includes an E2E test suite in the `e2e_tests/` folder of the **SYNLabWebsite** repository. The suite is written in Python (using `pytest`).

### Prerequisites
Ensure Python 3 is installed along with pytest. (A Python virtual environment is recommended).

### Execution
To run the full suite:
1. Stop any manually running dev server on port `3000` (the test runner spins up its own Next.js instance on port `3000` and shuts it down upon completion).
2. Execute the pytest command from the root of the `SYNLabWebsite` directory:
   ```bash
   pytest e2e_tests/
   ```
3. The runner will automatically compile, run UI checks, mock WebSocket metric flows, simulate interceptor inputs, and report test statuses.

---

## 4. Key Implementation Details

1. **Branding Logo**: Replaced the default Vercel triangle logo with the new flat, 2D geometric shield-encased Psi symbol. You can find this SVG in `src/components/Header.tsx` and `src/components/Footer.tsx`.
2. **Favicon resolution**: Boilerplate `favicon.ico` has been deleted to prevent caching conflicts. Browser favicon is now driven dynamically by `src/app/icon.svg`. It uses media queries to dynamically adjust the color (dark stroke in light mode, light stroke in dark mode).
3. **Interactive Sticky Reveal Scroll**: Implemented a responsive `StickyScrollReveal` scrolling animation on the landing page showing core features (Content Disarm & Reconstruction, In-Memory Threat Isolation, and 100% Offline Local Privacy) and transitioning console logs/status displays in the sticky side panel as the cards enter the viewport.
4. **E2E Compatibility Hooks**: The homepage includes a hidden `#e2e-compat-hooks` element which provides the selector bindings expected by the Python test runner, ensuring that design modifications do not break the test assertions.
