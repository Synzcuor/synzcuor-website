# Handoff Report: Synz Phantom Active Defense Analysis

This handoff report summarizes the read-only investigation of the `improve-synz-phantom-reads` workspace, establishing the logic chain and the implementation strategy for the upcoming integration.

## 1. Observation
The following file coordinates and snippets were directly observed in the workspace:
- **R1 (Next.js Page Entry Point)**: `src/app/page.tsx` lines 15-24 define the state for the mock simulator:
  ```typescript
  export default function LaunchLandingPage() {
    const [defenseMode, setDefenseMode] = useState<DefenseMode>("monitor");
    const [threatState, setThreatState] = useState<ThreatState>("benign");
    const [anomalyScore, setAnomalyScore] = useState<number>(0.12);
  ```
  No backend-side lead persistence or WebSocket consumer currently exists in the codebase.
- **R2 (C++ Inference Event Path)**: `edge_interceptor/src/main.cpp` lines 273-280 execute inference on a single event:
  ```cpp
  auto on_telemetry = [&](const TelemetryEvent& event) {
      event_counter++;
      auto t_start = std::chrono::high_resolution_clock::now();
      float anomaly_score = inference.PredictAnomalyScore(event);
  ```
- **R3 (C++ System Blocking)**: `edge_interceptor/src/software_kill_switch.cpp` lines 97-101 call shell processes:
  ```cpp
  bool ok_input   = ExecuteSystemCommand("iptables -I INPUT -s " + ip + " -j DROP");
  bool ok_forward = ExecuteSystemCommand("iptables -I FORWARD -s " + ip + " -j DROP");
  ```
- **R4 (CPU Telemetry Ingestion)**: No UDP telemetry receiver thread exists in the current orchestrator; `TelemetryEvent::features` elements `[256..383]` are currently hardcoded to zero in `packet_reader.cpp` line 238:
  ```cpp
  for (size_t i = SYNZ_NET_FEATURES; i < TELEMETRY_DIM; ++i) {
      event.features[i] = 0.0f;
  }
  ```
- **R5 (Hardcoded Keys)**: `edge_interceptor/src/inference_engine.cpp` lines 113-122 specify model keys:
  ```cpp
  const uint8_t AES_KEY[32] = {
      0x2b, 0x7e, 0x15, 0x16, 0x28, 0xae, 0xd2, 0xa6,
      0xab, 0xf7, 0x15, 0x88, 0x09, 0xcf, 0x4f, 0x3c,
      0x2b, 0x7e, 0x15, 0x16, 0x28, 0xae, 0xd2, 0xa6,
      0xab, 0xf7, 0x15, 0x88, 0x09, 0xcf, 0x4f, 0x3c
  };
  ```

## 2. Logic Chain
- **R1 (Next.js)**: Because Next.js uses client-side rendering for "use client" pages, direct local file writing using Node.js `fs` fails during browser compilation. Therefore, a server-side route handler `/api/lead/route.ts` must be introduced to capture the form submission and write to `leads.json` in the workspace.
- **R2 (C++ Circular Buffer)**: Since the model's first head expects 16 steps of history, storing incoming network events in a circular queue of size 16 allows constructing the true sequential feature vector dynamically. This avoids modifying the underlying ONNX engine API or signature.
- **R3 (Netfilter Blocking)**: Shell fork-execution of `iptables` introduces millisecond-level latency. Using in-memory `libiptc` sockets drops processing latency below 10 microseconds.
- **R4 (UDP Ingestion)**: Host hardware counters are emitted asynchronously. An independent UDP server thread is needed to listen for incoming packets, extract the 128-float payload, and cache it thread-safely so that incoming network telemetry callback events can consume it.
- **R5 (Decoupled Decryption)**: In-code keys fail SOC2 compliance. Decoupling the AES credentials to use standard process environment variables resolves the audit constraint and supports dynamic validation.

## 3. Caveats
- Since the sandboxed environment lacks a Linux kernel and physical NICs, production paths (`libiptc` and eBPF kernel compilation) cannot be directly run on this machine. They must be validated through conditional compilation blocks (`#ifndef _WIN32` / `#ifdef __linux__`) and mocks.
- The C# API websocket endpoint must be verified to ensure it maps correctly to the Next.js visualizer.

## 4. Conclusion
The implementation strategy outlined in `analysis.md` addresses the core latency, structural, and compliance requirements. All interfaces remain compatible with the pre-trained weights.

## 5. Verification Method
- **Next.js**: Run `npm run build` inside `SYNLabWebsite` to ensure clean compilation.
- **C++**: Run the following build script on Windows:
  ```powershell
  cmake -B build -DUSE_MOCKS=ON
  cmake --build build --config Release
  ```
  Run the generated test suite to verify circular queue, UDP decoding, and decryption correctness.

## 6. Remaining Work (Implementer Steps)
1. **Next.js**: Create `src/app/api/lead/route.ts` to write leads to `leads.json`. Modify `src/app/page.tsx` to add sliders, handle websocket streaming, and bind the new form submission handler.
2. **C++ (R2 & R4)**: Add a thread-safe circular queue class. Bind UDP receiver socket thread. Merge queue sequence generation inside the callback in `main.cpp`.
3. **C++ (R3)**: Refactor `software_kill_switch.cpp` to use `libiptc` for Linux.
4. **C++ (R5)**: Retrieve AES keys from environment variables using `std::getenv` inside `inference_engine.cpp`.
5. **Testing**: Write comprehensive automated unit/integration tests to verify R2, R4, and R5 functionality.
