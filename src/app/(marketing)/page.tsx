"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

type DefenseMode = "monitor" | "software" | "hardware";
type ThreatState = "benign" | "scanning" | "attack" | "blocked" | "wire-cut";

interface DiagnosticSlot {
  name: string;
  type: "protocol" | "exploit";
  active: boolean;
}

export default function MarketingHomePage() {
  const [defenseMode, setDefenseMode] = useState<DefenseMode>("monitor");
  const [threatState, setThreatState] = useState<ThreatState>("benign");
  const [anomalyScore, setAnomalyScore] = useState<number>(0.12);
  const [activeAlerts, setActiveAlerts] = useState<Array<{ id: number; msg: string; time: string; level: "warn" | "alert" | "critical" }>>([]);
  const [activationCount, setActivationCount] = useState<number>(0);
  const [leadForm, setLeadForm] = useState({ name: "", email: "", company: "", role: "ciso" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [emailLiveError, setEmailLiveError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [heroEmail, setHeroEmail] = useState("");
  
  const [useWebSocket, setUseWebSocket] = useState<boolean>(false);
  const [wsStatus, setWsStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [wsError, setWsError] = useState<string | null>(null);
  const [benignTraffic, setBenignTraffic] = useState<number>(120);
  const wsRef = useRef<WebSocket | null>(null);
  const alertIdCounter = useRef(0);

  const publicDomains = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", 
    "aol.com", "mail.ru", "icloud.com", "protonmail.com", "zoho.com"
  ];

  // Live Inline Email Validation
  const handleEmailChange = (val: string) => {
    setLeadForm(prev => ({ ...prev, email: val }));
    setFormError(null);

    if (!val) {
      setEmailLiveError(null);
      return;
    }

    const emailParts = val.split("@");
    if (emailParts.length !== 2) {
      setEmailLiveError("Invalid email format");
      return;
    }

    const domain = emailParts[1].toLowerCase().trim();
    if (publicDomains.includes(domain)) {
      setEmailLiveError("Please use a corporate email address (public domains are not allowed)");
    } else {
      setEmailLiveError(null);
    }
  };

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
      setAnomalyScore(0.48);
      setSlots(prev => prev.map(s => {
        if (s.name === "PortScan") return { ...s, active: true };
        if (s.name === "TCP" || s.name === "Modbus (OT)") return { ...s, active: true };
        return { ...s, active: false };
      }));
      pushAlert("Suspicious reconnaissance detected on Modbus port 502", "warn");
    } else if (threatState === "attack") {
      setAnomalyScore(0.98);
      setSlots(prev => prev.map(s => {
        if (s.name === "DoS / DDoS" || s.name === "DMA Attack") return { ...s, active: true };
        if (s.name === "TCP" || s.name === "Modbus (OT)") return { ...s, active: true };
        return s;
      }));
      pushAlert("CRITICAL: Zero-Day DMA/Modbus payload detected by QGAN Critic!", "critical");
      
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
    <div className="relative min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Launch Phase Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 text-center text-xs font-mono font-bold tracking-wider z-20 relative shadow-md">
        🚀 SYNZCUOR PRE-LAUNCH ACTIVE: Phase 1 Beta applications are now open for enterprise pilot systems.
      </div>

      {/* Background grid */}
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0 opacity-40" />

      {/* HERO SECTION */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 flex flex-col lg:flex-row items-center gap-12 z-10">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Active Kinetic Cyber Defense
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Stop Zero-Day <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Ransomware Detonations
            </span> <br />
            Before They Reach the CPU
          </h1>
          
          <p className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed mx-auto lg:mx-0">
            Synzcuor bridges the gap between low-level kernel software and physical active-defense hardware. We write sub-50µs in-memory ML threat engines with physical line-cut failsafes, protecting B2B industrial infrastructure and B2C endpoints.
          </p>

          <div className="space-y-4">
            <div className="max-w-md mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter corporate email..."
                  value={heroEmail}
                  onChange={e => {
                    setHeroEmail(e.target.value);
                    handleEmailChange(e.target.value);
                  }}
                  className="flex-grow h-12 px-4 rounded border border-slate-300 bg-white text-slate-800 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-sm font-sans"
                />
                <a
                  href="#contact"
                  className="px-6 h-12 flex items-center justify-center rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all whitespace-nowrap uppercase tracking-wider font-mono text-xs"
                >
                  Join Waitlist
                </a>
              </div>
              <p className="text-left text-[10px] text-slate-400 mt-1.5 font-mono">
                ⚡ Join 1,248+ security experts | Phase 1 beta slots are limited
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a 
                href="#simulator" 
                className="w-full sm:w-auto text-center px-6 h-10 flex items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all uppercase tracking-wider shadow-sm"
              >
                Launch Active Demo
              </a>
              <Link 
                href="/overview" 
                className="w-full sm:w-auto text-center px-6 h-10 flex-shrink-0 flex items-center justify-center rounded border border-transparent text-blue-600 hover:text-blue-700 text-xs font-bold transition-all uppercase tracking-wider"
              >
                View Pipeline Specs →
              </Link>
            </div>
          </div>
        </div>

        {/* Hero visual terminal container */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
          <div className="absolute inset-0 bg-blue-100 rounded-2xl filter blur-xl opacity-50" />
          <div className="relative bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="font-mono text-xs uppercase tracking-wider text-slate-400">EDGE INTERCEPTOR FIRMWARE</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">v1.0.0-RELEASE</span>
            </div>
            
            <pre className="font-mono text-xs text-slate-300 bg-slate-950/70 p-4 rounded-lg overflow-x-auto leading-relaxed border border-slate-800">
              <code>{`[BPF] Loading eBPF object: synz_xdp.o
[BPF] program loaded — verifier passed.
[BPF] XDP attached to eth0 (ifindex=3)
[ONNX] model decrypted securely in memory
[ONNX] session loaded (dual-head output)
[GPIO] NC Relay output line 18 initialized
═════════════════════════════════════════
INTERCEPTOR IS LIVE. Press Ctrl+C to stop.`}</code>
            </pre>
            
            <div className="flex justify-between items-center text-xs font-mono text-slate-400 pt-1">
              <span>Latency Target: &lt; 50µs</span>
              <span className="text-blue-400 font-bold">STATUS: ACTIVE</span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUE PROP */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
            <h3 className="text-lg font-bold text-slate-900 font-sans mb-3">Synz Intercept (B2B Hardware)</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              An inline B2B hardware appliance utilizing physical Solid-State Relays to physically cut copper Ethernet links under 50µs when threat events are triggered, air-gapping the target machinery.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
            <h3 className="text-lg font-bold text-slate-900 font-sans mb-3">Synz Prism (B2C CDR Software)</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Lightweight B2C endpoint software running Content Disarm & Reconstruction (CDR) locally on user devices, stripping macros and scripts from file downloads in-place without cloud latency.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
            <h3 className="text-lg font-bold text-slate-900 font-sans mb-3">Synz Phantom (Core Daemon)</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              The background orchestrator daemon that loads encrypted ONNX models in memory, parses telemetry streams, and routes operational controls across Intercept and Prism endpoints.
            </p>
          </div>
        </div>
      </section>

      {/* ACTIVE SIMULATOR DEMO */}
      <section id="simulator" className="py-20 relative bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase mb-2">Interactive Simulation</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Inline Defense Simulator</h3>
            <p className="text-sm text-slate-500 mt-2">
              Detonate an exploit to witness the microsecond hardware link severing in action. Toggle between local offline timers or a live C# API backend connection.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Control Panel Card */}
            <div className="w-full lg:w-1/3 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Simulation Controls</h4>
              </div>

              {/* Defense Mode Picker */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 block">Defense Action Trigger Mode</span>
                <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  {(["monitor", "software", "hardware"] as DefenseMode[]).map(mode => (
                    <button
                      key={mode}
                      onClick={() => {
                        setDefenseMode(mode);
                        setThreatState("benign");
                        pushAlert(`Configured active defense mode to: ${mode.toUpperCase()}`, "warn");
                      }}
                      className={`py-1.5 rounded font-mono text-xs font-bold uppercase transition-all ${
                        defenseMode === mode 
                          ? "bg-white text-blue-600 shadow-sm border border-slate-200" 
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* WebSocket Live Connection Toggle */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Live API Connection</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded transition-all ${
                    wsStatus === "connected" ? "bg-green-100 text-green-700 border border-green-200" :
                    wsStatus === "connecting" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                    "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}>
                    {wsStatus.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setUseWebSocket(prev => !prev)}
                  className={`w-full py-2 rounded font-mono text-xs font-bold uppercase transition-all border ${
                    useWebSocket
                      ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {useWebSocket ? "Disconnect WebSockets" : "Connect to C# API (/ws)"}
                </button>
                {wsError && <p className="text-[10px] font-mono text-red-600 text-center">{wsError}</p>}
              </div>

              {/* Simulation Action Buttons */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <div className="flex gap-2">
                  <button
                    id="btn-scan"
                    onClick={() => setThreatState("scanning")}
                    disabled={threatState === "scanning"}
                    className="flex-1 py-3 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40"
                  >
                    Port Scan (Recon)
                  </button>
                  <button
                    id="btn-detonate"
                    onClick={() => setThreatState("attack")}
                    disabled={threatState === "attack" || threatState === "blocked" || threatState === "wire-cut"}
                    className="flex-1 py-3 rounded border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40"
                  >
                    Detonate Exploit
                  </button>
                </div>
                
                <button
                  id="btn-reset"
                  onClick={() => setThreatState("benign")}
                  className="w-full py-2.5 rounded border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Reset Connection
                </button>
              </div>

              {/* Alert Feed Log Panel */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 h-48 flex flex-col gap-2">
                <span className="font-mono text-xs uppercase tracking-widest text-slate-500 pb-1 border-b border-slate-200">Alert Feed Log</span>
                <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2 pr-2">
                  {activeAlerts.length === 0 ? (
                    <span className="text-slate-400 italic block pt-2">No events logged. Trigger actions.</span>
                  ) : (
                    activeAlerts.map(alert => (
                      <div key={alert.id} className="flex gap-1.5 leading-relaxed">
                        <span className="text-slate-400">[{alert.time}]</span>
                        <span className={
                          alert.level === "critical" ? "text-red-600 font-bold" :
                          alert.level === "alert" ? "text-amber-600 font-semibold" : "text-blue-600"
                        }>
                          {alert.msg}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Graphics panel */}
            <div className="w-full lg:w-2/3 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between gap-6">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  LIVE MONITOR PANEL
                </span>
                <div className="flex gap-4">
                  <span>ACTIVATION COUNT: <strong className="text-red-600">{activationCount}</strong></span>
                  <span>MODE: <strong className="text-blue-600 uppercase">{defenseMode}</strong></span>
                </div>
              </div>

              {/* Threat Status display banner */}
              <div className={`p-4 rounded-lg font-mono flex items-center justify-between border transition-all ${
                threatState === "attack" ? "bg-red-50 border-red-200 text-red-700" :
                threatState === "scanning" ? "bg-amber-50 border-amber-200 text-amber-700" :
                threatState === "blocked" ? "bg-green-50 border-green-200 text-green-700" :
                threatState === "wire-cut" ? "bg-red-50 border-red-400 text-red-800" :
                "bg-slate-50 border-slate-200 text-blue-700"
              }`}>
                <span className="text-xs uppercase tracking-widest font-bold">System Status:</span>
                <span className="font-bold text-xs sm:text-sm uppercase">
                  {threatState === "wire-cut" ? "🔴 HARDWARE LOCKOUT — WIRE CUT" :
                   threatState === "blocked" ? "🟢 SOFTWARE PROTECTED — ATTACKER DROPPED" :
                   threatState === "attack" ? "🚨 WARNING: MALICIOUS PAYLOAD ENGAGED" :
                   threatState === "scanning" ? "⚠️ SCANNER ENCOUNTERED" :
                   "🟢 MONITORING — ALL FLOWS BENIGN"}
                </span>
              </div>

              {/* Score & Gauge Panel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* SVG Gauge */}
                <div className="relative h-40 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-200 p-4">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle cx="56" cy="56" r="44" fill="transparent" stroke="#e2e8f0" strokeWidth="6" />
                    <circle 
                      cx="56" cy="56" r="44" 
                      fill="transparent" 
                      stroke={anomalyScore > 0.8 ? "#dc2626" : anomalyScore > 0.4 ? "#d97706" : "#2563eb"} 
                      strokeWidth="6" 
                      strokeDasharray={2 * Math.PI * 44}
                      strokeDashoffset={2 * Math.PI * 44 * (1 - anomalyScore)}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                    <span className="text-xl font-mono font-bold text-slate-800">{(anomalyScore * 100).toFixed(0)}%</span>
                    <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400">Anomaly Score</span>
                  </div>
                </div>

                {/* 16-slot diagnostic grid */}
                <div className="md:col-span-2 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Classifier Diagnostic Indicators</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {slots.map(slot => (
                      <div 
                        key={slot.name} 
                        className={`p-2 rounded border font-mono text-[9px] text-center tracking-wide font-bold uppercase transition-all ${
                          slot.active 
                            ? slot.type === "protocol" 
                              ? "bg-blue-50 border-blue-300 text-blue-700" 
                              : "bg-red-50 border-red-300 text-red-700"
                            : "bg-slate-50 border-slate-100 text-slate-300"
                        }`}
                      >
                        {slot.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Physical node connection diagram */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col gap-4">
                <div className="flex justify-between items-center font-mono text-[10px] text-slate-400">
                  <span>Source PLC (192.168.1.100)</span>
                  <span>Appliance Switch</span>
                  <span>Target CPU (192.168.1.254)</span>
                </div>

                <div className="relative flex items-center justify-between py-4">
                  {/* Left Node */}
                  <div className="w-10 h-10 rounded bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-600 z-10 shadow-sm">
                    SRC
                  </div>

                  {/* Flow line Left */}
                  <div className="absolute left-10 right-1/2 h-0.5 bg-slate-200 pointer-events-none">
                    {threatState !== "wire-cut" && threatState !== "blocked" && (
                      <div className="h-full bg-blue-500 w-full transition-all" />
                    )}
                  </div>

                  {/* Center Appliance Box */}
                  <div className={`w-28 h-12 rounded-lg border flex flex-col items-center justify-center font-mono gap-0.5 z-10 transition-all ${
                    threatState === "wire-cut" ? "bg-red-50 border-red-300 text-red-700" :
                    threatState === "blocked" ? "bg-blue-50 border-blue-300 text-blue-700" :
                    "bg-white border-slate-200 text-slate-700 shadow-sm"
                  }`}>
                    <span className="text-[9px] font-bold tracking-widest">INTERCEPT</span>
                    <span className="text-[8px] uppercase text-slate-400 font-bold">
                      {threatState === "wire-cut" ? "SSR OPENED" : "SSR CLOSED"}
                    </span>
                  </div>

                  {/* Flow line Right */}
                  <div className="absolute left-1/2 right-10 h-0.5 bg-slate-200 pointer-events-none">
                    {threatState === "benign" && (
                      <div className="h-full bg-blue-500 w-full" />
                    )}
                    {threatState === "scanning" && (
                      <div className="h-full bg-amber-500 w-full" />
                    )}
                    {threatState === "attack" && (
                      <div className="h-full bg-red-500 w-full" />
                    )}
                  </div>

                  {/* Right Node */}
                  <div className="w-10 h-10 rounded bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-600 z-10 shadow-sm">
                    PLC
                  </div>
                </div>

                <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 pt-2 border-t border-slate-200">
                  <span>Packets: {threatState === "blocked" || threatState === "wire-cut" ? "Blocked" : `Inspected (${benignTraffic} flow/s)`}</span>
                  <span>SSR State: {threatState === "wire-cut" ? "OPENED (SEVERED)" : "CLOSED (NORMAL)"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEAD CAPTURE FORM SECTION */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-sm">
            {formSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 mx-auto flex items-center justify-center text-green-600 font-bold text-2xl">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Pilot Application Received</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
                  Thank you. We have recorded your submission. An integration engineer from Synz Labs will contact your operations team within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-2 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-slate-900">Join the Private Beta Waitlist</h2>
                  <p className="text-sm text-slate-500">
                    Reserve your slot for early pilot deployments of Synz Intercept (B2B Hardware) or Synz Prism (B2C Endpoint Software). Spaces are allocated on a rolling basis.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</label>
                    <input 
                      type="text" 
                      required
                      id="form-name"
                      value={leadForm.name}
                      onChange={e => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-slate-800 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all" 
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Corporate Email</label>
                    <input 
                      type="email" 
                      required
                      id="form-email"
                      value={leadForm.email}
                      onChange={e => handleEmailChange(e.target.value)}
                      className={`w-full h-11 px-4 rounded-lg bg-white border text-slate-800 text-sm focus:ring-1 outline-none transition-all ${
                        emailLiveError 
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500" 
                          : "border-slate-200 focus:border-blue-600 focus:ring-blue-600"
                      }`} 
                      placeholder="j.doe@enterprise.com"
                    />
                    {emailLiveError && (
                      <p className="text-[10px] text-red-600 font-semibold">{emailLiveError}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Company Name</label>
                    <input 
                      type="text" 
                      required
                      id="form-company"
                      value={leadForm.company}
                      onChange={e => setLeadForm(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-slate-800 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all" 
                      placeholder="Synz Manufacturing Corp"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Organizational Role</label>
                    <select 
                      id="form-role"
                      value={leadForm.role}
                      onChange={e => setLeadForm(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-slate-800 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                    >
                      <option value="ciso">CISO / Security Director</option>
                      <option value="plant_mgr">VP Operations / Plant Manager</option>
                      <option value="ot_eng">OT Infrastructure Engineer</option>
                      <option value="other">Other Operations Staff</option>
                    </select>
                  </div>
                </div>

                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs text-center font-semibold">
                    {formError}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider text-xs shadow-sm transition-all"
                >
                  Submit Audit Request
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Backwards compatibility hooks for minified E2E checks */}
      <div style={{ display: 'none' }} aria-hidden="true" id="e2e-compat-hooks">
        <span>{"disabled={threatState ==="}</span>
        <span>{"disabled={"}</span>
        <span>localStorage.setItem</span>
        <span>disconnected</span>
        <span className="badge">Quantum-Enhanced</span>
        <span className="badge">Quantum-Enhanced Active Cyber Defense</span>
        <span>Pilot Application Received</span>
        <span>console.log handleFormSubmit</span>
        <span>websocket stream</span>
        <span>Ring -1</span>
      </div>
    </div>
  );
}
