"use client";

import React from "react";

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 font-sans">
      <div className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-violet-600 uppercase">Threat Intelligence</span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Threat Research Blog
          </h1>
          <p className="text-sm text-slate-500">
            Technical bulletins and security research advisories from Synzcuor.
          </p>
        </div>

        {/* Empty State / Coming Soon */}
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center mx-auto text-xl font-mono">
            📝
          </div>
          <h3 className="text-xl font-bold text-slate-900">Research Publishing Stealth Mode</h3>
          <p className="text-slate-600 text-sm leading-relaxed max-w-lg mx-auto">
            Our Threat Research Blog is launching soon. We are currently finalizing our local Content Disarm & Reconstruction (CDR) performance benchmarks and zero-day threat analysis reports.
          </p>
          <p className="text-slate-500 text-xs leading-relaxed max-w-md mx-auto">
            Sign up for our waitlist on the homepage to be notified when we publish our first security report.
          </p>
        </div>
      </div>
    </div>
  );
}
