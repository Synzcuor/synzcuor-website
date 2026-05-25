"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  isSimulated?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isApiOnline: boolean;
  checkApiHealth: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiOnline, setIsApiOnline] = useState(false);
  const router = useRouter();

  const checkApiHealth = async (): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:5000/health", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const online = data.status === "healthy";
        setIsApiOnline(online);
        return online;
      }
    } catch (e) {
      // Ignored, API is offline
    }
    setIsApiOnline(false);
    return false;
  };

  useEffect(() => {
    // 1. Initial check of localStorage for user and token
    const storedToken = localStorage.getItem("phantom_token");
    const storedUser = localStorage.getItem("phantom_user");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("phantom_token");
        localStorage.removeItem("phantom_user");
      }
    }

    // 2. Perform API health check
    checkApiHealth().finally(() => {
      setIsLoading(false);
    });
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Check health before login attempt
    const online = await checkApiHealth();

    if (online) {
      try {
        const response = await fetch("http://localhost:5000/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          // data structure: { token, refreshToken, expiresAt, user }
          const loggedUser: User = {
            id: data.user.id,
            email: data.user.email,
            displayName: data.user.displayName,
            role: data.user.role,
          };
          localStorage.setItem("phantom_token", data.token);
          localStorage.setItem("phantom_user", JSON.stringify(loggedUser));
          setToken(data.token);
          setUser(loggedUser);
          return { success: true };
        } else {
          const errData = await response.json().catch(() => ({}));
          // Attempt offline fallback even if API is running but returns Unauthorized (if req states fallback on credentials match)
          // Wait: "If the health check fails or login POST request fails due to API being offline..."
          // So if it returns 401/Unauthorized, it might not be due to API being offline. But to be robust, let's fall back ONLY if the network request fails or if health check is offline.
          return { success: false, error: errData.error || "Invalid credentials" };
        }
      } catch (err) {
        // Fetch failed due to network / offline
      }
    }

    // Offline fallback logic
    if (email === "admin@synzlabs.io" && password === "phantom2026!") {
      const simulatedUser: User = {
        id: "simulated-admin-id-2026",
        email: "admin@synzlabs.io",
        displayName: "Simulated Admin",
        role: "Admin",
        isSimulated: true,
      };
      const mockToken = "mock-simulated-jwt-token-2026";
      localStorage.setItem("phantom_token", mockToken);
      localStorage.setItem("phantom_user", JSON.stringify(simulatedUser));
      setToken(mockToken);
      setUser(simulatedUser);
      return { success: true };
    }

    return { success: false, error: "Invalid credentials (offline fallback mode active)" };
  };

  const logout = () => {
    localStorage.removeItem("phantom_token");
    localStorage.removeItem("phantom_user");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        isApiOnline,
        checkApiHealth,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
