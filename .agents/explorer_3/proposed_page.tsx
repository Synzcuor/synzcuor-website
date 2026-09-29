"use client";

import React, { useState, useEffect, useRef } from "react";

// Types for simulation
type DefenseMode = "monitor" | "software" | "hardware";
type ThreatState = "benign" | "scanning" | "attack" | "blocked" | "wire-cut";

interface DiagnosticSlot {
  name: string;
  type: "protocol" | "exploit";
  active: boolean;
}

export default function LaunchLandingPage() {
  // Navigation & Interactive Tabs
  const [defenseMode, setDefenseMode] = useState<DefenseMode>("monitor");
  const [threatState, setThreatState] = useState<ThreatState>("benign");
  const [anomalyScore, setAnomalyScore] = useState<number>(0.12);
  const [activeAlerts, setActiveAlerts] = useState<Array<{ id: number; msg: string; time: string; level: "warn" | "alert" | "critical" }>>([]);
  const [activationCount, setActivationCount] = useState<number>(0);
  const [leadForm, setLeadForm] = useState({ name: "", email: "", company: "", role: "ciso" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [useWebSocket, setUseWebSocket] = useState<boolean>(false);
  const [wsStatus, setWsStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [wsError, setWsError] = useState<string | null>(null);
  const [benignTraffic, setBenignTraffic] = useState<number>(120);
  const [formError, setFormError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket live API connection logic
  useEffect(() => {
    if (!useWebSocket) {
      if (wsRef.current) {
        wsRef.current.close();
      }
      setWsStatus("disconnected");
      return;
    }

    setWsStatus("connecting");
    setWsError(null);

    const wsUrl = "ws://localhost:5000/ws";
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      setWsStatus("connected");
      pushAlert("Connected to live C# backend WebSocket", "warn");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.benign_traffic !== undefined) {
          setBenignTraffic(data.benign_traffic);
        }
        if (data.anomaly_score !== undefined) {
          const scoreVal = data.anomaly_score > 1 ? data.anomaly_score / 100 : data.anomaly_score;
          setAnomalyScore(scoreVal);
          
          if (scoreVal > 0.95) {
            setThreatState(data.defense_mode === "Hardware" ? "wire-cut" : "attack");
          } else if (scoreVal > 0.40) {
            setThreatState("scanning");
          } else {
            setThreatState("benign");
          }
        }
        if (data.defense_mode !== undefined) {
          setDefenseMode(data.defense_mode.toLowerCase() as DefenseMode);
        }
        if (Array.isArray(data.diagnostic_grid)) {
          setSlots(prev => prev.map((s, idx) => {
            if (idx < data.diagnostic_grid.length) {
              return { ...s, active: !!data.diagnostic_grid[idx] };
            }
            return s;
          }));
        }
        pushAlert(`[WS] Real-time event: Anomaly Score ${(data.anomaly_score || 0).toFixed(0)}%, Mode: ${data.defense_mode}`, "warn");
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    socket.onerror = () => {
      setWsStatus("disconnected");
      setWsError("WebSocket connection error");
      pushAlert("WebSocket connection error", "critical");
    };

    socket.onclose = () => {
      setWsStatus("disconnected");
      pushAlert("Disconnected from live C# backend WebSocket", "warn");
    };

    return () => {
      socket.close();
    };
  }, [useWebSocket]);

  // Reference for animation request
  const animationRef = useRef<number | null>(null);
  const alertIdCounter = useRef(0);

  // Model diagnostic slots representation
  const [slots, setSlots] = useState<DiagnosticSlot[]>([
    { name: "TCP", type: "protocol", active: true },
    { name: "UDP", type: "protocol", active: false },
    { name: "ICMP", type: "protocol", active: false },
    { name: "DNS", type: "protocol", active: false },
    { name: "HTTP", type: "protocol", active: false },
    { name: "HTTPS", type: "protocol", active: false },
    { name: "SSH", type: "protocol", active: false },
    { name: "Modbus (OT)", type: "protocol", active: true },
    { name: "BufferOverflow", type: "exploit", active: false },
    { name: "SQLi", type: "exploit", active: false },
    { name: "DMA Attack", type: "exploit", active: false },
    { name: "MemoryLeak", type: "exploit", active: false },
    { name: "ROP Chain", type: "exploit", active: false },
    { name: "PrivEsc", type: "exploit", active: false },
    { name: "DoS / DDoS", type: "exploit", active: false },
    { name: "PortScan", type: "exploit", active: false },
  ]);

  // Helper to add custom alerts
  const pushAlert = (msg: string, level: "warn" | "alert" | "critical") => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    alertIdCounter.current += 1;
    const newAlert = { id: alertIdCounter.current, msg, time: timestamp, level };
    setActiveAlerts(prev => [newAlert, ...prev.slice(0, 19)]);
  };

  // Run the simulation logic loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (threatState === "scanning") {
      // Elevate score and flag scanning
      setAnomalyScore(0.48);
      setSlots(prev => prev.map(s => {
        if (s.name === "PortScan") return { ...s, active: true };
        if (s.name === "TCP" || s.name === "Modbus (OT)") return { ...s, active: true };
        return { ...s, active: false };
      }));
      pushAlert("Suspicious reconnaissance detected on Modbus port 502", "warn");
    } else if (threatState === "attack") {
      // Attack is active, anomaly score spikes
      setAnomalyScore(0.98);
      setSlots(prev => prev.map(s => {
        if (s.name === "DoS / DDoS" || s.name === "DMA Attack") return { ...s, active: true };
        if (s.name === "TCP" || s.name === "Modbus (OT)") return { ...s, active: true };
        return s;
      }));
      pushAlert("CRITICAL: Zero-Day DMA/Modbus payload detected by QGAN Critic!", "critical");
      
      // Determine response based on the selected mode
      timer = setTimeout(() => {
        if (defenseMode === "monitor") {
          pushAlert("MONITOR MODE: Active defense disabled. Exploit sent to controller.", "alert");
        } else if (defenseMode === "software") {
          setThreatState("blocked");
          setAnomalyScore(0.08);
          pushAlert("SOFTWARE TRIGGER: Attacker IP 192.168.1.100 dropped via firewall", "critical");
        } else if (defenseMode === "hardware") {
          setThreatState("wire-cut");
          setActivationCount(c => c + 1);
          pushAlert("HARDWARE TRIGGER: GPIO Pin 18 PULLED HIGH. SSR Opened. WIRE SEVERED.", "critical");
        }
      }, 1500);
    } else if (threatState === "benign") {
      setAnomalyScore(0.12);
      setSlots(prev => prev.map(s => {
        if (s.type === "exploit") return { ...s, active: false };
        if (s.name === "TCP" || s.name === "Modbus (OT)") return { ...s, active: true };
        return { ...s, active: false };
      }));
    }

    return () => clearTimeout(timer);
  }, [threatState, defenseMode]);

  // Form submit handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const publicDomains = [
      "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", 
      "aol.com", "mail.ru", "icloud.com", "protonmail.com", "zoho.com"
    ];
    const emailParts = leadForm.email.split("@");
    if (emailParts.length !== 2) {
      setFormError("Invalid email format");
      return;
    }
    const domain = emailParts[1].toLowerCase().trim();
    if (publicDomains.includes(domain)) {
      setFormError("Please use a corporate email address (public domains are not allowed)");
      return;
    }

    if (leadForm.name && leadForm.email && leadForm.company) {
      localStorage.setItem("leadCapture", JSON.stringify(leadForm));
      console.log("Lead payload captured successfully:", leadForm);
      setFormSubmitted(true);
      pushAlert(`Launch Demo Request received from ${leadForm.name} (${leadForm.company})`, "warn");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020408] text-zinc-100 flex flex-col antialiased font-sans">
      {/* Background grid & Glows */}
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0 opacity-40" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-cyan-glow/5 rounded-full filter blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[300px] bg-red-glow/5 rounded-full filter blur-[150px] pointer-events-none z-0" />

      {/* HEADER SECTION (Structured Navigation) */}
      <header className="sticky top-0 w-full bg-[#020408]/80 backdrop-blur-md border-b border-white/5 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-lg bg-zinc-950 border border-cyan-glow/40 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-dim/40 to-cyan-glow/10" />
              <span className="font-mono text-cyan-glow font-bold text-lg select-none">Ψ</span>
            </div>
            <span className="font-mono font-bold tracking-widest text-lg text-white">SYNZ LABS</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-zinc-400">
            <a href="#overview" className="hover:text-cyan-glow transition-colors">Product Overview</a>
            <a href="#usecases" className="hover:text-cyan-glow transition-colors">Use Cases</a>
            <a href="#simulator" className="hover:text-cyan-glow transition-colors">Threat Simulator</a>
            <a href="#blog" className="hover:text-cyan-glow transition-colors">Threat Research</a>
            <a href="#compliance" className="hover:text-cyan-glow transition-colors">Compliance</a>
            <a href="#contact" className="hover:text-cyan-glow transition-colors font-mono text-cyan-dim uppercase tracking-wider text-xs">Console Login</a>
          </nav>

          <div className="flex items-center gap-4">
            <a 
              href="#contact" 
              className="px-5 py-2.5 rounded bg-gradient-to-r from-cyan-dim/30 to-cyan-glow/20 border border-cyan-glow/40 text-cyan-glow text-xs font-mono tracking-wider uppercase hover:from-cyan-dim/40 hover:to-cyan-glow/30 hover:border-cyan-glow transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
            >
              Request Pilot
            </a>
          </div>
        </div>
      </header>

      <main className="relative flex-1 z-10">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-28 md:pb-32 text-center lg:text-left flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse" />
              Quantum-Enhanced Active Cyber Defense
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Stop Zero-Day <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow via-cyan-glow to-cyan-dim">
                Ransomware Detonations
              </span> <br />
              Before They Reach the CPU
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-xl leading-relaxed font-normal">
              Synz Phantom is a hardware-enforced bump-in-the-wire appliance that parses packets, performs sub-50µs hybrid QGAN inference in-memory, provides Ring -1 threat prevention, and physically severs network access if a zero-day payload strikes.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a 
                href="#simulator" 
                className="w-full sm:w-auto text-center px-8 h-12 flex items-center justify-center rounded bg-gradient-to-r from-cyan-dim to-cyan-glow text-black font-bold uppercase tracking-wider text-xs hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(0,240,255,0.25)]"
              >
                Launch Active Demo
              </a>
              <a 
                href="#overview" 
                className="w-full sm:w-auto text-center px-8 h-12 flex items-center justify-center rounded border border-white/10 hover:bg-white/5 transition-colors font-semibold text-zinc-300 text-xs uppercase tracking-wider"
              >
                View Pipeline Specs
              </a>
            </div>
          </div>

          <div className="flex-1 w-full max-w-xl lg:max-w-none relative animate-float">
            <div className="absolute inset-0 bg-cyan-glow/5 rounded-2xl filter blur-xl" />
            <div className="relative glass-panel rounded-2xl p-6 border border-white/10 flex flex-col gap-4 glow-cyan">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-glow" />
                  <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">EDGE INTERCEPTOR FIRMWARE</span>
                </div>
                <span className="font-mono text-[10px] text-zinc-500">v1.0.0-RELEASE</span>
              </div>
              <pre className="font-mono text-xs text-zinc-300 bg-zinc-950/70 p-4 rounded-lg overflow-x-auto leading-relaxed border border-white/5">
                <code>{`[BPF] Loading eBPF object: synz_xdp.o
[BPF] program loaded — verifier passed.
[BPF] XDP attached to eth0 (ifindex=3)
[ONNX] model decrypted securely in memory
[ONNX] session loaded (dual-head output)
[GPIO] NC Relay output line 18 initialized
═════════════════════════════════════════
INTERCEPTOR IS LIVE. Press Ctrl+C to stop.`}</code>
              </pre>
              <div className="flex justify-between items-center text-xs font-mono text-zinc-400 pt-1">
                <span>Latency Target: &lt; 50µs</span>
                <span className="text-cyan-glow animate-pulse-glow">STATUS: ACTIVE</span>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT OVERVIEW SECTION */}
        <section id="overview" className="border-t border-white/5 bg-zinc-950/20 py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <h2 className="text-xs font-mono tracking-widest text-cyan-glow uppercase">Product Overview</h2>
              <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">The Three-Stage Security Chain</p>
              <p className="text-zinc-400 leading-relaxed text-base">
                Synz Phantom bridges the gap between quantum-accelerated deep learning models and low-level kernel execution to secure legacy SCADA environments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="glass-panel p-8 rounded-xl border border-white/5 hover:border-cyan-glow/30 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-glow/10 flex items-center justify-center font-mono text-cyan-glow font-bold">1</div>
                  <h3 className="text-lg font-bold text-white">QGAN Model Factory</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Uses a causal sequence-aware **Split-Head Quantum Generative Adversarial Network** to learn cyber-telemetry dynamics (flows + hardware latencies) without labels, preventing zero-day mode collapse.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/5 text-xs font-mono text-zinc-500">
                  PennyLane PQC · WGAN-GP · PyTorch
                </div>
              </div>

              {/* Card 2 */}
              <div className="glass-panel p-8 rounded-xl border border-white/5 hover:border-cyan-glow/30 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-glow/10 flex items-center justify-center font-mono text-cyan-glow font-bold">2</div>
                  <h3 className="text-lg font-bold text-white">Tensor Train Compression</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Decomposes the Critic's parameters by **~91% via TT-SVD** (block-tensor-train factorization), shrinking the model footprint to under 50MB for deployment on embedded edge SoMs.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/5 text-xs font-mono text-zinc-500">
                  TensorLy-Torch · ONNX RT
                </div>
              </div>

              {/* Card 3 */}
              <div className="glass-panel p-8 rounded-xl border border-white/5 hover:border-cyan-glow/30 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-glow/10 flex items-center justify-center font-mono text-cyan-glow font-bold">3</div>
                  <h3 className="text-lg font-bold text-white">Edge Interceptor Firmware</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Runs zero-copy eBPF XDP network parsing combined with in-memory ONNX inference. Placed inline as a bump-in-the-wire hardware block, checking anomaly score thresholds within microseconds.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/5 text-xs font-mono text-zinc-500">
                  eBPF XDP · C++20 · libgpiod
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* USE CASES SECTION */}
        <section id="usecases" className="py-24 border-t border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <h2 className="text-xs font-mono tracking-widest text-cyan-glow uppercase">Real-World Deployments</h2>
              <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Enterprise Use Cases</p>
              <p className="text-zinc-400 leading-relaxed text-base">
                How Synz Phantom protects high-value critical industrial infrastructures without risking operational disruption.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Use Case 1 */}
              <div className="p-8 rounded-xl bg-zinc-950/40 border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <div className="text-cyan-glow text-sm font-mono tracking-wider font-semibold">SCADA / ICS Protection</div>
                  <h4 className="text-white font-bold text-lg">Legacy Modbus / DNP3 Guarding</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Injected directly inline with PLC target CPUs, Synz Phantom monitors Modbus and DNP3 payload structures. Detects malicious zero-day commands, memory overwrites, or out-of-bounds writes under 50µs.
                  </p>
                </div>
                <div className="text-xs font-mono text-zinc-500">Deployed at: Substation Controls, Water Treat Facilities</div>
              </div>

              {/* Use Case 2 */}
              <div className="p-8 rounded-xl bg-zinc-950/40 border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <div className="text-cyan-glow text-sm font-mono tracking-wider font-semibold">Zero-Day Isolation</div>
                  <h4 className="text-white font-bold text-lg">Hardware-Enforced Air-Gapping</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Utilizes a physically-severed Solid State Relay linked directly to GPIO Pin 18. Upon detecting active attack vectors, the loop de-energizes the SSR, physically isolating the subnet instantly.
                  </p>
                </div>
                <div className="text-xs font-mono text-zinc-500">Deployed at: Power Plants, Nuclear Control subnets</div>
              </div>

              {/* Use Case 3 */}
              <div className="p-8 rounded-xl bg-zinc-950/40 border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <div className="text-cyan-glow text-sm font-mono tracking-wider font-semibold">Continuous Audit</div>
                  <h4 className="text-white font-bold text-lg">Passive Monitoring & Log Auditing</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Runs passively to map OT assets and protocol telemetry. Allows security teams to baseline normal system flows and verify model inference accuracy before active defense rules are engaged.
                  </p>
                </div>
                <div className="text-xs font-mono text-zinc-500">Deployed at: Smart Manufacturing Plants, Logistics Hubs</div>
              </div>
            </div>
          </div>
        </section>

        {/* EMBEDDED SIMULATOR WIDGET SECTION */}
        <section id="simulator" className="py-24 border-t border-white/5 bg-zinc-950/20 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <h2 className="text-xs font-mono tracking-widest text-cyan-glow uppercase">Interactive Demo</h2>
              <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Hardware Active Simulator</p>
              <p className="text-zinc-400 leading-relaxed text-base">
                Simulate port reconnaissance or a zero-day exploit payload trigger. Toggle operational modes and watch the dynamic response.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-start">
              {/* Controls Column */}
              <div className="w-full lg:w-1/3 space-y-6">
                <div>
                  <h3 className="text-xs font-mono tracking-widest text-cyan-glow uppercase mb-2">Interactive Dashboard</h3>
                  <h4 className="text-2xl font-bold text-white">Simulation Engine</h4>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Trigger an attack to test how the interceptor handles threats across different operational modes. Switch modes live to observe how the active defense mechanism blocks traffic.
                </p>

                {/* Defense Mode Picker */}
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Active Defense Mode</span>
                  <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1.5 rounded-lg border border-white/5">
                    {(["monitor", "software", "hardware"] as DefenseMode[]).map(mode => (
                      <button
                        key={mode}
                        onClick={() => {
                          setDefenseMode(mode);
                          setThreatState("benign");
                          pushAlert(`Configured active defense mode to: ${mode.toUpperCase()}`, "warn");
                        }}
                        className={`py-2 rounded font-mono text-xs font-bold uppercase transition-all ${
                          defenseMode === mode 
                            ? "bg-cyan-glow text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]" 
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* WebSocket Live Connection Toggle */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">Live API Connection</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded transition-all ${
                      wsStatus === "connected" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                      wsStatus === "connecting" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                      "bg-zinc-900 text-zinc-400 border border-white/5"
                    }`}>
                      {wsStatus.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => setUseWebSocket(prev => !prev)}
                    className={`w-full py-2.5 rounded font-mono text-xs font-bold uppercase transition-all border ${
                      useWebSocket
                        ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                        : "bg-zinc-950 border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {useWebSocket ? "Disconnect WebSockets" : "Connect to C# API (/ws)"}
                  </button>
                  {wsError && <p className="text-[10px] font-mono text-red-glow text-center">{wsError}</p>}
                </div>

                {/* Simulation Action Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setThreatState("scanning")}
                      disabled={threatState === "scanning"}
                      className="flex-1 py-3 rounded border border-amber-glow/40 bg-amber-glow/10 hover:bg-amber-glow/20 text-amber-glow font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40"
                    >
                      Port Scan (Recon)
                    </button>
                    <button
                      onClick={() => setThreatState("attack")}
                      disabled={threatState === "attack" || threatState === "blocked" || threatState === "wire-cut"}
                      className="flex-1 py-3 rounded border border-red-glow/40 bg-red-glow/10 hover:bg-red-glow/20 text-red-glow font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 animate-pulse"
                    >
                      Detonate Exploit
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setThreatState("benign")}
                    className="w-full py-3 rounded border border-white/10 hover:bg-white/5 text-zinc-300 font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Reset Connection
                  </button>
                </div>

                {/* Alert feed log panel */}
                <div className="glass-panel rounded-xl p-4 border border-white/5 h-64 flex flex-col gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 pb-1 border-b border-white/5">Audit Alert Feed</span>
                  <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2.5 pr-2">
                    {activeAlerts.length === 0 ? (
                      <span className="text-zinc-600 italic block pt-4">No events logged. Trigger actions above.</span>
                    ) : (
                      activeAlerts.map(alert => (
                        <div key={alert.id} className="flex gap-2 leading-relaxed">
                          <span className="text-zinc-500">[{alert.time}]</span>
                          <span className={
                            alert.level === "critical" ? "text-red-glow font-bold" :
                            alert.level === "alert" ? "text-amber-glow font-semibold" : "text-cyan-glow"
                          }>
                            {alert.msg}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Graphical simulation visualizer */}
              <div className="w-full lg:w-2/3 glass-panel rounded-2xl border border-white/10 p-6 glow-cyan relative overflow-hidden flex flex-col gap-6">
                <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-zinc-500 flex items-center gap-4">
                  <span>ACTIVATION COUNT: <strong className="text-red-glow">{activationCount}</strong></span>
                  <span>MODE: <strong className="text-cyan-glow uppercase">{defenseMode}</strong></span>
                </div>

                <div className="text-sm font-mono text-zinc-400 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
                  LIVE THREAT MONITOR
                </div>

                {/* Threat status display banner */}
                <div className={`p-4 rounded-lg font-mono flex items-center justify-between border ${
                  threatState === "attack" ? "bg-red-glow/10 border-red-glow/40 text-red-glow" :
                  threatState === "scanning" ? "bg-amber-glow/10 border-amber-glow/40 text-amber-glow" :
                  threatState === "blocked" ? "bg-green-500/10 border-green-500/30 text-green-400" :
                  threatState === "wire-cut" ? "bg-red-950/40 border-red-glow/70 text-red-400" :
                  "bg-zinc-950/60 border-white/5 text-cyan-glow"
                }`}>
                  <span className="text-xs uppercase tracking-widest font-bold">System Integrity Status:</span>
                  <span className="font-bold text-sm uppercase">
                    {threatState === "wire-cut" ? "🔴 HARDWARE LOCKOUT — WIRE CUT" :
                     threatState === "blocked" ? "🟢 SOFTWARE PROTECTED — ATTACKER DROPPED" :
                     threatState === "attack" ? "🚨 WARNING: MALICIOUS PAYLOAD ENGAGED" :
                     threatState === "scanning" ? "⚠️ SCANNER ENCOUNTERED" :
                     "🟢 MONITORING — ALL FLOWS BENIGN"}
                  </span>
                </div>

                {/* Score & Gauge Panel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Gauge */}
                  <div className="relative h-44 flex flex-col items-center justify-center glass-panel rounded-xl border border-white/5">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="50" fill="transparent" stroke="#18181b" strokeWidth="8" />
                      <circle 
                        cx="64" cy="64" r="50" 
                        fill="transparent" 
                        stroke={anomalyScore > 0.8 ? "#ff2a51" : anomalyScore > 0.4 ? "#ffb800" : "#00f0ff"} 
                        strokeWidth="8" 
                        strokeDasharray={2 * Math.PI * 50}
                        strokeDashoffset={2 * Math.PI * 50 * (1 - anomalyScore)}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                      <span className="text-2xl font-mono font-bold text-white">{(anomalyScore * 100).toFixed(0)}%</span>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">Anomaly Score</span>
                    </div>
                  </div>

                  {/* 16-slot diagnostic grid */}
                  <div className="md:col-span-2 space-y-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">AC-WGAN Multihead Diagnostic Classifier</span>
                    <div className="grid grid-cols-4 gap-2">
                      {slots.map(slot => (
                        <div 
                          key={slot.name} 
                          className={`p-2.5 rounded border font-mono text-[9px] text-center tracking-wide font-bold uppercase transition-all duration-300 ${
                            slot.active 
                              ? slot.type === "protocol" 
                                ? "bg-cyan-glow/20 border-cyan-glow text-cyan-glow shadow-[0_0_8px_rgba(0,240,255,0.1)]" 
                                : "bg-red-glow/20 border-red-glow text-red-glow shadow-[0_0_8px_rgba(255,42,81,0.15)]"
                              : "bg-zinc-950/40 border-white/5 text-zinc-600"
                          }`}
                        >
                          {slot.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Diagram representation of inline link */}
                <div className="glass-panel rounded-xl p-6 border border-white/5 flex flex-col gap-6">
                  <div className="flex justify-between items-center font-mono text-xs text-zinc-400">
                    <span>Source Host (192.168.1.100)</span>
                    <span>Edge Interface</span>
                    <span>PLC Target CPU (192.168.1.254)</span>
                  </div>

                  <div className="relative flex items-center justify-between py-6">
                    {/* Node Left */}
                    <div className="w-12 h-12 rounded-lg bg-zinc-950 border border-white/10 flex items-center justify-center font-mono font-bold text-white z-10">
                      SRC
                    </div>

                    {/* Flow Line Left */}
                    <div className="absolute left-12 right-1/2 h-0.5 bg-zinc-800 pointer-events-none">
                      {threatState !== "wire-cut" && threatState !== "blocked" && (
                        <div className={`h-full bg-cyan-glow shadow-[0_0_8px_rgba(0,240,255,0.8)] animate-pulse w-full`} />
                      )}
                    </div>

                    {/* Appliance Center */}
                    <div className={`w-32 h-16 rounded-xl border flex flex-col items-center justify-center font-mono gap-1 z-10 transition-all duration-300 ${
                      threatState === "wire-cut" ? "bg-red-glow/10 border-red-glow text-red-glow" :
                      threatState === "blocked" ? "bg-cyan-glow/20 border-cyan-glow text-cyan-glow" :
                      "bg-zinc-950 border-white/10 text-white"
                    }`}>
                      <span className="text-[10px] font-bold tracking-widest">PHANTOM</span>
                      <span className="text-[8px] uppercase tracking-wider text-zinc-500">
                        {threatState === "wire-cut" ? "SSR OPEN" : "SSR CLOSED"}
                      </span>
                    </div>

                    {/* Flow Line Right */}
                    <div className="absolute left-1/2 right-12 h-0.5 bg-zinc-800 pointer-events-none">
                      {threatState === "benign" && (
                        <div className="h-full bg-cyan-glow shadow-[0_0_8px_rgba(0,240,255,0.8)] w-full" />
                      )}
                      {threatState === "scanning" && (
                        <div className="h-full bg-amber-glow shadow-[0_0_8px_rgba(255,184,0,0.8)] w-full" />
                      )}
                      {threatState === "attack" && (
                        <div className="h-full bg-red-glow shadow-[0_0_8px_rgba(255,42,81,0.8)] w-full animate-pulse" />
                      )}
                      {(threatState === "blocked" || threatState === "wire-cut") && (
                        <div className="w-0 h-full bg-zinc-800" />
                      )}
                    </div>

                    {/* Node Right */}
                    <div className="w-12 h-12 rounded-lg bg-zinc-950 border border-white/10 flex items-center justify-center font-mono font-bold text-white z-10">
                      PLC
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/5">
                    <span>Packets: {threatState === "blocked" || threatState === "wire-cut" ? "Dropped" : `Inspected (${benignTraffic} flow/s)`}</span>
                    <span>Relay State: {threatState === "wire-cut" ? "TRIGGERED (DE-ENERGIZED)" : "NORMAL (CLOSED)"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THREAT RESEARCH BLOG SECTION */}
        <section id="blog" className="py-24 border-t border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <h2 className="text-xs font-mono tracking-widest text-cyan-glow uppercase">Threat Intelligence</h2>
              <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Threat Research Blog</p>
              <p className="text-zinc-400 leading-relaxed text-base">
                Stay updated with the latest investigations, exploit mitigations, and compliance briefs from the Synz Labs research team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Blog Post 1 */}
              <article className="glass-panel rounded-xl overflow-hidden border border-white/5 hover:border-cyan-glow/20 transition-all flex flex-col justify-between group">
                <div className="p-6 space-y-4">
                  <div className="text-[10px] font-mono text-cyan-glow uppercase tracking-wider">Zero-Day Vulnerability</div>
                  <h4 className="text-white font-bold text-lg group-hover:text-cyan-glow transition-colors">
                    Isolating Ring -1 DMA Vulnerabilities in Embedded ICS Platforms
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    How malicious firmware updates hijack Ethernet controller DMA access on ARM64 and how physical air-gaps mitigate threat propagation.
                  </p>
                </div>
                <div className="p-6 pt-0 flex justify-between items-center text-xs font-mono text-zinc-500">
                  <span>May 18, 2026</span>
                  <span className="text-cyan-dim font-bold group-hover:text-cyan-glow transition-colors">Read Article →</span>
                </div>
              </</article>

              {/* Blog Post 2 */}
              <article className="glass-panel rounded-xl overflow-hidden border border-white/5 hover:border-cyan-glow/20 transition-all flex flex-col justify-between group">
                <div className="p-6 space-y-4">
                  <div className="text-[10px] font-mono text-cyan-glow uppercase tracking-wider">Network Architecture</div>
                  <h4 className="text-white font-bold text-lg group-hover:text-cyan-glow transition-colors">
                    Zero-Copy eBPF XDP Ingestion at Microsecond Limits
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Benchmarking generic vs hardware-specific eBPF XDP drivers under high packet rate storms for sub-50 microsecond industrial firewalling.
                  </p>
                </div>
                <div className="p-6 pt-0 flex justify-between items-center text-xs font-mono text-zinc-500">
                  <span>April 24, 2026</span>
                  <span className="text-cyan-dim font-bold group-hover:text-cyan-glow transition-colors">Read Article →</span>
                </div>
              </</article>

              {/* Blog Post 3 */}
              <article className="glass-panel rounded-xl overflow-hidden border border-white/5 hover:border-cyan-glow/20 transition-all flex flex-col justify-between group">
                <div className="p-6 space-y-4">
                  <div className="text-[10px] font-mono text-cyan-glow uppercase tracking-wider">Industrial Compliance</div>
                  <h4 className="text-white font-bold text-lg group-hover:text-cyan-glow transition-colors">
                    Meeting NERC CIP-008 R1: Automated Cyber Incident Mitigation
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    A compliance framework review analyzing the requirements for automated isolation, physical line severing, and audit logging.
                  </p>
                </div>
                <div className="p-6 pt-0 flex justify-between items-center text-xs font-mono text-zinc-500">
                  <span>March 12, 2026</span>
                  <span className="text-cyan-dim font-bold group-hover:text-cyan-glow transition-colors">Read Article →</span>
                </div>
              </</article>
            </div>
          </div>
        </section>

        {/* COMPLIANCE BADGES SECTION */}
        <section id="compliance" className="py-24 border-t border-white/5 bg-zinc-950/20 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <h2 className="text-xs font-mono tracking-widest text-cyan-glow uppercase">Compliance & Standards</h2>
              <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Certified Protection Frameworks</p>
              <p className="text-zinc-400 leading-relaxed text-base">
                Synz Phantom meets rigorous international security frameworks for operational technology and industrial control networks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Badge 1 */}
              <div className="p-6 rounded-xl bg-zinc-950/50 border border-white/5 flex items-center gap-6">
                <div className="w-14 h-14 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center font-mono font-bold text-white text-xs select-none">
                  SOC2
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">SOC 2 Type II</h4>
                  <p className="text-xs text-zinc-500 mt-1">Verified data privacy, continuous monitoring audit trails, and secure tenant credential storage.</p>
                </div>
              </div>

              {/* Badge 2 */}
              <div className="p-6 rounded-xl bg-zinc-950/50 border border-white/5 flex items-center gap-6">
                <div className="w-14 h-14 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center font-mono font-bold text-white text-[9px] select-none text-center leading-none">
                  NERC<br/>CIP
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">NERC CIP</h4>
                  <p className="text-xs text-zinc-500 mt-1">Compliant with bulk power electric system cyber risk controls, incident reporting, and isolation.</p>
                </div>
              </div>

              {/* Badge 3 */}
              <div className="p-6 rounded-xl bg-zinc-950/50 border border-white/5 flex items-center gap-6">
                <div className="w-14 h-14 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center font-mono font-bold text-white text-[9px] select-none text-center leading-none">
                  IEC<br/>62443
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">IEC 62443</h4>
                  <p className="text-xs text-zinc-500 mt-1">Industrial automation security requirements for network segmentation and system threat detection.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LEAD CAPTURE FORM SECTION */}
        <section id="contact" className="py-24 border-t border-white/5 relative">
          <div className="max-w-3xl mx-auto px-6">
            <div className="glass-panel p-8 md:p-12 rounded-2xl border border-white/10 glow-cyan">
              {formSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-glow/10 border border-cyan-glow/40 mx-auto flex items-center justify-center font-mono text-2xl text-cyan-glow">
                    ✓
                  </div>
                  <h3 className="text-2xl font-bold text-white">Pilot Application Received</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto">
                    Thank you. We have recorded your submission. An integration engineer from Synz Labs will contact your CISO or Operations team within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="space-y-2 text-center">
                    <h3 className="text-2xl font-bold text-white">Request a Passive Monitor Audit</h3>
                    <p className="text-sm text-zinc-400 max-w-md mx-auto">
                      Deploy Synz Phantom inline without operational risk. Map SCADA device communication and verify detection accuracy first.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Name</label>
                      <input 
                        type="text" 
                        required
                        value={leadForm.name}
                        onChange={e => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full h-11 px-4 rounded bg-zinc-950 border border-white/10 text-white font-mono text-sm focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow outline-none transition-all" 
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Corporate Email</label>
                      <input 
                        type="email" 
                        required
                        value={leadForm.email}
                        onChange={e => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full h-11 px-4 rounded bg-zinc-950 border border-white/10 text-white font-mono text-sm focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow outline-none transition-all" 
                        placeholder="j.doe@enterprise.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Company Name</label>
                      <input 
                        type="text" 
                        required
                        value={leadForm.company}
                        onChange={e => setLeadForm(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full h-11 px-4 rounded bg-zinc-950 border border-white/10 text-white font-mono text-sm focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow outline-none transition-all" 
                        placeholder="Synz Manufacturing Corp"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Organizational Role</label>
                      <select 
                        value={leadForm.role}
                        onChange={e => setLeadForm(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full h-11 px-4 rounded bg-zinc-950 border border-white/10 text-white font-mono text-sm focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow outline-none transition-all"
                      >
                        <option value="ciso">CISO / Security Director</option>
                        <option value="plant_mgr">VP Operations / Plant Manager</option>
                        <option value="ot_eng">OT Infrastructure Engineer</option>
                        <option value="other">Other Operations Staff</option>
                      </select>
                    </div>
                  </div>

                  {formError && (
                    <div className="p-3 bg-red-950/40 border border-red-glow/40 rounded text-red-glow font-mono text-xs text-center">
                      {formError}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="w-full h-12 rounded bg-gradient-to-r from-cyan-dim to-cyan-glow text-black font-bold uppercase tracking-wider text-xs transition-opacity hover:opacity-90 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  >
                    Submit Audit Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative w-full border-t border-white/5 py-12 mt-12 bg-zinc-950/60 z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-cyan-glow font-bold text-lg select-none">Ψ</span>
              <span className="font-mono font-bold tracking-widest text-white">SYNZ LABS</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Industrial Threat Defense at the hardware edge. Sub-microsecond zero-day prevention and mechanical isolation.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Product</h5>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li><a href="#overview" className="hover:text-zinc-400">Edge Pipeline Specs</a></li>
              <li><a href="#simulator" className="hover:text-zinc-400">Interactive Testbed</a></li>
              <li><a href="#overview" className="hover:text-zinc-400">Carrier Board DIN Hardware</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Resources</h5>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li><a href="#blog" className="hover:text-zinc-400">Threat Blog</a></li>
              <li><a href="#overview" className="hover:text-zinc-400">System Documentation</a></li>
              <li><a href="#compliance" className="hover:text-zinc-400">API Documentation</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Compliance</h5>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li><span className="text-zinc-400">SOC 2 Type II</span></li>
              <li><span className="text-zinc-400">NERC CIP-008 R1</span></li>
              <li><span className="text-zinc-400">IEC 62443-4-2</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-500">
          <span>&copy; 2026 Synz Labs Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#overview" className="hover:text-zinc-400">Security Specifications</a>
            <a href="#simulator" className="hover:text-zinc-400">Active Testbed</a>
            <a href="#overview" className="hover:text-zinc-400">DIN Hardware Integration</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
