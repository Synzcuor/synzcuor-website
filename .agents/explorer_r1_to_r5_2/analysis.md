# Analysis Report: Synz Phantom Active Defense Improvements

## Executive Summary
This analysis details the implementation strategy for five key upgrades (R1–R5) across the Next.js website (`SYNLabWebsite`) and the C++ Edge Interceptor (`edge_interceptor`). The upgrades focus on introducing sequence-based modeling, low-latency in-memory packet blocking via `libiptc`, asynchronous hardware performance telemetry over UDP, dynamic AES key management, and a premium CISO-facing landing page simulator.

---

## R1. Next.js Launch Landing Page & Visualizer

### Goal & Requirements
- **Hero/Pitch**: Showcase sub-50µs zero-day threat prevention at Ring -1 without disrupting operations.
- **Sliders & Interactive Simulator**: Add controls for "Traffic Volatility" and "Payload Entropy" to dynamically calculate Wasserstein anomaly scores and active diagnostic slots.
- **Lead Intake Form**: Capture and validate `email`, `industry`, and `threatLevel`, and write submissions to a local JSON file.
- **WebSocket Streaming**: Toggle connection to the live C# backend (`SynzPhantom.API`) to stream actual threat metrics in real-time.

### Entry Points
- `src/app/page.tsx` — Client-side interface, simulator, and lead form.
- `src/app/api/lead/route.ts` — (New) Next.js API Route handler for saving leads to `leads.json` in the workspace root.

### Implementation Logic
1. **Interactive Controls**:
   - Introduce React state: `trafficVolatility` (0.0 to 1.0, default 0.15), `payloadEntropy` (0.0 to 1.0, default 0.1).
   - Recalculate anomaly score using:
     $$\text{anomalyScore} = \min(0.99, \text{baseline} + \text{volatility} \times 0.4 + \text{entropy} \times 0.5)$$
     where `baseline` is determined by the active state (Benign: 0.05, Scanning: 0.40, Attack: 0.80).
   - Dynamically toggle active diagnostic slots in the 16-slot grid:
     - `anomalyScore > 0.8`: Toggle exploit slots (`BufferOverflow`, `DoS / DDoS`, `DMA Attack`).
     - `anomalyScore > 0.4`: Toggle `PortScan` or `MemoryLeak`.
2. **Lead Intake Route**:
   - Validate corporate email (via regex) and fields.
   - API handler appends data securely to `leads.json` using `fs.writeFileSync`.
3. **WebSocket Client**:
   - Establish `new WebSocket("ws://localhost:5000/ws")` upon toggle.
   - Update `anomalyScore`, active slots, and active mode states directly when receiving JSON payloads containing `benign_traffic`, `anomaly_score`, `diagnostic_grid`, and `defense_mode`.

### Dependencies & Build Impacts
- Next.js Built-in App Router API handlers.
- Standard React Hooks (`useState`, `useEffect`, `useRef`).
- Standard CSS / Tailwind for custom slider styles.

### Pitfalls & Mitigation
- **Server-side `fs` in Client Components**: Doing filesystem writes in `page.tsx` directly will break static compilation. Mitigation: Route filesystem writes strictly through `src/app/api/lead/route.ts`.
- **WebSocket Reconnections**: Prevent socket leaks. Mitigation: Close the socket and clean up listeners in the `useEffect` cleanup return function.

---

## R2. C++ Edge Interceptor Circular Temporal Queue

### Goal & Requirements
- Maintain a sequence of the last 16 network and CPU telemetry events (T=16).
- Feed this history directly into the temporal model inputs instead of faking sequence history by duplicating one event, aligning with the AC-WGAN architecture.

### Entry Points
- `edge_interceptor/include/common.h`
- `edge_interceptor/src/main.cpp` — The callback loop orchestration.

### Implementation Logic
1. **Circular Queue Class**:
   - Implement `CircularTelemetryQueue` supporting thread-safe push operations.
   - Maintain a `std::vector<TelemetryEvent>` capped at 16 elements.
   - Populate with zeroed `TelemetryEvent` structures during cold start to ensure we always have 16 events.
2. **Input Tensor Construction**:
   - The model expects `input_tensor` representing a flat `[1, 400]` array, split into:
     - `net_seq`: `[16, 16]` network features (indices 0 to 255).
     - `cpu_seq`: `[16, 8]` CPU features (indices 256 to 383).
     - Padding: 16 floats (indices 384 to 399).
   - Construct the input features as follows:
     - For step $t \in [0, 15]$ (from oldest to newest event in queue):
       - `model_input[t * 16 + i] = queue[t].features[i]` for $i \in [0, 15]$ (network slice).
       - `model_input[256 + t * 8 + j] = queue[t].features[256 + j]` for $j \in [0, 7]$ (CPU slice).
   - Set the remaining padding elements `model_input[384..399]` to `0.0f`.
   - Pass this concatenated feature vector to `InferenceEngine::PredictAnomalyScore`.

### Dependencies & Build Impacts
- Standard C++ STL (`std::vector`, `std::mutex`).
- Header-only queue implementation; no extra build flags required.

### Pitfalls & Mitigation
- **Cold Start Anomaly Spikes**: Empty queue slots populated with random numbers can cause false positives. Mitigation: Pre-populate the queue with benign zeroed events.
- **Latency Overhead**: Copying 384 floats 16 times per packet adds overhead. Mitigation: Perform direct indexing and sequential block copies.

---

## R3. C++ Low-Overhead Netfilter Blocking

### Goal & Requirements
- Refactor `software_kill_switch.cpp` to use `libiptc` instead of calling `system("iptables...")` synchronously on the threat path.
- Manipulate Netfilter rules in memory via netlink sockets to reduce block latency from ~1ms to < 10µs.

### Entry Points
- `edge_interceptor/src/software_kill_switch.cpp`
- `edge_interceptor/CMakeLists.txt`

### Implementation Logic
1. **Rule Structure Construction**:
   - Allocate memory for an iptables entry: `sizeof(struct ipt_entry)` + `sizeof(struct xt_standard_target)`.
   - Set `entry.ip.src.s_addr = inet_addr(ip)` and `entry.ip.smsk.s_addr = inet_addr("255.255.255.255")`.
   - Set target name to `"DROP"`.
   - Verdict value: `-NF_DROP - 1` (equivalent to standard `-1` drop verdict).
2. **Rule Insertion**:
   - Call `iptc_init("filter")` to obtain the table handle.
   - Insert rules: `iptc_insert_entry("INPUT", &entry, 0, handle)` and `iptc_insert_entry("FORWARD", &entry, 0, handle)` at position 0 to prioritize dropping.
   - Commit rule: `iptc_commit(handle)` followed by `iptc_free(handle)`.
3. **Rule Removal**:
   - Iterate rules using `iptc_first_rule` and `iptc_next_rule`.
   - Locate entries matching target source IP and `"DROP"` target.
   - Delete via index using `iptc_delete_num_entry` and commit.

### Dependencies & Build Impacts
- Header `<libiptc/libiptc.h>` (available via standard `iptables-dev` package on Linux).
- Link with `libip4tc` on Linux. Add check in `CMakeLists.txt`:
  ```cmake
  find_library(IP4TC_LIB ip4tc)
  target_link_libraries(synz_interceptor PRIVATE ${IP4TC_LIB})
  ```

### Pitfalls & Mitigation
- **Thread Safety**: `libiptc` is not thread-safe. Mitigation: Protect all iptables handle calls using the switch's internal `std::mutex`.
- **Platform Portability**: `libiptc` works only on Linux. Mitigation: Enclose `libiptc` logic within `#ifndef _WIN32` blocks, keeping `netsh` commands for Windows.

---

## R4. C++ Host Telemetry Agent UDP Receiver

### Goal & Requirements
- Spin up a background UDP listener on the Edge Interceptor to receive PMU telemetry from host target servers (branch mispredictions, cache misses).
- Seamlessly populate features `[256..383]` of the active feature vector.

### Entry Points
- `edge_interceptor/include/common.h`
- `edge_interceptor/src/main.cpp`

### Implementation Logic
1. **Asynchronous UDP Thread**:
   - Create a background listener thread bound to a configurable port (default: `9999`) on `INADDR_ANY`.
   - Inside the loop, run `recvfrom` waiting for binary packages.
2. **Payload Parsing**:
   - Validate incoming payload size. The payload should pack 128 float values (representing CPU metrics), totaling 512 bytes.
   - Upon receipt, cast to a float array and store in a thread-safe global cache:
     ```cpp
     float g_latest_cpu_telemetry[128] = {0.0f};
     std::mutex g_cpu_mutex;
     ```
3. **Integration**:
   - When a network packet triggers `on_telemetry`, lock `g_cpu_mutex`, copy `g_latest_cpu_telemetry` into the current `TelemetryEvent::features[256..383]`, then push to the circular queue.

### Dependencies & Build Impacts
- standard socket APIs (`sys/socket.h` on Linux, `winsock2.h` on Windows).

### Pitfalls & Mitigation
- **Socket Blocking**: Prevent blocking shutdown. Mitigation: Put socket in non-blocking mode or use `select` / `poll` with a timeout, allowing exit checks via `g_running`.
- **Data Freshness**: Obsolete CPU telemetry could cause incorrect scoring. Mitigation: Add a timestamp limit and flush CPU metrics to zero if no UDP packet is received for > 2 seconds.

---

## R5. C++ Dynamic Key Loading

### Goal & Requirements
- Cleanly decouple decryption keys/IVs from the source code.
- Safely decrypt `.onnx.enc` directly in memory at runtime using keys provided from external vectors.

### Entry Points
- `edge_interceptor/src/inference_engine.cpp`

### Implementation Logic
1. **Dynamic Ingestion**:
   - Read the AES-256 CTR decryption key and IV from environment variables `SYNZ_AES_KEY` and `SYNZ_AES_IV`.
   - Safely convert incoming 64-char (Key) and 32-char (IV) hex strings into binary arrays.
2. **Fail-safe Logic**:
   - If variables are absent or invalid, throw a clear configuration error on startup:
     ```cpp
     throw std::runtime_error("Decryption credentials missing. Please define SYNZ_AES_KEY and SYNZ_AES_IV.");
     ```
3. **Decryption Execution**:
   - Run `AES_CTR_xcrypt_buffer` inside `inference_engine.cpp` with the loaded keys.
   - If the key is invalid, the decrypted model will be corrupt, causing `Ort::Session` initialization to throw. Wrap it in a `try-catch` block and fail with a clear diagnostic:
     `"Model decryption completed, but ONNX runtime failed to initialize. Decryption key or IV is likely incorrect."`

### Dependencies & Build Impacts
- No changes to dependencies (`tiny-AES-c` remains the decryption library).

### Pitfalls & Mitigation
- **Secrets Exposure**: Secrets could leak via process listings or logs. Mitigation: Avoid printing variables to stdout/syslog. Clear memory buffers immediately after loading the ONNX session.
