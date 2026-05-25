## 2026-05-24T15:54:29Z
You are the Implementation Worker for Synz Phantom active defense simulator and C++ Edge Interceptor firmware improvements.
Your working directory is: C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads/.agents/worker_r1_to_r5_impl_1
Please perform the implementation of R1, R2, R3, R4, and R5 in accordance with the specifications below.

MANDATORY INTEGRITY WARNING — DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

# Scope & Context
- Next.js Workspace: C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads
- C++ / C# Workspace: C:/Users/Adminb/.gemini/antigravity/worktrees/Synz_Phantom/improve-synz-phantom-reads

## Requirements to Implement
1. **R1. Next.js Launch Landing Page & Visualizer**:
   - Refactor `src/app/page.tsx` under `SYNLabWebsite` to build a production-grade CISO-focused page with hero elements, a React simulator dashboard, and a Lead capture form.
   - The React simulator dashboard must support three modes: Monitor, Software, Hardware. It must visualize anomalies, diagnostic grid slots, and severity.
   - The simulator must have a toggle to connect via WebSockets to the live C# backend (`ws://localhost:5000/ws` or similar configured socket endpoint).
   - The Lead capture form must restrict to corporate email domains, show a success transition state, save the details to `localStorage`, and log payloads to the console.
   - Update `SynzPhantom.API` to host a WebSocket endpoint (e.g. mapping `/ws` in `Program.cs`) that tracks connected sockets and broadcasts telemetry events received on POST `/api/v1/telemetry` to all WebSocket client connections.

2. **R2. C++ Edge Interceptor Circular Temporal Queue**:
   - In `edge_interceptor/src/main.cpp` and `edge_interceptor/src/inference_engine.cpp`, implement a thread-safe circular buffer (guarded by mutex) storing the last 16 events.
   - Each event contains 16 network features and 8 CPU features.
   - Construct the input tensor `[1, 400]` by serializing these events in chronological order: the first 256 elements contain the network features of the 16 events (16 * 16), the next 128 elements contain the CPU features of the 16 events (16 * 8), and the remaining 16 elements are zero-padded to size 400.

3. **R3. C++ Low-Overhead Netfilter Blocking**:
   - Refactor `software_kill_switch.cpp` to use the `libiptc` library for Linux builds.
   - Perform in-memory Netfilter rule insertion/removal into the `INPUT` and `FORWARD` chains, bypassing slow `system()` shell command execution.
   - Guard it with `#if !defined(_WIN32) && !defined(USE_MOCKS)` so that it compiles and uses mock logging on Windows.
   - Add `libip4tc` linking to `CMakeLists.txt`.

4. **R4. C++ Host Telemetry UDP Receiver**:
   - Add a background thread in the C++ Edge Interceptor that runs a UDP server socket listening on port `9999` (or configurable).
   - Ingest 32-byte payloads (8 floats) representing CPU performance counters (cache misses, mispredictions, etc.).
   - Decode these floats and update the CPU telemetry feature vector indices `[256..383]` in the active queue events.
   - Ensure thread safety with the packet reader thread using mutexes.

5. **R5. C++ Dynamic Key Loading**:
   - Remove hardcoded keys and IVs from `inference_engine.cpp`.
   - Read `SYNZ_AES_KEY` and `SYNZ_AES_IV` (as well as fallback `SYNZ_DECRYPTION_KEY` and `SYNZ_DECRYPTION_IV`) from environment variables.
   - Parse them from hex-encoded strings into binary byte arrays (32-byte key, 16-byte IV).
   - Decrypt the `.onnx.enc` model file in memory using `tiny-AES-c`. Zero out the keys in memory after decryption.
   - Handle missing/incorrect keys gracefully by logging errors and exiting with code 1.

6. **Unit Tests**:
   - Create a C++ unit test suite (e.g. `edge_interceptor/src/test_suite.cpp` or in `edge_interceptor/tests`) that compiles cleanly and verifies:
     - The circular queue sequence insertion, chronological order, and flattening.
     - UDP packet reception and decoding.
     - AES hex decoding, key validation, and decryption.
   - Hook the test suite target into `CMakeLists.txt` so it can be built and run.

## Git & Logging Policies
- After completing/implementing each requirement (R1 to R5), update `DEVLOG.md` in both workspaces.
- Perform a Git commit with a descriptive message in the active repositories after every step.
- Ensure that `npm run build` succeeds inside `SYNLabWebsite` and CMake build succeeds inside `edge_interceptor` (on Windows with mocks, and on Linux without mocks if possible, or explain mock behavior).

## Deliverables
Write a detailed handoff report (`handoff.md`) inside your working directory summarizing:
- What changes were made to which files.
- Command-line build and test execution logs/results.
- Verification that all requirements are fully implemented with zero cheating.
