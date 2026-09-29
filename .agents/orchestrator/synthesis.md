# Synthesis of Explorers' Findings

## 1. CORS Policy on C# API
- **File**: `SynzPhantom.API/Program.cs` and `SynzPhantom.Core/Config/PhantomConfig.cs`.
- **Change**: Restricted CORS from `AllowAnyOrigin()` to origins matching `http://localhost:3000` with `.AllowCredentials()`.
- **Implementation**:
  - Add `AllowedCorsOrigins` configuration in `PhantomConfig.cs` (default `http://localhost:3000`).
  - Read from configuration and set up `.WithOrigins()` dynamically in `Program.cs`.

## 2. Next.js Routing and Authentication (App Router)
- **Path structure**:
  - `/login` (Auth & offline fallback): `src/app/login/page.tsx`
  - `/dashboard` (Sidebar layout & dashboard page): `src/app/dashboard/layout.tsx` and `src/app/dashboard/page.tsx`
  - `/dashboard/events` (Events table with expandable diagnostics): `src/app/dashboard/events/page.tsx`
  - `/dashboard/sensors` (Sensors card grid): `src/app/dashboard/sensors/page.tsx`
- **Session Management**: Store JWT token, refresh token, expiration, and user info in `localStorage` upon successful login.
- **Offline Fallback**: If `fetch` to `/api/v1/auth/login` fails due to API being offline, check credentials against `admin@synzlabs.io` / `phantom2026!`. If matched, set mock user session with `isSimulated: true` and redirect to `/dashboard`.
- **API State Detection**: Poll backend `/api/v1/auth/keys` or another health endpoint to show API connection state. If connection fails or returns 401/403, flag status dynamically in the UI.

## 3. Homepage Redesign
- **File**: `src/app/page.tsx`
- **Redesign**: B2B dark-theme, Sans-serif typography (`Outfit`), high-end marketing blocks (Overview, Use Cases, Threat Blog, Compliance SOC2/NERC CIP/IEC 62443 badges).
- **Simulator & Form**: Integrate the Active Defense Simulator widget and Lead Capture Form. Ensure all ID/class hooks and exact texts are preserved to remain 100% backwards-compatible with `e2e_tests/test_web_ui.py`.

## 4. Automated Validation Tests
- **File**: `e2e_tests/test_analyst_portal.py`
- **Coverage**: Verify routing to `/login` and `/dashboard`, JWT token storage on login, offline fallback authentication, and API connection state detection.
