"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConsoleLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Store JWT token and refresh token in local storage
      localStorage.setItem("synz_token", data.token);
      localStorage.setItem("synz_refresh_token", data.refreshToken);
      localStorage.setItem("synz_token_expiry", data.expiresAt);
      localStorage.setItem("synz_user", JSON.stringify(data.user));

      // Redirect to operator console dashboard
      router.push("/console/dashboard");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020408] text-zinc-100 flex items-center justify-center antialiased font-sans">
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0 opacity-40" />
      <div className="absolute w-[400px] h-[400px] bg-cyan-glow/5 rounded-full filter blur-[120px] pointer-events-none z-0" />

      <div className="w-full max-w-md p-8 glass-panel rounded-2xl border border-white/10 glow-cyan relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-lg bg-zinc-950 border border-cyan-glow/40 items-center justify-center select-none mb-2">
            <span className="font-mono text-cyan-glow font-bold text-2xl">Ψ</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Operator Console Login</h2>
          <p className="text-xs text-zinc-400">Access Synz Phantom active interceptor telemetry and relays</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Email Address</label>
            <input
              type="email"
              required
              id="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 rounded bg-zinc-950 border border-white/10 text-white font-mono text-sm focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow outline-none transition-all"
              placeholder="operator@enterprise.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Console Password</label>
            <input
              type="password"
              required
              id="password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 rounded bg-zinc-950 border border-white/10 text-white font-mono text-sm focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow outline-none transition-all"
              placeholder="••••••••••••"
            />
          </div>

          {error && (
            <div id="error-message" className="p-3 bg-red-950/40 border border-red-glow/40 rounded text-red-glow font-mono text-xs text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            id="login-submit-btn"
            className="w-full h-12 rounded bg-gradient-to-r from-cyan-dim to-cyan-glow text-black font-bold uppercase tracking-wider text-xs transition-opacity hover:opacity-90 shadow-[0_0_15px_rgba(0,240,255,0.2)] disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Connect to Console"}
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-xs text-zinc-500 hover:text-cyan-glow transition-colors font-mono">
            ← Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
