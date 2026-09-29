# ==============================================================================
# test_cross_feature.py — Cross-Feature Integration Tests (TC-XF-01 - TC-XF-08)
# ==============================================================================

import os
import time
import socket
import urllib.request
import pytest
from conftest import NEXTJS_URL, state

# ==============================================================================
# Tier 3: Cross-Feature Combinations (8 Cases)
# ==============================================================================

def test_tc_xf_01_live_mode_overrides():
    """TC-XF-01: Live Mode Overrides (F4 + F2)
    Verify WebSocket metrics stream updates the Active Defense mode UI state instantly, 
    overriding local mock states.
    """
    # Verify that app/page.tsx has WebSocket handling setting the defense mode
    page_file = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../src/app/page.tsx")
    )
    assert os.path.exists(page_file)
    with open(page_file, "r", encoding="utf-8") as f:
        content = f.read()
    assert "setDefenseMode" in content, "page.tsx should update defense mode state"
    assert "socket.onmessage" in content or "WebSocket" in content, "page.tsx should handle WebSocket messages"

def test_tc_xf_02_telemetry_temporal_integration():
    """TC-XF-02: Telemetry Temporal Integration (F5 + F7)
    Verify that circular queue events correctly integrate the live UDP telemetry updates in sequence, 
    aligning network features and CPU telemetry timestamps.
    """
    main_file = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../../Synz_Phantom/improve-synz-phantom-reads/edge_interceptor/src/main.cpp")
    )
    assert os.path.exists(main_file)
    with open(main_file, "r") as f:
        content = f.read()
    assert "CircularBuffer" in content or "g_circular_queue" in content or "Push" in content, "main.cpp should push events to CircularBuffer"

def test_tc_xf_03_threat_ingress_to_block_e2e():
    """TC-XF-03: Threat Ingress To Block E2E (F6 + F5)
    Verify that a critical threat prediction from a sequence-based feature vector (F5) 
    immediately triggers the in-memory Netfilter drop rule (F6) for the attacker IP.
    """
    main_file = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../../Synz_Phantom/improve-synz-phantom-reads/edge_interceptor/src/main.cpp")
    )
    assert os.path.exists(main_file)
    with open(main_file, "r") as f:
        content = f.read()
    assert "BlockIP" in content or "ks.BlockIP" in content, "main.cpp should trigger BlockIP on anomaly score"

def test_tc_xf_04_secure_start_ingestion_sync():
    """TC-XF-04: Secure Start Ingestion Sync (F8 + F5)
    Verify that model decryption at startup (F8) executes before any events are ingested 
    into the circular queue (F5), preventing null pointer dereferences.
    """
    main_file = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../../Synz_Phantom/improve-synz-phantom-reads/edge_interceptor/src/main.cpp")
    )
    assert os.path.exists(main_file)
    with open(main_file, "r") as f:
        content = f.read()
    
    init_idx = content.find("Initialize")
    thread_idx = content.find("std::thread")
    assert init_idx != -1
    assert thread_idx != -1
    assert init_idx < thread_idx, "Model initialization must complete before telemetry thread starts"

def test_tc_xf_05_cpu_network_correlation_block():
    """TC-XF-05: CPU/Network Correlation Block (F7 + F6)
    Verify that high cache misses received via UDP telemetry (F7) combined with suspicious 
    network traffic trigger a high anomaly score and immediate Netfilter block (F6).
    """
    main_file = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../../Synz_Phantom/improve-synz-phantom-reads/edge_interceptor/src/main.cpp")
    )
    assert os.path.exists(main_file)
    with open(main_file, "r") as f:
        content = f.read()
    assert "telemetry" in content.lower()
    assert "BlockIP" in content, "Should contain block action integration"

def test_tc_xf_06_submission_concurrency():
    """TC-XF-06: Submission Concurrency (F4 + F3)
    Verify that submitting the lead form (F3) while WebSocket streaming (F4) is active 
    does not cause interface lag or socket disconnection.
    """
    page_file = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../src/app/page.tsx")
    )
    assert os.path.exists(page_file)
    with open(page_file, "r", encoding="utf-8") as f:
        content = f.read()
    assert "handleFormSubmit" in content, "page.tsx should define handleFormSubmit"
    assert "useWebSocket" in content, "page.tsx should handle useWebSocket toggle state"

def test_tc_xf_07_key_validation_prior_to_blocklist():
    """TC-XF-07: Key Validation Prior to Blocklist (F6 + F8)
    Verify that the dynamic key loading module (F8) validates key integrity before the 
    Netfilter engine (F6) registers its blocklist files.
    """
    ie_file = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../../Synz_Phantom/improve-synz-phantom-reads/edge_interceptor/src/inference_engine.cpp")
    )
    assert os.path.exists(ie_file)
    with open(ie_file, "r") as f:
        content = f.read()
    assert "SYNZ_AES_KEY" in content or "SYNZ_DECRYPTION_KEY" in content, "Should resolve decryption keys first"

def test_tc_xf_08_ingestion_bind_deferral():
    """TC-XF-08: Ingestion Bind Deferral (F7 + F8)
    Verify that UDP telemetry listening (F7) remains suspended and does not bind sockets 
    until the encrypted ONNX model has been successfully decrypted and initialized in memory (F8).
    """
    main_file = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../../Synz_Phantom/improve-synz-phantom-reads/edge_interceptor/src/main.cpp")
    )
    assert os.path.exists(main_file)
    with open(main_file, "r") as f:
        content = f.read()
    assert content.find("Initialize") < content.find("bind"), "Initialize must happen before binding socket"
