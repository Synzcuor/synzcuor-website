"use client";

import React, { useState, useEffect, useRef } from "react";

interface FeatureSection {
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
}

const features: FeatureSection[] = [
  {
    title: "Content Disarm & Reconstruction",
    subtitle: "Active File Disarmament",
    description:
      "Synz Prism intercepts and reconstructs files from the ground up. By stripping out macros, hidden scripts, and dynamic triggers locally, it ensures all documents are completely sanitized within 50 microseconds.",
    highlights: ["Zero-Latency File Parsing", "Macro Disarmament", "Clean Reconstructed Exports"],
  },
  {
    title: "In-Memory Threat Interception",
    subtitle: "Realtime Exploit Blocking",
    description:
      "A local split-head QGAN neural net monitors file entropy and system counter registers at memory-load time. Threats are isolated and blocked before CPU instruction execution can begin.",
    highlights: ["Sub-50µs Anomaly Detection", "Memory-Level Line Cutting", "Signature-Less Interception"],
  },
  {
    title: "100% Offline Local Privacy",
    subtitle: "Zero Cloud Telemetry",
    description:
      "Traditional security tools upload sensitive corporate files to cloud sandboxes for detonation. Synz Prism runs fully isolated on the endpoint. Zero telemetry, zero uploads, absolute data privacy.",
    highlights: ["Air-Gapped Operation", "Local Only Processing", "Zero Third-Party Ingestion"],
  },
];

export default function StickyScrollReveal() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for tracking intersection of scroll sections
  const ref0 = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -40% 0px",
      threshold: 0.1,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-index"));
          setActiveIndex(index);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const r0 = ref0.current;
    const r1 = ref1.current;
    const r2 = ref2.current;

    if (r0) observer.observe(r0);
    if (r1) observer.observe(r1);
    if (r2) observer.observe(r2);

    return () => {
      if (r0) observer.unobserve(r0);
      if (r1) observer.unobserve(r1);
      if (r2) observer.unobserve(r2);
    };
  }, []);

  return (
    <section ref={containerRef} className="py-24 bg-slate-950 text-white border-y border-slate-900 cyber-grid relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-20">
          <span className="text-xs font-mono font-bold tracking-widest text-violet-400 uppercase">ACTIVE DEFENSE INTERACTIVE DEMO</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-2">
            Local threat mitigation, visualized.
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            Scroll down to see the core engine mechanics in action. Watch how Synz Prism protects your machine entirely offline.
          </p>
        </div>

        {/* Layout: Scroll on left, Sticky on right */}
        <div className="flex flex-col lg:flex-row gap-12 items-start relative">
          
          {/* Left: Text sections (each triggers a change in activeIndex) */}
          <div className="w-full lg:w-1/2 space-y-36 pb-36">
            
            {/* Section 0 */}
            <div 
              ref={ref0} 
              data-index="0"
              className={`space-y-6 transition-all duration-500 ${
                activeIndex === 0 ? "opacity-100 transform translate-x-0" : "opacity-30 transform -translate-x-2"
              }`}
            >
              <span className="text-xs font-mono font-bold text-violet-400 px-3 py-1 bg-violet-950/50 rounded-full border border-violet-800/40">
                01 / FILE DISARMAMENT
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{features[0].title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-lg">{features[0].description}</p>
              
              <div className="space-y-2 pt-2">
                {features[0].highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-mono text-slate-300">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 1 */}
            <div 
              ref={ref1} 
              data-index="1"
              className={`space-y-6 transition-all duration-500 ${
                activeIndex === 1 ? "opacity-100 transform translate-x-0" : "opacity-30 transform -translate-x-2"
              }`}
            >
              <span className="text-xs font-mono font-bold text-violet-400 px-3 py-1 bg-violet-950/50 rounded-full border border-violet-800/40">
                02 / IN-MEMORY BLOCKING
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{features[1].title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-lg">{features[1].description}</p>
              
              <div className="space-y-2 pt-2">
                {features[1].highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-mono text-slate-300">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2 */}
            <div 
              ref={ref2} 
              data-index="2"
              className={`space-y-6 transition-all duration-500 ${
                activeIndex === 2 ? "opacity-100 transform translate-x-0" : "opacity-30 transform -translate-x-2"
              }`}
            >
              <span className="text-xs font-mono font-bold text-violet-400 px-3 py-1 bg-violet-950/50 rounded-full border border-violet-800/40">
                03 / STEALTH PRIVACY
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{features[2].title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-lg">{features[2].description}</p>
              
              <div className="space-y-2 pt-2">
                {features[2].highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-mono text-slate-300">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Sticky visualizer card with transitions */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-28 h-[440px] flex items-center justify-center z-10">
            
            {/* Visualizer Panel Container */}
            <div className="w-full h-full rounded-2xl bg-neutral-900 border border-neutral-800/80 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-500">
              
              {/* Amethyst background glow grid */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.06),transparent_60%)] pointer-events-none" />

              {/* Status Header */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 z-10">
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${activeIndex === 0 ? "bg-emerald-500 animate-pulse" : activeIndex === 1 ? "bg-red-500 animate-pulse" : "bg-blue-400"} `} />
                  PRISM ENGINE // VISUALIZER
                </span>
                <span className="text-slate-600">STATE: ACTIVE</span>
              </div>

              {/* Content Panel Area */}
              <div className="flex-1 my-6 flex items-center justify-center z-10 relative">
                
                {/* STATE 0: CDR File Disarm Visualizer */}
                <div 
                  className={`absolute inset-0 flex flex-col justify-center transition-all duration-500 ${
                    activeIndex === 0 ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="bg-neutral-950 rounded-xl border border-neutral-800/80 p-5 space-y-4 max-w-sm mx-auto shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 font-bold text-xs font-mono">
                        XLSX
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">monthly_forecast.xlsx</div>
                        <div className="text-[10px] text-slate-500">Telemetry size: 1.4 MB</div>
                      </div>
                    </div>
                    
                    {/* Disarm Progress simulation */}
                    <div className="space-y-1.5 font-mono text-[9px]">
                      <div className="flex justify-between text-slate-400">
                        <span>Status: <strong className="text-amber-400 animate-pulse">STRIPPING MACROS...</strong></span>
                        <span>42%</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-900 rounded overflow-hidden">
                        <div className="h-full bg-amber-500 rounded animate-[pulse_1.5s_infinite]" style={{ width: '42%' }} />
                      </div>
                    </div>

                    <div className="border-t border-neutral-800/80 pt-3 text-[9px] font-mono text-slate-500 space-y-1">
                      <div className="flex justify-between text-red-500">
                        <span>- [Exploit Blocked] Auto_Open macro script</span>
                        <span>DELETED</span>
                      </div>
                      <div className="flex justify-between text-green-400">
                        <span>+ [Reconstruct] Clean XML grid cells</span>
                        <span>COMPILED</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STATE 1: Zero-Day Memory Interceptor Visualizer */}
                <div 
                  className={`absolute inset-0 flex flex-col justify-center transition-all duration-500 ${
                    activeIndex === 1 ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="bg-neutral-950 rounded-xl border border-neutral-800/80 p-4 space-y-3 w-full max-w-md mx-auto shadow-xl">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                      <span className="text-[10px] font-mono text-slate-400">CPU REGISTER MEMORY DECODER</span>
                      <span className="text-[9px] font-mono text-red-500 animate-pulse">OVERFLOW PREVENTED</span>
                    </div>

                    {/* Instruction registers */}
                    <div className="space-y-1 text-[9px] font-mono leading-relaxed">
                      <div className="flex justify-between text-slate-400">
                        <span>0x00FF8C: PUSH edx</span>
                        <span className="text-slate-500">NOP</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>0x00FF90: MOV eax, [ebp-4]</span>
                        <span className="text-slate-500">SAFE</span>
                      </div>
                      <div className="flex justify-between bg-red-950/40 text-red-400 px-1 border border-red-900/50 rounded">
                        <span>0x00FFA4: JMP esp (SHELLCODE DETECTED)</span>
                        <span className="font-bold">BLOCKED [0.03ms]</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>0x00FFA8: NOP (INT 3 / CUT)</span>
                        <span className="text-slate-600">HALT</span>
                      </div>
                    </div>

                    {/* Threat classification gauge */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
                      <div className="bg-neutral-900 p-2 rounded text-center">
                        <div className="text-[8px] font-mono text-slate-500">LATENCY TRIGGER</div>
                        <div className="text-xs font-mono font-bold text-violet-400">12 microseconds</div>
                      </div>
                      <div className="bg-neutral-900 p-2 rounded text-center">
                        <div className="text-[8px] font-mono text-slate-500">QGAN ANOMALY SCORE</div>
                        <div className="text-xs font-mono font-bold text-red-500">0.984 (High Risk)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STATE 2: 100% Offline Local Privacy Visualizer */}
                <div 
                  className={`absolute inset-0 flex flex-col justify-center transition-all duration-500 ${
                    activeIndex === 2 ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="bg-neutral-950 rounded-xl border border-neutral-800/80 p-5 space-y-4 max-w-sm mx-auto shadow-xl text-center">
                    
                    {/* Glowing shield outline */}
                    <div className="w-16 h-16 rounded-full bg-violet-600/10 border border-violet-500/30 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                      <svg className="w-8 h-8 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-200">Device Telemetry Air-Gapped</div>
                      <p className="text-[9px] text-slate-500 leading-relaxed font-mono">
                        Active firewall policies block outbound reports. Prism scans are processed strictly in kernel-space memory buffers.
                      </p>
                    </div>

                    <div className="bg-neutral-900 p-2.5 rounded border border-neutral-800 text-[8px] font-mono text-slate-400 space-y-1">
                      <div className="flex justify-between">
                        <span>NETWORK INTERFACES:</span>
                        <span className="text-red-500 font-bold">MUTED</span>
                      </div>
                      <div className="flex justify-between">
                        <span>OUTBOUND TELEMETRY UPLOADS:</span>
                        <span className="text-red-500 font-bold">0 INGESTED</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ENCRYPTION DECRYPTION SESSION:</span>
                        <span className="text-green-400 font-bold">LOCAL ONLY</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Status Footer info */}
              <div className="flex justify-between text-[8px] font-mono text-slate-600 border-t border-neutral-800/80 pt-3 z-10">
                <span>MODEL: TT-SVD-COMPRESSED [0.02 MB]</span>
                <span>INTERFACE TYPE: OFFLINE SHIELD</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
