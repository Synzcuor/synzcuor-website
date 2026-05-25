## 2026-05-24T15:47:51Z

Build a premium Next.js launch landing page and interactive active-defense simulator for Synz Phantom, and implement critical C++ Edge Interceptor firmware improvements to achieve ultra-low latency, dynamic security, and operational compliance.

Working directory (Next.js): C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads
Working directory (C++ / C#): C:/Users/Adminb/.gemini/antigravity/worktrees/Synz_Phantom/improve-synz-phantom-reads
Integrity mode: development

## Requirements

### R1. Next.js Launch Landing Page & Visualizer
Build a production-grade, highly stylized launch landing page under `SYNLabWebsite` targeting industrial CISOs and Plant Managers.
- **Hero & Core Pitch**: Focus on sub-50µs zero-day threat prevention at Ring -1 without server disruption.
- **Interactive Active Defense Simulator**: Build an interactive client-side React dashboard that visualizes:
  - Benign traffic vs. malicious exploits (e.g., Modbus zero-days).
  - Anomaly score gauge tracking and 16-slot diagnostic grid outputs.
  - Active defense mode behaviors: Monitor (passive alerts), Software Block (IP drop), and Hardware Lockout (snapping the physical relay open).
  - Add an optional config or toggle to connect via WebSockets to the live C# backend (`SynzPhantom.API`) to stream actual threat metrics.
- **Lead Intake**: Form to request passive audits, with validation and client-side storage/mock-sending logs.

### R2. C++ Edge Interceptor Circular Temporal Queue
Upgrade the C++ orchestrator (`edge_interceptor/src`) to support true sequence-based inputs.
- Maintain a circular buffer of the last 16 network and CPU telemetry events.
- Construct the model input vector from this active sequence history instead of faking a sequence by reshaping a single event, aligning execution with the temporal AC-WGAN architecture.

### R3. C++ Low-Overhead Netfilter Blocking
Refactor `software_kill_switch.cpp` to use the `libiptc` library on Linux.
- Block/unblock target attacker IPs directly in-memory via Netlink socket interfaces, removing all synchronous, high-overhead `system("iptables...")` shell calls in the critical threat path.

### R4. C++ Host Telemetry Agent UDP Receiver
Implement a background UDP server thread in the C++ Edge Interceptor.
- Ingest real-time hardware performance counter telemetry streams (L1/L2 cache misses, branch mispredictions) sent by target servers.
- Use this telemetry to populate input features `[256..383]` (the CPU head inputs) in the model's feature vector.

### R5. C++ Dynamic Key Loading
Remove the hardcoded plain-text AES decryption keys and IVs from `inference_engine.cpp`.
- Load decryption keys dynamically at runtime (e.g., from secure environment variables, config handshakes, or server requests) to decrypt the `.onnx.enc` model safely in memory.

---

## Acceptance Criteria

### A1. Next.js Website Build & Verification
- [ ] `npm run build` succeeds on `SYNLabWebsite` with zero TypeScript errors or CSS compiler warnings.
- [ ] Lead capture form validates corporate email addresses and inputs correctly, displaying a success state and logging the payload to the developer console.
- [ ] Interactive simulator switches modes (Monitor, Software, Hardware) instantly, accurately updating the flow diagram and active defense visual triggers.

### A2. C++ Edge Interceptor Compilation & Execution
- [ ] CMake configuration and build succeed in Release mode with mocks enabled on Windows, and compile cleanly without errors on Linux.
- [ ] The C++ Edge Interceptor processes mock packets through the new 16-event circular buffer without memory leaks or segmentation faults.
- [ ] Dynamic AES key loading successfully decrypts the `.onnx.enc` model in memory at startup, failing gracefully if the key is missing or incorrect.
- [ ] The UDP telemetry listener runs on a background thread and successfully decodes and integrates test telemetry packets into the inference feature vector.
- [ ] On Linux, software blocking successfully calls `libiptc` to drop/restore traffic instead of spawning shell commands.

### A3. Independent Validation Tests
- [ ] The agent team must author a suite of automated unit/integration tests (either using C++ GTest/Catch2 or script-based wrappers) that verifies:
  - Sequence correctness in the circular queue.
  - Correct decoding of UDP performance telemetry.
  - AES key validation and decryption functionality.

## 2026-05-24T15:48:55Z

Please ensure that your implementation team follows these critical execution policies:
1. Update DEVLOG.md and any project notes files in both workspaces after completing/implementing each step/requirement.
2. Perform a Git commit with a descriptive message in the active repositories after every step.
3. If any change, decision, or implementation is questionable or experimental, commit those changes to a separate Git branch (e.g., prefix with `experimental-` or `feature-`) instead of committing directly to the main branch.

These updates are required so the user can sync workspaces and continue working seamlessly from another device.

