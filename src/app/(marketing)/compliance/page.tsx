import React from "react";

export default function CompliancePage() {
  const certifications = [
    {
      title: "SOC 2 Type II",
      status: "Certified",
      description: "Synz Labs maintains comprehensive SOC 2 Type II audit reports. Our organizational and hardware processes are reviewed annually to verify that all data ingestion, simulated firmware logs, and telemetry operations satisfy trust security principles.",
    },
    {
      title: "NERC CIP",
      status: "Compliant",
      description: "For critical electric infrastructure networks, our edge interceptor devices align with strict North American Electric Reliability Corporation (NERC) Critical Infrastructure Protection standards. This includes active physical isolation, secure dynamic AES key loading, and audit event logs.",
    },
    {
      title: "IEC 62443",
      status: "OT Security Standard",
      description: "Designed specifically for industrial control systems, Synz Phantom provides drop-in compliance alignment with IEC 62443 parameters. We secure networks at the components and systems levels without requesting logic changes from legacy controllers.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 font-sans">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
        <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Trust & Compliance</span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Enterprise Security Standards
        </h1>
        <p className="text-lg text-slate-500">
          Our products are built to comply with strict operational safety regulations and data privacy frameworks governing global energy and manufacturing networks.
        </p>
      </div>

      {/* Certifications cards list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {certifications.map((cert) => (
          <div key={cert.title} className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-semibold rounded">
                {cert.status}
              </span>
              <h2 className="text-2xl font-bold text-slate-900 font-sans">{cert.title}</h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">{cert.description}</p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Audited</span>
              <span className="text-blue-600 font-bold">✓</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
