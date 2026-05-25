# Synz Phantom Active Defense — CORS & Auth Architecture Analysis

## Executive Summary
This report details the implementation plan for integrating a secure CORS policy on the `SynzPhantom.API` C# backend and constructing the authentication architecture in the Next.js frontend (`SYNLabWebsite`). It provides configurations, code structures, and details the specific Next.js conventions required for this project environment.

---

## Part 1: CORS Policies Integration in `SynzPhantom.API`

### 1.1 The CORS Credentials Constraint
Currently, `Program.cs` registers a wide-open default CORS policy:
```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});
```
While this works for anonymous requests, it is incompatible with secure authentication flows that transmit credentials. The CORS specification states that **when credentials are allowed (`Access-Control-Allow-Credentials: true`), the allowed origin cannot be wildcarded (`Access-Control-Allow-Origin: *`)**. 

To allow the Next.js app (running at `http://localhost:3000`) to send cookies or Authorization headers with JWT credentials without triggering browser-side CORS blocks, we must:
1. Remove `.AllowAnyOrigin()`.
2. Explicitly specify the origin using `.WithOrigins("http://localhost:3000")` (or a dynamically configured list of origins).
3. Call `.AllowCredentials()`.

### 1.2 Proposed C# Implementation

#### Step 1: Update `PhantomConfig.cs`
Add a configuration property to support environment-driven or settings-file CORS origins, falling back to `http://localhost:3000`.
*File: `phantom_console/SynzPhantom.Core/Config/PhantomConfig.cs`*
```csharp
// Add under the B2B API Connection section (around line 42)
/// <summary>Comma-separated list of allowed CORS origins.</summary>
public string AllowedCorsOrigins { get; set; } = "http://localhost:3000";
```

#### Step 2: Update CORS Registration in `Program.cs`
Modify the CORS services registration to read the configured origins, split them, and configure credentials support.
*File: `phantom_console/SynzPhantom.API/Program.cs`*
```csharp
// Replace lines 111-116 with:
// CORS Policies
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        var origins = config.AllowedCorsOrigins?
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            ?? new[] { "http://localhost:3000" };

        policy.WithOrigins(origins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
```
*Note: Make sure that `app.UseCors();` remains placed in the middleware pipeline (line 151) prior to any custom authorization middlewares (`ApiKeyAuthMiddleware`).*

---

## Part 2: Next.js Authentication Architecture

The authentication system for the Next.js interface must satisfy:
1. **JWT Storage**: Session persistence with consideration for browser-based security vectors.
2. **Auth Context / Hook**: Global react state providing user context and authentication actions.
3. **API Connection Detection & Fallback**: Intelligent detection of C# backend availability, falling back to simulated credentials (`admin@synzlabs.io` / `phantom2026!`) if offline.
4. **Theme Alignment**: Cyberpunk glassmorphism aesthetics consistent with the landing page.
5. **Route Guards**: Protection of routes and components.

### 2.1 JWT Token Storage Design

We propose a dual-layer approach for token handling:
1. **Client-Side Direct Storage (Recommended for immediate deployment)**:
   - Store the JWT and refresh token in `localStorage`. 
   - Add the JWT to the HTTP request headers (`Authorization: Bearer <token>`) for all REST calls.
   - *Security Note*: While simple to implement, `localStorage` is vulnerable to Cross-Site Scripting (XSS). If a malicious script runs, it can read the token. To mitigate this, standard CSRF protections and strict Content Security Policies (CSPs) should be enabled.
2. **Backend-For-Frontend (BFF) Pattern (Recommended for production hardening)**:
   - Introduce Next.js Route Handlers (`src/app/api/auth/login/route.ts`) to handle authentication.
   - When a user logs in, the Next.js route handler forwards the request to the C# API, receives the tokens, and sets a secure `HttpOnly`, `SameSite=Strict`, `Secure` cookie.
   - Client-side JS never sees the token, neutralizing XSS data theft.

Below, we detail the implementation architecture supporting both client-side token management and local simulation.

### 2.2 Auth Context & Hook Design
The auth context handles connection testing, requests to the backend, fallback verification, and state tracking.

*Proposed File: `src/context/AuthContext.tsx`*
```tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  tenant?: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSimulated: boolean; // Indicates if we are logged in using offline simulated fallback
  apiOnline: boolean;   // Real-time backend API connection status
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkApiHealth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = "http://localhost:5000"; // Adjust to backend host/port
const FALLBACK_EMAIL = "admin@synzlabs.io";
const FALLBACK_PASS = "phantom2026!";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const [apiOnline, setApiOnline] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Perform backend health check
  const checkApiHealth = async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/health`, { 
        method: "GET",
        signal: AbortSignal.timeout(2000) // 2s timeout
      });
      const online = res.ok;
      setApiOnline(online);
      return online;
    } catch {
      setApiOnline(false);
      return false;
    }
  };

  // Re-hydrate session on boot
  useEffect(() => {
    async function initializeAuth() {
      const storedToken = localStorage.getItem("phantom_token");
      const storedUser = localStorage.getItem("phantom_user");
      const storedSim = localStorage.getItem("phantom_simulated") === "true";

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsSimulated(storedSim);
      }
      
      // Test the API health in the background
      await checkApiHealth();
      setIsLoading(false);
    }
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Check if C# API is reachable
    const isOnline = await checkApiHealth();

    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Invalid email or password");
        }

        const data = await response.json();
        
        // Save live session
        localStorage.setItem("phantom_token", data.token);
        localStorage.setItem("phantom_user", JSON.stringify(data.user));
        localStorage.setItem("phantom_simulated", "false");
        
        setToken(data.token);
        setUser(data.user);
        setIsSimulated(false);
        setApiOnline(true);
        
        router.push("/");
      } catch (err: any) {
        setIsLoading(false);
        throw err;
      }
    } else {
      // Backend is OFFLINE: check local simulated fallback credentials
      if (email === FALLBACK_EMAIL && password === FALLBACK_PASS) {
        // Create mock credentials matching seed data
        const mockUser: User = {
          id: "00000000-0000-0000-0000-000000000000",
          email: FALLBACK_EMAIL,
          displayName: "Admin (Offline Fallback)",
          role: "Admin",
          tenant: {
            id: "00000000-0000-0000-0000-000000000000",
            name: "Synz Labs (Simulated)",
            slug: "synz-labs",
            isActive: true
          }
        };
        const mockToken = "mock-simulated-jwt-token-2026";
        
        localStorage.setItem("phantom_token", mockToken);
        localStorage.setItem("phantom_user", JSON.stringify(mockUser));
        localStorage.setItem("phantom_simulated", "true");
        
        setToken(mockToken);
        setUser(mockUser);
        setIsSimulated(true);
        setApiOnline(false);
        
        router.push("/");
      } else {
        setIsLoading(false);
        throw new Error("Invalid credentials (API is offline; fallback accounts only).");
      }
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("phantom_token");
    localStorage.removeItem("phantom_user");
    localStorage.removeItem("phantom_simulated");
    
    setToken(null);
    setUser(null);
    setIsSimulated(false);
    
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, isSimulated, apiOnline, login, logout, checkApiHealth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
```

### 2.3 Login Screen Design (`src/app/login/page.tsx`)
A Cyberpunk glassmorphic login panel styled similarly to the telemetry interceptor component in `app/page.tsx`.

*Proposed File: `src/app/login/page.tsx`*
```tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, checkApiHealth, apiOnline } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Poll API health on login screen mount
  useEffect(() => {
    checkApiHealth();
    const interval = setInterval(checkApiHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#04060a] text-zinc-100 flex items-center justify-center antialiased px-4">
      {/* Grid Overlay */}
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0" />
      <div className="absolute w-[500px] h-[250px] bg-cyan-glow/5 rounded-full filter blur-[100px] pointer-events-none z-0" />

      <div className="relative w-full max-w-md glass-panel rounded-2xl p-8 border border-white/10 glow-cyan z-10 flex flex-col gap-6">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="relative w-12 h-12 rounded-lg bg-zinc-950 border border-cyan-glow/40 flex items-center justify-center">
            <span className="font-mono text-cyan-glow font-bold text-2xl select-none">Ψ</span>
          </div>
          <h1 className="font-mono font-bold tracking-widest text-lg text-white">SYNZ LABS</h1>
          <p className="text-xs font-mono text-zinc-500 uppercase">Phantom Console Access</p>
        </div>

        {/* API Health Banner */}
        <div className={`p-2.5 rounded border text-center font-mono text-[10px] tracking-wide uppercase ${
          apiOnline 
            ? "bg-green-500/10 border-green-500/30 text-green-400"
            : "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse"
        }`}>
          {apiOnline 
            ? "● Backend API Online" 
            : "▲ Backend Offline — Simulated Fallback Mode Enabled"}
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Security Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 rounded bg-zinc-950 border border-white/10 text-white font-mono text-sm focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow outline-none transition-all"
              placeholder="e.g. admin@synzlabs.io"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Credentials Key</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 rounded bg-zinc-950 border border-white/10 text-white font-mono text-sm focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow outline-none transition-all"
              placeholder="••••••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-glow/40 rounded text-red-glow font-mono text-xs text-center leading-relaxed">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded bg-gradient-to-r from-cyan-dim to-cyan-glow text-black font-bold uppercase tracking-wider text-xs transition-opacity hover:opacity-90 shadow-[0_0_15px_rgba(0,240,255,0.2)] disabled:opacity-50"
          >
            {isSubmitting ? "Decrypting Session..." : "Authorize Terminal"}
          </button>
        </form>

        {/* Fallback Hints */}
        {!apiOnline && (
          <div className="border-t border-white/5 pt-4 text-center font-mono text-[9px] text-zinc-500 leading-relaxed">
            API connection failed. Use local mock credentials:<br />
            <span className="text-cyan-dim font-bold">admin@synzlabs.io</span> / <span className="text-cyan-dim font-bold">phantom2026!</span>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 2.4 Auth Guards & Route Interception
To secure page layouts and prevent unauthenticated page loads, we use a client-side wrapper component.

*Proposed File: `src/components/ProtectedRoute.tsx`*
```tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#04060a] flex items-center justify-center font-mono text-cyan-glow text-xs uppercase tracking-widest">
        <span className="animate-pulse">Loading Security Context...</span>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};
```

---

## Part 3: Important Next.js Version Conventions

### 🔒 Core Constraint: Next.js `proxy.ts` Convention (Breaking Change)
According to the local project documentation in `node_modules/next/dist/docs/`, **this customized version of Next.js does not support standard middleware (`middleware.ts`)**. 
Instead, it uses a unique **`proxy.ts`** or **`proxy.js`** file at the root level of the project.

Key parameters of the `proxy.ts` implementation:
1. **Single File**: Only one `proxy` file is permitted per workspace.
2. **Matcher Config**: An exported config defines the matched paths.
3. **Execution**: The `proxy(request: Request)` function executes before matching page files. It can return redirects or custom `Response`/`NextResponse` payloads.

#### Proposed Auth Integration via `proxy.ts`
If JWT tokens are saved to client-side readable cookies (e.g. during authentication), you can intercept routes on the server side using the custom proxy file:

*Proposed File: `proxy.ts`*
```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  // Intercept the root route and dashboard paths
  matcher: ['/', '/dashboard/:path*'],
};

export function proxy(request: NextRequest) {
  // Retrieve the session token from cookies
  const token = request.cookies.get('phantom_token')?.value;

  // If no token exists and requesting a protected path, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
```
*Note: If `localStorage` is selected as the primary token container, server-side interception via `proxy.ts` cannot read the token, and the client-side `ProtectedRoute.tsx` wrapper must be used instead.*

---

## Summary of Action Plan

| Component | Target File | Proposed Change / Content |
|---|---|---|
| C# Core | `PhantomConfig.cs` | Add `AllowedCorsOrigins` string parameter. |
| C# API | `Program.cs` | Retrieve allowed origins, call `.WithOrigins().AllowCredentials().AllowAnyMethod().AllowAnyHeader()` instead of `.AllowAnyOrigin()`. |
| Next.js App | `src/app/layout.tsx` | Wrap children inside `<AuthProvider>` and conditionally apply `<ProtectedRoute>`. |
| Next.js Context | `src/context/AuthContext.tsx` | Implement `AuthProvider` with API connection check and simulated fallback logic. |
| Next.js Login | `src/app/login/page.tsx` | Create cyberpunk login form with live health indicators. |
| Next.js Guards | `src/components/ProtectedRoute.tsx` | Create component-level client guard. |
| Next.js Edge | `proxy.ts` | Server-side routing interceptor using project's `proxy` convention (if cookies are chosen). |
