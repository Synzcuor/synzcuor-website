import React from "react";

export default function CareersPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 font-sans">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
        <span className="text-xs font-mono font-bold tracking-widest text-violet-600 uppercase">Careers at Synzcuor</span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Build the Future of Consumer Privacy & Security
        </h1>
        <p className="text-lg text-slate-500">
          We write ultra-fast, intelligent local software to shield everyday users from zero-day threat vectors. Absolute privacy meets high-performance engineering.
        </p>
      </div>

      {/* Philosophy Callout */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200/60 rounded-2xl p-8 md:p-12 mb-16 space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Our Core Thesis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600 leading-relaxed">
          <p>
            <strong>Local-First:</strong> We believe that cloud-based security agents compromise privacy and add latency. The future of defense is dynamic, real-time local inference. We write lightweight machine learning models to identify anomalies instantly on the endpoint.
          </p>
          <p>
            <strong>Privacy Centric:</strong> Your data should never leave your machine. Synz Prism runs 100% locally on your computer, stripping active threats and reconstructing clean files without uploading your private documents to third-party servers.
          </p>
        </div>
      </div>

      {/* Engineering Culture values */}
      <div className="space-y-8 mb-20">
        <h2 className="text-2xl font-bold text-slate-900 text-center">Our Engineering Standards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-3">
            <h3 className="font-semibold text-slate-900">Absolute Speed</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We profile every microsecond. From low-level file hooks to neural network execution, we optimize for speed to ensure zero lag for the user.
            </p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-3">
            <h3 className="font-semibold text-slate-900">100% Privacy</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We believe security must not cost you your privacy. We build systems that perform all sanitization and analytics fully offline and locally.
            </p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-3">
            <h3 className="font-semibold text-slate-900">Mastery of the Stack</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No shortcuts. We expect deep understanding of file system architectures, system-level operating system APIs, and lightweight neural runtime optimization.
            </p>
          </div>
        </div>
      </div>

      {/* Open Roles list (Stealth Mode Empty State) */}
      <div className="space-y-8 max-w-3xl mx-auto">
        <div className="border-b border-slate-200 pb-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Open Opportunities</h2>
          <p className="text-sm text-slate-500">Join our engineering group.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center mx-auto text-xl font-mono">
            🔑
          </div>
          <h3 className="text-lg font-bold text-slate-900">Stealth Operations Mode</h3>
          <p className="text-slate-600 text-sm leading-relaxed max-w-lg mx-auto">
            We are currently operating in stealth mode as we prepare for our consumer launch in 21 days. All core engineering roles are filled at this time.
          </p>
          <p className="text-slate-500 text-xs leading-relaxed max-w-md mx-auto">
            However, we are always excited to connect with exceptional C++ systems engineers, local ML optimization experts, and product-focused security designers.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="mt-20 text-center max-w-xl mx-auto p-8 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">Connect with Us</h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          If you want to build high-performance consumer security systems at the intersection of local AI and operating system internals, reach out at:
        </p>
        <div className="pt-2">
          <a 
            href="mailto:careers@synzcuor.com"
            className="inline-block text-lg font-mono font-bold text-violet-600 hover:text-violet-700 underline"
          >
            careers@synzcuor.com
          </a>
        </div>
      </div>
    </div>
  );
}
