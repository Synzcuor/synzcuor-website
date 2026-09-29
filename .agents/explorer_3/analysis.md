# Analysis Report — Synz Labs Homepage Redesign & Test Validation

This report outlines the recommendations and implementation plan for redesigning the Synz Labs homepage as a polished B2B enterprise landing page, adding operators' console routing and JWT session management, and implementing automated validation tests.

---

## 1. Executive Summary

The objective is twofold:
1. **Homepage Redesign**: Transform the existing developer-focused landing page (`src/app/page.tsx`) into a high-converting, professional B2B enterprise homepage. The redesign must introduce structured navigation, comprehensive sections for Product Overview, Use Cases, Threat Research Blog, and Compliance Badges (SOC2, NERC CIP, IEC 62443), while preserving the exact state machine and WebSocket functionality of the threat simulator widget to remain 100% backwards-compatible with the existing E2E test suite.
2. **Console Authentication & Testing**: Recommend a new operators' area with custom routing (`/console/login` and `/console/dashboard`), JWT token storage lifecycle, and dynamic API connection state detection. Provide automated pytest test cases validating these components using the lightweight `HTMLParser` model established in the project.

---

## 2. Homepage B2B Redesign Architecture

The redesigned homepage (`proposed_page.tsx`) is designed to run within the existing Next.js App Router context. It uses Tailwind CSS for clean dark mode styling and a premium sans-serif typography interface (`Outfit` font stack).

### 2.1 Structured Navigation (Header & Footer)
- **Sticky Glassmorphic Header**: Implements a blur background (`bg-[#020408]/80 backdrop-blur-md`) with links targeting key sections (`#overview`, `#usecases`, `#simulator`, `#blog`, `#compliance`) and a prominent "Request Pilot" button.
- **Enterprise Footer**: Contains links divided into multi-column layouts (Product, Resources, Compliance, Legal) and explicitly features compliance indicators alongside standard copyright statements.

### 2.2 Section Structure
1. **Hero Section**: Retains the headline `"Stop Zero-Day Ransomware Detonations Before They Reach the CPU"` and details the `sub-50µs` and `Ring -1` active defense claims. Features a pulsing indicator badge `"Quantum-Enhanced Active Cyber Defense"` and the interactive eBPF interceptor console log block.
2. **Product Overview**: Details the three core pillars: QGAN Model Factory, Tensor Train Compression, and Edge Interceptor Firmware.
3. **Use Cases**: Spotlights three practical industrial deployments: SCADA/ICS Modbus monitoring, Hardware-enforced SSR air-gapping, and Passive monitor auditing.
4. **Interactive Simulator**: Embeds the interactive threat simulator widget. The design integrates:
   - *Left Sidebar*: Controls for defense mode ("monitor" | "software" | "hardware"), WebSocket live connection toggle, simulator detonation controls, and a scrollable Audit Alert Feed.
   - *Right Grid*: Status Integrity display banner, dynamic SVG-based Anomaly Score gauge, a 16-slot eBPF Multihead Diagnostic Classifier grid, and a visual inline link network diagram.
5. **Threat Research Blog**: Showcases three recent threat intelligence publications written by the Synz Labs research team, establishing thought leadership.
6. **Compliance & Standards**: Visually displays badge cards for SOC2, NERC CIP-008 R1, and IEC 62443-4-2.
7. **Lead Intake Form**: Captures name, email, company, and role. Uses corporate domain filtering (rejecting personal domains like Gmail and Yahoo), logs submissions to the console, and writes details to `localStorage` under the `leadCapture` key, transitioning the UI into a clean success block (`"Pilot Application Received"`).

### 2.3 Backwards-Compatibility Assessment
The existing test suite in `e2e_tests/test_web_ui.py` relies on specific DOM elements and strings. The redesign preserves these features exactly:
- **Heading checks**: The main `h1` contains both `"Stop Zero-Day"` and `"Ransomware Detonations"`.
- **Latency copy**: The strings `"sub-50µs"` and `"Ring -1"` are kept in the hero text block.
- **Badge checks**: The badge text `"Quantum-Enhanced"` is rendered inside an inline-flex element.
- **CTA link**: A link containing `"Launch Active Demo"` is mapped with `href="#simulator"`.
- **Pre-tag console logs**: The firmware logs block outputs the exact text strings: `[BPF] Loading eBPF object: synz_xdp.o`, `[ONNX] model decrypted securely in memory`, and `[GPIO] NC Relay output line 18 initialized`.
- **Form fields**: Input element placeholders and attributes match `name`, `email`, `company`, and `select` with options. Corporate domain filter and success string `"Pilot Application Received"` are intact.
- **WebSocket controls**: The connection toggle contains `"websocket"` or `"stream"`.

---

## 3. Console Authentication and Routing Design

To support administrative operators, we design a dedicated Next.js routing folder under `src/app/console/`.

### 3.1 Next.js App Router Structure
```text
src/app/
├── page.tsx                    # Redesigned Homepage
├── layout.tsx                  # Root Layout (Fonts, Global CSS)
└── console/
    ├── login/
    │   └── page.tsx            # Operator Login (/console/login)
    └── dashboard/
        └── page.tsx            # Operational Dashboard (/console/dashboard)
```

### 3.2 Authentication & Session Flow Diagram
```
[ Browser /console/login ]
       │
       ├─► Inputs credentials (email, password)
       ├─► SUBMIT: POST /api/v1/auth/login to C# API (localhost:5000)
       │
[ C# API Backend ]
       │
       ├─► Verifies credentials against Identity Repository
       ├─► Generates signed HS256 JWT + Refresh Token
       ├─► Returns JSON: { token, refreshToken, expiresAt, user }
       │
[ Browser /console/login ]
       │
       ├─► Receives token payload
       ├─► Stores in LocalStorage:
       │     - `synz_token`
       │     - `synz_refresh_token`
       │     - `synz_user`
       ├─► Router redirects to `/console/dashboard`
       │
[ Browser /console/dashboard ]
       │
       ├─► Reads `synz_token` on mount
       ├─► If missing: Redirects to `/console/login`
       ├─► If present: Initiates API connection verification
```

### 3.3 JWT Session Storage Lifecycle
- **JWT Storage**: JWT token and refresh tokens are stored in `localStorage` under `synz_token` and `synz_refresh_token` to maintain persistent session states across browser reloads.
- **Session Removal**: Triggered on:
  1. Manual logout click (`logout-btn`).
  2. Expired session check.
  3. API returning a `401 Unauthorized` or `403 Forbidden` status.
  All token properties (`synz_token`, `synz_refresh_token`, etc.) are removed via `localStorage.removeItem()` prior to router redirect.

### 3.5 API Connection State Detection
The dashboard (`proposed_console_dashboard.tsx`) implements a connection state machine tracking states: `"loading" | "connected" | "offline" | "auth_error"`.
- On page load, it queries the backend API keys endpoint (`/api/v1/auth/keys`) with the stored JWT token: `Authorization: Bearer <token>`.
- **API Online & Valid Token**: Updates state to `"connected"`, displays status badge `"API CONNECTED"`, and renders the keys counts list.
- **API Offline (Network Failure)**: Catch-block intercepts network exceptions, updates state to `"offline"`, displays badge `"OFFLINE"`, and renders a warning banner (`#connection-warning`) indicating telemetry logs are suspended.
- **Token Invalid/Revoked (401/403)**: Updates state to `"auth_error"`, purges local tokens, and redirects back to `/console/login`.
- **Polling Loop**: Operates on a `10000ms` window to dynamically reflect backend state changes in real time.

---

## 4. Test Design & Automated Validation

The automated validation suite (`proposed_test_routing_auth.py`) is written in Python to match the existing pytest testing harness. It leverages standard-library `urllib.request` and a custom subclass of `HTMLParser` (`ConsolePageParser`) to perform HTTP assertions without needing heavy dependencies.

### 4.1 Page Parser Implementation
The parser checks HTML structures for IDs, placeholders, classes, and target scripts:
- **Inputs**: Records type, id, placeholder, and validation rules (such as `required`).
- **Buttons**: Captures text labels and attributes like `id="login-submit-btn"` or `id="logout-btn"`.
- **Status Elements**: Extracts the inner text of status tags, such as `api-connection-status`.

### 4.2 Test Cases Scope
1. **`test_tc_route_01_login_page_rendering`**:
   - Fetches `/console/login`.
   - Asserts page response is 200 OK.
   - Verifies the form inputs (`email-input`, `password-input`) and submission buttons are present.
2. **`test_tc_route_02_dashboard_page_rendering`**:
   - Fetches `/console/dashboard`.
   - Asserts page response is 200 OK.
   - Verifies brand labels and the presence of the `api-connection-status` container.
3. **`test_tc_jwt_01_client_side_redirect_checks`**:
   - Verifies that `/console/dashboard` contains the necessary Javascript checks searching for `synz_token` and triggers `router.push("/console/login")` if missing.
4. **`test_tc_jwt_02_login_payload_handling`**:
   - Verifies that `/console/login` contains script functions writing response parameters (`synz_token`, `synz_refresh_token`) to client storage.
5. **`test_tc_api_state_01_connection_badge_placeholders`**:
   - Checks that the dashboard HTML defines layouts or hooks supporting connection status labels: `"connected"`, `"offline"`, and `"error"`.
6. **`test_tc_api_state_02_connection_loss_banners`**:
   - Asserts that the warning banner block (`connection-warning`) exists in the code layout to display offline warnings when the API drops.

---

## 5. Implementation & Integration Plan

To implement these changes on the target system, follow the step-by-step instructions below.

### 5.1 File Placement
Apply the proposed files to the target workspace paths:

1. **Homepage Redesign**:
   - Copy the proposed homepage code to:
     `C:/Users/Adminb/Documents/SYNLabWebsite/src/app/page.tsx` (or full workspace target paths)
     *Relative destination: `src/app/page.tsx`*
2. **Operators' Console Pages**:
   - Create directories:
     `src/app/console/login`
     `src/app/console/dashboard`
   - Copy login page code to:
     `src/app/console/login/page.tsx`
   - Copy dashboard page code to:
     `src/app/console/dashboard/page.tsx`
3. **Automated Tests**:
   - Copy the pytest file to:
     `e2e_tests/test_routing_auth.py`

### 5.2 Verification Commands
After copying the files, execute these commands in the terminal to verify the layout, compiling, and tests pass:

```powershell
# 1. Navigate to the Next.js workspace
cd C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads

# 2. Build the Next.js application to check for TypeScript and compiler errors
npm run build

# 3. Start the Next.js web application (runs in background on port 3000)
# Note: Ensure the C# API server is NOT active or is active on 5000.
# The e2e test suite will orchestrate dev servers or connect directly.
# To run the test suite:
pytest e2e_tests/ --verbose
```

All 6 new test cases in `test_routing_auth.py` and the 15+ existing UI tests in `test_web_ui.py` should execute and pass, verifying routing, JWT token storage hooks, connection state placeholders, and B2B homepage elements.
