"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#04060a] text-zinc-100 flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border border-cyan-glow border-t-transparent animate-spin" />
          <p className="text-xs uppercase tracking-widest text-zinc-500 animate-pulse">Authenticating Secure Session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
