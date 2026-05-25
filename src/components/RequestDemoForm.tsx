"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RequestDemoForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companySize: "",
    legacyICS: "no"
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      setStatus("error");
      setMessage("System offline. Missing API configuration.");
      return;
    }

    setStatus("loading");
    
    const { error } = await supabase
      .from('leads')
      .insert([{ ...formData, created_at: new Date().toISOString() }]);

    if (error) {
      setStatus("error");
      setMessage("Connection failed. Try again.");
    } else {
      setStatus("success");
      setMessage("Request received. Our engineering team will contact you shortly.");
      setFormData({ name: "", email: "", companySize: "", legacyICS: "no" });
    }
  };

  return (
    <section id="request-demo" className="py-32 bg-white border-t border-gray-200">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black mb-4">
            Request Demo
          </h2>
          <p className="text-xl text-gray-700">
            Deploy our software monitor in under a minute. <br className="hidden md:block"/> See what your legacy firewall is missing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-50 p-8 border border-gray-200 shadow-xl flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-black uppercase tracking-widest">Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                disabled={status === "loading" || status === "success"}
                className="bg-white border border-gray-300 px-4 py-3 text-black focus:outline-none focus:border-synz-accent transition-colors disabled:opacity-50"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-black uppercase tracking-widest">Work Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={status === "loading" || status === "success"}
                className="bg-white border border-gray-300 px-4 py-3 text-black focus:outline-none focus:border-synz-accent transition-colors disabled:opacity-50"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-black uppercase tracking-widest">Company Size</label>
            <select 
              value={formData.companySize}
              onChange={(e) => setFormData({...formData, companySize: e.target.value})}
              disabled={status === "loading" || status === "success"}
              className="bg-white border border-gray-300 px-4 py-3 text-black focus:outline-none focus:border-synz-accent transition-colors disabled:opacity-50 appearance-none"
              required
            >
              <option value="" disabled>Select size...</option>
              <option value="1-50">1-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-1000">201-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-black uppercase tracking-widest">Are you running legacy ICS/SCADA?</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="legacyICS" 
                  value="yes"
                  checked={formData.legacyICS === "yes"}
                  onChange={(e) => setFormData({...formData, legacyICS: e.target.value})}
                  className="accent-synz-accent"
                />
                <span className="text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="legacyICS" 
                  value="no"
                  checked={formData.legacyICS === "no"}
                  onChange={(e) => setFormData({...formData, legacyICS: e.target.value})}
                  className="accent-synz-accent"
                />
                <span className="text-gray-700">No</span>
              </label>
            </div>
          </div>

          <button 
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="mt-4 bg-synz-accent text-synz-black font-bold uppercase tracking-widest py-4 hover:bg-synz-accent-hover transition-colors disabled:bg-synz-gray disabled:text-synz-light"
          >
            {status === "loading" ? "Submitting..." : status === "success" ? "Received" : "Request Access"}
          </button>
          
          {message && (
            <p className={`text-sm text-center font-bold tracking-widest mt-2 ${status === "success" ? "text-synz-accent" : "text-red-500"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
