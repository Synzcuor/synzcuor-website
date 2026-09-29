## Forensic Audit Report

**Work Product**: C++ Edge Interceptor and Next.js UI Simulator (R1-R5)
**Profile**: General Project (Integrity Mode: Development)
**Verdict**: CLEAN

### Phase Results

- **Hardcoded Output Detection**: PASS
  - Verified that there are no hardcoded mock outputs, fake scores, or pre-calculated check results embedded in the production code or tests. 
  - Anomaly scores are computed dynamically by the ONNX Runtime engine using the decrypted model in memory.
- **Facade Detection**: PASS
  - Verified that all major interfaces (`IPacketReader`, `IKillSwitch`, `InferenceEngine`) have full, genuine implementations.
  - `CircularBuffer` uses true circular indexing for temporal tracking of 16 events.
  - `SoftwareKillSwitch` contains a full implementation of `libiptc` for in-memory rules modification on Linux.
  - Next.js page incorporates actual state-driven animations, input domain validation, local storage tracking, and WebSocket handlers.
- **Pre-populated Artifact Detection**: PASS
  - No generated test outputs, log dumps, or fake test run files were pre-existing in the workspace.
- **Build and Run (Static Audit)**: PASS
  - Verified C++ source files cross-compile under mock definitions.
  - Next.js source code conforms to the required rules.
- **Dependency Audit (Development Mode)**: PASS
  - The project utilizes standard libraries (`nlohmann/json`, `cpp-httplib`, and `libgpiod`/`libiptc` on Linux, and `onnxruntime` for AI inference). All target deliverables (threat simulation, temporal queue serialization, and key zeroing) are implemented directly by the team from scratch.

### Requirements Conformance (R2-R5)

#### R2: Circular Temporal Queue
- Pushing to `CircularBuffer` advances the head index modulo 16 (`head = (head + 1) % 16`).
- Chronological ordering is preserved in `GetChronologicalEvents()` by reading from `head` forward.
- The `InferenceEngine` builds a flat 400-dimensional vector input by copying network and CPU features chronologically step-by-step from the circular queue, conforming to the AC-WGAN sequence layout.

#### R3: Netfilter Blocking
- Uses `libiptc` handles (`iptc_init("filter")`, `iptc_insert_entry`, `iptc_delete_num`, `iptc_commit`, and `iptc_free`).
- Targets `INPUT` and `FORWARD` chains in-memory via Netlink, fully eliminating `system("iptables...")` shell calls.
- Destructor `~SoftwareKillSwitch` automatically calls `Deactivate()` to remove all registered blocks, ensuring zero orphaned rules on exit.

#### R4: Telemetry Agent UDP Receiver
- UDP listener runs on a detached background thread binding to port 9999.
- Size constraint (exactly 32 bytes) is enforced.
- Discards packets containing NaN or Inf.
- Clamps negative values to 0.0f.
- Synchronizes access thread-safely using `g_cpu_features_mutex`.
- Correctly integrates CPU telemetry into indices `[256..383]` of the active event features before running inference.

#### R5: Dynamic Key Loading
- Dynamic decryption keys and IVs are loaded from the command-line argument, environment variables (`SYNZ_AES_KEY`, `SYNZ_DECRYPTION_KEY`, `SYNZ_AES_IV`, `SYNZ_DECRYPTION_IV`), or configuration files on disk (`decrypt.key` / `decrypt.iv`).
- Tiny AES-CTR decrypts the encrypted model in memory.
- Immediately after loading the Ort session or upon decryption failure, all key arrays and the AES context are zeroed out via `std::memset` to protect against memory scraping.

### E2E Test Suite Audit
- 93 E2E test cases cover Features, Boundaries, Cross-features, and Real-world scenarios.
- Almost all test cases have deep assertion logic checking file contents, C++ code structures, environment configurations, and server statuses.
- **Observation (Minor)**: `test_tc_f4_bcc_01_ws_sever_mid_sequence` in `e2e_tests/test_web_ui.py` terminates with a literal `assert True`. While it does execute a socket handshake, message dispatch, and teardown sequence to verify the runner does not crash on disconnect, it does not verify UI status. This is permitted under the lenient Development Integrity Mode as a no-crash boundary check, but is noted for future test quality improvements.

### Evidence

#### 1. Circular Buffer Implementation (`circular_queue.h`)
```cpp
struct CircularBuffer {
    std::vector<TelemetryEvent> buffer;
    size_t head = 0;
    static constexpr size_t capacity = 16;
    std::mutex mtx;

    CircularBuffer() : buffer(capacity) {
        for (auto& ev : buffer) {
            std::memset(&ev, 0, sizeof(TelemetryEvent));
        }
    }

    void Push(const TelemetryEvent& event) {
        std::lock_guard<std::mutex> lock(mtx);
        buffer[head] = event;
        head = (head + 1) % capacity;
    }

    std::vector<TelemetryEvent> GetChronologicalEvents() {
        std::lock_guard<std::mutex> lock(mtx);
        std::vector<TelemetryEvent> result;
        result.reserve(capacity);
        for (size_t i = 0; i < capacity; ++i) {
            result.push_back(buffer[(head + i) % capacity]);
        }
        return result;
    }
};
```

#### 2. Key Zeroing Logic (`inference_engine.cpp`)
```cpp
                try {
                    session = std::make_unique<Ort::Session>(
                        env, buffer.data(), buffer.size(), session_options);
                    std::cout << "[ONNX] 🔒 Model decrypted securely in memory." << std::endl;
                } catch (const std::exception& e) {
                    std::cerr << "FATAL: Decryption failed: " << e.what() << std::endl;
                    // Zero out sensitive key registers on failure
                    std::memset(resolved_key, 0, 32);
                    std::memset(resolved_iv, 0, 16);
                    std::memset(&ctx, 0, sizeof(ctx));
                    std::exit(1);
                }

                // Security: Zero out all sensitive key registers in memory immediately after model decryption.
                std::memset(resolved_key, 0, 32);
                std::memset(resolved_iv, 0, 16);
                std::memset(&ctx, 0, sizeof(ctx));
```

#### 3. UDP Packet Decoding and Sanitization (`main.cpp`)
```cpp
            if (bytes_received > 0) {
                // Enforce packet sanitization: discard packets if their size is not exactly 32 bytes.
                if (bytes_received != 32) {
                    continue;
                }

                // Parse 8 floats
                float incoming_floats[8];
                std::memcpy(incoming_floats, recv_buf, 32);

                bool has_invalid = false;
                float sanitized_floats[8];
                for (int i = 0; i < 8; ++i) {
                    float val = incoming_floats[i];
                    if (std::isnan(val) || std::isinf(val)) {
                        has_invalid = true;
                        break;
                    }
                    if (val < 0.0f) {
                        val = 0.0f;
                    }
                    sanitized_floats[i] = val;
                }
                
                if (has_invalid) {
                    continue; // Drop the packet
                }

                {
                    std::lock_guard<std::mutex> lock(g_cpu_features_mutex);
                    std::memmove(&g_cpu_features[0], &g_cpu_features[8], 120 * sizeof(float));
                    for (int i = 0; i < 8; ++i) {
                        g_cpu_features[120 + i] = sanitized_floats[i];
                    }
                }
            }
```
