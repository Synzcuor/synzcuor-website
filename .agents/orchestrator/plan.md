# Implementation Plan: Synz Phantom Active Defense Upgrades

## Overview
This plan coordinates the development of the Next.js launch landing page/simulator and C++ Edge Interceptor firmware improvements across two workspaces.

## Milestones & Work Items

### Milestone 1: E2E Test Suite Development (Testing Track)
- **Objective**: Build automated verification tests for both Next.js and C++ requirements.
- **Tasks**:
  1. Define test runner, test format, and structure in `TEST_INFRA.md`.
  2. Implement unit/integration tests for:
     - Next.js lead capture email validation and simulation mode transitions.
     - C++ circular queue sequence correctness.
     - C++ UDP telemetry packet decoding and integration.
     - C++ AES key loading and model decryption.
  3. Publish `TEST_READY.md` once the suite is fully operational and passes against mock/empty implementations.

### Milestone 2: Next.js Landing Page & Simulator (R1)
- **Objective**: Create the marketing landing page and interactive active defense simulator.
- **Tasks**:
  1. Add a WebSocket connection toggle to allow connecting to a C# API (`SynzPhantom.API`) streaming live threat metrics.
  2. When WebSocket is toggled on, open a connection to `ws://localhost:5000/ws` (or configurable URL) and update simulator state dynamically from received messages.
  3. Refactor Lead Intake Form:
     - Implement strict corporate email validation (disallow public domains like gmail.com, yahoo.com, outlook.com, hotmail.com, etc.).
     - Display clear validation error messages.
     - Save lead payloads in `localStorage`.
     - Log payload explicitly to `console.log`.
  4. Ensure `npm run build` compiles with zero warnings or errors.

### Milestone 3: C++ Circular Temporal Queue (R2)
- **Objective**: Implement sequence-based input tracking using a circular buffer.
- **Tasks**:
  1. Add a sequence tracking buffer in the orchestrator (`edge_interceptor/src`).
  2. Store the last 16 network and CPU telemetry events.
  3. Pack the model input vector with these 16 events in chronological order, matching the temporal AC-WGAN architecture expectation.

### Milestone 4: C++ Low-Overhead Netfilter Blocking (R3)
- **Objective**: Implement in-memory IP blocking using `libiptc` on Linux.
- **Tasks**:
  1. Modify `software_kill_switch.cpp` to use the `libiptc` APIs.
  2. Append/delete rules in-memory directly on the Netlink socket rather than invoking expensive system shell commands.
  3. Ensure compilation and graceful fallbacks work on platforms where `libiptc` is not present (e.g. Windows).

### Milestone 5: C++ UDP Telemetry Agent Receiver (R4)
- **Objective**: Ingest performance counters via UDP to populate features `[256..383]`.
- **Tasks**:
  1. Spawn a background UDP listening thread in the Edge Interceptor.
  2. Listen on a designated port (e.g. 9999).
  3. Receive binary performance counter telemetry packets.
  4. Decode and thread-safely update elements `[256..383]` of the active feature vector.

### Milestone 6: C++ Dynamic Key Loading (R5)
- **Objective**: Load AES decryption keys dynamically.
- **Tasks**:
  1. Remove hardcoded key and IV from `inference_engine.cpp`.
  2. Load the key and IV at runtime from environment variables or config handshake.
  3. Return clear error/gracefully exit if the key is missing or invalid.

### Milestone 7: Verification and Adversarial Hardening
- **Objective**: Achieve 100% test coverage and perform white-box security audits.
- **Tasks**:
  1. Run the entire automated test suite to ensure all unit and integration tests pass.
  2. Perform adversarial validation via challenger subagents.
  3. Verify via Forensic Auditor.

---

## Code Layout & Targets
- **Next.js Website**: `C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads/src/app/page.tsx`
- **C++ Code**: `C:/Users/Adminb/.gemini/antigravity/worktrees/Synz_Phantom/improve-synz-phantom-reads/edge_interceptor`
