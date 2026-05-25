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
  notes?: string;
}

export default function EventsLogPage() {
  const { token, isApiOnline } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const mockEvents: EventItem[] = [
    {
      id: "evt-001",
      timestamp: new Date(Date.now() - 1000 * 45).toISOString(),
      sourceIP: "192.168.1.104",
      destPort: 502,
      anomalyScore: 0.98,
      threatLevel: "Critical",
      activeSlots: ["Modbus (OT)", "DMA Attack", "TCP"],
      isBlocked: true,
      inferenceLatencyMs: 0.042,
      sensorName: "OT-Sensor-West"
    },
    {
      id: "evt-002",
      timestamp: new Date(Date.now() - 1000 * 300).toISOString(),
      sourceIP: "192.168.1.18",
      destPort: 80,
      anomalyScore: 0.72,
      threatLevel: "High",
      activeSlots: ["HTTP", "BufferOverflow", "TCP"],
      isBlocked: false,
      inferenceLatencyMs: 0.038,
      sensorName: "Enterprise-Sensor-01"
    },
    {
      id: "evt-003",
      timestamp: new Date(Date.now() - 1000 * 1800).toISOString(),
      sourceIP: "192.168.1.100",
      destPort: 502,
      anomalyScore: 0.48,
      threatLevel: "Medium",
      activeSlots: ["Modbus (OT)", "PortScan", "TCP"],
      isBlocked: false,
      inferenceLatencyMs: 0.021,
      sensorName: "OT-Sensor-West"
    },
    {
      id: "evt-004",
      timestamp: new Date(Date.now() - 1000 * 7200).toISOString(),
      sourceIP: "10.0.5.12",
      destPort: 445,
      anomalyScore: 0.96,
      threatLevel: "Critical",
      activeSlots: ["TCP", "DoS / DDoS"],
      isBlocked: true,
      inferenceLatencyMs: 0.045,
      sensorName: "Core-Gateway-02"
    },
    {
      id: "evt-005",
      timestamp: new Date(Date.now() - 1000 * 14400).toISOString(),
      sourceIP: "192.168.1.155",
      destPort: 22,
      anomalyScore: 0.35,
      threatLevel: "Low",
      activeSlots: ["SSH", "TCP"],
      isBlocked: false,
      inferenceLatencyMs: 0.015,
      sensorName: "Enterprise-Sensor-01"
    }
  ];

  const fetchEvents = async () => {
    if (!isApiOnline || !token) {
      setEvents(mockEvents);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/v1/events?pageSize=50", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.items || []);
      } else {
        throw new Error("Failed to fetch events from API");
      }
    } catch (e) {
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // Poll every 5 seconds
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, [isApiOnline, token, refreshKey]);

  const toggleRow = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const handleManualRefresh = () => {
    setLoading(true);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="p-8 space-y-6 flex flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-mono font-bold tracking-widest text-white uppercase">Interactive Threat Log</h1>
          <p className="text-xs font-mono text-zinc-400">Deep Packet Analytics and Anomaly Classification Logs</p>
        </div>
        <button
          onClick={handleManualRefresh}
          className="px-4 py-2 bg-cyan-glow/10 hover:bg-cyan-glow/20 border border-cyan-glow/30 hover:border-cyan-glow text-cyan-glow font-mono text-xs uppercase tracking-wider rounded transition-all"
        >
          Refresh Feed
        </button>
      </div>

      {/* Main Events Table Panel */}
      <div className="glass-panel p-6 rounded-xl border border-white/5 bg-zinc-950/20 flex flex-col gap-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-zinc-400">
            <thead className="text-zinc-500 uppercase tracking-widest text-[9px] border-b border-white/5 bg-zinc-950/40">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Sensor Node</th>
                <th className="py-3 px-4">Source IP</th>
                <th className="py-3 px-4">Dest Port</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4 text-center">Action</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-zinc-900/10">
              {loading && events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500">Querying security logs...</td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-600 italic">No events logged in system database.</td>
                </tr>
              ) : (
                events.map((evt) => {
                  const isExpanded = expandedRowId === evt.id;
                  return (
                    <React.Fragment key={evt.id}>
                      <tr className={`hover:bg-white/[0.02] transition-all cursor-pointer ${isExpanded ? "bg-white/[0.01]" : ""}`} onClick={() => toggleRow(evt.id)}>
                        <td className="py-3.5 px-4 text-zinc-300">
                          {new Date(evt.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">{evt.sensorName || "Unknown Sensor"}</td>
                        <td className="py-3.5 px-4 text-white font-semibold">{evt.sourceIP}</td>
                        <td className="py-3.5 px-4">{evt.destPort}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`font-bold ${evt.anomalyScore > 0.8 ? "text-red-500" : evt.anomalyScore > 0.4 ? "text-amber-400" : "text-green-400"}`}>
                            {Math.round(evt.anomalyScore * 100)}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            evt.isBlocked 
                              ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}>
                            {evt.isBlocked ? "BLOCKED" : "MONITORED"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(evt.id);
                            }}
                            className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded font-mono transition-all border ${
                              isExpanded 
                                ? "bg-cyan-glow text-black border-cyan-glow shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                                : "bg-zinc-900 border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                            }`}
                          >
                            Diagnostics
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-zinc-950/60 font-mono">
                          <td colSpan={7} className="p-6 border-b border-white/10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-400">
                              <div className="space-y-2">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Active Diagnostics (Classifier Slots)</span>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {evt.activeSlots && evt.activeSlots.length > 0 ? (
                                    evt.activeSlots.map((slot) => (
                                      <span key={slot} className="px-2.5 py-0.5 rounded bg-zinc-900 border border-white/5 text-white text-[10px] font-bold">
                                        {slot}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-zinc-600 italic">None active</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Detection Interceptor Details</span>
                                <p className="text-zinc-300 font-semibold pt-1">Node: {evt.sensorName || "N/A"}</p>
                                <p className="text-[10px] text-zinc-500">ID: {evt.id}</p>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Inference Performance</span>
                                <p className="text-zinc-300 font-semibold pt-1">Latency: {evt.inferenceLatencyMs.toFixed(3)} ms</p>
                                <p className="text-[10px] text-zinc-500">Dual-head QGAN Evaluation</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
