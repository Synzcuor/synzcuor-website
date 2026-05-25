"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface SensorItem {
  id: string;
  name: string;
  location?: string;
  modelVersion?: string;
  status: string; // Online, Offline, Stale
  lastHeartbeat?: string;
  totalEvents: number;
  totalThreats: number;
  totalBlocked: number;
  ipAddress?: string;
}

export default function SensorsGridPage() {
  const { token, isApiOnline } = useAuth();
  const [sensors, setSensors] = useState<SensorItem[]>([]);
  const [loading, setLoading] = useState(true);

  const mockSensors: SensorItem[] = [
    {
      id: "sens-001",
      name: "OT-Sensor-West",
      location: "Houston Assembly Plant — OT Subnet 1",
      modelVersion: "v1.0.0-RELEASE",
      status: "Online",
      lastHeartbeat: new Date(Date.now() - 3000).toISOString(),
      totalEvents: 948,
      totalThreats: 12,
      totalBlocked: 5,
      ipAddress: "192.168.1.10"
    },
    {
      id: "sens-002",
      name: "Enterprise-Sensor-01",
      location: "Austin Data Center — Edge Rack B",
      modelVersion: "v1.0.0-RELEASE",
      status: "Online",
      lastHeartbeat: new Date(Date.now() - 8000).toISOString(),
      totalEvents: 2185,
      totalThreats: 5,
      totalBlocked: 0,
      ipAddress: "192.168.2.14"
    },
    {
      id: "sens-003",
      name: "Turbine-Telemetry-S3",
      location: "Wind Farm Array 4 — PLC Hub 12",
      modelVersion: "v1.0.0-BETA",
      status: "Stale",
      lastHeartbeat: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      totalEvents: 5802,
      totalThreats: 96,
      totalBlocked: 18,
      ipAddress: "10.14.0.95"
    },
    {
      id: "sens-004",
      name: "Substation-Core-N",
      location: "Chicago Power Substation East",
      modelVersion: "v1.0.0-RELEASE",
      status: "Offline",
      lastHeartbeat: undefined,
      totalEvents: 0,
      totalThreats: 0,
      totalBlocked: 0,
      ipAddress: "172.16.88.5"
    }
  ];

  const fetchSensors = async () => {
    if (!isApiOnline || !token) {
      setSensors(mockSensors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/v1/sensors", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSensors(data || []);
      } else {
        throw new Error("Failed to fetch sensors");
      }
    } catch (e) {
      setSensors(mockSensors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
    // Poll every 5 seconds
    const interval = setInterval(fetchSensors, 5000);
    return () => clearInterval(interval);
  }, [isApiOnline, token]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return "bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse";
      case "stale":
        return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
      case "offline":
      default:
        return "bg-red-500/20 text-red-400 border border-red-500/30";
    }
  };

  return (
    <div className="p-8 space-y-6 flex flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-mono font-bold tracking-widest text-white uppercase">Sensor Fleet Management</h1>
          <p className="text-xs font-mono text-zinc-400">Status and Telemetry Ingestion from Inline Interceptors</p>
        </div>
        <div className="font-mono text-xs text-zinc-500">
          Nodes Active: {sensors.filter(s => s.status.toLowerCase() === "online").length} / {sensors.length}
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && sensors.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500 font-mono">Querying sensor fleet state...</div>
        ) : sensors.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-600 italic font-mono">No sensors registered on this tenant.</div>
        ) : (
          sensors.map((sensor) => (
            <div
              key={sensor.id}
              className="glass-panel p-6 rounded-xl border border-white/5 bg-zinc-950/20 flex flex-col justify-between gap-6 hover:border-cyan-glow/20 transition-all duration-300 relative overflow-hidden"
            >
              {/* Card Top / Name & Status */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="font-mono text-sm font-bold text-white tracking-wider truncate max-w-[160px]" title={sensor.name}>
                    {sensor.name}
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">Model: {sensor.modelVersion || "Unknown"}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${getStatusBadge(sensor.status)}`}>
                  {sensor.status}
                </span>
              </div>

              {/* Card Mid / Location & IP */}
              <div className="space-y-2 text-xs font-mono text-zinc-400 border-y border-white/5 py-4">
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase tracking-widest text-[9px]">Location</span>
                  <span className="text-zinc-300 text-right truncate max-w-[150px]" title={sensor.location}>
                    {sensor.location || "Unspecified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase tracking-widest text-[9px]">IP Address</span>
                  <span className="text-zinc-300 font-semibold">{sensor.ipAddress || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase tracking-widest text-[9px]">Last Heartbeat</span>
                  <span className="text-zinc-300">
                    {sensor.lastHeartbeat 
                      ? new Date(sensor.lastHeartbeat).toLocaleTimeString() 
                      : "Never"}
                  </span>
                </div>
              </div>

              {/* Card Bottom / Stats */}
              <div className="grid grid-cols-2 gap-4 text-center font-mono">
                <div className="bg-zinc-950/40 p-2.5 rounded border border-white/5 flex flex-col gap-0.5">
                  <span className="text-[8px] text-zinc-500 uppercase tracking-wider">Processed Flow</span>
                  <span className="text-sm font-bold text-white">{sensor.totalEvents.toLocaleString()}</span>
                </div>
                <div className="bg-zinc-950/40 p-2.5 rounded border border-white/5 flex flex-col gap-0.5">
                  <span className="text-[8px] text-zinc-500 uppercase tracking-wider">Threats Blocked</span>
                  <span className="text-sm font-bold text-red-400">{sensor.totalThreats.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
