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

