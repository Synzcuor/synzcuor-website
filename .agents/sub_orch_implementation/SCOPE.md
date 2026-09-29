# Scope: Implementation of Synz Phantom R1-R5

## Architecture
- **Next.js Web Interface (`SYNLabWebsite`)**: Single-page CISO/Plant Manager dashboard under `src/app/page.tsx` displaying telemetry logs, diagnostic grids, and active defense simulator. Can connect via WebSockets to C# backend.
- **C++ Edge Interceptor (`edge_interceptor`)**:
  - `main.cpp`: Orchestration loop. Integrates PacketReader, InferenceEngine, and KillSwitch.
  - `inference_engine.cpp`: ONNX model loader/decrypter.
  - `software_kill_switch.cpp`: libiptc Netfilter block.
  - `packet_reader.cpp`: Reads packets/telemetry.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | R1: Next.js Simulator | Premium landing page & React simulator dashboard, Lead Intake Form | None | DONE |
| 2 | R2: Circular Queue | Maintain 16-event circular buffer for temporal AC-WGAN model | None | DONE |
| 3 | R3: libiptc Blocking | Refactor C++ software blocking to use libiptc directly (Linux only) | None | DONE |
| 4 | R4: UDP Telemetry | Ingest hardware performance counter telemetry via UDP in background | None | DONE |
| 5 | R5: Dynamic Key Loading | Load AES keys dynamically at runtime instead of plain-text | None | DONE |
| 6 | Integration & Verification | Pass E2E tests, run Challenger coverage audit, and Forensic Audit | 1, 2, 3, 4, 5 | DONE |

## Interface Contracts
### Web Simulator ↔ C# / Mock API
- WebSockets connection to C# backend (`SynzPhantom.API`) streaming JSON metrics:
  - `benign_traffic`: number
  - `anomaly_score`: number (0-100)
  - `diagnostic_grid`: array of 16 status indicators
  - `defense_mode`: 'Monitor' | 'Software' | 'Hardware'

### C++ Edge Interceptor ↔ Host Telemetry Agent (UDP)
- UDP packets, populates feature vector elements `[256..383]` representing CPU performance telemetry.

## Code Layout
### Next.js Workspace (`C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads`)
- `src/app/page.tsx`: Landing page entry point
- `src/components/`: Shared React components (Simulator, LeadForm)
- `src/app/globals.css`: Styles

### C++ Workspace (`C:/Users/Adminb/.gemini/antigravity/worktrees/Synz_Phantom/improve-synz-phantom-reads`)
- `edge_interceptor/src/main.cpp`: Entry point & orchestration loop
- `edge_interceptor/src/inference_engine.cpp`: ONNX model loading, decryption, and execution
- `edge_interceptor/src/software_kill_switch.cpp`: libiptc Netfilter block
- `edge_interceptor/src/packet_reader.cpp`: Network traffic reader
