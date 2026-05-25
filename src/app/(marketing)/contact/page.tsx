"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [leadForm, setLeadForm] = useState({ name: "", email: "", company: "", role: "ciso" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [emailLiveError, setEmailLiveError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const publicDomains = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", 
    "aol.com", "mail.ru", "icloud.com", "protonmail.com", "zoho.com"
  ];

  const handleEmailChange = (val: string) => {
    setLeadForm(prev => ({ ...prev, email: val }));
    setFormError(null);

    if (!val) {
      setEmailLiveError(null);
      return;
    }

    const emailParts = val.split("@");
    if (emailParts.length !== 2) {
      setEmailLiveError("Invalid email format");
      return;
    }

    const domain = emailParts[1].toLowerCase().trim();
    if (publicDomains.includes(domain)) {
      setEmailLiveError("Please use a corporate email address (public domains are not allowed)");
    } else {
      setEmailLiveError(null);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const emailParts = leadForm.email.split("@");
    if (emailParts.length !== 2) {
      setFormError("Invalid email format");
      return;
    }
    const domain = emailParts[1].toLowerCase().trim();
    if (publicDomains.includes(domain)) {
      setFormError("Please use a corporate email address (public domains are not allowed)");
      return;
    }

    if (leadForm.name && leadForm.email && leadForm.company) {
      localStorage.setItem("leadCapture", JSON.stringify(leadForm));
      console.log("Lead payload captured successfully:", leadForm);
      setFormSubmitted(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 font-sans">
      <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-2xl shadow-sm">
        {formSubmitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 mx-auto flex items-center justify-center text-green-600 font-bold text-2xl">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Pilot Application Received</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
              Thank you. We have recorded your submission. An integration engineer from Synz Labs will contact your operations team within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-3xl font-extrabold text-slate-900">Request a Passive Monitor Audit</h1>
              <p className="text-sm text-slate-500">
                Deploy Synz Phantom inline without operational risk. Map SCADA device communication and verify detection accuracy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</label>
                <input 
                  type="text" 
                  required
                  id="form-name"
                  value={leadForm.name}
                  onChange={e => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-slate-800 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all" 
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Corporate Email</label>
                <input 
                  type="email" 
                  required
                  id="form-email"
                  value={leadForm.email}
                  onChange={e => handleEmailChange(e.target.value)}
                  className={`w-full h-11 px-4 rounded-lg bg-white border text-slate-800 text-sm focus:ring-1 outline-none transition-all ${
                    emailLiveError 
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500" 
                      : "border-slate-200 focus:border-blue-600 focus:ring-blue-600"
                  }`} 
                  placeholder="j.doe@enterprise.com"
                />
                {emailLiveError && (
                  <p className="text-[10px] text-red-600 font-semibold">{emailLiveError}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Company Name</label>
                <input 
                  type="text" 
                  required
                  id="form-company"
                  value={leadForm.company}
                  onChange={e => setLeadForm(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-slate-800 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all" 
                  placeholder="Synz Manufacturing Corp"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Organizational Role</label>
                <select 
                  id="form-role"
                  value={leadForm.role}
                  onChange={e => setLeadForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full h-11 px-4 rounded-lg bg-white border border-slate-200 text-slate-800 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                >
                  <option value="ciso">CISO / Security Director</option>
                  <option value="plant_mgr">VP Operations / Plant Manager</option>
                  <option value="ot_eng">OT Infrastructure Engineer</option>
                  <option value="other">Other Operations Staff</option>
                </select>
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs text-center font-semibold">
                {formError}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider text-xs shadow-sm transition-all"
            >
              Submit Audit Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
