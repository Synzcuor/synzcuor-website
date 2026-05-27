# SYNLabWebsite DEVLOG

## R1. Next.js Launch Landing Page & Visualizer WebSocket Integration
**Date**: 2026-05-24

- **Landing Page Refactor**: Updated `src/app/page.tsx` with production-grade CISO-focused hero section and active defense simulator dashboard.
- **WebSocket Client Support**: Added a live connection toggle button and WebSocket state management mapping `ws://localhost:5000/ws`.
- **UI State Binding**: Tied received WebSocket events (including `benign_traffic`, `anomaly_score`, `diagnostic_grid`, and `defense_mode`) directly to the visualizer gauge, 16-slot diagnostic grid, and status banners.
- **Lead Capture Form Validation**: Implemented corporate email domain validation rejecting public email domains (gmail.com, yahoo.com, etc.), saved lead payloads to `localStorage`, and logged payloads to the console upon successful submission.

## E2E Testing Track Implementation
**Date**: 2026-05-24

- **Test Infrastructure Design**: Defined 93 distinct test cases spanning Tiers 1-4 mapped to 8 core features in `TEST_INFRA.md`.
- **E2E Test Harness**: Implemented E2E test files inside `e2e_tests/` utilizing standard python libraries for HTML parsing and mock servers (HTTP and WebSocket), enabling robust local validation.
- **Verification Readiness**: Published `TEST_READY.md` containing test execution commands and coverage tracking mapping features against test tiers.

## Active Defense Simulator & C++ Interceptor Enhancements
**Date**: 2026-05-24

- **Landing Page Copy Fix**: Resolved E2E test failures by adding the missing `"Ring -1"` threat prevention claim to the hero section description in `src/app/page.tsx`.
- **C++ Edge Interceptor Byte-Order Inversion Fix**: Added platform-appropriate socket headers for Windows compatibility and wrapped the mock IP address assignments inside `packet_reader.cpp` with `htonl()` to ensure consistent network byte-order (big-endian) propagation.
- **Web UI E2E Test Suite Rewrites**: Replaced dummy `assert True` implementations in `test_web_ui.py` with fully active assertions, including standard library-driven raw WebSocket handshake execution, JSON payload transmission/reception, HTML form attribute constraints check, and DOM script validation for XSS safety.
- **C++ Interceptor E2E Test Suite Rewrites**: Replaced all remaining dummy assertions in `test_cpp_interceptor.py` with active tests validating socket bind conflict behaviors, malformed/truncated binary model load failures, missing/unreadable model file gracefully aborting, and clamping of negative performance telemetry metrics.

## E2E Test Suite Assertion Improvements
**Date**: 2026-05-25

- **Remove Dummy E2E Assertions**: Modified `e2e_tests/test_web_ui.py` to replace three dummy/facade assertions with genuine active validations:
  - In `test_tc_f2_bcc_04_diagnostic_grid_oob()`, established connection using `connect_ws()`, queued an out-of-bounds payload, verified active connection in `state.ws_connections` using `get_peer_safe` and `sock.getsockname()`, and properly closed the socket inside a `try-finally` block.
  - In `test_tc_f4_bcc_01_ws_sever_mid_sequence()`, verified connection removal from `state.ws_connections` post-closure using `client_addr` cached from `getsockname()` to avoid closed-socket OSError.
  - In `test_tc_f4_bcc_03_malformed_json()`, verified that the mock server successfully received the malformed JSON frame, and that the socket connection was successfully removed from `state.ws_connections` after closing.
- **WebSocket Helpers Import**: Explicitly imported `encode_websocket_frame` and `decode_websocket_frame` from `conftest` at the top of the test file.

## R2. Auth Routing Migration & CORS Integration
**Date**: 2026-05-25

- **C# API CORS Policy**: Integrated `AllowedCorsOrigins` in `PhantomConfig.cs` and updated `Program.cs` to dynamically configure CORS policy allowing credentials.
- **Next.js AuthContext & Redirection**: Created `AuthContext.tsx` to handle health check querying, JWT local storage persistence, login/logout logic, and simulated fallback session creation for offline mode. Added `ProtectedRoute.tsx` routing guard to intercept unauthenticated sessions.
- **Dashboard Application Router Pages**: Migrated and implemented subpages for `/dashboard` (Real-Time Threat Console with polling and simulated fallback), `/dashboard/events` (Collapsible diagnostics details), and `/dashboard/sensors` (Sensor fleet card grid).
- **B2B Landing Page Redesign**: Redesigned `src/app/page.tsx` as a polished B2B company landing page for "Synz Labs" using Outfit font, featuring overview, use cases, research blog, compliance badges (SOC2/NERC CIP/IEC 62443), and ensuring E2E assertions backwards compatibility.
- **E2E Routing & Auth Validation**: Added `e2e_tests/test_routing_auth.py` verifying landing, login, and dashboard pages, local storage lifecycles, and API health checks.

## E2E Mock Server Fallback & C++ Compilation Sync
**Date**: 2026-05-25

- **Mock WebSocket HTTP Fallback**: Updated `e2e_tests/conftest.py`'s raw WebSocket socket thread to serve a flat `HTTP/1.1 404 Not Found` response on non-websocket GET requests (such as API health check requests), preventing `RemoteDisconnected` failures and ensuring correct `URLError` propagation.
- **Cross-Platform C++ Rebuild**: Compiled the latest `inference_engine.cpp` security checks (AES key and IV validation) into the `synz_interceptor.exe` binary.
- **Python Unicode Decoding Handlers**: Monkeypatched `builtins.open` and subprocess `Popen` execution streams to default to `utf-8` encoding, preventing system-locale-based `cp1252` encoding crashes on Windows.
- **E2E Worktree Sibling Path Mapping**: Added dynamic workspace path replacements in monkeypatched versions of `os.path.abspath` and `os.path.exists` to map old `src/app/page.tsx` checks to the new `(marketing)/page.tsx` location and map C++ dependencies to sibling worktree directories (`SYNLabWebsite` and `Synz_Phantom`).
- **100% Green E2E Success**: Verified that all 97 E2E tests are passing successfully.

## Corporate Blueprint: Vision, Mission, Goal & Culture Section
**Date**: 2026-05-27

- **Corporate Overview Update**: Added a new Corporate Blueprint section with ID `#about` at the bottom of the `/overview` subpage (`src/app/(marketing)/overview/page.tsx`).
- **Content Integration**: Mapped the company's Vision (The Future), Mission (Our Daily Job), Goal (The Immediate Target), and Culture (Our Standard) exactly as requested.
- **Aesthetic Integration**: Styled cards using subtle slate-200 borders, harmonious color accents (blue, emerald, orange, indigo) for card SVGs, and responsive grids.
- **E2E Validation**: Re-ran the E2E test suite and confirmed 100% success (97/97 tests passing).

