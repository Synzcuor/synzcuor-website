"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface EventItem {
  id: string;
  timestamp: string;
  sourceIP: string;
  destPort: number;
  anomalyScore: number;
  threatLevel: string;
  activeSlots: string[];
  isBlocked: boolean;
  inferenceLatencyMs: number;
  sensorName?: string;
}

export default function DashboardHome() {
  const { token, isApiOnline } = useAuth();
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [threatsDetected, setThreatsDetected] = useState<number>(0);
  const [killSwitchBlocks, setKillSwitchBlocks] = useState<number>(0);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [topAttackCategories, setTopAttackCategories] = useState<{ name: string; count: number; percentage: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // High fidelity simulated offline metrics
  const mockStats = {
    totalEvents: 1420,
    threatsDetected: 184,
    killSwitchBlocks: 23,
    topCategories: [
      { name: "Modbus Exploits (OT)", count: 83, percentage: 45 },
      { name: "DMA Buffer Overflows", count: 46, percentage: 25 },
      { name: "TCP Port Scanning", count: 28, percentage: 15 },
      { name: "ROP Chain Privilege Escalation", count: 27, percentage: 15 }
    ],
    events: [
      {
        id: "mock-1",
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        sourceIP: "192.168.1.104",
        destPort: 502,
        anomalyScore: 0.98,
        threatLevel: "Critical",
        activeSlots: ["Modbus (OT)", "DMA Attack"],
        isBlocked: true,
        inferenceLatencyMs: 0.042,
        sensorName: "OT-Sensor-West"
      },
      {
        id: "mock-2",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        sourceIP: "192.168.1.18",
        destPort: 80,
        anomalyScore: 0.72,
        threatLevel: "High",
        activeSlots: ["HTTP", "BufferOverflow"],
        isBlocked: false,
        inferenceLatencyMs: 0.038,
        sensorName: "Enterprise-Sensor-01"
      },
      {
        id: "mock-3",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        sourceIP: "192.168.1.100",
        destPort: 502,
        anomalyScore: 0.48,
        threatLevel: "Medium",
        activeSlots: ["Modbus (OT)", "PortScan"],
        isBlocked: false,
        inferenceLatencyMs: 0.021,
        sensorName: "OT-Sensor-West"
      },
      {
        id: "mock-4",
        timestamp: new Date(Date.now() - 1000 * 3600 * 2).toISOString(),
        sourceIP: "10.0.5.12",
        destPort: 445,
        anomalyScore: 0.96,
        threatLevel: "Critical",
        activeSlots: ["TCP", "DoS / DDoS"],
        isBlocked: true,
        inferenceLatencyMs: 0.045,
        sensorName: "Core-Gateway-02"
      }
    ]
  };

  const fetchData = async () => {
    if (!isApiOnline || !token) {
      // Fallback
      setTotalEvents(mockStats.totalEvents);
      setThreatsDetected(mockStats.threatsDetected);
      setKillSwitchBlocks(mockStats.killSwitchBlocks);
      setTopAttackCategories(mockStats.topCategories);
      setEvents(mockStats.events);
      setLoading(false);
      return;
    }

    try {
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      // 1. Fetch stats
      const statsRes = await fetch("http://localhost:5000/api/v1/events/stats", { headers });
      if (statsRes.ok) {
        const stats = await statsRes.json();
        // stats keys: TotalEvents, TotalThreats, TotalBlocked, ByLevel, TopSlots
        setTotalEvents(stats.totalEvents);
        setThreatsDetected(stats.totalThreats);
        setKillSwitchBlocks(stats.totalBlocked);

        const totalSlotsCount = Object.values(stats.topSlots || {}).reduce((a: any, b: any) => a + b, 0) as number || 1;
        const mappedCategories = Object.entries(stats.topSlots || {}).map(([name, count]: [string, any]) => ({
          name,
          count,
          percentage: Math.round((count / totalSlotsCount) * 100)
        })).sort((a, b) => b.count - a.count);
        setTopAttackCategories(mappedCategories.length > 0 ? mappedCategories : mockStats.topCategories);
      } else {
        throw new Error("Stats fetch failed");
      }

      // 2. Fetch recent events
      const eventsRes = await fetch("http://localhost:5000/api/v1/events?pageSize=10", { headers });
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setEvents(data.items || []);
      } else {
        throw new Error("Events fetch failed");
      }
    } catch (e) {
      // Fallback on error
      setTotalEvents(mockStats.totalEvents);
      setThreatsDetected(mockStats.threatsDetected);
      setKillSwitchBlocks(mockStats.killSwitchBlocks);
      setTopAttackCategories(mockStats.topCategories);
      setEvents(mockStats.events);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [isApiOnline, token]);

  return (
    <div className="p-8 space-y-8 flex flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-mono font-bold tracking-widest text-white uppercase">Real-Time Threat Console</h1>
          <p className="text-xs font-mono text-zinc-400">Live QGAN Intrusion Detection & Interception Analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isApiOnline ? "bg-green-500 animate-pulse" : "bg-amber-500 animate-pulse"}`} />
          <span className="font-mono text-xs uppercase text-zinc-400">
            System State: {isApiOnline ? "Connected to C# API" : "Simulated/Offline"}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Events Widget */}
        <div className="glass-panel p-6 rounded-xl border border-white/5 glow-cyan flex flex-col gap-2 relative overflow-hidden bg-zinc-950/20">
          <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-zinc-600">ID: E-WIDGET</div>
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">Total Packets Inspected</span>
          <span className="text-3xl font-mono font-extrabold text-white">{totalEvents.toLocaleString()}</span>
          <span className="text-[10px] font-mono text-cyan-dim uppercase tracking-wider">Sub-50µs Analysis Ingest</span>
        </div>

        {/* Threats Detected Widget */}
        <div className="glass-panel p-6 rounded-xl border border-white/5 glow-cyan flex flex-col gap-2 relative overflow-hidden bg-zinc-950/20">
          <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-zinc-600">ID: T-WIDGET</div>
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">Threats Flagged</span>
          <span className="text-3xl font-mono font-extrabold text-amber-400">{threatsDetected.toLocaleString()}</span>
          <span className="text-[10px] font-mono text-amber-500/80 uppercase tracking-wider">Wasserstein Anomaly Threshold Triggered</span>
        </div>

        {/* Kill-Switch Blocks Widget */}
        <div className="glass-panel p-6 rounded-xl border border-white/5 glow-cyan flex flex-col gap-2 relative overflow-hidden bg-zinc-950/20">
          <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-zinc-600">ID: K-WIDGET</div>
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">Hardware Kill-Switch Blocks</span>
          <span className="text-3xl font-mono font-extrabold text-red-500">{killSwitchBlocks.toLocaleString()}</span>
          <span className="text-[10px] font-mono text-red-500/80 uppercase tracking-wider">GPIO SSR De-Energized access cut</span>
        </div>
      </div>

      {/* Graphs & Live Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Feed (Table) - Left/Center Column */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-white/5 bg-zinc-950/20 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="font-mono text-sm uppercase font-bold text-white tracking-widest">Live Threat Feed (10 Max)</span>
            <span className="font-mono text-[10px] text-zinc-500">POLLING ACTIVE</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-zinc-400">
              <thead className="text-zinc-500 uppercase tracking-widest text-[9px] border-b border-white/5 bg-zinc-950/40">
                <tr>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Sensor Node</th>
                  <th className="py-2.5 px-4">Source IP</th>
                  <th className="py-2.5 px-4">Dest Port</th>
                  <th className="py-2.5 px-4 text-center">Score</th>
                  <th className="py-2.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-zinc-900/10">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-600 italic">No threats captured. System is running clean.</td>
                  </tr>
                ) : (
                  events.map((evt) => (
                    <tr key={evt.id} className="hover:bg-white/[0.02] transition-all">
                      <td className="py-3 px-4 font-semibold text-zinc-300">
                        {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 truncate max-w-[120px]" title={evt.sensorName || "N/A"}>
                        {evt.sensorName || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-white">{evt.sourceIP}</td>
                      <td className="py-3 px-4">{evt.destPort}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-bold ${evt.anomalyScore > 0.8 ? "text-red-500" : "text-amber-400"}`}>
                          {Math.round(evt.anomalyScore * 100)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          evt.isBlocked 
                            ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}>
                          {evt.isBlocked ? "BLOCKED" : "MONITORED"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Attack Categories Chart - Right Column */}
        <div className="glass-panel p-6 rounded-xl border border-white/5 bg-zinc-950/20 flex flex-col gap-6">
          <div className="border-b border-white/5 pb-3">
            <span className="font-mono text-sm uppercase font-bold text-white tracking-widest">Top Attack Categories</span>
          </div>

          <div className="flex flex-col gap-6 items-center justify-center flex-1">
            {/* Animated SVG Pie/Donut Chart */}
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#18181b" strokeWidth="10" />
                
                {/* Category 1: Modbus Exploits */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="transparent"
                  stroke="#00f0ff"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.45)}`}
                  className="transition-all duration-1000 ease-out"
                />

                {/* Category 2: DMA Overflows */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="transparent"
                  stroke="#ff2a51"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.25)}`}
                  transform="rotate(162, 50, 50)"
                  className="transition-all duration-1000 ease-out"
                />

                {/* Category 3: Port Scan */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="transparent"
                  stroke="#ffb800"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.15)}`}
                  transform="rotate(252, 50, 50)"
                  className="transition-all duration-1000 ease-out"
                />

                {/* Category 4: ROP Chain */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="transparent"
                  stroke="#a855f7"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.15)}`}
                  transform="rotate(306, 50, 50)"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-center">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Intrusions</span>
                <span className="text-lg font-bold text-white">{threatsDetected}</span>
              </div>
            </div>

            {/* Legend / Breakdown List */}
            <div className="w-full space-y-3 font-mono text-xs">
              {topAttackCategories.map((cat, idx) => {
                const colors = ["#00f0ff", "#ff2a51", "#ffb800", "#a855f7"];
                return (
                  <div key={cat.name} className="flex flex-col gap-1">
                    <div className="flex justify-between text-zinc-300">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
                        <span className="truncate max-w-[160px]">{cat.name}</span>
                      </div>
                      <span className="font-bold text-white">{cat.percentage}%</span>
                    </div>
                    {/* Animated bar */}
                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full transition-all duration-1000" 
                        style={{ 
                          width: `${cat.percentage}%`,
                          backgroundColor: colors[idx % colors.length]
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
