"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setStatus("error");
      setMessage("System offline. Missing Supabase credentials.");
      return;
    }

    setStatus("loading");
    
    // Insert email into the 'waitlist' table
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email, created_at: new Date().toISOString() }]);

    if (error) {
      setStatus("error");
      // Basic handling for unique constraint (already registered)
      if (error.code === '23505') {
        setMessage("Email already registered in the system.");
      } else {
        setMessage("Connection failed. Try again.");
      }
    } else {
      setStatus("success");
      setMessage("Access secured. You are on the list.");
      setEmail("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === "loading" || status === "success"}
        placeholder="YOUR@COMPANY.COM" 
        className="bg-transparent border border-synz-gray px-4 py-3 text-synz-white placeholder-synz-gray/50 focus:outline-none focus:border-synz-accent font-mono uppercase text-sm transition-colors disabled:opacity-50"
        required
      />
      <button 
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="bg-synz-accent text-black font-bold uppercase tracking-widest py-3 hover:bg-synz-white transition-colors disabled:bg-synz-gray disabled:text-synz-light"
      >
        {status === "loading" ? "Uplinking..." : status === "success" ? "Authorized" : "Secure Access"}
      </button>
      
      {message && (
        <p className={`text-xs uppercase font-bold tracking-widest mt-2 ${status === "success" ? "text-green-500" : "text-synz-accent"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
