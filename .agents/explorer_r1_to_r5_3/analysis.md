# Requirements Analysis & Detailed Implementation Plan

This document details the analysis and proposed implementation strategy for expanding the Synz Security cyber-kinetic active defense platform. The scope spans a Next.js front-end landing page, C++ temporal sequence queues, in-memory Netfilter firewall logic, a background UDP telemetry server, and dynamic AES key management.

---

## 1. Requirement 1: Next.js Landing Page, Visualizer, & Lead Intake

### Entry Point
- `src/app/page.tsx`
- `src/app/globals.css` (for theme/animations)

### Proposed Changes & UI Additions
1. **Active Defense Simulator Upgrade**:
   - Maintain local client-side state for the interactive dashboard: active threat levels, a 16-slot diagnostic grid matching the protocol/exploit slots, and the active defense mode (Monitor, Software, Hardware).
   - Add a toggle switch: `"Connect to Live Core API"`.
   - Add a text input field for the WebSocket URL (defaulting to `ws://localhost:5001/ws`).
   - When the toggle is activated:
     - Open a standard browser `WebSocket` connection to the provided URL.
     - Add `onmessage` handling to parse JSON frames containing:
       - `anomaly_score` (mapped to the live gauge)
       - `diagnostic_grid` (an array of 16 booleans mapped to the 16 slots)
       - `defense_mode` (mapped to defense mode status)
       - `network_rate` (mapped to flow visualizer)
     - Gracefully handle `onclose` and `onerror` by displaying a status banner and falling back to local simulation.
2. **Corporate Lead Intake Validation**:
   - Enhance the "Request Passive Audit" form.
   - Restrict the email input field to corporate domains. Validations will:
     - Check standard email formatting (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
     - Split the email address by the `@` character.
     - Compare the domain against a blocklist of common personal email providers: `gmail.com`, `yahoo.com`, `hotmail.com`, `outlook.com`, `aol.com`, `icloud.com`, `proton.me`, `protonmail.com`, `yandex.com`.
   - Upon successful submission:
     - Log the payload to the developer console (`console.log`).
     - Store the lead in `localStorage` under the key `synz_leads` as a JSON array of objects, containing name, corporate email, company, and submission timestamp.
     - Show a success alert / confirmation modal.

### Code Snippet: Corporate Email Validation (React TS)
```typescript
const personalDomains = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", 
  "aol.com", "icloud.com", "proton.me", "protonmail.com", "yandex.com"
];

const validateLeadForm = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Invalid email address format." };
  }
  const domain = email.split("@")[1].toLowerCase();
  if (personalDomains.includes(domain)) {
    return { valid: false, message: "Please enter a corporate email address (personal providers are not accepted)." };
  }
  return { valid: true, message: "" };
};
```

---

## 2. Requirement 2: C++ Edge Interceptor Circular Temporal Queue

### Entry Points
- `edge_interceptor/include/common.h`
- `edge_interceptor/src/main.cpp`

### Context & Logic
The AC-WGAN Critic model expects a `[1, 400]` input tensor. Inside the Critic's model definition, features `[0..255]` are reshaped to `[16, 16]` (16 time steps of 16 network features) and features `[256..383]` are reshaped to `[16, 8]` (16 time steps of 8 CPU features). The remaining 16 dimensions are padding.
To support this temporal sequence without faking data:
1. Define a thread-safe `CircularBuffer` template in a new header or in `common.h`.
2. Instantiate two global (or member-owned) circular buffers:
   - `CircularBuffer<std::array<float, 16>, 16> g_net_history;`
   - `CircularBuffer<std::array<float, 8>, 16> g_cpu_history;`
3. Pre-fill both buffers with default-constructed (zero-filled) arrays to ensure the system is operational from step zero.
4. When a new network event is received:
   - Extract the first 16 network features: `event.features[0..15]`.
   - Push them to `g_net_history`.
   - Extract the latest 16 items from both `g_net_history` and `g_cpu_history` in chronological order (oldest to newest).
   - Flatten these history vectors into a single `TelemetryEvent mutable_event;` feature array:
     - `mutable_event.features[0..255]` filled by the 16 net steps.
     - `mutable_event.features[256..383]` filled by the 16 CPU steps.
     - `mutable_event.features[384..399]` set to `0.0f` (padding).
   - Pass `mutable_event` to the inference engine.

### Code Design: Thread-Safe Circular Buffer
```cpp
#include <mutex>
#include <vector>
#include <array>

template <typename T, size_t N>
class CircularBuffer {
private:
    std::vector<T> buffer_;
    size_t write_idx_ = 0;
    std::mutex mutex_;

public:
    CircularBuffer() : buffer_(N) {}

    void Push(const T& item) {
        std::lock_guard<std::mutex> lock(mutex_);
        buffer_[write_idx_] = item;
        write_idx_ = (write_idx_ + 1) % N;
    }

    std::vector<T> GetOrdered() {
        std::lock_guard<std::mutex> lock(mutex_);
        std::vector<T> ordered;
        ordered.reserve(N);
        for (size_t i = 0; i < N; ++i) {
            size_t idx = (write_idx_ + i) % N;
            ordered.push_back(buffer_[idx]);
        }
        return ordered;
    }
};
```

---

## 3. Requirement 3: C++ Low-Overhead Netfilter Blocking

### Entry Points
- `edge_interceptor/src/software_kill_switch.cpp`
- `edge_interceptor/CMakeLists.txt`

### Refactoring Logic
Instead of shelling out to iptables using slow `system()` processes, refactor the `SoftwareKillSwitch` to use the `libip4tc` API on Linux to program rules directly into the Netfilter engine in-memory.
1. Update `CMakeLists.txt` to find and link the library `ip4tc`:
   ```cmake
   find_library(LIBIP4TC_LIBRARY NAMES ip4tc)
   target_link_libraries(synz_interceptor PRIVATE ${LIBIP4TC_LIBRARY})
   ```
2. Refactor `BlockIP()` and `UnblockIP()` under `#ifdef __linux__`:
   - Initialize a handle for the "filter" table via `iptc_init("filter")`.
   - Allocate and construct an `ipt_entry` representation.
   - Configure the source IP parameter in the entry struct using `inet_pton`. Set the mask to `255.255.255.255` (`0xFFFFFFFF`).
   - Append the `ipt_standard_target` target payload specifying the `-NF_DROP - 1` verdict (which corresponds to DROP).
   - Use `iptc_insert_entry` to place the block rule at index 0 of the target chain (`INPUT` or `FORWARD`).
   - Call `iptc_commit()` to write the transactions atomically to the kernel.
   - If the platform is not Linux, fall back to standard mock console printouts or platform-native mock APIs.

### Code Snippet: direct libiptc integration (IPv4 DROP Rule)
```cpp
#ifdef __linux__
#include <libiptc/libiptc.h>
#include <arpa/inet.h>
#include <netinet/ip.h>

bool ApplyIptcRule(const std::string& chain, const std::string& ip_str, bool add) {
    struct iptc_handle* h = iptc_init("filter");
    if (!h) return false;

    struct in_addr ip_addr;
    if (inet_pton(AF_INET, ip_str.c_str(), &ip_addr) != 1) {
        iptc_free(h);
        return false;
    }

    bool success = false;
    if (add) {
        // Construct entry + target
        size_t size = sizeof(struct ipt_entry) + sizeof(struct ipt_standard_target);
        struct ipt_entry* e = (struct ipt_entry*)calloc(1, size);
        if (e) {
            e->ip.src.s_addr = ip_addr.s_addr;
            e->ip.smsk.s_addr = inet_addr("255.255.255.255");
            e->target_offset = sizeof(struct ipt_entry);
            e->next_offset = size;

            struct ipt_standard_target* t = (struct ipt_standard_target*)((char*)e + e->target_offset);
            t->target.verdict = -NF_DROP - 1;
            t->target.u.user.target_size = sizeof(struct ipt_standard_target);
            strcpy(t->target.u.user.name, IPT_STANDARD_TARGET);

            if (iptc_insert_entry(chain.c_str(), e, 0, h)) {
                success = iptc_commit(h);
            }
            free(e);
        }
    } else {
        // Locate and delete
        const struct ipt_entry* e;
        int idx = 0;
        for (e = iptc_first_rule(chain.c_str(), h); e; e = iptc_next_rule(e, h)) {
            if (e->ip.src.s_addr == ip_addr.s_addr) {
                if (iptc_delete_num_entry(chain.c_str(), idx, h)) {
                    success = iptc_commit(h);
                }
                break;
            }
            idx++;
        }
    }
    iptc_free(h);
    return success;
}
#endif
```

---

## 4. Requirement 4: C++ Host Telemetry Agent UDP Receiver

### Entry Point
- `edge_interceptor/src/main.cpp`
- `edge_interceptor/include/common.h`

### Data Flow & Logic
Host telemetry data from target machines is sent as a UDP sequence of performance counters. The Edge Interceptor will run a background UDP server to ingest these values and fill the CPU segment of the circular queues.
1. **Performance Counter Payload Structure**:
   - Define a fixed binary layout structure representing the performance counter updates:
     ```cpp
     struct CpuTelemetryPayload {
         float counters[8]; // e.g., L1 Cache Misses, L2 Cache Misses, Branch Mispredictions, etc.
     };
     ```
2. **Background Thread**:
   - Spawn a server thread in the main loop binding to port `9999` (or custom configuration via `SYNZ_TELEMETRY_PORT` environment variable).
   - In a loop, receive packets using `recvfrom()`.
   - Validate that the received packet matches exactly `sizeof(CpuTelemetryPayload)` bytes (32 bytes).
   - Cast the binary payload and copy it into a local array.
   - Push the 8 floats into `g_cpu_history` (the CPU history circular buffer).

### Socket Portability (Windows / Linux)
```cpp
#ifdef _WIN32
  #include <winsock2.h>
  using socket_t = SOCKET;
  #define close_socket(s) closesocket(s)
#else
  #include <sys/socket.h>
  #include <netinet/in.h>
  #include <unistd.h>
  using socket_t = int;
  #define close_socket(s) close(s)
  #define INVALID_SOCKET -1
#endif
```

---

## 5. Requirement 5: C++ Dynamic Key Loading

### Entry Point
- `edge_interceptor/src/inference_engine.cpp`

### Implementation Strategy
Remove the hardcoded secret vectors from the source code. Instead, load the AES decryption key and IV at startup from local environment variables.
1. **Environment Variables**:
   - `SYNZ_AES_KEY`: Contains a 64-character hexadecimal representation of the 32-byte key.
   - `SYNZ_AES_IV`: Contains a 32-character hexadecimal representation of the 16-byte initialization vector.
2. **Hex to Bytes Utility**:
   - Parse hex strings to raw byte blocks.
   - Perform length and formatting checks: key must be exactly 32 bytes, IV must be exactly 16 bytes.
3. **Graceful Startup Failures**:
   - If either variable is missing or formatted incorrectly, throw a descriptive `std::runtime_error`.
   - Wrap the ONNX load sequence in a try-catch block. If decryption fails (corrupted buffer header/invalid ONNX structure), catch the engine crash, log a key mismatch warning, and exit cleanly.

### Code Snippet: Hex Decoding & Validation
```cpp
std::vector<uint8_t> DecodeHex(const std::string& hex) {
    if (hex.length() % 2 != 0) {
        throw std::runtime_error("Hex string must have an even length.");
    }
    std::vector<uint8_t> bytes;
    bytes.reserve(hex.length() / 2);
    for (size_t i = 0; i < hex.length(); i += 2) {
        std::string byteString = hex.substr(i, 2);
        char* end;
        long val = strtol(byteString.c_str(), &end, 16);
        if (*end != '\0') {
            throw std::runtime_error("Invalid hex character in key/IV string.");
        }
        bytes.push_back(static_cast<uint8_t>(val));
    }
    return bytes;
}
```

---

## 6. Integration and Testing Validation

### Suite of Automated Tests (`edge_interceptor/src/test_suite.cpp`)
Author an automated test executable containing unit tests to verify:
1. **Circular Queue correctness**:
   - Pushing 20 elements, ensuring size clamps to 16, and confirming the first 4 elements were evicted (chronological accuracy).
2. **UDP Telemetry Ingestion**:
   - Sockets loopback test sending an array of 8 known values and asserting that the parsed payload matches.
3. **Decryption Accuracy**:
   - Decrypting a known dummy cipher and matching with the expected plaintext vector.

To enable, add this to `CMakeLists.txt`:
```cmake
enable_testing()
add_executable(synz_tests src/test_suite.cpp src/aes.c)
target_include_directories(synz_tests PRIVATE include)
add_test(NAME SynzUnitTests COMMAND synz_tests)
```

---

## 7. Potential Pitfalls & Safeguards

- **Concurrency Locks**:
  - *Risk*: Both the incoming network packet threads (PacketReader callback) and the UDP server thread will modify memory simultaneously.
  - *Mitigation*: Ensure `CircularBuffer` operations are fully guarded by `std::mutex` locks.
- **WSA WinSock Double Init**:
  - *Risk*: Multiple socket threads on Windows calling `WSAStartup` can conflict.
  - *Mitigation*: Consolidate socket setup. If WinSock is already initialized by `WindowsPacketReader`, reference the active context.
- **Memory Decryption Leaks**:
  - *Risk*: Plaintext weights left lingering in heap memory post-load.
  - *Mitigation*: Clear variables containing decrypted ONNX buffers from memory immediately after the ONNX Runtime session has finished importing the model (`buffer.clear()`, `buffer.shrink_to_fit()`).
