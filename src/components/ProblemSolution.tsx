import { XCircle, CheckCircle2 } from "lucide-react";

export default function ProblemSolution() {
  return (
    <section className="py-24 bg-white border-y border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0">
          
          {/* Left Side: Standard Firewall */}
          <div className="border border-gray-200 p-8 lg:p-12 lg:border-r-0 relative group bg-gray-50">
            <div className="absolute top-0 right-0 p-4">
              <span className="text-red-500 font-mono text-sm tracking-widest uppercase flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Compromised
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-black">Legacy IT Firewalls</h3>
            <p className="text-gray-600 mb-8 max-w-md">
              They wait for the payload to execute before reacting. By the time signatures match, your industrial controllers are already offline.
            </p>
            
            <div className="bg-white border border-gray-200 p-4 font-mono text-sm text-gray-600 overflow-hidden relative shadow-sm">
              <div className="opacity-50">
                &gt; analyzing packet stream...<br/>
                &gt; heuristic engine running...<br/>
                &gt; matching against CVE DB...<br/>
                &gt; WARNING: anomalous traffic detected<br/>
              </div>
              <div className="text-red-500 mt-2 font-bold animate-pulse">
                [!] CRITICAL: SCADA INSTRUCTION OVERRIDE SUCCESSFUL<br/>
                [!] CONNECTION LOST TO PLC-04
              </div>
            </div>
          </div>

          {/* Right Side: Synzcuor */}
          <div className="border border-synz-accent p-8 lg:p-12 relative bg-white group shadow-sm">
            <div className="absolute inset-0 bg-synz-accent/5 pointer-events-none" />
            <div className="absolute top-0 right-0 p-4">
              <span className="text-synz-accent font-mono text-sm tracking-widest uppercase flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Protected
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-black">Synzcuor Intercept</h3>
            <p className="text-gray-600 mb-8 max-w-md">
              Inline sub-50µs packet parsing. When malicious math is detected, solid-state relays physically air-gap your factory before execution.
            </p>
            
            <div className="bg-gray-50 border border-gray-200 p-4 font-mono text-sm text-gray-600 overflow-hidden relative">
              <div className="text-black">
                &gt; parsing eBPF ingress... [12µs]<br/>
                &gt; scoring payload entropy... [24µs]<br/>
              </div>
              <div className="text-synz-accent mt-2">
                &gt; MUTATION DETECTED: Score 0.98 [38µs]<br/>
                &gt; TRIGGERING RELAY INTERLOCK...
              </div>
              <div className="text-black bg-synz-accent font-bold mt-2 p-1 inline-block">
                [+] PHYSICAL CONNECTION SEVERED [47µs]
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
