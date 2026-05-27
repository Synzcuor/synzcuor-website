import React from "react";

export default function OverviewPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 font-sans">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
        <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Product Deep Dive</span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Active Defense Security Architecture
        </h1>
        <p className="text-lg text-slate-500">
          A physical bump-in-the-wire appliance built to inspect, verify, and sever network access under critical threats in SCADA environments.
        </p>
      </div>

      {/* Grid of detailed features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        <div className="space-y-6">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-lg">
            1
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Normally-Closed Hardware Switch</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            The core interceptor uses a solid-state relay mapped to an isolated hardware GPIO pin. Under normal operation, the relay remains closed, passing binary traffic across dual gigabit PHY layers. 
            Once a zero-day payload is classified, the hardware pin is driven HIGH to de-energize the relay and sever physical copper connection under 50µs.
          </p>
        </div>

        <div className="space-y-6">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-lg">
            2
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Ring -1 Network Detonation Block</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Operating below the target OS kernel layer (Ring -1/hypervisor/network adapter boundary), malicious traffic is processed and dropped at the network card level. 
            This prevents attack instructions from ever reaching target PLCs or assembly line CPUs.
          </p>
        </div>

        <div className="space-y-6">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-lg">
            3
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Causal sequence QGAN Factory</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Our models are trained utilizing a dual-head Quantum Generative Adversarial Network architecture to model temporal hardware behaviors. 
            By feeding both network payloads and monitored CPU performance telemetry, it builds robust representations of normal network states.
          </p>
        </div>

        <div className="space-y-6">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-lg">
            4
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Tensor Train Parameters Factorization</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            For resource-constrained embedded environments, the Critic networks are compressed by ~91% via block-tensor-train (TT-SVD) factorization. 
            This allows high-dimensional ONNX models to run entirely within the SRAM of Edge System-on-Modules (SoM).
          </p>
        </div>
      </div>

      {/* Specifications Table */}
      <div id="specs" className="space-y-6 pt-16 border-t border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 text-center">Technical Specifications Matrix</h2>
        <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm">
          <table className="w-full text-left border-collapse text-sm text-slate-500 font-sans">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-widest text-xs border-b border-slate-200">
              <tr>
                <th className="py-4 px-6 font-bold">Specification</th>
                <th className="py-4 px-6 font-bold text-blue-600">Synz Intercept (Enterprise)</th>
                <th className="py-4 px-6 font-bold text-slate-700">Synz Micro (Compact)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-900">SoM Host Platform</td>
                <td className="py-4 px-6">NVIDIA Jetson Orin Nano / ARM64</td>
                <td className="py-4 px-6">Raspberry Pi CM4 / ARM64</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-900">Ethernet PHY Layer</td>
                <td className="py-4 px-6">Dual Gigabit PHY (Intel i210)</td>
                <td className="py-4 px-6">Dual Fast Ethernet PHY (Realtek)</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-900">Active Interception</td>
                <td className="py-4 px-6">eBPF XDP + AF_XDP Zero-Copy</td>
                <td className="py-4 px-6">eBPF XDP Generic (SKB Mode)</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-900">Physical Relay Type</td>
                <td className="py-4 px-6">Normally Closed (NC) SSR (Omron)</td>
                <td className="py-4 px-6">NC Mechanical Relay (Panasonic)</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-slate-900">GPIO Line Mapping</td>
                <td className="py-4 px-6">libgpiod Line 18</td>
                <td className="py-4 px-6">libgpiod Line 23</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Company Values & Culture Section */}
      <div id="about" className="space-y-10 pt-20 border-t border-slate-200 mt-24">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Corporate Blueprint</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Our Mission &amp; Culture
          </h2>
          <p className="text-base text-slate-500 max-w-xl mx-auto">
            We are engineering the physical failsafe for modern industry. This is the foundation of our technology and our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Vision */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Vision <span className="text-slate-400 font-normal text-sm font-sans">(The Future)</span></h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              A world where software intelligence controls physical defense. We will replace traditional hackable firewalls with an intelligent, software-first threat detection system backed by an untouchable physical hardware failsafe.
            </p>
          </div>

          {/* Mission */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Mission <span className="text-slate-400 font-normal text-sm font-sans">(Our Daily Job)</span></h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              We write sub-50µs in-memory ML inference models to detect advanced threats at the network edge. We are software-first, but the hardware is just as important—we design the physical hardware that cuts the network line the millisecond an attack is detected.
            </p>
          </div>

          {/* Goal */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Goal <span className="text-slate-400 font-normal text-sm font-sans">(The Immediate Target)</span></h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              To deploy our first live factory pilot, prove that our unified software and hardware architecture is the fastest defense on the market, and secure the venture funding to aggressively scale.
            </p>
          </div>

          {/* Culture */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Culture <span className="text-slate-400 font-normal text-sm font-sans">(Our Standard)</span></h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              No vibe coders. We demand mathematical rigour for real-time model inference and an obsession with low-latency software. We build software-first security that is backed by the absolute laws of physical hardware.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
