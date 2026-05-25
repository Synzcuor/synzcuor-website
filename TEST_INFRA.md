# Synz Phantom E2E Test Suite & Infrastructure Specification

This document defines the comprehensive End-to-End (E2E) testing framework, test harness architecture, and 93 detailed test cases spanning 4 tiers. It guarantees coverage for both the Next.js web application (`SYNLabWebsite`) and the C++ Edge Interceptor (`edge_interceptor`), verifying performance, safety, and operational compliance.

---

## 1. Test Architecture & Harness Design

To execute comprehensive end-to-end tests across low-level C++ network software and high-level Next.js React interfaces, the test suite uses a unified **Python-based Test Orchestrator** paired with **Playwright** for web testing and raw **Sockets/Subprocesses** for C++/C# interaction.

### 1.1 Process Lifecycle Management
The orchestrator manages the lifecycle of three distinct components:
1. **Next.js Web Server**: Launched via `npm run build && npm run start` (or `npm run dev`) on `localhost:3000`.
2. **C# SynzPhantom.API Backend**: Launched via `dotnet run` within the `phantom_console/SynzPhantom.API` folder on `localhost:5000/5001`.
3. **C++ Edge Interceptor Daemon**: Compiled with `-DUSE_MOCKS=ON` (for local development/mock runs) or run with production capability on Linux testbeds. Launched with custom environment variables:
   - `SYNZ_DECRYPTION_KEY`: Passed to verify dynamic key loading.
   - `SYNZ_DECRYPTION_IV`: Passed to verify IV initialization.
   - `SYNZ_KILL_MODE`: Toggled between `monitor`, `software`, and `hardware`.
   - `SYNZ_CORE_URL`: Configured to stream alerts back to the API.

### 1.2 Telemetry Ingestion & Attack Simulation Hooks
- **Network Traffic Injection**: The orchestrator mimics network packet streams by utilizing Python's `socket` library or low-level raw socket injection. It pushes mock network telemetry events to simulate benign traffic, port scans, and zero-day exploits.
- **CPU Telemetry Ingestion (UDP)**: A dedicated Python background thread sends binary-packed UDP packets containing mock PMU performance counters (cache misses, mispredictions) to the interceptor’s background receiver port.
- **WebSocket Streaming Testbed**: A mock WebSocket server or the real C# API WebSocket router is spun up by the orchestrator. Playwright UI tests toggle the streaming client to hook into this live data stream.

### 1.3 Directory & Test Suite Execution Layout
```text
C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads/
├── TEST_INFRA.md (This File)
└── e2e_tests/
    ├── conftest.py            # Pytest fixtures for process orchestration
    ├── test_web_ui.py         # Playwright-based UI, Hero, Form, & Simulator tests
    ├── test_cpp_interceptor.py# Low-level queue, key load, UDP, & libiptc tests
    ├── test_cross_feature.py  # Pairwise cross-feature integration tests
    └── test_scenarios.py      # Real-world application scenarios
```

---

## 2. Requirements to Core Features Mapping

| Requirement (ORIGINAL_REQUEST.md) | Covered By Feature (F1 - F8) |
| :--- | :--- |
| **R1. Next.js Landing Page & Visualizer** | **F1**: Web Hero & Core Pitch UI Elements<br>**F2**: Web Interactive Active Defense Simulator UI & State Dashboard<br>**F3**: Web Lead Intake Form (validation, storage, logs)<br>**F4**: Web WebSocket Threat Metrics Streaming client |
| **R2. C++ Edge Interceptor Circular Queue** | **F5**: C++ Circular Temporal Queue (16-event sequence buffer, temporal feature vector construction) |
| **R3. C++ Low-Overhead Netfilter Blocking**| **F6**: C++ Low-Overhead Netfilter Blocking (in-memory libiptc-based blocking/unblocking) |
| **R4. C++ Host Telemetry UDP Receiver** | **F7**: C++ Telemetry Agent UDP Receiver (background UDP server, performance counter decoding, feature vector integration) |
| **R5. C++ Dynamic Key Loading** | **F8**: C++ Dynamic Key Loading (AES key validation, ONNX model decryption in memory) |

---

## 3. Comprehensive E2E Test Cases (93 Cases)

### Tier 1: Feature Coverage (40 Cases)

#### Feature 1: Web Hero & Core Pitch UI Elements (F1)
*   **TC-F1-01: Main Heading Assertion**
    *   *Objective*: Verify that the landing page displays the exact CISO-focused primary heading.
    *   *Preconditions*: Next.js server running on `localhost:3000`.
    *   *Actions*: Navigate to `/`, locate the `h1` element.
    *   *Expected Result*: Text contains `"Stop Zero-Day Ransomware Detonations Before They Reach the CPU"`.
    *   *Verification*: Playwright locator checking `h1` visibility and text.
*   **TC-F1-02: Target Latency Metric Banner**
    *   *Objective*: Assert the visibility of sub-50µs latency claims and Ring -1 prevention in the copy.
    *   *Preconditions*: Server running.
    *   *Actions*: Query page elements for keyword `"sub-50µs"`, `"Ring -1"`.
    *   *Expected Result*: Text elements detailing both parameters are visible and styled within the main viewport.
    *   *Verification*: `expect(locator).toBeVisible()` on target copy nodes.
*   **TC-F1-03: Quantum-Enhanced Badge Rendering**
    *   *Objective*: Verify the specialized industrial cyber-defense badge is displayed at the top.
    *   *Preconditions*: Server running.
    *   *Actions*: Locate the inline-flex badge with text `"Quantum-Enhanced Active Cyber Defense"`.
    *   *Expected Result*: Badge exists, contains a pulsing green/cyan indicator circle.
    *   *Verification*: CSS selector matching classes `.bg-cyan-glow/10` or text matching.
*   **TC-F1-04: Call-To-Action (CTA) Navigation**
    *   *Objective*: Ensure the "Launch Active Demo" button scrolls viewport to the simulator.
    *   *Preconditions*: Viewport at top.
    *   *Actions*: Click `"Launch Active Demo"` button.
    *   *Expected Result*: Viewport scrolls down, `#simulator` element is visible in the viewport.
    *   *Verification*: Playwright `is_in_viewport` assertion on `#simulator`.
*   **TC-F1-05: Firmware Mock Console Output**
    *   *Objective*: Verify that the simulated firmware log block displays the correct startup sequence.
    *   *Preconditions*: Page loaded.
    *   *Actions*: Inspect the code element inside the mock console container.
    *   *Expected Result*: Text contains `[BPF] Loading eBPF object: synz_xdp.o`, `[ONNX] model decrypted`, and `[GPIO] NC Relay output line 18 initialized`.
    *   *Verification*: Assert text content of the pre/code tag.

#### Feature 2: Web Interactive Active Defense Simulator UI & State Dashboard (F2)
*   **TC-F2-01: Anomaly Score Gauge Zero State**
    *   *Objective*: Verify the anomaly gauge initializes with a low benign score.
    *   *Preconditions*: Simulation in "Benign" state.
    *   *Actions*: Read the text value inside the SVG gauge.
    *   *Expected Result*: Displays `"12%"` (or similar value < 0.20 anomaly score).
    *   *Verification*: Match inner text of the gauge container.
*   **TC-F2-02: Port Scan Action State Change**
    *   *Objective*: Assert simulator behavior during reconnaissance.
    *   *Preconditions*: Simulator loaded.
    *   *Actions*: Click `"Port Scan (Recon)"` button.
    *   *Expected Result*: System Integrity Status updates to `"⚠️ SCANNER ENCOUNTERED"`, anomaly score rises to 48%, and "PortScan" slot in the grid lights up.
    *   *Verification*: Inspect status banner text and diagnostic slot CSS classes.
*   **TC-F2-03: Exploit Detonation Monitor Mode**
    *   *Objective*: Verify passive logging behavior in Monitor mode.
    *   *Preconditions*: Mode set to `"Monitor"`.
    *   *Actions*: Click `"Detonate Exploit"`.
    *   *Expected Result*: Anomaly score spikes to 98%, status updates to `"🚨 WARNING: ACTIVE PAYLOAD DETECTED"`, but no blocking occurs (flow line to PLC remains active, alert is logged).
    *   *Verification*: Verify alert feed log shows `"MONITOR MODE: Active defense disabled."`
*   **TC-F2-04: Exploit Detonation Software Mode**
    *   *Objective*: Verify active blocking at software firewall level.
    *   *Preconditions*: Mode set to `"Software"`.
    *   *Actions*: Click `"Detonate Exploit"`.
    *   *Expected Result*: Score spikes to 98%, then after 1.5 seconds drops to 8%, status changes to `"🟢 SOFTWARE PROTECTED — ATTACKER DROPPED"`, and the left flow line becomes inactive (dropped).
    *   *Verification*: Verify log shows `"SOFTWARE TRIGGER: Attacker IP 192.168.1.100 dropped via firewall"`.
*   **TC-F2-05: Exploit Detonation Hardware Mode**
    *   *Objective*: Verify physical cutoff simulation.
    *   *Preconditions*: Mode set to `"Hardware"`.
    *   *Actions*: Click `"Detonate Exploit"`.
    *   *Expected Result*: Score spikes, then status changes to `"🔴 HARDWARE LOCKOUT — WIRE CUT"`, flow lines are severed, and the "ACTIVATION COUNT" increments by 1.
    *   *Verification*: Assert the activation count element text increments from `0` to `1`.

#### Feature 3: Web Lead Intake Form (F3)
*   **TC-F3-01: Form Field Verification**
    *   *Objective*: Verify the presence of all required input fields.
    *   *Preconditions*: Page loaded.
    *   *Actions*: Scan the `#contact` section.
    *   *Expected Result*: Name, Corporate Email, Company Name inputs, and Organizational Role dropdown are visible.
    *   *Verification*: Query selectors for input types and select elements.
*   **TC-F3-02: Corporate Email Restriction**
    *   *Objective*: Verify rejection of generic personal emails.
    *   *Preconditions*: Fill name and company.
    *   *Actions*: Type `test@gmail.com` into Email field, submit.
    *   *Expected Result*: Form validation fails or blocks submission with a visual warning (for corporate domain enforcement).
    *   *Verification*: Verify form does not transition to success block; check error indicator presence.
*   **TC-F3-03: Success State Transition**
    *   *Objective*: Verify UI response on valid submission.
    *   *Preconditions*: Form filled with corporate data (`john@synzcorp.com`).
    *   *Actions*: Click `"Submit Audit Request"`.
    *   *Expected Result*: Form elements vanish, replaced by `"Pilot Application Received"` message.
    *   *Verification*: Query success text node and check form visibility is false.
*   **TC-F3-04: Client-side Storage Persistence**
    *   *Objective*: Check if lead data is written to localStorage.
    *   *Preconditions*: Successful submission.
    *   *Actions*: Read `localStorage` values under key `synz_lead_data` (or similar configured key).
    *   *Expected Result*: Captured name, email, and company match the submitted values.
    *   *Verification*: Execute JavaScript in page context to check `localStorage`.
*   **TC-F3-05: Dev Console Payload Logging**
    *   *Objective*: Assert console logging of form submit payload.
    *   *Preconditions*: Console listener active.
    *   *Actions*: Submit valid corporate form data.
    *   *Expected Result*: Console logs a JSON payload containing the user's name, email, company, and selected role.
    *   *Verification*: Playwright page console listener checks for matches.

#### Feature 4: Web WebSocket Threat Metrics Streaming client (F4)
*   **TC-F4-01: Toggle Switch Interaction**
    *   *Objective*: Verify WebSocket toggle switch triggers connection initiation.
    *   *Preconditions*: Mock server running on port 5001.
    *   *Actions*: Toggle the WebSocket metrics connector to `"On"`.
    *   *Expected Result*: Connection state is established, status lights up green.
    *   *Verification*: Verify network connection request to `ws://localhost:5001/ws` in devtools.
*   **TC-F4-02: Gauge Real-time Ingestion**
    *   *Objective*: Verify that incoming WebSocket metric packets drive the UI gauge.
    *   *Preconditions*: WS connection active.
    *   *Actions*: Send JSON packet `{"anomaly_score": 75}` through socket.
    *   *Expected Result*: Anomaly Score text updates to `75%`, and gauge stroke offset changes dynamically.
    *   *Verification*: Capture SVG gauge parameters in UI.
*   **TC-F4-03: Diagnostic Grid Ingestion**
    *   *Objective*: Verify WebSocket updates diagnostic indicators.
    *   *Preconditions*: WS connection active.
    *   *Actions*: Send WS packet `{"diagnostic_grid": [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0]}`.
    *   *Expected Result*: Grid slot index 0 and 3 (TCP and DoS patterns) light up.
    *   *Verification*: Assert class updates on grid children.
*   **TC-F4-04: Connection Loss Alerting**
    *   *Objective*: Verify visual feedback on WebSocket connection drops.
    *   *Preconditions*: WS connection active.
    *   *Actions*: Kill mock WS server.
    *   *Expected Result*: Connection status indicator turns red, alert feed logs `"WebSocket connection closed"`.
    *   *Verification*: Inspect DOM elements for error state.
*   **TC-F4-05: Active Disconnect Sequence**
    *   *Objective*: Verify clean socket teardown on toggle switch off.
    *   *Preconditions*: WS connection active.
    *   *Actions*: Toggle WebSocket switch back to `"Off"`.
    *   *Expected Result*: Socket closes cleanly, simulator falls back to client-side mock timers.
    *   *Verification*: Confirm socket close frame in network inspector.

#### Feature 5: C++ Circular Temporal Queue (F5)
*   **TC-F5-01: Exact Buffer Capacity Assertion**
    *   *Objective*: Verify queue stores exactly 16 events.
    *   *Preconditions*: Clean interceptor state.
    *   *Actions*: Ingest 20 sequential telemetry events.
    *   *Expected Result*: Queue size remains capped at 16; oldest 4 events are discarded.
    *   *Verification*: Query queue size mock/test output.
*   **TC-F5-02: Chronological Sequence Preservation**
    *   *Objective*: Ensure first-in, first-out sequence ordering.
    *   *Preconditions*: Interceptor running.
    *   *Actions*: Push events with unique serials 1 to 17.
    *   *Expected Result*: The queue history contains events 2 through 17 in strict chronological order.
    *   *Verification*: Inspect debug dumps of queue buffers.
*   **TC-F5-03: Input Vector Dimensional Construction**
    *   *Objective*: Verify the built tensor has dimensions corresponding to 16 concatenated events.
    *   *Preconditions*: Queue loaded with 16 events.
    *   *Actions*: Trigger model input feature vector extraction.
    *   *Expected Result*: Constructed vector size matches target temporal model inputs (16 * feature size).
    *   *Verification*: Assert `vector.size() == 16 * TELEMETRY_DIM` (or matching temporal network inputs).
*   **TC-F5-04: Partially-Filled Queue Padding**
    *   *Objective*: Ensure correct zero-padding for warm-up phases.
    *   *Preconditions*: Queue contains only 3 events.
    *   *Actions*: Extract inference vector.
    *   *Expected Result*: Features for slots [0..2] contain active data; slots [3..15] are padded with `0.0`.
    *   *Verification*: Assert values in the extracted input float array.
*   **TC-F5-05: Queue Insertion Latency Benchmark**
    *   *Objective*: Ensure queue operations do not block packet processing path.
    *   *Preconditions*: Real-time clock active.
    *   *Actions*: Ingest 1000 burst packets.
    *   *Expected Result*: Average insertion and feature vector compilation time is < 1µs.
    *   *Verification*: Profile C++ execution path via std::chrono high_resolution_clock.

#### Feature 6: C++ Low-Overhead Netfilter Blocking (F6)
*   **TC-F6-01: In-Memory INPUT Chain Injection**
    *   *Objective*: Verify libiptc adds in-memory drop rule on attacker source IP.
    *   *Preconditions*: Running on Linux with administrative permissions.
    *   *Actions*: Call `BlockIP("10.0.0.99")`.
    *   *Expected Result*: Rule created in the `INPUT` chain matching source `10.0.0.99` with target `DROP`.
    *   *Verification*: Run `iptables -S INPUT` via test script, parse stdout for `"-A INPUT -s 10.0.0.99/32 -j DROP"`.
*   **TC-F6-02: FORWARD Chain Rule Matching**
    *   *Objective*: Verify libiptc inserts block into the transit path (inline mode).
    *   *Preconditions*: Running on Linux.
    *   *Actions*: Call `BlockIP("10.0.0.99")`.
    *   *Expected Result*: DROP rule is inserted at index 1 of the `FORWARD` chain.
    *   *Verification*: Parse output of `iptables -L FORWARD -n`.
*   **TC-F6-03: Rule Deletion / Unblocking**
    *   *Objective*: Verify clean removal of iptables rules.
    *   *Preconditions*: IP `10.0.0.99` blocked.
    *   *Actions*: Call `UnblockIP("10.0.0.99")`.
    *   *Expected Result*: INPUT and FORWARD drop rules for `10.0.0.99` are removed.
    *   *Verification*: `iptables -S` does not return matches for target IP.
*   **TC-F6-04: Synchronous Call Elimination**
    *   *Objective*: Verify no external shell processes are spawned during blocking.
    *   *Preconditions*: Audit daemon or process tracer active.
    *   *Actions*: Trigger software block.
    *   *Expected Result*: Netfilter rules are modified via netlink API, no `fork()` or `/bin/sh` executes.
    *   *Verification*: Monitor process system calls (e.g. `execve` trace) during block.
*   **TC-F6-05: Blocklist Local File Serialization**
    *   *Objective*: Verify blocklist persistence.
    *   *Preconditions*: Empty blocklist.
    *   *Actions*: Block `10.0.0.99` and `10.0.0.100`.
    *   *Expected Result*: `/var/lib/synz-phantom/blocklist.txt` contains both IPs.
    *   *Verification*: Read file contents via pytest script.

#### Feature 7: C++ Telemetry Agent UDP Receiver (F7)
*   **TC-F7-01: Port Ingestion Startup**
    *   *Objective*: Verify background server binds to UDP port.
    *   *Preconditions*: Default configuration (Port `9999`).
    *   *Actions*: Start interceptor.
    *   *Expected Result*: Port is bound, listening on `0.0.0.0:9999`.
    *   *Verification*: Check `netstat -anup` or verify port binding status.
*   **TC-F7-02: Cache Miss Telemetry Decoding**
    *   *Objective*: Verify decoding of binary-packed telemetry metrics.
    *   *Preconditions*: UDP socket listening.
    *   *Actions*: Send binary payload mapping L1 miss rate: `0.75` and L2 miss rate: `0.45` to port 9999.
    *   *Expected Result*: Interceptor parses floats correctly.
    *   *Verification*: Assert parsed metrics match input values in logs/debug dump.
*   **TC-F7-03: CPU Head Feature Integration**
    *   *Objective*: Verify parsed telemetry populates CPU inputs in the model feature vector.
    *   *Preconditions*: Telemetry packet received.
    *   *Actions*: Extract active feature vector.
    *   *Expected Result*: Indices `256` to `383` contain the incoming CPU telemetry values.
    *   *Verification*: Inspect values of extracted feature vector inside the test framework.
*   **TC-F7-04: Thread-Safe State Ingestion**
    *   *Objective*: Ensure UDP thread writes to feature arrays without race conditions.
    *   *Preconditions*: Packet reader loop actively executing.
    *   *Actions*: Send 10,000 UDP telemetry updates while processing network frames.
    *   *Expected Result*: Data is synchronized, no data corruption or segmentation faults.
    *   *Verification*: Assert memory sanity under ThreadSanitizer or stress testing.
*   **TC-F7-05: Thread Lifecycle Clean Shutdown**
    *   *Objective*: Verify UDP thread terminates gracefully.
    *   *Preconditions*: Daemon running.
    *   *Actions*: Send `SIGINT` (Ctrl+C).
    *   *Expected Result*: Background UDP thread joins cleanly, socket is closed.
    *   *Verification*: Verify process exits with status 0, leaving no orphan threads.

#### Feature 8: C++ Dynamic Key Loading (F8)
*   **TC-F8-01: Environment Key Retrieval**
    *   *Objective*: Verify the key loader extracts strings from the environment.
    *   *Preconditions*: Set `SYNZ_DECRYPTION_KEY="0123456789ABCDEF0123456789ABCDEF"`.
    *   *Actions*: Initialize key loading sequence.
    *   *Expected Result*: Key is read successfully into memory.
    *   *Verification*: Verify loader does not fallback to empty state.
*   **TC-F8-02: Encrypted Model In-Memory Decryption**
    *   *Objective*: Verify `.onnx.enc` is decrypted into valid ONNX session memory.
    *   *Preconditions*: Valid key in env, encrypted model file on disk.
    *   *Actions*: Initialize model.
    *   *Expected Result*: Model decrypts; ONNX Runtime session loads graph structure.
    *   *Verification*: Assert `session` is non-null, model outputs verified.
*   **TC-F8-03: Decryption Key Zeroing**
    *   *Objective*: Prevent memory scrapers from recovering keys.
    *   *Preconditions*: Model initialized.
    *   *Actions*: Inspect the memory buffer that held the AES key.
    *   *Expected Result*: Key buffer contains only `0x00`.
    *   *Verification*: White-box check asserting key cleanup functions write zeros to key registers.
*   **TC-F8-04: Missing Decryption Key Failure**
    *   *Objective*: Prevent unencrypted execution attempts.
    *   *Preconditions*: `SYNZ_DECRYPTION_KEY` unset.
    *   *Actions*: Run interceptor.
    *   *Expected Result*: Process terminates with exit code `1`, logging `"FATAL: Decryption key not found"`.
    *   *Verification*: Assert process exit code and stderr log contents.
*   **TC-F8-05: Mismatched Key Decryption Rejection**
    *   *Objective*: Handle incorrect keys safely.
    *   *Preconditions*: Set wrong AES key.
    *   *Actions*: Run interceptor.
    *   *Expected Result*: Decryption produces garbage header, ONNX session initialization fails, process exits.
    *   *Verification*: Assert exit code and log string `"Ort::Exception: Invalid model"`.

---

### Tier 2: Boundary & Corner Cases (40 Cases)

#### Feature 1: Web Hero & Core Pitch UI Elements (F1-BCC)
*   **TC-F1-BCC-01: Responsive Breakpoint Constraint**
    *   *Objective*: Verify layout flow on ultra-narrow screens (320px).
    *   *Actions*: Set browser width to 320px, check text overlapping.
    *   *Expected Result*: Layout stacks vertically, text remains readable without clipping.
*   **TC-F1-BCC-02: Ultra-Wide Viewport Resolution**
    *   *Objective*: Verify layout scaling on 4K resolutions (3840px).
    *   *Actions*: Scale browser width to 3840px.
    *   *Expected Result*: Max-width constraints hold, centering content cleanly.
*   **TC-F1-BCC-03: Reader Mode Global Styles Override**
    *   *Objective*: Ensure CSS rules do not collapse when browser style defaults change.
    *   *Actions*: Toggle high contrast/reader style overrides.
    *   *Expected Result*: Font contrasts remain high, text is visible.
*   **TC-F1-BCC-04: Mock Console Overflow Performance**
    *   *Objective*: Verify code block handles excessively long log strings.
    *   *Actions*: Inject 10KB startup logs into the mock terminal.
    *   *Expected Result*: Scrollbars appear; panel layout remains rigid.
*   **TC-F1-BCC-05: Image Asset Lazy Loading Fallback**
    *   *Objective*: Ensure critical text renders even if network delay blocks badge images.
    *   *Actions*: Block image loads.
    *   *Expected Result*: System status text and titles render immediately.

#### Feature 2: Web Interactive Active Defense Simulator UI & State Dashboard (F2-BCC)
*   **TC-F2-BCC-01: Rapid Double-Detonation Handling**
    *   *Objective*: Prevent race conditions in React state timers on double click.
    *   *Actions*: Click `"Detonate Exploit"` twice in quick succession.
    *   *Expected Result*: System processes only the first click; second click is ignored (throttled).
*   **TC-F2-BCC-02: Score Boundary Gauge Transitions**
    *   *Objective*: Verify gauge color transitions at exact boundaries (0.40, 0.70, 0.95).
    *   *Actions*: Force input score to exactly `0.40`, `0.70`, `0.95`.
    *   *Expected Result*: Color matches warn (yellow), alert (orange), critical (red) exactly.
*   **TC-F2-BCC-03: Mid-Transition State Interruptions**
    *   *Objective*: Verify safety when resetting simulator before block animation completes.
    *   *Actions*: Click `"Detonate Exploit"`, then immediately click `"Reset Connection"`.
    *   *Expected Result*: Active block timeout is cleared; simulator returns cleanly to Benign state.
*   **TC-F2-BCC-04: Diagnostic Grid Index Range Protection**
    *   *Objective*: Verify behavior when grid matches invalid index.
    *   *Actions*: Force state to contain index 18.
    *   *Expected Result*: UI does not throw exceptions; out-of-bound indicators are ignored.
*   **TC-F2-BCC-05: Max Accumulator Limit (Activation Count)**
    *   *Objective*: Verify activation counter overflow safety.
    *   *Actions*: Trigger hardware cutout 1,000 times in automation.
    *   *Expected Result*: Count renders `1000` correctly without UI layout breaking.

#### Feature 3: Web Lead Intake Form (F3-BCC)
*   **TC-F3-BCC-01: Personal Domains Filtering**
    *   *Objective*: Reject non-business contacts.
    *   *Actions*: Attempt submissions with `@yahoo.com`, `@hotmail.com`, `@outlook.com`.
    *   *Expected Result*: Visual validation message appears; submission is blocked.
*   **TC-F3-BCC-02: Form Field Attack Payloads (XSS/SQLi)**
    *   *Objective*: Verify form fields handle script tags safely.
    *   *Actions*: Type `<script>alert('XSS')</script>` into name field, submit.
    *   *Expected Result*: Data is saved as plain text; script does not execute.
*   **TC-F3-BCC-03: Storage Quota Block Fallback**
    *   *Objective*: Handle full localStorage situations.
    *   *Actions*: Mock full localStorage, submit lead.
    *   *Expected Result*: Lead logs to developer console cleanly, form handles error gracefully.
*   **TC-F3-BCC-04: Empty Fields Validation**
    *   *Objective*: Reject whitespace-only input strings.
    *   *Actions*: Input `"   "` into name field, click submit.
    *   *Expected Result*: Validation intercepts submission.
*   **TC-F3-BCC-05: Submission Timeout Verification**
    *   *Objective*: Assert submit transaction finishes under target time limit.
    *   *Actions*: Trigger submission, track execution.
    *   *Expected Result*: Form switches state in less than 100ms.

#### Feature 4: Web WebSocket Threat Metrics Streaming client (F4-BCC)
*   **TC-F4-BCC-01: Server Connection Termination Mid-Sequence**
    *   *Objective*: Verify client stability if connection terminates during an attack.
    *   *Actions*: Connect, detonate exploit, disconnect WS server during the 1.5s countdown.
    *   *Expected Result*: Simulator falls back to offline state warning; UI remains interactive.
*   **TC-F4-BCC-02: Metric Flooding Mitigation**
    *   *Objective*: Ensure high-frequency socket updates do not lock UI thread.
    *   *Actions*: Stream 200 metric updates/sec.
    *   *Expected Result*: UI frame rates remain above 60fps (updates throttled/batched).
*   **TC-F4-BCC-03: Malformed JSON Processing**
    *   *Objective*: Ensure client ignores corrupted packet structures.
    *   *Actions*: Push `"{invalid_json: true"` raw text.
    *   *Expected Result*: Client catches parse exception, ignores packet, and does not crash.
*   **TC-F4-BCC-04: Network Offline Transition**
    *   *Objective*: Verify state during global browser connection loss.
    *   *Actions*: Trigger offline status in Chrome DevTools.
    *   *Expected Result*: UI updates streaming toggle to disconnected state.
*   **TC-F4-BCC-05: Rapid Toggle Double Trigger Protection**
    *   *Objective*: Prevent race conditions creating duplicate WS sockets.
    *   *Actions*: Double click the toggle selector rapidly.
    *   *Expected Result*: Only one active WebSocket object is created.

#### Feature 5: C++ Circular Temporal Queue (F5-BCC)
*   **TC-F5-BCC-01: Telemetry Burst Ingestion**
    *   *Objective*: Verify queue stability under high volume.
    *   *Actions*: Push 10,000 packets rapidly.
    *   *Expected Result*: Memory remains stable; queue maintains the latest 16 items.
*   **TC-F5-BCC-02: Telemetry Timestamp Reordering**
    *   *Objective*: Handle packet arrival out-of-order.
    *   *Actions*: Push events with out-of-order monotonic timestamps.
    *   *Expected Result*: Queue matches sequence order based on timestamps, sorting if required.
*   **TC-F5-BCC-03: Invalid Numerical Values (NaN/Inf)**
    *   *Objective*: Verify queue sanitizes metric values.
    *   *Actions*: Push event containing `NaN` feature scores.
    *   *Expected Result*: Interceptor filters or replaces `NaN`/`Inf` with `0.0` to prevent ONNX errors.
*   **TC-F5-BCC-04: Single-Event Execution Mode**
    *   *Objective*: Ensure valid tensor output with only 1 event present.
    *   *Actions*: Push 1 event, trigger feature compile.
    *   *Expected Result*: Returns valid 16-event formatted array (1 active, 15 zero-padded).
*   **TC-F5-BCC-05: Multi-thread Contention**
    *   *Objective*: Verify queue synchronization during parallel updates.
    *   *Actions*: Read and write to queue concurrently from multiple threads.
    *   *Expected Result*: Execution proceeds without data corruption.

#### Feature 6: C++ Low-Overhead Netfilter Blocking (F6-BCC)
*   **TC-F6-BCC-01: Double Blocking Idempotency**
    *   *Objective*: Ensure duplicate block requests are ignored.
    *   *Actions*: Call `BlockIP("10.0.0.9")` twice.
    *   *Expected Result*: Only one iptables rule exists; second call exits immediately.
*   **TC-F6-BCC-02: Non-existent IP Deletion**
    *   *Objective*: Ensure unblocking unlisted IPs does not trigger errors.
    *   *Actions*: Call `UnblockIP("10.0.0.222")` when not blocked.
    *   *Expected Result*: Function returns successfully; no iptables error is thrown.
*   **TC-F6-BCC-03: Memory Depletion Error Handling**
    *   *Objective*: Prevent crashes if netlink buffer allocations fail.
    *   *Actions*: Simulate system out-of-memory.
    *   *Expected Result*: Software block fails gracefully, logs error, fallbacks to backup.
*   **TC-F6-BCC-04: Out-Of-Bounds IP Formats**
    *   *Objective*: Ensure rejection of invalid IP strings.
    *   *Actions*: Call `BlockIP("256.0.0.1")`.
    *   *Expected Result*: Key validation rejects IP format; no netfilter command is initiated.
*   **TC-F6-BCC-05: Process Interruption Recovery**
    *   *Objective*: Assert rules are maintained after crash.
    *   *Actions*: Kill interceptor process via `SIGKILL` (simulate crash).
    *   *Expected Result*: Blocklist file is safe; iptables rules remain active in kernel.

#### Feature 7: C++ Telemetry Agent UDP Receiver (F7-BCC)
*   **TC-F7-BCC-01: Giant Packet Rejection**
    *   *Objective*: Prevent buffer overflow attacks.
    *   *Actions*: Send 65KB UDP packet to port 9999.
    *   *Expected Result*: Receiver drops packet; buffer size restricts overflow.
*   **TC-F7-BCC-02: Random Binary Noise Injection**
    *   *Objective*: Ensure robustness against malformed packet bytes.
    *   *Actions*: Stream random binary sequences.
    *   *Expected Result*: Decoder catches validation error, discards payloads, and stays online.
*   **TC-F7-BCC-03: Negative Metric Sign Rejection**
    *   *Objective*: Ensure telemetry metrics contain valid counts.
    *   *Actions*: Send negative miss rates.
    *   *Expected Result*: Values are clamped to `0.0` or rejected.
*   **TC-F7-BCC-04: Address In Use Recovery**
    *   *Objective*: Handle startup port collisions.
    *   *Actions*: Run two instances of interceptor.
    *   *Expected Result*: Second instance fails to bind UDP receiver, logs error, and exits.
*   **TC-F7-BCC-05: Ingest Traffic Storm Resilience**
    *   *Objective*: Verify no memory leak under continuous packet load.
    *   *Actions*: Send 500,000 UDP packets over 10 seconds.
    *   *Expected Result*: Memory footprint remains stable, thread maintains performance.

#### Feature 8: C++ Dynamic Key Loading (F8-BCC)
*   **TC-F8-BCC-01: Key Length Bounds Validation**
    *   *Objective*: Reject invalid keys.
    *   *Actions*: Set `SYNZ_DECRYPTION_KEY="too_short"`.
    *   *Expected Result*: Startup blocks, logs invalid key size error.
*   **TC-F8-BCC-02: Truncated Model File Handling**
    *   *Objective*: Prevent segfaults on corrupted model binaries.
    *   *Actions*: Truncate model file to 1KB, start interceptor.
    *   *Expected Result*: Decryption finishes but session setup fails gracefully with error logs.
*   **TC-F8-BCC-03: Decryption Failure Cleanup**
    *   *Objective*: Ensure no decrypted fragments remain in memory on failure.
    *   *Actions*: Decrypt with invalid key.
    *   *Expected Result*: In-memory model buffer is cleared immediately.
*   **TC-F8-BCC-04: File Permission Mismatch**
    *   *Objective*: Handle unreadable model files.
    *   *Actions*: Change model file permissions to `000` (unreadable).
    *   *Expected Result*: Startup exits gracefully with a clear file read exception.
*   **TC-F8-BCC-05: Mismatched IV Length**
    *   *Objective*: Validate IV formats.
    *   *Actions*: Set `SYNZ_DECRYPTION_IV="invalid_length"`.
    *   *Expected Result*: Initialization aborts with error format description.

---

### Tier 3: Cross-Feature Combinations (8 Cases)

*   **TC-XF-01: Live Mode Overrides (F4 + F2)**
    *   *Objective*: Verify WebSocket metrics stream updates the Active Defense mode UI state instantly, overriding local mock states.
    *   *Actions*: Start WebSocket stream, send `{"defense_mode": "Software"}` package.
    *   *Expected Result*: The UI state transitions to "Software" and active defense mode visual indicator lights up.
*   **TC-XF-02: Telemetry Temporal Integration (F5 + F7)**
    *   *Objective*: Verify that circular queue events correctly integrate the live UDP telemetry updates in sequence, aligning network features and CPU telemetry timestamps.
    *   *Actions*: Feed UDP telemetry packet to port 9999, then send network packet.
    *   *Expected Result*: The next event in the queue contains both network stats and the updated CPU telemetry.
*   **TC-XF-03: Threat Ingress To Block E2E (F6 + F5)**
    *   *Objective*: Verify that a critical threat prediction from a sequence-based feature vector (F5) immediately triggers the in-memory Netfilter drop rule (F6) for the attacker IP.
    *   *Actions*: Push malicious sequence to circular queue.
    *   *Expected Result*: Anomaly score triggers, libiptc immediately drops the source IP.
*   **TC-XF-04: Secure Start Ingestion Sync (F8 + F5)**
    *   *Objective*: Verify that model decryption at startup (F8) executes before any events are ingested into the circular queue (F5), preventing null pointer dereferences.
    *   *Actions*: Start interceptor with encrypted model.
    *   *Expected Result*: Model decrypted successfully, packet ingestion is deferred until session is verified.
*   **TC-XF-05: CPU/Network Correlation Block (F7 + F6)**
    *   *Objective*: Verify that high cache misses received via UDP telemetry (F7) combined with suspicious network traffic trigger a high anomaly score and immediate Netfilter block (F6).
    *   *Actions*: Stream high cache miss metrics to UDP listener, trigger network scans.
    *   *Expected Result*: Anomaly score crosses critical threshold, IP is blocked.
*   **TC-XF-06: Submission Concurrency (F4 + F3)**
    *   *Objective*: Verify that submitting the lead form (F3) while WebSocket streaming (F4) is active does not cause interface lag or socket disconnection.
    *   *Actions*: Activate WebSocket connection, type in inputs, and submit the lead form.
    *   *Expected Result*: Form is submitted, WebSocket continues streaming without drops or performance latency.
*   **TC-XF-07: Key Validation Prior to Blocklist (F6 + F8)**
    *   *Objective*: Verify that the dynamic key loading module (F8) validates key integrity before the Netfilter engine (F6) registers its blocklist files.
    *   *Actions*: Provide mismatched key, trace initialization steps.
    *   *Expected Result*: Core fails on key validation, halts startup before file system and firewall hooks are initialized.
*   **TC-XF-08: Ingestion Bind Deferral (F7 + F8)**
    *   *Objective*: Verify that UDP telemetry listening (F7) remains suspended and does not bind sockets until the encrypted ONNX model has been successfully decrypted and initialized in memory (F8).
    *   *Actions*: Initiate interceptor with slow decrypt mechanism.
    *   *Expected Result*: UDP port remains unbound during decryption; binds immediately after model is verified.

---

### Tier 4: Real-World Application Scenarios (5 Cases)

#### TC-RW-01: Zero-Day SCADA Exploit Mitigation Sequence
*   *Objective*: Demonstrate mitigation of a zero-day exploit sequence under 50µs.
*   *Setup*: Interceptor running inline. Target PLC and attacker IP active.
*   *Actions*: Attacker executes benign Modbus operations (normal sequence), then triggers a zero-day DMA exploit (critical pattern).
*   *Expected Result*:
    1. Circular queue records the sequence history.
    2. Inference engine calculates score of `0.98`.
    3. Netfilter engine adds source block in-memory under 50µs.
    4. Attacker network access is severed; benign SCADA controller continues operations without disruption.

#### TC-RW-02: Dynamic Key Rotation & Model Reload Scenario
*   *Objective*: Rotate AES decryption keys and reload model with zero downtime.
*   *Setup*: Interceptor actively monitoring network traffic.
*   *Actions*:
    1. Rotate keys in secure env variables.
    2. Send `SIGUSR1` to the interceptor process.
*   *Expected Result*:
    1. Interceptor receives signal.
    2. Loader reads new key.
    3. Re-decrypts `.onnx.enc` in a background buffer.
    4. Switches session pointer atomically without dropping packets or resetting the circular queue.

#### TC-RW-03: Telemetry Network Storm & Out-of-Order Cache Telemetry
*   *Objective*: Maintain interceptor resilience during telemetry storms and out-of-order packets.
*   *Setup*: Attack vector active.
*   *Actions*:
    1. Inject 50,000 UDP telemetry packets with scrambled, non-sequential timestamps.
    2. Concurrently execute a brute-force SSH pattern on the network interface.
*   *Expected Result*:
    1. The UDP server sorts packets using monotonic timestamps.
    2. Discards obsolete packets.
    3. Queue is updated correctly; no threadlocks or memory leaks occur.

#### TC-RW-04: CISO Executive Live Demonstration
*   *Objective*: Verify the end-to-end integration of the Next.js visualizer and the C# API backend.
*   *Setup*: Next.js page open in browser, WebSocket active. C# API server running with mock simulator.
*   *Actions*:
    1. Detonate a simulated attack via C# control endpoint.
    2. Fill in the CISO Audit Form on the landing page.
*   *Expected Result*:
    1. UI transitions immediately, displaying the threat.
    2. The C# API publishes metrics which the UI renders.
    3. Audit form succeeds and logs database entry to tenant context.

#### TC-RW-05: Multi-tenant Core API Failover and Local Blocklist Persistence
*   *Objective*: Ensure local survival when the central management API goes offline.
*   *Setup*: Interceptor connected to Synz Core.
*   *Actions*:
    1. Sever connection to `SYNZ_CORE_URL` (API offline).
    2. Send zero-day attack payload.
*   *Expected Result*:
    1. Interceptor detects threat and blocks attacker IP locally.
    2. Serializes blocked IP to `/var/lib/synz-phantom/blocklist.txt`.
    3. Queues alert payload locally.
    4. On URL reconnection, queues are flushed and uploaded.

---

## 4. Pass/Fail Criteria & Test Execution

### 4.1 Global Pass Criteria
- **100% Test Execution**: All 93 test cases must run. Zero skipped unless hardware interfaces are unavailable (graceful mock skip).
- **Zero Memory Leaks**: Memory allocation profiling (Valgrind/AddressSanitizer) must register zero leaks on the C++ Edge Interceptor.
- **Microsecond Latency Limits**: Feature queue injection and inference latency must remain < 50µs in 99.9% of normal test runs.
- **Strict Compliance**: No production files may contain hardcoded keys. No `system()` calls in critical block paths.

### 4.2 Execution Commands
To execute the suite within the workspace:

```bash
# 1. Build C++ Edge Interceptor in test mode
cd C:/Users/Adminb/.gemini/antigravity/worktrees/Synz_Phantom/improve-synz-phantom-reads/edge_interceptor
cmake -B build -DUSE_MOCKS=ON -DCMAKE_BUILD_TYPE=Release
cmake --build build --config Release

# 2. Build Next.js visualizer
cd C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads
npm install
npm run build

# 3. Run E2E Test Suite via pytest
pytest e2e_tests/ --verbose --durations=10
```
