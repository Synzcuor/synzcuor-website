## 2026-05-24T16:32:10Z
You are the Implementation Worker for Synz Phantom active defense simulator and C++ Edge Interceptor firmware improvements.
Your working directory is: C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads/.agents/worker_r1_to_r5_impl_2

Please execute the required code refactoring, system fixes, and test suite rewrites in accordance with the specifications below.

MANDATORY INTEGRITY WARNING — DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

# Scope & Context
- Next.js Workspace: C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads
- C++ Workspace: C:/Users/Adminb/.gemini/antigravity/worktrees/Synz_Phantom/improve-synz-phantom-reads

## Requirements to Implement & Fix

1. **C++ Main Orchestrator Compilation Fix (R2/R4)**:
   - In `edge_interceptor/src/main.cpp`, the global atomic variable `g_running` is used before its declaration. Move `std::atomic<bool> g_running{true};` to the top of `main.cpp` (above the UDP listener thread) to fix the compiler error.

2. **C++ Circular Temporal Queue Extraction & Shared Header (R2)**:
   - Extract the `CircularBuffer` struct from `inference_engine.cpp` into a new shared header file `edge_interceptor/include/circular_queue.h`.
   - Update both `inference_engine.cpp` and `test_interceptor.cpp` to include and use the shared `circular_queue.h` implementation.
   - The queue must store the last 16 events thread-safely (using std::mutex) and allow retrieval in oldest-to-newest chronological order.

3. **C++ Low-Overhead Netfilter Blocking via libiptc (R3)**:
   - Refactor `software_kill_switch.cpp` to implement rule insertion/deletion using the standard Linux `libiptc` C API (part of Netfilter/iptables dev package) rather than using high-overhead, synchronous `system()` command spawns (`iptables-nft` or `netsh`).
   - Specifically, load the `filter` table, and insert/delete rules targeting the attacker's source IP (DROP verdict) at index 0 in both `INPUT` and `FORWARD` chains.
   - Ensure the rules are properly committed in-memory (`iptc_commit`).
   - On destruction/deactivation, iterate through blocked IPs and cleanly remove all rules added during the run.
   - All `libiptc` operations must be guarded by `#if !defined(_WIN32) && !defined(USE_MOCKS)` so that it compiles and uses mock console logging on Windows and mock builds.
   - Update `CMakeLists.txt` to find and link against `libip4tc` (under Linux non-mock builds).

4. **C++ Host Telemetry UDP Binary Ingestion (R4)**:
   - In `edge_interceptor/src/main.cpp`, refactor `start_udp_listener()` to receive and parse a 32-byte binary payload (representing 8 floats) rather than JSON.
   - Enforce packet sanitization:
     - Discard packets if their size is not exactly 32 bytes.
     - Check incoming floats for `NaN` or `Inf` (using std::isnan / std::isinf). If any float is invalid, drop the packet.
     - Clamp negative float values to `0.0f`.
   - Thread-safely shift the 128-float historical telemetry buffer `g_cpu_features` by 8 floats, and append the new 8 floats to indices `[120..127]`. Ensure synchronization with the event callback copying these features.

5. **C++ Dynamic Key Loading & Security Hardening (R5)**:
   - In `inference_engine.cpp`, remove the plain-text hardcoded `DEFAULT_AES_KEY` fallback entirely.
   - Load the AES key dynamically from environment variables `SYNZ_AES_KEY` or `SYNZ_DECRYPTION_KEY`, or from file `/etc/synz-keys/decrypt.key` (or `C:/etc/synz-keys/decrypt.key` on Windows).
   - Load the AES IV dynamically from environment variables `SYNZ_AES_IV` or `SYNZ_DECRYPTION_IV`, or from file `/etc/synz-keys/decrypt.iv` (or `C:/etc/synz-keys/decrypt.iv` on Windows).
   - If keys or IV are missing, or decryption fails, log a fatal error and exit the interceptor process immediately with exit code 1.
   - Security: Zero out all sensitive key registers (e.g. key/IV buffers and the tiny-AES `AES_ctx` struct) in memory immediately after model decryption.

6. **C++ Unit Tests Rewrite**:
   - Refactor `edge_interceptor/src/test_interceptor.cpp` to verify actual production code classes:
     - Test `CircularBuffer` sequence insertion, chronological order, FIFO wrap-around, and capacity using the shared `circular_queue.h`.
     - Test `InferenceEngine` dynamic key loading with various environment variable and file conditions (assert it fails cleanly when key is missing, and passes when correct key/IV is set).
     - Test `SoftwareKillSwitch` rule registration, idempotency, and clean deactivation.
   - Hook unit tests into `CMakeLists.txt` and ensure `./build/test_interceptor` compiles and passes cleanly (under mock mode).

7. **Next.js Real Application E2E Test Verification**:
   - Refactor `e2e_tests/conftest.py` to run the actual Next.js web application server (via `npm run dev` or `npm run build` + `npm run start`) in a background subprocess instead of spinning up a mock HTTP server serving a static HTML string.
   - Replace all dummy `assert True` tests in Python E2E files (`test_cpp_interceptor.py`, `test_web_ui.py`, `test_cross_feature.py`, `test_scenarios.py`) with real functional assertions:
     - In `test_cpp_interceptor.py`, test the real C++ interceptor execution, UDP binary telemetry transmission, key validation, and file persistence.
     - In `test_web_ui.py`, test the UI elements, simulated console block, form submissions, and WebSocket telemetry stream changes.
     - In `test_cross_feature.py`, test the cross-feature integration points.
     - In `test_scenarios.py`, test real-world SCADA mitigation, key rotation, and API failover.

## Git & Logging Policies
- After completing/refactoring each requirement, update `DEVLOG.md` in both workspaces.
- Perform a Git commit with a descriptive message in the active repositories after every step.
- Verify that `npm run build` succeeds inside `SYNLabWebsite` and CMake build succeeds inside `edge_interceptor` (on Windows with mocks, and on Linux without mocks).
- Ensure all unit and E2E tests run and pass.

## Deliverables
Write a detailed handoff report (`handoff.md`) inside your working directory summarizing:
- What changes were made to which files.
- Command-line build and test execution logs/results.
- Verification that all requirements are fully implemented with zero cheating.
