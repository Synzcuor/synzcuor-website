# Project: Synz Phantom Active Defense

## Architecture
This project consists of two main components:
1. **Next.js Web Interface (`SYNLabWebsite`)**: A landing page and active defense simulator designed for industrial CISOs and Plant Managers, demonstrating sub-50µs threat prevention at Ring -1.
2. **C++ Edge Interceptor (`edge_interceptor`)**: High-performance network and CPU telemetry ingestion, inference engine (using encrypted ONNX models), and Netfilter-based low-overhead software block.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | E2E Testing Track | Design and implement comprehensive tests (Tiers 1-4) | None | DONE |
| 2 | Next.js Landing Page & Simulator (R1) | Hero section, interactive React simulator dashboard, Lead capture form | None | DONE |
| 3 | C++ Circular Temporal Queue (R2) | Maintain 16-event circular buffer for temporal AC-WGAN model | None | DONE |
| 4 | C++ Netfilter Blocking (R3) | Refactor software blocking to use libiptc directly | None | DONE |
| 5 | C++ UDP Telemetry Receiver (R4) | Background thread receiving CPU telemetry for features [256..383] | None | DONE |
| 6 | C++ Dynamic Key Loading (R5) | Dynamic key loading to decrypt `.onnx.enc` in memory | None | DONE |
| 7 | Final E2E & Adversarial Verification | Pass 100% E2E tests and perform white-box adversarial hardening (Tier 5) | M1, M2, M3, M4, M5, M6 | DONE |

## Interface Contracts
### Web Simulator ↔ C# / Mock API
- Toggle to connect via WebSockets to C# backend (`SynzPhantom.API`) to stream actual threat metrics.
- JSON structure for WebSocket stream:
  - `benign_traffic`: number
  - `anomaly_score`: number (0-100)
  - `diagnostic_grid`: array of 16 status indicators
  - `defense_mode`: 'Monitor' | 'Software' | 'Hardware'

### C++ Edge Interceptor ↔ Host Telemetry Agent (UDP)
- Protocol: UDP packets
- Payload format: Binary payload containing performance counters (L1/L2 cache misses, branch mispredictions).
- Populates feature vector elements `[256..383]`.

## Code Layout
### Next.js Workspace
- `src/app/page.tsx`: Landing page entry point
- `src/app/globals.css`: Styles
- `src/components/`: Shared React components (Simulator, LeadForm)

### C++ Workspace
- `edge_interceptor/src/main.cpp`: Entry point & orchestration loop
- `edge_interceptor/src/inference_engine.cpp`: ONNX model loading, decryption, and execution
- `edge_interceptor/src/software_kill_switch.cpp`: libiptc Netfilter block
- `edge_interceptor/src/packet_reader.cpp`: Network traffic reader
