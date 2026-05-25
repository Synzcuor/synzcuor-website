"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const links = [
    { name: "Threat Console", href: "/dashboard", icon: "📊" },
    { name: "Event Log", href: "/dashboard/events", icon: "🛡️" },
    { name: "Sensor Fleet", href: "/dashboard/sensors", icon: "🌐" },
  ];

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-[#04060a] text-zinc-100 font-sans overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-zinc-950/80 border-r border-white/5 flex flex-col justify-between backdrop-blur-sm">
          {/* Logo and Navigation */}
          <div className="flex flex-col gap-8 p-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-lg bg-zinc-950 border border-cyan-glow/40 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-dim/40 to-cyan-glow/10" />
                <span className="font-mono text-cyan-glow font-bold text-base select-none">Ψ</span>
              </div>
              <span className="font-mono font-bold tracking-widest text-sm text-white">SYNZ PHANTOM</span>
            </div>

            {/* Navigation links */}
            <nav className="flex flex-col gap-2">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-all ${
                      isActive
                        ? "bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow shadow-[0_0_15px_rgba(0,240,255,0.05)] font-semibold"
                        : "border border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                    }`}
                  >
                    <span>{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-white/5 flex flex-col gap-4 bg-zinc-950/40">
            {user && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate max-w-[140px]">
                    {user.displayName}
                  </span>
                  {user.isSimulated && (
                    <span className="text-[8px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1 py-0.5 rounded">
                      SIMULATED
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-zinc-500 truncate">
                  {user.email}
                </span>
                <span className="text-[9px] font-mono text-cyan-dim uppercase tracking-widest">
                  Role: {user.role}
                </span>
              </div>
            )}
            <button
              onClick={logout}
              className="w-full py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-glow/20 hover:border-red-glow/40 text-red-glow rounded font-mono text-xs uppercase tracking-wider transition-all"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Cyberpunk grid background in main panel */}
          <div className="absolute inset-0 cyber-grid pointer-events-none z-0 opacity-40" />
          <div className="relative flex-1 overflow-y-auto z-10">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
