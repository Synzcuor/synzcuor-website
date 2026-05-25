## 2026-05-24T23:50:00Z

You are the Implementation Worker for Synz Phantom active defense simulator and C++ Edge Interceptor firmware improvements.
Your working directory is: C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads/.agents/worker_r1_to_r5_impl_3

Please execute the required code fixes, refactoring, and test suite rewrites in accordance with the specifications below.

MANDATORY INTEGRITY WARNING — DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

# Scope & Tasks

1. **Next.js Landing Page Copy Fix**:
   - In `C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads/src/app/page.tsx`, add the missing `"Ring -1"` threat prevention claim to the hero description or title to satisfy the R1 requirement and fix the E2E test `test_tc_f1_02_target_latency_banner` which asserts `"Ring -1" in html`.

2. **C++ Edge Interceptor IP Byte-Order Inversion Fix**:
   - In `C:/Users/Adminb/.gemini/antigravity/worktrees/Synz_Phantom/improve-synz-phantom-reads/edge_interceptor/src/packet_reader.cpp`, wrap the mock IP address assignments in `MockPacketReader::Start` (e.g. `0xC0A80164` and `0xC0A80101`) with `htonl()`.
   - Ensure you conditionally include the socket headers at the top of `packet_reader.cpp` to resolve `htonl()` on both Windows and Linux/macOS:
     ```cpp
     #ifdef _WIN32
     #include <winsock2.h>
     #else
     #include <arpa/inet.h>
     #endif
     ```

3. **Re-implement Dummy E2E Tests in `test_web_ui.py`**:
   - In `C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads/e2e_tests/test_web_ui.py`, replace all dummy `assert True` or trivial checks with genuine, active assertions.
   - For WebSocket streaming tests (e.g., `test_tc_f4_02_gauge_real_time_ingestion`, `test_tc_f4_03_diagnostic_grid_ingestion`, etc.), open a real WebSocket client socket (using python standard `socket` library to connect to `localhost:5000`, perform standard WebSocket handshake, send messages or read frames broadcast by the mock WebSocket server) and assert that real JSON payloads are sent, received, and match the format.
   - Re-implement all boundary/corner case tests (such as XSS validation, required form attributes, overflow log scrolling styles, viewports) to actively search page elements or test standard library-driven requests.

4. **Re-implement Dummy E2E Tests in `test_cpp_interceptor.py`**:
   - In `C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads/e2e_tests/test_cpp_interceptor.py`, replace all dummy `assert True` tests with genuine tests.
   - For `test_tc_f7_01_udp_port_startup`, replace the dummy `sendto` check with an active check: assert that another socket cannot bind to `(UDP_HOST, UDP_PORT)` when the interceptor process is running (raising `OSError`).
   - For `test_tc_f7_bcc_04_port_collision_exit`, bind `(UDP_HOST, UDP_PORT)` from python, start the interceptor, and assert that it exits with a non-zero exit code or logs a bind error.
   - For `test_tc_f8_bcc_02_truncated_model`, write a short, malformed binary file, pass it as the model path to the interceptor process, and assert it exits with a non-zero exit code.
   - For `test_tc_f8_bcc_04_unreadable_model_permissions`, run the interceptor with a non-existent model file and assert it exits with a non-zero exit code.
   - For other circular queue or key parsing checks, statically analyze code structure, read the headers/source files, and perform active assertions.

5. **Build and Test Verification**:
   - Inside `SYNLabWebsite` workspace, run `npm run build` to verify the web app compiles cleanly.
   - Inside `edge_interceptor` workspace, run CMake to configure with mocks (e.g. `cmake -B build -DUSE_MOCKS=ON`) and compile the project.
   - Run the C++ unit test suite (`./build/test_interceptor`) and confirm all tests pass.
   - In `SYNLabWebsite`, run `python -m pytest e2e_tests/ --verbose` to run the E2E test suite and verify that all 93 tests pass.

6. **Git Logging and Commits**:
   - Update `DEVLOG.md` in both workspaces detailing the fixes made.
   - Perform descriptive Git commits in both repositories after implementing the fixes.

Write a detailed handoff report (`handoff.md`) in your working directory and notify the parent when done.
