# Adversarial Challenge Report — Synz Phantom Active Defense

## Challenge Summary

**Overall risk assessment**: MEDIUM

While the system implements strict memory sanitization and boundary checks (such as fixed packet sizes for UDP telemetry), several architectural assumptions can be exploited by an adversary under stress or active threat scenarios. The most notable risks include remote UDP telemetry spoofing due to a broad interface binding, potential temporal sequence races in the inference engine under concurrency, and leftover decrypted memory on initialization failure.

---

## Challenges

### [High] Challenge 1: Remote UDP Telemetry Spoofing & Poisoning
- **Assumption challenged**: The Host Telemetry Agent is the sole source of UDP performance counters.
- **Attack scenario**: The UDP socket binds to `INADDR_ANY` (`0.0.0.0`) on port 9999. Since UDP is connectionless and unauthenticated, any remote attacker on the network can send spoofed 32-byte UDP packets to port 9999. By flooding the port with custom float values, the attacker can:
  1. Force false positives to trigger the hardware kill switch (causing Denial of Service/self-inflicted wire cutting).
  2. Dilute or mask legitimate network anomaly characteristics by spoofing "perfectly normal" CPU metrics, preventing zero-day detections.
- **Blast radius**: Complete bypass or manipulation of the AI classification model's decision-making logic.
- **Mitigation**: Bind the socket strictly to `127.0.0.1` (localhost) if the telemetry agent is co-located on the same physical host, or implement source IP validation (e.g., only accepting packets from the trusted host agent IP) and cryptographically sign/MAC the telemetry updates.

### [Medium] Challenge 2: Non-Atomic temporal Sequence Updates Under Concurrency
- **Assumption challenged**: The packet polling loop is single-threaded, and `PredictAnomalyScore` is executed sequentially.
- **Attack scenario**: Although the packet reader runs a single polling thread in production, if the binary is refactored to poll from multiple queues or if `PredictAnomalyScore` is called concurrently, the operations of pushing to the circular queue and retrieving chronological events are not atomic. A race condition can occur where:
  - Thread A pushes event $A_t$.
  - Thread B pushes event $B_t$.
  - Thread A gets the chronological events sequence, receiving a sequence that includes $B_t$ rather than a clean sequence ending in $A_t$.
- **Blast radius**: Out-of-order temporal sequences fed into the ONNX model, causing erratic anomaly scores and false positives/negatives.
- **Mitigation**: Wrap the `Push` and `GetChronologicalEvents` sequence in `PredictAnomalyScore` with a local mutex lock to ensure atomic temporal history acquisition per inference run.

### [Medium] Challenge 3: Incomplete Memory Sanitization on Model Loading Failure
- **Assumption challenged**: Standard catch-and-exit blocks cleanly reclaim all sensitive buffers.
- **Attack scenario**: If the decrypted ONNX model fails to load into the `Ort::Session` (due to model corruption, incorrect key decryption, or runtime errors), the catch block zeroes out `resolved_key` and `resolved_iv` and exits. However, the vector `buffer` containing the decrypted or partially decrypted model is NOT explicitly zeroed before calling `std::exit(1)`.
- **Blast radius**: Decrypted neural network weights remain in memory pages. If a core dump is generated on exit or if process memory is inspected via a cold boot/DMA attack, the proprietary model can be retrieved.
- **Mitigation**: Explicitly call `std::memset(buffer.data(), 0, buffer.size())` inside the catch block before terminating the process.

---

## Stress Test Results

- **UDP packet flood** → Binds to `0.0.0.0:9999` and shifts sliding array upon receiving any 32-byte packet → **FAIL** (vuln to spoofing)
- **NaN/Infinity injection** → Packet reader drops packets containing NaN/Inf → **PASS** (resilient to numerical instability injection)
- **Negative float injection** → Clamps negative values to 0.0f → **PASS** (resilient to value domain boundary bypass)
- **OOB Diagnostic Index** → Handled safely via defined slot constants → **PASS**

---

## Unchallenged Areas

- **eBPF Kernel Verification**: We did not verify the kernel verification safety of the XDP bytecode `synz_xdp.o` itself against kernel version changes, as the compiled object file was not loaded into a live Linux kernel.
