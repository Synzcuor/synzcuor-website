# Handoff Report — Explorer 3

## 1. Observation
- The Next.js landing page is located in `SYNLabWebsite` worktree at `src/app/page.tsx`, which contains the React simulator component.
- The C++ Edge Interceptor is located in `Synz_Phantom` worktree at `edge_interceptor/`.
- `edge_interceptor/src/inference_engine.cpp` (lines 114-122) contains hardcoded plain-text decryption credentials:
  ```cpp
  const uint8_t AES_KEY[32] = {
      0x2b, 0x7e, 0x15, 0x16, 0x28, 0xae, 0xd2, 0xa6,
      ...
  };
  const uint8_t AES_IV[16] = {
      0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7,
      ...
  };
  ```
- `compression_engine/compress/tt_decompose.py` (lines 68-83) specifies Critic sequence inputs reshaped from a single flat vector of size 384 into:
  - `net_seq = net_flat.view(batch, 16, 16)`
  - `cpu_seq = cpu_flat.view(batch, 16, 8)`
- `edge_interceptor/src/software_kill_switch.cpp` (lines 96-98) uses synchronous iptables CLI command executions for packet blocking on Linux:
  ```cpp
  bool ok_input   = ExecuteSystemCommand("iptables -I INPUT -s " + ip + " -j DROP");
  bool ok_forward = ExecuteSystemCommand("iptables -I FORWARD -s " + ip + " -j DROP");
  ```
- No existing UDP receiver socket logic is present in the current C++ orchestrator source.

## 2. Logic Chain
- Since `tt_decompose.py` performs cross-attention over temporal sequences reshaped to `(16, 16)` and `(16, 8)`, the C++ inference engine must populate a `[1, 384]` (or `[1, 400]` with padding) feature tensor using a true historical sequence of 16 network events (each contributing 16 features) and 16 CPU events (each contributing 8 features). This requires the implementation of two thread-safe circular buffers mapping to those exact sequence steps.
- Since `software_kill_switch.cpp` uses shell calls to `system()`, blocking is high-overhead and synchronous. Linking `libip4tc` will allow the system to insert rule structures directly into the Linux Netfilter engine's tables in-memory via socket operations, removing shell call latency.
- Since the PMU latency telemetry data must feed features `[256..383]` representing the CPU sequence history (16 steps * 8 features), a background thread bound to a UDP socket is required to ingest binary payloads from target servers and push them to the CPU circular queue.
- Since hardcoding plain-text credentials violates compliance guidelines, loading hex-encoded values of `SYNZ_AES_KEY` and `SYNZ_AES_IV` from environment variables, validating their formats/lengths, and failing gracefully when wrong or missing solves the vulnerability.

## 3. Caveats
- Direct execution of `libiptc` requires Linux root credentials (`CAP_NET_ADMIN`). Testing this on local mock setups (e.g., Windows/macOS development) will bypass libiptc and output mock notifications.
- WinSock socket initialization (`WSAStartup`) must be carefully coordinated on Windows targets to prevent resource leaks or double-initialization conflicts.

## 4. Conclusion
The entry points are clearly documented, and a comprehensive implementation strategy detailing specific files, structs, logic flows, and testing parameters has been written in `analysis.md`. The design achieves temporal sequence accuracy, high-performance in-memory firewall rules, UDP telemetry streaming, and secure AES decryption key lifecycle management.

## 5. Verification Method
- **Files to Inspect**:
  - `C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads/.agents/explorer_r1_to_r5_3/analysis.md`
- **Validation**:
  - Verify that the C++ compilation succeeds with `cmake -B build -DUSE_MOCKS=ON` followed by `cmake --build build`.
  - Validate the front-end layout compliance by checking that `src/app/page.tsx` utilizes React hooks correctly and parses WebSocket data structures gracefully.
