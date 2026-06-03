import React from "react";

export default function CompliancePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 font-sans">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
        <span className="text-xs font-mono font-bold tracking-widest text-violet-600 uppercase">Trust & Compliance</span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Security & Privacy Standards
        </h1>
        <p className="text-lg text-slate-500">
          Our products are built with local-first operational safety, data privacy, and compliance principles in mind.
        </p>
      </div>

      {/* Compliance Status Callout */}
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm space-y-6 text-center">
        <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center mx-auto text-xl font-mono">
          🛡️
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Compliance & Certifications Progress</h2>
        
        <div className="text-sm text-slate-600 leading-relaxed text-left space-y-4 max-w-xl mx-auto">
          <p>
            <strong>Stealth Operations:</strong> Synzcuor is currently operating in pre-launch mode. We are actively designing our consumer infrastructure and endpoint agents to align with strict security and privacy standards (including SOC 2, NERC CIP, and IEC 62443 parameters).
          </p>
          <p>
            <strong>Local-First Guarantee:</strong> Because Synz Prism runs 100% locally on your device and does not upload your documents or metadata to external servers, data sovereignty and privacy compliance are built-in by design.
          </p>
          <p>
            <strong>Audit Timeline:</strong> Formal compliance audits and third-party certifications are planned post-launch. Details and official audit reports will be published on this page as they are finalized.
          </p>
        </div>

        <div className="pt-6 border-t border-slate-100 max-w-xl mx-auto">
          <p className="text-xs text-slate-500 font-mono">
            For specific compliance questions or security inquiries, please contact our security team:
          </p>
          <div className="mt-2">
            <a 
              href="mailto:security@synzcuor.com"
              className="inline-block text-sm font-mono font-bold text-violet-600 hover:text-violet-700 underline"
            >
              security@synzcuor.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
