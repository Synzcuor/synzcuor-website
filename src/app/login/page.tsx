"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, isAuthenticated, isApiOnline, checkApiHealth, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // Periodically check api health or just once on mount
  useEffect(() => {
    checkApiHealth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#04060a] text-zinc-100 flex flex-col items-center justify-center p-6 antialiased">
      {/* Background grid */}
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0" />
      <div className="absolute top-1/4 w-[400px] h-[200px] bg-cyan-glow/5 rounded-full filter blur-[100px] pointer-events-none z-0" />

      {/* Main glass panel container */}
      <div className="relative w-full max-w-md bg-zinc-950/40 backdrop-blur-md rounded-2xl border border-white/10 p-8 glow-cyan z-10 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="relative w-12 h-12 rounded-xl bg-zinc-950 border border-cyan-glow/40 flex items-center justify-center overflow-hidden mb-2">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-dim/40 to-cyan-glow/10" />
            <span className="font-mono text-cyan-glow font-bold text-xl select-none">Ψ</span>
          </div>
          <h1 className="text-xl font-mono font-bold tracking-widest text-white">SYNZ PHANTOM</h1>
          <p className="text-xs font-mono text-zinc-400">B2B Zero-Day Cyber Defense Portal</p>
        </div>

        {/* Backend status banner */}
        <div className={`p-3 rounded-lg border font-mono text-xs text-center flex items-center justify-center gap-2 ${
          isApiOnline 
            ? "bg-green-500/10 border-green-500/30 text-green-400" 
            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
        }`}>
          <span className={`w-2 h-2 rounded-full ${isApiOnline ? "bg-green-500 animate-pulse" : "bg-amber-500 animate-pulse"}`} />
          <span>API Backend: {isApiOnline ? "ONLINE" : "OFFLINE (Simulated Mode Active)"}</span>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-glow/40 rounded text-red-glow font-mono text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 rounded bg-zinc-950 border border-white/10 text-white font-mono text-sm focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow outline-none transition-all"
              placeholder="admin@synzlabs.io"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 rounded bg-zinc-950 border border-white/10 text-white font-mono text-sm focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 mt-2 rounded bg-gradient-to-r from-cyan-dim to-cyan-glow text-black font-mono font-bold uppercase tracking-wider text-xs transition-opacity hover:opacity-90 shadow-[0_0_15px_rgba(0,240,255,0.2)] disabled:opacity-50"
          >
            {isSubmitting ? "Authenticating..." : "Establish Connection"}
          </button>
        </form>

        <div className="border-t border-white/5 pt-4 text-center">
          <p className="text-[10px] font-mono text-zinc-500">
            For offline mode, use credentials:<br />
            <span className="text-zinc-400">admin@synzlabs.io</span> / <span className="text-zinc-400">phantom2026!</span>
          </p>
        </div>
      </div>
    </div>
  );
}
