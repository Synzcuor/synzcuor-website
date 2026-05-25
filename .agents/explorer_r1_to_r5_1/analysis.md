# Synz Phantom Implementation Analysis Report (Requirements R1-R5)

This report details the implementation plan for Next.js website and C++ edge interceptor requirements. The changes are designed to fit the existing code structures without disruption.

---

## R1: Next.js Launch Landing Page & Visualizer

### 1. High-Level Concept & Design
The landing page targets industrial CISOs and VP Operations/Plant Managers. The messaging centers on **sub-50µs zero-day threat prevention at Ring -1 without host agent overhead**, preventing server disruptions and PLC state corruption.

### 2. React Simulator & WebSocket Integration
In `src/app/page.tsx`, we will introduce:
- A `Live API Stream` toggle switch.
- WebSocket hook to connect to `ws://localhost:5000/ws` (the C# API server).
- State synchronization: upon receiving WebSocket messages, decode the JSON payload containing `anomalyScore`, `isBlocked`, and `activeSlots`. Update the visual flow line, gauge, status banner, and diagnostic grid indicators in real-time.

#### Proposed WebSocket Payload Map:
```json
{
  "sensorId": "sensor-guid",
  "anomalyScore": 0.98,
  "isBlocked": true,
  "activeSlots": ["DoS / DDoS", "DMA Attack", "TCP"],
  "inferenceLatencyUs": 25.4
}
```

### 3. Corporate Email Validation
Add domain checking to the Lead Capture Form to filter out free webmail services (e.g., `gmail.com`, `yahoo.com`, `outlook.com`), ensuring only high-quality enterprise leads are submitted.
Log the validated payload to the developer console (`console.log`) and show a clear success state.

### 4. C# WebSockets Backend Integration (SynzPhantom.API)
To support real-time threat streaming, the C# ASP.NET API server must be updated:
- Introduce a singleton `WebSocketConnectionManager` class in `SynzPhantom.API` to store active client WebSocket sessions.
- In `Program.cs`, add `app.UseWebSockets()` middleware and map a `/ws` endpoint that registers incoming sockets.
- In `TelemetryController.cs`, inject the manager and broadcast telemetry JSON packets (complying with the visualizer contract) to all connected visualizer clients whenever `IngestTelemetry` or `IngestBatch` receives new telemetry from sensors.

---

## R2: C++ Edge Interceptor Circular Temporal Queue

### 1. Temporal Sequence Manager
We will introduce a thread-safe `TemporalSequenceManager` in `edge_interceptor/src` (or inside `main.cpp`) that maintains:
- A circular buffer of the last 16 network events (16 features each).
- A circular buffer of the last 16 CPU telemetry events (8 features each).

### 2. Layout Structure & Flattening
- **Network features**: `[0..255]` of the input tensor. Populated by serializing the 16 network events (16 floats per event).
- **CPU features**: `[256..383]` of the input tensor. Populated by serializing the 16 CPU events (8 floats per event).
- **Zero padding**: `[384..399]` of the input tensor (the model expects shape `[1, 400]`).

### 3. Code Entry Point (main.cpp)
We will modify the `on_telemetry` callback inside `main.cpp`:
1. Extract the first 16 network features from the arriving `event.features`.
2. Push them to the `TemporalSequenceManager`.
3. Construct the flattened 384-dimensional vector.
4. Set `sequence_event.features` to the constructed vector.
5. Invoke `inference.PredictAnomalyScore(sequence_event)`.

---

## R3: C++ Low-Overhead Netfilter Blocking

### 1. libiptc Control Logic
In `software_kill_switch.cpp`, we will eliminate the `system()` calls on Linux. Instead, we will:
1. Initialize the netfilter table handle using `iptc_init("filter")`.
2. Construct the standard IP drop rule using `struct ipt_entry` and `struct xt_standard_target`.
3. Set the target verdict to standard DROP: `target->verdict = -NF_DROP - 1;` (evaluates to `-1`).
4. Append/insert rules to `INPUT` and `FORWARD` chains via `iptc_insert_entry` and `iptc_commit`.
5. For unblocking, delete the corresponding entry via `iptc_delete_entry` and `iptc_commit`.

### 2. CMake Integration
Add search and library linking configuration for `libip4tc` in `edge_interceptor/CMakeLists.txt`:
```cmake
find_library(IP4TC_LIB NAMES ip4tc)
if (IP4TC_LIB)
    target_link_libraries(synz_interceptor PRIVATE ${IP4TC_LIB})
else()
    message(WARNING "libip4tc not found. libiptc blocking will compile as no-op on non-Linux systems.")
endif()
```

---

## R4: C++ Host Telemetry Agent UDP Receiver

### 1. Background Thread Listening
Implement a background thread in the edge interceptor that listens on a UDP socket (port `5005` by default).
Ingest binary telemetry packages of exactly 32 bytes representing 8 CPU performance counter metrics (L1/L2 cache misses, branch mispredictions, etc.).

### 2. Feature Mapping
Upon receiving a valid packet:
1. Cast the raw buffer to `float[8]`.
2. Push the 8 floats directly to the CPU circular buffer in `TemporalSequenceManager`.
3. The next network packet inference will automatically include these updated CPU telemetry inputs.

---

## R5: C++ Dynamic Key Loading

### 1. Environment Variable Retrieval
In `inference_engine.cpp`, we will read the environment variables `SYNZ_DECRYPT_KEY` and `SYNZ_DECRYPT_IV` using `std::getenv`.

### 2. Hex String Decoding
Parse:
- `SYNZ_DECRYPT_KEY`: 64-character hex string representing the 32-byte AES key.
- `SYNZ_DECRYPT_IV`: 32-character hex string representing the 16-byte AES IV.

### 3. Graceful Failure
If environment variables are missing or incorrect, throw a `std::runtime_error`. This will be caught at startup in `main.cpp`, logging a fatal error and exiting with status code 1.

---

## R1-R5 Verification Strategy

We will develop a testing suite (`tests/` directory) containing:
1. **AES Decryption Tests**: Verify key parsing, IV parsing, and AES-CTR decryption correctness.
2. **Circular Queue Tests**: Validate sequence retention, ordering, and buffer flattening into the [384] shape.
3. **UDP Ingest Tests**: Simulate sending binary floats over UDP loopback and verify decoding.
4. **Netfilter Rule Mock Tests**: Validate compiling libiptc logic or mock execution pathways.
