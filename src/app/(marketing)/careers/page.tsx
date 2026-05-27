import React from "react";

interface Role {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

const roles: Role[] = [
  {
    title: "Edge C++ Kernel Engineer",
    department: "High-Performance Systems",
    location: "Austin, TX / Hybrid",
    type: "Full-time",
    description: "Write low-latency network stack bypass mechanisms and in-memory packet parsing layers in C++20 for custom system-on-module edge devices.",
    requirements: ["C++20/23", "eBPF", "DPDK", "libgpiod / Linux GPIO", "Kernel Space programming"]
  },
  {
    title: "QGAN ML Research Scientist",
    department: "Threat Detection",
    location: "Austin, TX / Hybrid",
    type: "Full-time",
    description: "Design and implement hybrid Quantum Generative Adversarial Networks (QGAN) to perform sub-50µs anomaly inference directly in space-constrained memory.",
    requirements: ["PyTorch / ONNX Runtime", "Quantum Simulation frameworks", "Tensor Train compression", "Real-time inference profiling"]
  },
  {
    title: "FPGA / Hardware Failsafe Engineer",
    department: "Hardware Engineering",
    location: "Austin, TX (On-site)",
    type: "Full-time",
    description: "Architect the physical line-cutting failsafe system on FPGA boards. Create ultra-fast circuit breakers that respond to GPIO triggers within nanoseconds.",
    requirements: ["Verilog / VHDL", "PCB Design & Altium", "FPGA timing analysis & constraint files", "High-speed physical signal routing"]
  },
  {
    title: "Distributed Systems Engineer (Console)",
    department: "SaaS & Control Plane",
    location: "Austin, TX / Hybrid",
    type: "Full-time",
    description: "Build high-throughput telemetry ingestion pipelines and the real-time SOC dashboard for managing thousands of active edge devices.",
    requirements: ["Next.js & React", "TypeScript", "WebSockets / gRPC", "Go / Rust", "PostgreSQL / TimescaleDB"]
  },
  {
    title: "Threat Detection Engineer",
    department: "Systems Integration & QA",
    location: "Austin, TX / Hybrid",
    type: "Full-time",
    description: "Develop automated testing infrastructure and continuous integrations that validate real-world firmware telemetry against simulated exploits.",
    requirements: ["Python & Pytest", "Rust integration tooling", "Linux networking namespace virtualization", "exploit simulation & bash scripting"]
  },
  {
    title: "Quantum-Safe ML Researcher",
    department: "Machine Learning R&D",
    location: "Austin, TX / Hybrid",
    type: "Full-time",
    description: "Perform research on post-quantum cryptographic primitives and safe neural net architectures that run on space-constrained edge nodes.",
    requirements: ["PhD in CS / Mathematics", "Quantum Information Theory", "Lattice-based Cryptography", "Deep learning optimization"]
  }
];

export default function CareersPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 font-sans">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
        <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Careers at Synz Labs</span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Build the Software-First Hardware Failsafe
        </h1>
        <p className="text-lg text-slate-500">
          We write ultra-fast, intelligent software to detect zero-day threat vectors, backed by physical hardware failsafes that cut the wire. Code meets metal here.
        </p>
      </div>

      {/* Philosophy Callout */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-2xl p-8 md:p-12 mb-16 space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Our Core Thesis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600 leading-relaxed">
          <p>
            <strong>Software First:</strong> We believe that static signatures and firewall rules are dead. The future of defense is dynamic, real-time in-memory inference. We write sub-50µs hybrid machine learning models to identify anomalies instantly as packets cross the edge.
          </p>
          <p>
            <strong>Hardware is as Important:</strong> When an active exploit hits, software alone cannot be trusted. If the kernel or operating system is compromised, only hard physics can guarantee security. Our physical system-on-module severs the connection at the physical layer.
          </p>
        </div>
      </div>

      {/* Engineering Culture values */}
      <div className="space-y-8 mb-20">
        <h2 className="text-2xl font-bold text-slate-900 text-center">Engineering Standards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-3">
            <h3 className="font-semibold text-slate-900">Absolute Speed</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We profile every microsecond. From kernel bypass drivers in C++ to tensor train model compression, we optimize for speed at every layer of the stack.
            </p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-3">
            <h3 className="font-semibold text-slate-900">Hard Physics</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We believe security must rely on the laws of physics, not just fragile software. We build systems that physically cut the copper wire or interrupt power to isolate threats.
            </p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-3">
            <h3 className="font-semibold text-slate-900">Math & Metal</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No vibe coding. We expect deep understanding of algorithms, kernel memory structures, and hardware interfaces. We master both the math and the physical machine.
            </p>
          </div>
        </div>
      </div>

      {/* Open Roles list */}
      <div className="space-y-8">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-900">Open Opportunities</h2>
          <p className="text-sm text-slate-500">Join our engineering group in Austin, TX.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {roles.map((role, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6 transition-all group hover:shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
                      {role.department}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1 group-hover:text-blue-600 transition-colors">
                      {role.title}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-full text-[10px] font-mono whitespace-nowrap">
                    {role.type}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {role.description}
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">Required Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {role.requirements.map((req, reqIdx) => (
                    <span 
                      key={reqIdx}
                      className="px-2 py-0.5 bg-slate-50 border border-slate-200/80 rounded text-[10px] font-mono text-slate-600"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="mt-20 text-center max-w-xl mx-auto p-8 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">How to Apply</h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          If you want to build security systems at the intersection of AI software and custom physical hardware, send your resume/CV and github profile to:
        </p>
        <div className="pt-2">
          <a 
            href="mailto:careers@synzlabs.io"
            className="inline-block text-lg font-mono font-bold text-blue-600 hover:text-blue-700 underline"
          >
            careers@synzlabs.io
          </a>
        </div>
      </div>
    </div>
  );
}
