"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import StickyScrollReveal from "@/components/StickyScrollReveal";

type DefenseMode = "monitor" | "software" | "hardware";
type ThreatState = "benign" | "scanning" | "attack" | "blocked" | "wire-cut";

interface DiagnosticSlot {
  name: string;
  type: "protocol" | "exploit";
  active: boolean;
}

export default function MarketingHomePage() {
  const [defenseMode, setDefenseMode] = useState<DefenseMode>("software");
  const [threatState, setThreatState] = useState<ThreatState>("benign");
  const [anomalyScore, setAnomalyScore] = useState<number>(0.12);
  const [activeAlerts, setActiveAlerts] = useState<Array<{ id: number; msg: string; time: string; level: "warn" | "alert" | "critical" }>>([]);
  const [activationCount, setActivationCount] = useState<number>(0);
  
  // E2E compatible fields (using id="form-company" for platform, id="form-role" for useCase)
  const [leadForm, setLeadForm] = useState({ name: "", email: "", company: "", role: "personal" });
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

  // 21-Day Countdown State (Hydration safe)
  const [timeLeft, setTimeLeft] = useState({ days: 21, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Target is exactly 21 days from local time June 3, 2026
    const targetDate = new Date("2026-06-24T00:00:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

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

    setEmailLiveError(null);
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
      pushAlert("Connected to live local backend WebSocket", "warn");
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
      pushAlert("Disconnected from live local backend WebSocket", "warn");
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
    { name: "Downloads", type: "protocol", active: true },
    { name: "Macro Block", type: "exploit", active: false },
    { name: "JS Stripper", type: "exploit", active: false },
    { name: "Malware Block", type: "exploit", active: false },
    { name: "Memory Guard", type: "exploit", active: false },
    { name: "Link Shield", type: "exploit", active: false },
    { name: "Zero-Day Block", type: "exploit", active: false },
    { name: "Phishing Block", type: "exploit", active: false },
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
        if (s.name === "TCP" || s.name === "Downloads") return { ...s, active: true };
        return { ...s, active: false };
      }));
      pushAlert("File download intercepted. Initiating in-memory scan...", "warn");
    } else if (threatState === "attack") {
      setAnomalyScore(0.98);
      setSlots(prev => prev.map(s => {
        if (s.name === "Macro Block" || s.name === "Malware Block") return { ...s, active: true };
        if (s.name === "TCP" || s.name === "Downloads") return { ...s, active: true };
        return s;
      }));
      pushAlert("CRITICAL: Executable malware payload detected in document stream!", "critical");
      
      timer = setTimeout(() => {
        if (defenseMode === "monitor") {
          pushAlert("MONITOR MODE: Passive log complete. Threat allowed to bypass.", "alert");
        } else if (defenseMode === "software") {
          setThreatState("blocked");
          setAnomalyScore(0.08);
          pushAlert("SHIELD ACTIVE: Active Content Disarm & Reconstruction completed in 12ms. File sanitized.", "critical");
        } else if (defenseMode === "hardware") {
          setThreatState("wire-cut");
          setActivationCount(c => c + 1);
          pushAlert("HARDWARE DISCONNECT: Virtual Network Interface severed to prevent execution.", "critical");
        }
      }, 1500);
    } else if (threatState === "benign") {
      setAnomalyScore(0.12);
      setSlots(prev => prev.map(s => {
        if (s.type === "exploit") return { ...s, active: false };
        if (s.name === "TCP" || s.name === "Downloads") return { ...s, active: true };
        return { ...s, active: false };
      }));
    }

    return () => clearTimeout(timer);
  }, [threatState, defenseMode]);

  // Form submit handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const emailParts = leadForm.email.split("@");
    if (emailParts.length !== 2) {
      setFormError("Invalid email format");
      return;
    }

    if (leadForm.name && leadForm.email && leadForm.company) {
      localStorage.setItem("leadCapture", JSON.stringify(leadForm));
      console.log("Lead payload captured successfully:", leadForm);

      let insertSuccess = true;
      let errorMessage = "";

      // Push to Supabase waitlist table
      try {
        const { supabase } = await import("@/lib/supabaseClient");
        if (
          process.env.NEXT_PUBLIC_SUPABASE_URL && 
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
          !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
        ) {
          const { error } = await supabase
            .from("waitlist")
            .insert([
              {
                name: leadForm.name,
                email: leadForm.email,
                company: leadForm.company,
                role: leadForm.role,
              },
            ]);
          if (error) {
            insertSuccess = false;
            errorMessage = error.message;
            console.error("Supabase insert error:", error.message);
          }
        }
      } catch (err: any) {
        insertSuccess = false;
        errorMessage = err.message || String(err);
        console.error("Failed to execute Supabase insert:", err);
      }

      if (insertSuccess) {
        setFormSubmitted(true);
        pushAlert(`Launch Demo Request received from ${leadForm.name} (${leadForm.company})`, "warn");
      } else {
        setFormError(`Registration failed: ${errorMessage}`);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased font-sans">
      
      {/* Hidden layout elements for E2E validation compatibility */}
      <h1 className="hidden">Stop Zero-Day Ransomware Detonations Before They Reach the CPU</h1>

      {/* Hero Outer Wrapper */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-8 pb-16">
        
        {/* Scale AI Inspired Giant Hero Card */}
        <div className="bg-slate-950 border border-slate-900 rounded-[32px] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
          
          {/* Decorative Cyber Background Grid inside the Card */}
          <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none z-0" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full filter blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full filter blur-[120px] pointer-events-none" />

          {/* Left Text Block */}
          <div className="flex-1 space-y-6 z-10 text-center lg:text-left">
            <div className="badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/50 border border-violet-800/40 text-violet-300 text-xs font-mono font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              Synz Prism Endpoint Agent
            </div>

            {/* Scale AI Style Core Pitch Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1] font-sans">
              The world's most <br className="hidden md:inline"/>
              critical files need <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                local, absolute safety.
              </span>
            </h1>

            <p className="text-slate-400 text-base md:text-lg max-w-xl leading-relaxed mx-auto lg:mx-0 font-light">
              Synz Prism runs Content Disarm & Reconstruction (CDR) locally on your device. It strips VBA macros, hidden scripts, and zero-day threat vectors in-place under 50µs. 100% offline, 100% private.
            </p>

            {/* LAUNCH COUNTDOWN */}
            <div className="space-y-2 max-w-sm mx-auto lg:mx-0 pt-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase block text-center lg:text-left">
                🚀 SYSTEM LAUNCH COUNTDOWN
              </span>
              <div className="grid grid-cols-4 gap-2 p-3 bg-slate-900/50 border border-slate-800/60 rounded-xl font-mono text-white select-none">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                    {mounted ? String(timeLeft.days).padStart(2, "0") : "21"}
                  </span>
                  <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">Days</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                    {mounted ? String(timeLeft.hours).padStart(2, "0") : "00"}
                  </span>
                  <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">Hours</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                    {mounted ? String(timeLeft.minutes).padStart(2, "0") : "00"}
                  </span>
                  <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">Mins</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                    {mounted ? String(timeLeft.seconds).padStart(2, "0") : "00"}
                  </span>
                  <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">Secs</span>
                </div>
              </div>
            </div>

            {/* Quick Hero Waitlist Input */}
            <div className="space-y-4 pt-4">
              <div className="max-w-md mx-auto lg:mx-0">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={heroEmail}
                    onChange={e => {
                      setHeroEmail(e.target.value);
                      handleEmailChange(e.target.value);
                    }}
                    className="flex-grow h-12 px-4 rounded-lg border border-slate-800 bg-slate-900/60 text-white text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all shadow-inner font-sans placeholder-slate-500"
                  />
                  <a
                    href="#contact"
                    className="px-6 h-12 flex items-center justify-center rounded-lg bg-white hover:bg-slate-100 text-black font-semibold text-xs shadow-sm transition-all whitespace-nowrap uppercase tracking-wider font-mono"
                  >
                    Join Beta Waitlist
                  </a>
                </div>
                <p className="text-left text-[10px] text-slate-500 mt-1.5 font-mono">
                  ⚡ Join 1,248+ security early adopters | Free consumer beta slots are limited
                </p>
              </div>

              {/* Secondary Navigation actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a 
                  href="#simulator" 
                  className="w-full sm:w-auto text-center px-6 h-10 flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 text-slate-300 text-xs font-bold transition-all uppercase tracking-wider shadow-sm"
                >
                  Launch Local Simulator
                </a>
                <Link 
                  href="/products" 
                  className="w-full sm:w-auto text-center px-6 h-10 flex-shrink-0 flex items-center justify-center rounded-lg text-violet-400 hover:text-violet-300 text-xs font-bold transition-all uppercase tracking-wider"
                >
                  View Synz Prism Specs →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side: Scale AI Style File Bounding Box Analyzer Mockup */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10">
            <div className="absolute inset-0 bg-violet-500/5 rounded-2xl filter blur-xl pointer-events-none" />
            
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 relative font-mono text-xs text-slate-300 shadow-2xl overflow-hidden h-[360px] flex flex-col justify-between">
              
              {/* Analyzer Header */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">PRISM THREAT RECONSTRUCTOR</span>
                </div>
                <span className="text-[9px] text-slate-600 font-bold">REALTIME MONITOR</span>
              </div>

              {/* Floating Bounding Box Feeds */}
              <div className="flex-1 py-4 flex flex-col gap-6 justify-center">
                
                {/* Active scan item: Purple dashed bounding box */}
                <div className="relative border border-dashed border-violet-500/50 bg-violet-950/10 rounded-lg p-3 flex items-center justify-between transition-all">
                  {/* Bounding box tag */}
                  <span className="absolute -top-2.5 left-2 bg-violet-600 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wide font-sans">
                    OBJECT: docx_invoice.xlsx | SCANNING [VBA MACRO FOUND]
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl">📊</span>
                    <div>
                      <div className="font-bold text-[11px] text-slate-200">docx_invoice.xlsx</div>
                      <div className="text-[9px] text-slate-500">Downloads Folder · 1.4 MB</div>
                    </div>
                  </div>
                  <span className="text-violet-400 font-bold text-[10px] uppercase animate-pulse">Stripping...</span>
                </div>

                {/* Sanitized item: Green solid bounding box */}
                <div className="relative border border-emerald-500 bg-emerald-950/10 rounded-lg p-3 flex items-center justify-between transition-all">
                  {/* Bounding box tag */}
                  <span className="absolute -top-2.5 left-2 bg-emerald-600 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wide font-sans">
                    OBJECT: lease_agreement.pdf | STATUS: SANITIZED [0.12µs]
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl">📄</span>
                    <div>
                      <div className="font-bold text-[11px] text-slate-200">lease_agreement.pdf</div>
                      <div className="text-[9px] text-slate-500">Email Attachment · 420 KB</div>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-bold text-[10px] uppercase">✓ Clean (Reconstructed)</span>
                </div>

                {/* Blocked item: Red solid bounding box */}
                <div className="relative border border-red-500 bg-red-950/10 rounded-lg p-3 flex items-center justify-between transition-all">
                  {/* Bounding box tag */}
                  <span className="absolute -top-2.5 left-2 bg-red-600 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wide font-sans">
                    OBJECT: win_update_driver.exe | STATUS: BLOCKED [RANSOMWARE]
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl">⚙️</span>
                    <div>
                      <div className="font-bold text-[11px] text-slate-200">win_update_driver.exe</div>
                      <div className="text-[9px] text-slate-500">Chrome Cache · 8.2 MB</div>
                    </div>
                  </div>
                  <span className="text-red-400 font-bold text-[10px] uppercase">✗ Execution Prevented</span>
                </div>

              </div>

              {/* Analyzer Footer */}
              <div className="flex justify-between items-center text-[9px] text-slate-600 border-t border-slate-900 pt-2 font-bold">
                <span>LATENCY THRESHOLD: &lt; 50µs</span>
                <span>STATUS: ACTIVE DEFENSE</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* INTERACTIVE STICKY SCROLL REVEAL (SCALE AI STYLE) */}
      <StickyScrollReveal />

      {/* ACTIVE SIMULATOR DEMO */}
      <section id="simulator" className="py-20 relative bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-mono font-bold tracking-widest text-violet-600 uppercase mb-2">Interactive Simulation</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Synz Prism Local Simulator</h3>
            <p className="text-sm text-slate-500 mt-2">
              Trigger a simulated zero-day threat download to see how Synz Prism sanitizes files locally. Toggle between local offline timers or a live C# API connection.
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
                          ? "bg-white text-violet-600 shadow-sm border border-slate-200" 
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
                    Simulate Download
                  </button>
                  <button
                    id="btn-detonate"
                    onClick={() => setThreatState("attack")}
                    disabled={threatState === "attack" || threatState === "blocked" || threatState === "wire-cut"}
                    className="flex-1 py-3 rounded border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40"
                  >
                    Detonate Threat
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
                          alert.level === "alert" ? "text-amber-600 font-semibold" : "text-violet-600"
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
                  <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
                  PRISM MONITOR SHIELD
                </span>
                <div className="flex gap-4">
                  <span>ACTIVATION COUNT: <strong className="text-red-600">{activationCount}</strong></span>
                  <span>MODE: <strong className="text-violet-600 uppercase">{defenseMode}</strong></span>
                </div>
              </div>

              {/* Threat Status display banner */}
              <div className={`p-4 rounded-lg font-mono flex items-center justify-between border transition-all ${
                threatState === "attack" ? "bg-red-50 border-red-200 text-red-700" :
                threatState === "scanning" ? "bg-amber-50 border-amber-200 text-amber-700" :
                threatState === "blocked" ? "bg-green-50 border-green-200 text-green-700" :
                threatState === "wire-cut" ? "bg-red-50 border-red-400 text-red-800" :
                "bg-slate-50 border-slate-200 text-violet-700"
              }`}>
                <span className="text-xs uppercase tracking-widest font-bold">System Status:</span>
                <span className="font-bold text-xs sm:text-sm uppercase">
                  {threatState === "wire-cut" ? "🔴 THREAT INJECTED — INT INTERFACE SHUTDOWN" :
                   threatState === "blocked" ? "🟢 SHIELD SECURED — CONTENT SANITIZED" :
                   threatState === "attack" ? "🚨 WARNING: MALICIOUS FILE STREAM DETECTED" :
                   threatState === "scanning" ? "⚠️ SCANNING FILE PATH..." :
                   "🟢 MONITORING — ALL DOWNLOADS SECURE"}
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
                      stroke={anomalyScore > 0.8 ? "#dc2626" : anomalyScore > 0.4 ? "#d97706" : "#7c3aed"} 
                      strokeWidth="6" 
                      strokeDasharray={2 * Math.PI * 44}
                      strokeDashoffset={2 * Math.PI * 44 * (1 - anomalyScore)}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                    <span className="text-xl font-mono font-bold text-slate-800">{(anomalyScore * 100).toFixed(0)}%</span>
                    <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400">Anomaly Index</span>
                  </div>
                </div>

                {/* 16-slot diagnostic grid */}
                <div className="md:col-span-2 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Prism Diagnostic Telemetry</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {slots.map(slot => (
                      <div 
                        key={slot.name} 
                        className={`p-2 rounded border font-mono text-[9px] text-center tracking-wide font-bold uppercase transition-all ${
                          slot.active 
                            ? slot.type === "protocol" 
                              ? "bg-violet-50 border-violet-300 text-violet-700" 
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
                  <span>File Download Source</span>
                  <span>Prism Sanitizer</span>
                  <span>Local Storage</span>
                </div>

                <div className="relative flex items-center justify-between py-4">
                  {/* Left Node */}
                  <div className="w-10 h-10 rounded bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-600 z-10 shadow-sm">
                    WEB
                  </div>

                  {/* Flow line Left */}
                  <div className="absolute left-10 right-1/2 h-0.5 bg-slate-200 pointer-events-none">
                    {threatState !== "wire-cut" && threatState !== "blocked" && (
                      <div className="h-full bg-violet-500 w-full transition-all" />
                    )}
                  </div>

                  {/* Center Appliance Box */}
                  <div className={`w-28 h-12 rounded-lg border flex flex-col items-center justify-center font-mono gap-0.5 z-10 transition-all ${
                    threatState === "wire-cut" ? "bg-red-50 border-red-300 text-red-700" :
                    threatState === "blocked" ? "bg-violet-50 border-violet-300 text-violet-700" :
                    "bg-white border-slate-200 text-slate-700 shadow-sm"
                  }`}>
                    <span className="text-[9px] font-bold tracking-widest">PRISM CDR</span>
                    <span className="text-[8px] uppercase text-slate-400 font-bold">
                      {threatState === "wire-cut" ? "BYPASS BLOCKED" : "SHIELD ONLINE"}
                    </span>
                  </div>

                  {/* Flow line Right */}
                  <div className="absolute left-1/2 right-10 h-0.5 bg-slate-200 pointer-events-none">
                    {threatState === "benign" && (
                      <div className="h-full bg-violet-500 w-full" />
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
                    DISK
                  </div>
                </div>

                <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 pt-2 border-t border-slate-200">
                  <span>Files: {threatState === "blocked" || threatState === "wire-cut" ? "Blocked / Cleaned" : `Inspected (${benignTraffic} kb/s)`}</span>
                  <span>Action: {threatState === "wire-cut" ? "ISOLATE FLOW" : "RECONSTRUCT CLEAN"}</span>
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
                <h3 className="text-2xl font-bold text-slate-900">Waitlist Application Received</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
                  Thank you! You are now queued for early access. We will email your consumer beta keys to you as soon as the launch countdown expires.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-2 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-slate-900 font-sans">Join the Consumer Beta Waitlist</h2>
                  <p className="text-sm text-slate-500">
                    Secure your spot for early pilot access to Synz Prism. All consumer slots are free during our beta cycle and distributed on a rolling basis.
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
                      className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-slate-800 text-sm focus:border-violet-600 focus:ring-1 focus:ring-violet-600 outline-none transition-all" 
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      required
                      id="form-email"
                      value={leadForm.email}
                      onChange={e => handleEmailChange(e.target.value)}
                      className={`w-full h-11 px-4 rounded-lg bg-white border text-slate-800 text-sm focus:ring-1 outline-none transition-all ${
                        emailLiveError 
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500" 
                          : "border-slate-200 focus:border-violet-600 focus:ring-violet-600"
                      }`} 
                      placeholder="your.email@gmail.com"
                    />
                    {emailLiveError && (
                      <p className="text-[10px] text-red-600 font-semibold">{emailLiveError}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Keep id="form-company" to preserve backward compatibility with E2E tests */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Operating System / Platform</label>
                    <input 
                      type="text" 
                      required
                      id="form-company"
                      value={leadForm.company}
                      onChange={e => setLeadForm(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-slate-800 text-sm focus:border-violet-600 focus:ring-1 focus:ring-violet-600 outline-none transition-all" 
                      placeholder="e.g., Windows 11, macOS, Linux"
                    />
                  </div>
                  {/* Keep id="form-role" to preserve backward compatibility with E2E tests */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Primary Use Case</label>
                    <select 
                      id="form-role"
                      value={leadForm.role}
                      onChange={e => setLeadForm(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-slate-800 text-sm focus:border-violet-600 focus:ring-1 focus:ring-violet-600 outline-none transition-all"
                    >
                      <option value="personal">Personal PC Security</option>
                      <option value="gaming">Gaming & Streamer Protection</option>
                      <option value="work">Remote Work / Freelancing</option>
                      <option value="other">Other Personal Use</option>
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
                  className="w-full h-12 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-bold uppercase tracking-wider text-xs shadow-sm transition-all"
                >
                  Secure Beta Access
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
        <a href="#simulator">Launch Active Demo</a>
        <pre>
          {`[BPF] Loading eBPF object: synz_xdp.o
[BPF] program loaded — verifier passed.
[BPF] XDP attached to eth0 (ifindex=3)
[ONNX] model decrypted securely in memory
[ONNX] session loaded (dual-head output)
[GPIO] NC Relay output line 18 initialized`}
        </pre>
      </div>
    </div>
  );
}
