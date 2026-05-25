"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type ConnectionState = "connected" | "offline" | "auth_error" | "loading";

export default function ConsoleDashboardPage() {
  const router = useRouter();
  const [connectionState, setConnectionState] = useState<ConnectionState>("loading");
  const [displayName, setDisplayName] = useState<string>("");
  const [sensorsData, setSensorsData] = useState<any[]>([]);

  useEffect(() => {
    // Check JWT presence in localStorage
    const token = localStorage.getItem("synz_token");
    const userStr = localStorage.getItem("synz_user");
    
    if (!token || !userStr) {
      setConnectionState("auth_error");
      localStorage.removeItem("synz_token");
      router.push("/console/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setDisplayName(user.displayName || "Operator");
    } catch {
      setDisplayName("Operator");
    }

    // Function to check connection and load telemetry
    const verifyApiConnection = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/auth/keys", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          setConnectionState("auth_error");
          localStorage.removeItem("synz_token");
          setTimeout(() => router.push("/console/login"), 1000);
        } else if (response.ok) {
          setConnectionState("connected");
          // Optionally parse keys list or sensor list
          const keys = await response.json();
          setSensorsData(keys);
        } else {
          setConnectionState("offline");
        }
      } catch (err) {
        setConnectionState("offline");
      }
    };

    verifyApiConnection();
    // Poll API connection state every 10 seconds
    const interval = setInterval(verifyApiConnection, 10000);

    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("synz_token");
    localStorage.removeItem("synz_refresh_token");
    localStorage.removeItem("synz_token_expiry");
    localStorage.removeItem("synz_user");
    router.push("/console/login");
  };

  return (
    <div className="relative min-h-screen bg-[#020408] text-zinc-100 flex flex-col antialiased font-sans">
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0 opacity-40" />

      {/* DASHBOARD HEADER */}
      <header className="w-full bg-[#020408]/80 backdrop-blur-md border-b border-white/5 z-20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-cyan-glow font-bold text-lg">Ψ</span>
            <span className="font-mono font-bold tracking-widest text-white">SYNZ CONSOLE</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-mono">Status:</span>
              <span
                id="api-connection-status"
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded transition-all border ${
                  connectionState === "connected"
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : connectionState === "offline"
                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                    : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                }`}
              >
                {connectionState === "connected" && "API CONNECTED"}
                {connectionState === "offline" && "OFFLINE"}
                {connectionState === "auth_error" && "AUTHENTICATION ERROR"}
                {connectionState === "loading" && "CONNECTING..."}
              </span>
            </div>

            <div className="text-sm font-semibold text-zinc-300">
              Welcome, <span id="operator-display-name">{displayName}</span>
            </div>

            <button
              onClick={handleLogout}
              id="logout-btn"
              className="px-4 py-1.5 rounded bg-zinc-950 border border-white/10 hover:border-red-glow/40 hover:text-red-glow text-xs font-mono tracking-wider transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD MAIN */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 z-10 space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">System Telemetry & Access</h2>
          <p className="text-sm text-zinc-400">Manage cryptographic API keys and inspect hardware active defense states</p>
        </div>

        {connectionState === "offline" && (
          <div id="connection-warning" className="p-4 bg-red-950/20 border border-red-glow/40 rounded-xl text-red-glow flex flex-col gap-1">
            <span className="font-bold text-sm">WARNING: API Connection Lost</span>
            <span className="text-xs">The operator console cannot reach the C# backend API at localhost:5000. Telemetry logging is suspended.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Console State */}
          <div className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block">Security Context</span>
              <h3 className="text-lg font-bold text-white">Authentication Active</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The session is cryptographically signed. Your role allows read access to active API keys and hardware telemetry sensors.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-mono text-zinc-500">
              Provider: JWT Bearer / HS256
            </div>
          </div>

          {/* Card 2: Active Keys count */}
          <div className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block">Cryptographic Keys</span>
              <h3 className="text-lg font-bold text-white">Authorized Sensor Keys</h3>
              <div className="text-3xl font-mono font-bold text-cyan-glow" id="keys-count-display">
                {connectionState === "connected" ? sensorsData.length : "—"}
              </div>
              <p className="text-xs text-zinc-400">
                Number of registered high-speed eBPF daemon keys reported by the authentication repository.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-mono text-zinc-500">
              Repository: SQLite / EF Core
            </div>
          </div>

          {/* Card 3: System Access Mode */}
          <div className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block">Active Mode</span>
              <h3 className="text-lg font-bold text-white">System Integrity</h3>
              <div className="text-sm font-mono font-bold text-green-400">
                NORMAL OPERATIONS
              </div>
              <p className="text-xs text-zinc-400">
                The C++ Edge Interceptor is monitoring incoming Modbus flows with generic eBPF sockets active.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-mono text-zinc-500">
              Interceptor Port: 9999 (UDP)
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
