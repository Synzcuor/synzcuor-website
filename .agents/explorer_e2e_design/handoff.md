# E2E Test Design Handoff Report

## 1. Observation

Direct observations made in the workspace repositories:

*   **Requirements Source File**: Located at `C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads/ORIGINAL_REQUEST.md`.
    *   *R1*: "Build a production-grade, highly stylized launch landing page under `SYNLabWebsite` targeting industrial CISOs and Plant Managers... interactive client-side React dashboard... Lead Intake form..." (lines 13-21)
    *   *R2*: "Upgrade the C++ orchestrator... support true sequence-based inputs. Maintain a circular buffer of the last 16 network and CPU telemetry events..." (lines 23-26)
    *   *R3*: "Refactor `software_kill_switch.cpp` to use the `libiptc` library on Linux. Block/unblock target attacker IPs directly in-memory..." (lines 28-30)
    *   *R4*: "Implement a background UDP server thread in the C++ Edge Interceptor. Ingest real-time hardware performance counter telemetry streams..." (lines 32-35)
    *   *R5*: "Remove the hardcoded plain-text AES decryption keys and IVs from `inference_engine.cpp`. Load decryption keys dynamically at runtime..." (lines 37-39)

*   **Next.js Visualizer File**: Located at `C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads/src/app/page.tsx`.
    *   State management lines 17-21:
        ```typescript
        const [defenseMode, setDefenseMode] = useState<DefenseMode>("monitor");
        const [threatState, setThreatState] = useState<ThreatState>("benign");
        const [anomalyScore, setAnomalyScore] = useState<number>(0.12);
        ```
    *   Lead Capture Form submit lines 107-113:
        ```typescript
        const handleFormSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          if (leadForm.name && leadForm.email && leadForm.company) {
            setFormSubmitted(true);
            pushAlert(`Launch Demo Request received from ${leadForm.name} (${leadForm.company})`, "warn");
          }
        };
        ```

*   **C++ Edge Interceptor Files**:
    *   In `C:/Users/Adminb/.gemini/antigravity/worktrees/Synz_Phantom/improve-synz-phantom-reads/edge_interceptor/src/main.cpp`:
        *   Lines 273-285: Telemetry ingestion invokes `PredictAnomalyScore` directly per single packet event without sequence queue integration.
    *   In `C:/Users/Adminb/.gemini/antigravity/worktrees/Synz_Phantom/improve-synz-phantom-reads/edge_interceptor/src/inference_engine.cpp`:
        *   Lines 113-122: AES decryption keys and IVs are hardcoded:
            ```cpp
            const uint8_t AES_KEY[32] = {
                0x2b, 0x7e, 0x15, 0x16, ...
            };
            const uint8_t AES_IV[16] = {
                0xf0, 0xf1, 0xf2, ...
            };
            ```
    *   In `C:/Users/Adminb/.gemini/antigravity/worktrees/Synz_Phantom/improve-synz-phantom-reads/edge_interceptor/src/software_kill_switch.cpp`:
        *   Lines 96-102: System calls are made using synchronous `ExecuteSystemCommand` with command string interpolation (`iptables` / `netsh`).

---

## 2. Logic Chain

The step-by-step reasoning from observations to the proposed test suite design:

1.  **Requirement to Feature Mapping**: Based on *R1 - R5*, the system can be decomposed into 8 functional modules (F1 - F8) spanning client-side React UI elements, WebSockets, circular buffering, Netfilter low-level driver calls, UDP background server sockets, and memory-safe cryptography.
2.  **Coverage Scoping**: To verify all 8 features, a multi-tier E2E testing framework is required:
    *   *Tier 1 (Feature Coverage)*: Ensure basic happy-path coverage of at least 5 test cases per feature (40 tests total).
    *   *Tier 2 (Boundary & Corner Cases)*: Stress the inputs, UI states, network floods, and memory cleanups under extreme conditions with 5 cases per feature (40 tests total).
    *   *Tier 3 (Cross-Feature Pairwise)*: Ensure integrated pipelines (e.g. WebSocket metrics updating UI, UDP telemetry integrating into feature vectors, key load before model initialization) behave synchronously under load (8 tests total).
    *   *Tier 4 (Real-World Scenarios)*: Trace complete operational scenarios like SCADA zero-day mitigations under 50µs, key rotation signaling, and API connection failovers (5 tests total).
3.  **Test Run Automation**: To orchestrate low-level network commands (UDP telemetry, Netfilter rules) and browser actions simultaneously, Python is chosen as the test runner language since it integrates Playwright browser control, socket APIs, process execution tracking (`subprocess`), and clean test assertions (`pytest`) out-of-the-box.

---

## 3. Caveats

*   **Netfilter and Linux Interfaces**: Low-level Netfilter blocking tests (`libiptc`) require Linux and `sudo` capability (`CAP_NET_ADMIN`). On Windows, the test suite must fallback to checking `netsh` additions or mock the return states of the firewall module.
*   **Encrypted Model Dependency**: Dynamic key validation and decryption tests require the presence of `synz_phantom.onnx.enc` in the path.

---

## 4. Conclusion

The E2E test plan is fully designed and documented in `TEST_INFRA.md` at the project root of the Next.js workspace. It covers 93 test cases detailing ID, Title, Objective, Preconditions, Actions, Expected Output, and Verification Method. This ensures the implementation subagents have clear guidelines for writing the tests and code.

---

## 5. Verification Method

To verify the test suite design:
1. Check that `TEST_INFRA.md` is present at `C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads/TEST_INFRA.md`.
2. Inspect the test case list to confirm that all 93 cases are explicitly detailed and mapped.
3. Validate that the pass/fail criteria and execution commands are documented.
