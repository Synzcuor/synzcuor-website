import React from "react";

export default function UseCasesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 font-sans">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
        <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Operational Scenarios</span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Securing Critical Infrastructure
        </h1>
        <p className="text-lg text-slate-500">
          How industrial facilities and operational technology environments utilize Synz Phantom inline to block zero-day exploits.
        </p>
      </div>

      <div className="space-y-16">
        {/* Case 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Use Case 01</span>
            <h2 className="text-3xl font-bold text-slate-900">Smart Manufacturing Assembly Lines</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Ransomware attacks in manufacturing environments frequently target legacy programmable logic controllers (PLCs) governing physical machinery movements. 
              By placing the Synz Phantom interceptor inline, it inspects every Modbus/TCP and EtherNet/IP packet. If a zero-day payload strikes, the device severs the connection before the controller can execute the malicious instructions, containing the threat to a single node.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-slate-600">Modbus/TCP Protection</span>
              <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-slate-600">assembly integrity</span>
              <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-slate-600">Sub-50µs Latency</span>
            </div>
          </div>
          <div className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-8 font-mono text-xs text-slate-500 space-y-4">
            <div className="border-b border-slate-200 pb-2 font-bold text-slate-700">SCADA SIMULATOR TRACE [BENIGN]</div>
            <div>
              [FLOW] 192.168.1.100 -&gt; Modbus Coil Write Request [Coil 0015 = 1]<br />
              [QGAN] Anomaly Score: 0.11 (Normal Flow)<br />
              [FLOW] Command forwarded to controller. Relay State: CLOSED.
            </div>
            <div className="border-b border-slate-200 pb-2 pt-2 font-bold text-red-600">SCADA SIMULATOR TRACE [ATTACK]</div>
            <div>
              [FLOW] 192.168.1.100 -&gt; Modbus Register Flood (OOB Buffer Exploit)<br />
              [QGAN] Anomaly Score: 0.98 (CRITICAL THREAT)<br />
              [GPIO] PIN 18 HIGH -&gt; SSR Opened. Connection Severed under 32µs.
            </div>
          </div>
        </div>

        {/* Case 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-grow space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Use Case 02</span>
            <h2 className="text-3xl font-bold text-slate-900">Electrical Substation Transmission Grids</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              State-sponsored threat actors target energy grids by injecting malicious commands into remote terminal units (RTUs) or power switches. 
              The Synz Phantom interceptor monitors high-frequency telemetry sequences along with hardware indicators (cache misses, temporal latency shifts). 
              If the device detects coordinated, stealthy reconnaissance attempts, it automatically switches to Software drop rules or initiates a complete Hardware lockout to isolate the substation.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-slate-600">RTU / Grid Defense</span>
              <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-slate-600">NERC CIP Alignment</span>
              <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-slate-600">libiptc Netlink Drop</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
