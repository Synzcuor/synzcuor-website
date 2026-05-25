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
    </div>
  );
}
