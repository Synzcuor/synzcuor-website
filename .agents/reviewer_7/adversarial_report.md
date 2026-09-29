# Adversarial Challenge Report — 2026-05-24

## Challenge Summary

**Overall risk assessment**: LOW

Static adversarial analysis shows that the edge interceptor's architecture is highly robust. Concurrency safeguards, packet boundary validation, and static type boundaries prevent common injection and thread-contention attacks. The primary vulnerabilities are logical risks related to dynamic key lifecycle management and Netfilter state handling.

---

## Challenges

### [Medium] Challenge 1: Key and IV Exposure in Process Environment Blocks
- **Assumption challenged**: Environmental variables are secure locations to resolve cryptographic materials dynamically.
- **Attack scenario**: An attacker who compromises a non-root system process or obtains read-only local access can inspect the process environment blocks (e.g. via `/proc/[pid]/environ` on Linux or via WMI on Windows) to extract `SYNZ_DECRYPTION_KEY` and `SYNZ_DECRYPTION_IV`.
- **Blast radius**: Full compromise of the model's intellectual property. The attacker can decrypt the compiled ONNX model binary and extract the proprietary neural network architecture and parameters.
- **Mitigation**: Pass the decryption key via a secure descriptor or use the Linux kernel keyring utility (`keyctl`) to pass secrets. Cleanse the environment block variables immediately after decryption.

### [Low] Challenge 2: Out-of-Sync Local Netfilter Blocklist state
- **Assumption challenged**: If the iptables rule commit fails, the local persistent list and runtime file will remain consistent with the active kernel state.
- **Attack scenario**: If the libiptc rule deletion fails (`iptc_commit` returns false) due to rule locking, concurrent modifications, or resource exhaustion, the software kill switch fallback logic `ok || true` forces removal of the IP from the local `blocked_ips_` array and persists it to `/var/lib/synz-phantom/blocklist`.
- **Blast radius**: The kernel-level iptables rule blocking the target IP will remain active, but the interceptor's internal list will believe the IP is unblocked. Consequently, subsequent administrative requests to unblock the IP will fail because the interceptor thinks the IP is not blocked and will skip sending a delete command.
- **Mitigation**: Implement a health check or sync script that queries the netfilter tables directly and reconciles the active iptables rules with the contents of the persistent local blocklist file.

---

## Stress Test Results

- **Malformed UDP Telemetry packet** → Discarded due to size validation (`bytes_received != 32`) and float value checks (`isnan` / `isinf` filtering) → **PASS** (System does not crash or corrupt the feature array)
- **Extreme value boundaries in telemetry** → Inputs are clamped to `>= 0.0f` and processed safely → **PASS**
- **Decryption key missing or truncated** → Fails immediately during startup (`std::exit(1)`) with zeroed key buffers → **PASS**

---

## Unchallenged Areas

- **Dynamic Kernel Thread Contention under High Network Load** — Reason: eBPF driver performance and hardware packet loss under generic network storms could not be evaluated dynamically due to OS permission constraints.
