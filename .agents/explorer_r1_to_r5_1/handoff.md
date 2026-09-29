# Handoff Report — Explorer 1

## 1. Observation
We observed the following relevant code sections and configurations across the Next.js, C++, and C# codebases:
1. **Next.js Simulator**: In `src/app/page.tsx`, we have a client-side React simulator loop (`useEffect` at lines 58-104) that operates in isolation and lacks integration with WebSockets or SignalR.
2. **C++ Decryption Keys**: In `edge_interceptor/src/inference_engine.cpp`, the AES keys and IVs are currently hardcoded as plain-text:
   ```cpp
   const uint8_t AES_KEY[32] = { ... };
   const uint8_t AES_IV[16] = { ... };
   ```
3. **C++ Single-Event Processing**: In `edge_interceptor/src/inference_engine.cpp`, the model input features are populated by a single `TelemetryEvent`:
   ```cpp
   /* Copy the 384 features into the padded input buffer */
   for (size_t i = 0; i < TELEMETRY_DIM; ++i) {
       padded_input[i] = event.features[i];
   }
   ```
   This does not maintain a temporal history queue of 16 network/CPU events as required by the split-head temporal AC-WGAN generator critic structure.
4. **C++ Netfilter System Blocking**: In `edge_interceptor/src/software_kill_switch.cpp` (lines 96-102), the firewall rules are applied by executing external shells via `system()`:
   ```cpp
   #ifndef _WIN32
       bool ok_input   = ExecuteSystemCommand("iptables -I INPUT -s " + ip + " -j DROP");
       bool ok_forward = ExecuteSystemCommand("iptables -I FORWARD -s " + ip + " -j DROP");
   ...
   ```
5. **C++ Host Telemetry Ingestion**: The edge interceptor does not contain a background UDP thread to ingest CPU performance counter values from external target servers.
6. **C# WebSockets Ingestion**: In `SynzPhantom.API/Controllers/TelemetryController.cs`, the API receives telemetry via authenticated HTTP POST but has no WebSocket server mapped to broadcast incoming threat metrics.

---

## 2. Logic Chain
1. To implement **R1 (Next.js & WebSockets)**, since `src/app/page.tsx` lacks WebSocket streaming, we must add a custom React hook/effect and toggle switch connecting to the live C# backend (`ws://localhost:5000/ws`). Since `SynzPhantom.API` lacks WebSockets, we must register a `WebSocketConnectionManager` singleton and use `app.UseWebSockets()` middleware in C#.
2. To satisfy **R2 (C++ Circular Queue)**, the input model expects a sequence history. We must introduce a `TemporalSequenceManager` storing the last 16 network and CPU events, serializing them to form the flat 384-dimensional features input shape.
3. To satisfy **R3 (C++ Low-Overhead Netfilter Blocking)**, the high-overhead `system("iptables...")` calls must be replaced. By linking `libip4tc` and utilizing `iptc_init`, `iptc_insert_entry`, and `iptc_commit`, we can perform in-memory netfilter rule manipulations directly.
4. To satisfy **R4 (C++ UDP Telemetry Receiver)**, the CPU metrics `[256..383]` must be updated. Spawning a background socket listener thread on port `5005` to ingest 32-byte UDP floats and updating `TemporalSequenceManager` enables active telemetry feedback loops.
5. To satisfy **R5 (C++ Dynamic Key Loading)**, we must remove hardcoded keys from `inference_engine.cpp` and parse them at startup from the environment variables `SYNZ_DECRYPT_KEY` and `SYNZ_DECRYPT_IV`.

---

## 3. Caveats
- `libiptc` is Linux-specific. On Windows/macOS development environments, it should gracefully fall back to mock execution or bypass the real kernel calls to prevent compilation failures (controlled by CMake build flag `#ifdef USE_MOCKS` or `#ifndef _WIN32`).
- The UDP receiver assumes the target servers send exactly 32 bytes (8 floats) per update. If different telemetry payload sizes are introduced, the socket reader must adjust dynamically.

---

## 4. Conclusion
We have established a complete, concrete, and self-contained implementation plan for requirements R1-R5. By separating concerns (Next.js visualizer hooks, C# WebSocket broadcast, C++ temporal sequence management, C++ libiptc in-memory netfilter blocking, C++ background UDP receiver, and C++ env-based decryption), the implementer can execute the changes cleanly.

---

## 5. Verification Method
1. **Next.js Website**: Run `npm run build` inside `SYNLabWebsite` directory. It must compile with zero errors.
2. **C++ Edge Interceptor**: Verify with CMake compile in Release mode on Linux, and build with mocks on Windows.
3. **Automated Tests**: Authors will build Catch2/GTest unit tests (or script-based tests) in `edge_interceptor/tests` to verify:
   - `AES Decryption`: Verify decryption from environmental parameters match the decrypter.
   - `Circular Queue`: Verify queue push, shift, and flattening output sequence correctness.
   - `UDP Ingest`: Verify loopback UDP packet decoding.
