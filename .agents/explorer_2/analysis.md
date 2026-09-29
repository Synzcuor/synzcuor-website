# Re-Architecting Blazor Analyst Portal to Next.js App Router (Next.js 16 & Tailwind v4)

This report details the architectural plan, directory structure, and TSX/Tailwind component specifications to migrate the existing Blazor-based Synz Phantom Analyst Portal into a modern React-based Next.js App Router application.

---

## 1. Architectural Highlights

### Next.js 16 Core Conventions
Following the Next.js 16 framework guidelines:
1. **Global Props Helpers**: Next.js 16 provides global `LayoutProps` and `PageProps` generic types (no imports required).
2. **Asynchronous Params/SearchParams**: Any dynamic params are represented as Promises (e.g. `const { id } = await props.params`). For the static pages in `/dashboard`, we will define types like `PageProps<'/dashboard'>` and `LayoutProps<'/dashboard'>`.
3. **Server vs. Client Components**: Interleaving will be used. Main route layouts and pages will be Server Components by default. The live-polling data fetches, WebSocket connections, collapsible rows, and custom SVGs will use Client Components (`"use client"`).

### Styling with Tailwind v4
The Next.js workspace runs Tailwind CSS v4, which defines variables inside the `@theme` directive in `src/app/globals.css`. We will map colors using Tailwind v4 utility classes:
* Background: `bg-background` (`#04060a`)
* Foreground/Main Text: `text-foreground` (`#f3f4f6`)
* Card/Panel BG: `bg-card-bg` (`rgba(10, 15, 26, 0.7)`)
* Accent Colors: `text-cyan-glow` (`#00f0ff`), `text-red-glow` (`#ff2a51`), `text-amber-glow` (`#ffb800`)
* Custom Animations: `animate-pulse-glow` and `animate-float`.

---

## 2. Directory Structure

The proposed structure adds the dashboard routing prefix under `/dashboard`:

```text
src/
└── app/
    ├── globals.css              # Existing Tailwind v4 configuration
    ├── layout.tsx               # Existing root layout
    ├── page.tsx                 # Existing landing page / active simulator
    └── dashboard/
        ├── layout.tsx           # Sidebar navigation shell (Server Component)
        ├── page.tsx             # Dashboard / metrics / top attacks / live feed (Client/Server Combo)
        ├── nav-menu.tsx         # Interactive sidebar link list (Client Component)
        ├── top-attacks-chart.tsx# Animated SVG graphs for top attack types (Client Component)
        ├── events/
        │   └── page.tsx         # Expandable threat events log table (Client Component)
        └── sensors/
            └── page.tsx         # Sensors fleet status grid (Client Component)
```

---

## 3. Detailed Component Implementations

### A. Sidebar Navigation Layout (`src/app/dashboard/layout.tsx`)
This defines the structural layout. It encapsulates the responsive sidebar, user profile/actions header, and content region.

```tsx
// src/app/dashboard/layout.tsx
import React from "react";
import NavMenu from "./nav-menu";

export default function DashboardLayout(props: LayoutProps<"/dashboard">) {
  return (
    <div className="flex h-screen w-full bg-[#050810] text-[#e0e0e0] overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#1a2040] bg-[#0a0e1a] flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-[#1a2040]">
          <div className="relative w-8 h-8 rounded bg-zinc-950 border border-[#00d4ff]/40 flex items-center justify-center overflow-hidden mr-2">
            <span className="font-mono text-[#00d4ff] font-bold text-base select-none">Ψ</span>
          </div>
          <h2 className="font-mono font-bold tracking-widest text-base text-[#00d4ff] text-shadow-[0_0_10px_rgba(0,212,255,0.2)]">
            SYNZ PHANTOM
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <NavMenu />
        </div>

        <div className="p-4 border-t border-[#1a2040] text-xs text-zinc-500 font-mono">
          <span>v1.0.0-RELEASE</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-[#1a2040] bg-[#0a0e1a]/90 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="font-semibold text-lg text-[#00d4ff] tracking-tight">
            Analyst Console
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-zinc-400">ANALYST_PORTAL</span>
          </div>
        </header>

        {/* Dynamic Inner Routes */}
        <div className="flex-1 p-8">
          {props.children}
        </div>
      </main>
    </div>
  );
}
```

Interactive Sidebar Links (`src/app/dashboard/nav-menu.tsx`):
```tsx
// src/app/dashboard/nav-menu.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Threat Events", href: "/dashboard/events" },
  { label: "Fleet / Sensors", href: "/dashboard/sensors" },
];

export default function NavMenu() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 px-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${
              isActive
                ? "bg-[#12182b] text-[#00d4ff] border-l-2 border-[#00d4ff] bg-gradient-to-r from-[#00d4ff]/10 to-transparent"
                : "text-[#8090b0] hover:text-[#00d4ff] hover:bg-[#12182b]/50"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
```

---

### B. Dashboard Page (`src/app/dashboard/page.tsx`)
Implements the summary widgets, a real-time reactive feed table, and custom SVG animation graphs representing top attack profiles.

```tsx
// src/app/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import TopAttacksChart from "./top-attacks-chart";

interface EventStats {
  totalEvents: number;
  totalThreats: number;
  totalBlocked: number;
  byLevel: Record<string, number>;
  topSlots: Record<string, number>;
  avgInferenceLatencyMs: number;
}

interface ThreatEvent {
  id: string;
  timestamp: string;
  sourceIp: string;
  destPort: number;
  anomalyScore: number;
  threatLevel: string;
  isBlocked: boolean;
  sensorName: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<EventStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<ThreatEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Poll standard REST APIs every 5 seconds for telemetry aggregated totals
  const loadDashboardData = async () => {
    try {
      const statsRes = await fetch("http://localhost:5000/api/v1/events/stats");
      const recentRes = await fetch("http://localhost:5000/api/v1/events?pageSize=10");
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (recentRes.ok) {
        const recentData = await recentRes.json();
        setRecentEvents(recentData.items);
      }
    } catch (error) {
      console.error("Error retrieving dashboard statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* 3 Metrics Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0a0e1a]/70 border border-[#1a2040] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-[#8090b0]">Total Events (24h)</span>
          <span className="text-4xl font-bold font-mono text-[#00d4ff] mt-2 text-shadow-[0_0_15px_rgba(0,212,255,0.3)]">
            {stats ? stats.totalEvents.toLocaleString() : "---"}
          </span>
        </div>
        <div className="bg-[#0a0e1a]/70 border border-[#1a2040] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-[#8090b0]">Threats Detected</span>
          <span className="text-4xl font-bold font-mono text-[#ff8800] mt-2 text-shadow-[0_0_15px_rgba(255,136,0,0.3)]">
            {stats ? stats.totalThreats.toLocaleString() : "---"}
          </span>
        </div>
        <div className="bg-[#0a0e1a]/70 border border-[#1a2040] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-[#8090b0]">Kill-Switch Blocks</span>
          <span className="text-4xl font-bold font-mono text-[#ff0040] mt-2 text-shadow-[0_0_15px_rgba(255,0,64,0.3)]">
            {stats ? stats.totalBlocked.toLocaleString() : "---"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Threat Feed (Left Column) */}
        <div className="lg:col-span-2 bg-[#0a0e1a]/70 border border-[#1a2040] rounded-xl p-6 shadow-lg">
          <h3 className="text-base font-bold text-[#00d4ff] uppercase tracking-wider mb-4">
            Live Threat Feed
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#e0e0e0]">
              <thead>
                <tr className="border-b border-[#1a2040] text-zinc-500 font-mono text-xs uppercase">
                  <th className="pb-3 pl-2">Time</th>
                  <th className="pb-3">Source IP</th>
                  <th className="pb-3">Sensor</th>
                  <th className="pb-3">Anomaly</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2040]/40">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-zinc-500">Retrieving feed data...</td>
                  </tr>
                ) : recentEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-zinc-500 italic">No threat anomalies logged.</td>
                  </tr>
                ) : (
                  recentEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pl-2 font-mono text-zinc-400">
                        {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-3.5 font-mono text-zinc-300">
                        {evt.sourceIp}:{evt.destPort}
                      </td>
                      <td className="py-3.5 text-zinc-300">{evt.sensorName || "Unknown"}</td>
                      <td className="py-3.5 font-mono">
                        <span className={
                          evt.anomalyScore > 0.95 ? "text-[#ff0040]" :
                          evt.anomalyScore > 0.70 ? "text-[#ff8800]" :
                          evt.anomalyScore > 0.40 ? "text-[#ffcc00]" : "text-[#00d4ff]"
                        }>
                          {(evt.anomalyScore * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] uppercase font-bold border ${
                          evt.isBlocked
                            ? "bg-[#ff0040]/10 text-[#ff0040] border-[#ff0040]/30"
                            : "bg-[#ffcc00]/10 text-[#ffcc00] border-[#ffcc00]/30"
                        }`}>
                          {evt.isBlocked ? "Blocked" : "Allowed"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Attack Types with Custom Animated SVG Graphs (Right Column) */}
        <div className="bg-[#0a0e1a]/70 border border-[#1a2040] rounded-xl p-6 shadow-lg">
          <h3 className="text-base font-bold text-[#00d4ff] uppercase tracking-wider mb-6">
            Top Attack Profiles
          </h3>
          <TopAttacksChart data={stats?.topSlots} />
        </div>
      </div>
    </div>
  );
}
```

Top Attacks Animated SVG Chart (`src/app/dashboard/top-attacks-chart.tsx`):
This custom SVG component achieves dynamic SVG-driven bars which transition smoothly as telemetry numbers refresh.

```tsx
// src/app/dashboard/top-attacks-chart.tsx
"use client";

import React from "react";

interface TopAttacksProps {
  data?: Record<string, number>;
}

export default function TopAttacksChart({ data }: TopAttacksProps) {
  if (!data || Object.keys(data).length === 0) {
    return <p className="text-zinc-500 italic text-sm">Insufficient data available.</p>;
  }

  const sortedSlots = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxVal = Math.max(...sortedSlots.map(([, val]) => val), 1);

  return (
    <div className="space-y-6">
      {sortedSlots.map(([category, value]) => {
        const percentage = (value / maxVal) * 100;

        return (
          <div key={category} className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">{category}</span>
              <span className="text-[#00d4ff] font-bold">{value}</span>
            </div>
            
            {/* Custom SVG bar with glow filter and width transition */}
            <svg className="w-full h-3 overflow-visible" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id={`glow-${category}`} x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ff8800" floodOpacity="0.4" />
                </filter>
              </defs>
              {/* Background Track */}
              <rect width="100%" height="6" rx="3" fill="#1a2040" />
              {/* Animated Foreground Bar */}
              <rect
                width={`${percentage}%`}
                height="6"
                rx="3"
                fill="url(#gradient-accent)"
                filter={`url(#glow-${category})`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gradient-accent" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff8800" />
                  <stop offset="100%" stopColor="#ff0040" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        );
      })}
    </div>
  );
}
```

---

### C. Threat Events Log with Telemetry Diagnostics (`src/app/dashboard/events/page.tsx`)
Features a diagnostic events index showing metadata logs, manually refreshable via actions, with table rows that expand to display JSON-deserialized diagnostic slots, sensor specs, and sub-millisecond ONNX inferences.

```tsx
// src/app/dashboard/events/page.tsx
"use client";

import React, { useState, useEffect } from "react";

interface ThreatEvent {
  id: string;
  timestamp: string;
  sourceIp: string;
  destPort: number;
  anomalyScore: number;
  threatLevel: string;
  activeSlots: string[];
  isBlocked: boolean;
  inferenceLatencyMs: number;
  sensorName: string;
  sensorId: string;
}

export default function EventsLogPage() {
  const [events, setEvents] = useState<ThreatEvent[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/events?pageSize=50");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.items);
      }
    } catch (error) {
      console.error("Error retrieving threat events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight text-[#00d4ff]">Threat Events Log</h2>
        <button 
          onClick={fetchEvents}
          className="px-4 py-2 bg-gradient-to-r from-[#00d4ff] to-[#0088ff] text-black font-semibold text-xs font-mono uppercase tracking-wider rounded hover:opacity-90 transition-all shadow-[0_0_15px_rgba(0,212,255,0.2)]"
        >
          Refresh Feed
        </button>
      </div>

      <div className="bg-[#0a0e1a]/70 border border-[#1a2040] rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-sm text-[#e0e0e0]">
          <thead>
            <tr className="border-b border-[#1a2040] text-zinc-500 font-mono text-xs uppercase bg-[#0d1326]">
              <th className="py-4 px-6">Timestamp</th>
              <th className="py-4 px-6">Source IP</th>
              <th className="py-4 px-6">Target Port</th>
              <th className="py-4 px-6">Threat Level</th>
              <th className="py-4 px-6">Anomaly Score</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a2040]/40">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-500">Querying database event logs...</td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-500 italic">No telemetry logged in database.</td>
              </tr>
            ) : (
              events.map((evt) => {
                const isExpanded = expandedId === evt.id;
                return (
                  <React.Fragment key={evt.id}>
                    <tr className="hover:bg-white/[0.01] transition-colors border-b border-[#1a2040]/20">
                      <td className="py-4 px-6 font-mono text-zinc-400">
                        {new Date(evt.timestamp).toISOString().replace("T", " ").substring(0, 19)}
                      </td>
                      <td className="py-4 px-6 font-mono text-zinc-300">{evt.sourceIp}</td>
                      <td className="py-4 px-6 font-mono text-zinc-300">{evt.destPort}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                          evt.threatLevel === "Critical" ? "bg-[#ff0040]/15 text-[#ff0040] border-[#ff0040]/30" :
                          evt.threatLevel === "High" ? "bg-[#ff8800]/15 text-[#ff8800] border-[#ff8800]/30" :
                          evt.threatLevel === "Medium" ? "bg-[#ffcc00]/15 text-[#ffcc00] border-[#ffcc00]/30" :
                          "bg-[#00d4ff]/15 text-[#00d4ff] border-[#00d4ff]/30"
                        }`}>
                          {evt.threatLevel}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-[#00d4ff]">
                        {(evt.anomalyScore * 100).toFixed(1)}%
                      </td>
                      <td className="py-4 px-6 font-mono">
                        {evt.isBlocked ? "Blocked" : "Allowed"}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => toggleExpand(evt.id)}
                          className="px-3 py-1.5 border border-[#1a2040] hover:border-[#00d4ff] text-xs font-semibold rounded bg-[#12182b]/40 text-[#e0e0e0] hover:text-[#00d4ff] transition-all"
                        >
                          {isExpanded ? "Hide Details" : "Diagnostics"}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Collapsible Telemetry Row */}
                    {isExpanded && (
                      <tr className="bg-[#00d4ff]/[0.02] border-l-2 border-[#00d4ff]">
                        <td colSpan={7} className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                              <h4 className="text-xs uppercase tracking-widest text-[#8090b0] font-bold">Active Diagnostics</h4>
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {evt.activeSlots && evt.activeSlots.length > 0 ? (
                                  evt.activeSlots.map((slot) => (
                                    <span key={slot} className="px-2 py-0.5 bg-[#ff8800]/15 text-[#ff8800] border border-[#ff8800]/30 rounded text-xs font-mono">
                                      {slot}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-zinc-500 italic">No malicious vectors tagged.</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <h4 className="text-xs uppercase tracking-widest text-[#8090b0] font-bold">Detection Interceptor</h4>
                              <p className="text-sm font-semibold text-zinc-200 mt-1">{evt.sensorName || "Standalone"}</p>
                              <p className="text-[10px] font-mono text-zinc-500">{evt.sensorId || "N/A"}</p>
                            </div>
                            
                            <div className="space-y-1">
                              <h4 className="text-xs uppercase tracking-widest text-[#8090b0] font-bold">Inference Latency</h4>
                              <p className="text-xl font-bold font-mono text-[#00d4ff] mt-1">
                                {evt.inferenceLatencyMs.toFixed(2)} <span className="text-xs text-[#8090b0]">ms</span>
                              </p>
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
  );
}
```

---

### D. Sensors Fleet Status Grid (`src/app/dashboard/sensors/page.tsx`)
A display showing sensor fleet deployment metrics, locations, online/offline status banners, and live packet capture frequencies.

```tsx
// src/app/dashboard/sensors/page.tsx
"use client";

import React, { useState, useEffect } from "react";

interface Sensor {
  id: string;
  name: string;
  location: string | null;
  modelVersion: string | null;
  status: string;
  lastHeartbeat: string | null;
  totalEvents: number;
  totalThreats: number;
  totalBlocked: number;
  ipAddress: string | null;
}

export default function SensorsFleetPage() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSensors = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/sensors");
      if (res.ok) {
        const data = await res.json();
        setSensors(data);
      }
    } catch (error) {
      console.error("Error retrieving sensor fleet:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight text-[#00d4ff]">Sensor Fleet Management</h2>
        <button 
          className="px-4 py-2 bg-gradient-to-r from-[#00d4ff] to-[#0088ff] text-black font-semibold text-xs font-mono uppercase tracking-wider rounded hover:opacity-90 transition-all shadow-[0_0_15px_rgba(0,212,255,0.2)]"
        >
          Enroll Interceptor
        </button>
      </div>

      {loading ? (
        <p className="text-zinc-500 italic text-sm">Loading fleet nodes...</p>
      ) : sensors.length === 0 ? (
        <div className="bg-[#0a0e1a]/70 border border-[#1a2040] rounded-xl p-12 text-center">
          <h3 className="text-lg font-bold text-zinc-400">No sensors registered</h3>
          <p className="text-zinc-500 text-sm mt-2">Enroll your first edge bump-in-the-wire interceptor to capture telemetry flows.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensors.map((sensor) => (
            <div 
              key={sensor.id} 
              className="bg-[#0a0e1a]/70 border border-[#1a2040] hover:border-[#00d4ff]/30 rounded-xl p-6 shadow-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white tracking-wide">{sensor.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded font-mono text-[9px] uppercase font-bold border ${
                    sensor.status === "Online"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : sensor.status === "Stale"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      : "bg-[#ff0040]/10 text-[#ff0040] border-[#ff0040]/30"
                  }`}>
                    {sensor.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#8090b0]">Deploy Location</span>
                  <div className="text-sm text-zinc-200">{sensor.location || "Unspecified Operations Unit"}</div>
                </div>

                {/* Local Stats Box */}
                <div className="grid grid-cols-2 gap-4 p-3 bg-black/40 rounded-lg border border-[#1a2040]/40 font-mono">
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase">Processed</span>
                    <div className="text-sm font-bold text-zinc-200 mt-0.5">{sensor.totalEvents.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase">Threats</span>
                    <div className="text-sm font-bold text-[#ff8800] mt-0.5">{sensor.totalThreats.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="mt-6 pt-4 border-t border-[#1a2040]/60 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                <span>IP: {sensor.ipAddress || "Unknown"}</span>
                <span>
                  Ping: {sensor.lastHeartbeat 
                    ? new Date(sensor.lastHeartbeat).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) 
                    : "Never"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 4. Live Updates and API Integration Strategy

Next.js handles both SSR and CSR beautifully. We suggest setting up a common API routing utility to clean up direct hardcoded fetches.

1. **Base Configuration**: Use a `.env.local` to direct REST queries and WS connections:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_WS_URL=ws://localhost:5000/ws
   ```
2. **WebSocket Synchronization**:
   We can also build a context provider `SocketProvider` wrapping `/dashboard` to capture live `/ws` broadcasts and dispatch React events or trigger updates to the components.
   When a WebSocket broadcast receives:
   ```json
   {
     "benign_traffic": 120,
     "anomaly_score": 97.2,
     "diagnostic_grid": [true, false, ...],
     "defense_mode": "Hardware"
   }
   ```
   The dashboard UI can overlay live animated pulses on cards, update the anomaly gauge, or append an alert directly to a real-time monitor.
