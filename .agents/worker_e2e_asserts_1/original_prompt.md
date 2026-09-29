## 2026-05-25T00:01:06Z
You are the E2E Test Suite Assertion Worker.
Your working directory is: C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads/.agents/worker_e2e_asserts_1
Please modify the E2E test file 'e2e_tests/test_web_ui.py' in the Next.js workspace to remove the three dummy/facade assertions:

MANDATORY INTEGRITY WARNING — DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

# Work details:
Target file: C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads/e2e_tests/test_web_ui.py

Changes to make:
1. In function test_tc_f2_bcc_04_diagnostic_grid_oob() (around line 349-354):
Replace the dummy assertion "assert len(state.ws_connections) >= 0" with a active verification:
- Establish a connection using 'sock = connect_ws()'
- Append the out-of-bounds diagnostic grid payload to state.ws_send_queue
- Wait for 0.1s
- Verify that the connection remains active and connected in 'state.ws_connections' using 'get_peer_safe' and 'sock.getsockname()'
- Properly close the socket in a try-finally block.

2. In function test_tc_f4_bcc_01_ws_sever_mid_sequence() (around line 399-406):
Replace "assert True" with a genuine verification checking that the socket connection was successfully removed from state.ws_connections:
- "assert not any(get_peer_safe(conn) == sock.getsockname() for conn in state.ws_connections)"
(Note that we close the socket in this test, so check that it's no longer in the server's list of active connections).

3. In function test_tc_f4_bcc_03_malformed_json() (around line 421-430):
Replace the dummy "assert len(state.ws_connections) >= 0" with two genuine verifications:
- Assert that the mock server successfully received the malformed JSON frame:
  "assert any(\"{malformed_json\" in msg for msg in state.ws_received_messages)"
- Assert that the socket connection was successfully removed from state.ws_connections after calling sock.close():
  "assert not any(get_peer_safe(conn) == client_addr for conn in state.ws_connections)"

After making these changes:
- Run the full pytest suite: 'python -m pytest e2e_tests/ --verbose' inside the Next.js workspace to verify that everything passes.
- Log your actions in 'DEVLOG.md' and make a git commit.
- Write a handoff report at 'handoff.md' in your working directory and notify the parent.
