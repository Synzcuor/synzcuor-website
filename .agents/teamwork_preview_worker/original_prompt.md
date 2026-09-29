## 2026-05-25T07:27:39Z

You are the teamwork_preview_worker.
Your task is to implement all requirements defined in C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads/ORIGINAL_REQUEST.md.

Specifically, execute the following implementation steps:

Step 1: C# API CORS Integration
- In the C# backend project:
  - Edit `phantom_console/SynzPhantom.Core/Config/PhantomConfig.cs` to add the configuration property:
    ```csharp
    /// <summary>Comma-separated list of allowed CORS origins.</summary>
    public string AllowedCorsOrigins { get; set; } = "http://localhost:3000";
    ```
  - Edit `phantom_console/SynzPhantom.API/Program.cs` to configure CORS default policy to accept headers, methods, and credentials originating dynamically from origins defined in `config.AllowedCorsOrigins` (defaulting to "http://localhost:3000"):
    ```csharp
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy =>
        {
            var origins = config.AllowedCorsOrigins?
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                ?? new[] { "http://localhost:3000" };

            policy.WithOrigins(origins)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        });
    });
    ```
  - Run C# build verification: run `dotnet build` in `phantom_console` and make sure it compiles with zero errors.

Step 2: Next.js App Router Pages Migration & Auth Context
- In the Next.js frontend workspace:
  - Create `src/context/AuthContext.tsx` to handle authentication, API health check (GET http://localhost:5000/health), JWT storage in `localStorage` under `phantom_token` / `phantom_user` keys, login logic (posting email + password to `http://localhost:5000/api/v1/auth/login`), logout logic (clearing local storage and redirecting), and offline fallback logic.
    - Offline fallback: If the health check fails or login POST request fails due to API being offline, check credentials against email `admin@synzlabs.io` and password `phantom2026!`. If matched, log in locally with simulated session flag `isSimulated: true` and a mock token `mock-simulated-jwt-token-2026`.
  - Create `src/components/ProtectedRoute.tsx` to wrap child pages and perform client-side authentication checks: if not loading and not authenticated, push router to `/login`.
  - Update `src/app/layout.tsx` to wrap body content in `<AuthProvider>`.
  - Create `/login` page at `src/app/login/page.tsx` with a clean Cyberpunk dark-theme glassmorphism panel. It must check API health, show a banner identifying whether the backend is online or in offline simulated mode, collect email and password, show errors on validation failure, and redirect to `/dashboard` on success.
  - Create `/dashboard` layout at `src/app/dashboard/layout.tsx` containing sidebar links to `/dashboard`, `/dashboard/events`, and `/dashboard/sensors`, a user profile display, and a log out action.
  - Create `/dashboard` home page at `src/app/dashboard/page.tsx` containing:
    - Metrics widgets (Total Events, Threats Detected, Kill-Switch Blocks).
    - Live threat feed list table (polling GET http://localhost:5000/api/v1/events?pageSize=10).
    - Top Attack Categories custom animated SVG graphs.
    - Support for offline fallback: if C# backend is offline or token is invalid, automatically display high-fidelity simulated metrics and feeds client-side.
  - Create `/dashboard/events` page at `src/app/dashboard/events/page.tsx` with an interactive threat event log table (polling GET http://localhost:5000/api/v1/events?pageSize=50). Clicking "Diagnostics" on a row must toggle an expandable detail area displaying:
    - Active Diagnostics (protocol/exploit slots).
    - Detection Interceptor (sensor name and ID).
    - Inference Latency (ms).
    - Support a manual "Refresh Feed" button and offline mock telemetry simulation.
  - Create `/dashboard/sensors` page at `src/app/dashboard/sensors/page.tsx` displaying a card grid of the sensor fleet (polling GET http://localhost:5000/api/v1/sensors). Each card must display: name, status (Online/Offline/Stale), deploy location, processed events, threats detected, IP address, and last ping. Supports offline mock nodes simulation.

Step 3: Redesign Landing Page (src/app/page.tsx)
- Redesign the root homepage as a polished, professional B2B company landing page for "Synz Labs".
- Make sure to keep it B2B dark-theme, sans-serif Outfit font, structured navigation, Product Overview, Use Cases, Threat Research Blog, and Compliance SOC2 / NERC CIP / IEC 62443 badges.
- Ensure 100% backwards-compatibility with the existing E2E tests in `e2e_tests/test_web_ui.py`. You MUST retain the exact text strings, headings, class names, IDs, variables, select option values, and simulator logic/state mappings:
  - Hero head containing `"Stop Zero-Day"` and `"Ransomware Detonations"`.
  - Content copy containing `"sub-50µs"` and `"Ring -1"`.
  - Specialized industrial cyber-defense badge containing `"Quantum-Enhanced"`.
  - Link with text `"Launch Active Demo"` and `href="#simulator"`.
  - Simulated firmware pre block showing:
    `[BPF] Loading eBPF object: synz_xdp.o`
    `model decrypted` (case insensitive)
    `[GPIO] NC Relay output line 18 initialized`
  - Anomaly gauge initialized at 12% (`"12%"`).
  - Port Scan button containing `"Port Scan (Recon)"` or ID `"btn-scan"`.
  - Detonate Exploit button and Reset Connection button (label `"Reset Connection"` or ID `"btn-reset"`).
  - Local state showing `"monitor"`, `"software"`, `"hardware"`.
  - Lead form inputs with placeholders/IDs for `name`, `email`, `company`, and `role` select options (`ciso`, `plant_mgr`, `ot_eng`).
  - Personal domains email rejection showing success text `"Pilot Application Received"` and saving lead details to `localStorage` under `leadCapture` key.
  - WebSocket stream toggle switch.
  - Check `e2e_tests/test_web_ui.py` assertions carefully to ensure your redesign doesn't break any of them.

Step 4: Create Automated Validation Tests
- Add a new validation test suite at `e2e_tests/test_routing_auth.py` using standard pytest.
- It must test and assert:
  - Routing behavior to `/login`, `/dashboard`, `/dashboard/events`, `/dashboard/sensors`.
  - JWT token storage lifecycle and fallback simulated session creation on offline authentication.
  - API connection state detection logic.
- Ensure the tests use python's standard libraries (like `urllib.request` and `HTMLParser`) and are robust.

Step 5: Compilation, Run Tests & Verify
- Navigating to the Next.js workspace, run `npm run build` to verify there are zero compile/TypeScript warnings or errors.
- Navigating to the C# workspace, run `dotnet build` to verify there are zero compiler errors.
- Run `pytest e2e_tests/` and verify that ALL tests (including the existing ones and the new ones) compile, execute, and pass.
- Record progress and write a handoff report listing passing builds and test commands and layouts.
- Git commit all files modified with a descriptive commit message in both active repositories, and update `DEVLOG.md` as required.
