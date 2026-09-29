# Implementation Plan — Remove Dummy E2E Assertions

## Goal
Modify `e2e_tests/test_web_ui.py` to replace three dummy/facade assertions with genuine active assertions and verify correctness.

## Proposed Changes

### 1. Import helper functions
Modify the imports at line 12 of `e2e_tests/test_web_ui.py` to explicitly import `encode_websocket_frame` and `decode_websocket_frame` from `conftest` to ensure scope visibility.
```python
from conftest import NEXTJS_URL, state, encode_websocket_frame, decode_websocket_frame
```

### 2. Update `test_tc_f2_bcc_04_diagnostic_grid_oob()`
- Location: lines 349-354.
- Action: Replace the dummy assertion with socket connection, queue payload submission, connection active check, and proper teardown in a try-finally block.
- Implementation:
```python
def test_tc_f2_bcc_04_diagnostic_grid_oob():
    """Verify diagnostic grid doesn't crash when index is out of bounds."""
    sock = connect_ws()
    try:
        state.ws_send_queue.append('{"diagnostic_grid": [' + ','.join(['1']*50) + ']}')
        time.sleep(0.1)
        assert any(get_peer_safe(conn) == sock.getsockname() for conn in state.ws_connections)
    finally:
        sock.close()
```

### 3. Update `test_tc_f4_bcc_01_ws_sever_mid_sequence()`
- Location: lines 399-406.
- Action: Replace `assert True` with a genuine verification checking that the socket connection was successfully removed from `state.ws_connections`.
- Implementation:
```python
def test_tc_f4_bcc_01_ws_sever_mid_sequence():
    """Verify client stability if connection terminates during an attack sequence."""
    sock = connect_ws()
    client_addr = sock.getsockname()
    state.ws_send_queue.append('{"anomaly_score": 0.99, "defense_mode": "Hardware"}')
    time.sleep(0.05)
    sock.close()
    time.sleep(0.05)
    # Using client_addr since getsockname() raises OSError on a closed socket:
    # assert not any(get_peer_safe(conn) == sock.getsockname() for conn in state.ws_connections)
    assert not any(get_peer_safe(conn) == client_addr for conn in state.ws_connections)
```

### 4. Update `test_tc_f4_bcc_03_malformed_json()`
- Location: lines 421-430.
- Action: Replace dummy assertion with checking for the malformed JSON frame receipt and socket removal.
- Implementation:
```python
def test_tc_f4_bcc_03_malformed_json():
    """Ensure client ignores corrupted WebSocket payloads without crashing."""
    sock = connect_ws()
    client_addr = sock.getsockname()
    try:
        sock.sendall(encode_websocket_frame("{malformed_json: true"))
    except Exception:
        pass
    time.sleep(0.05)
    sock.close()
    time.sleep(0.05)
    assert any("{malformed_json" in msg for msg in state.ws_received_messages)
    assert not any(get_peer_safe(conn) == client_addr for conn in state.ws_connections)
```

## Verification
- Propose execution of `python -m pytest e2e_tests/ --verbose`.
- Check git status and commit changes with a clear message.
- Update DEVLOG.md.
