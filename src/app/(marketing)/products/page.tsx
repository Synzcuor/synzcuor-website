import React from "react";
import Link from "next/link";

interface SpecItem {
  label: string;
  value: string;
}

interface Product {
  id: string;
  title: string;
  category: string;
  badge: string;
  overview: string;
  description: string;
  specs: SpecItem[];
}

const products: Product[] = [
  {
    id: "intercept",
    title: "Synz Intercept",
    category: "B2B Industrial / Enterprise",
    badge: "Hardware Failsafe",
    overview: "An inline hardware appliance that sits physically between the network and critical equipment (like power grids, medical devices, or assembly line PLCs).",
    description: "Built on custom carrier boards housing System-on-Modules with dual Gigabit Ethernet ports. Inside is a physical Normally Closed (NC) Solid-State Relay wired directly to a CPU GPIO pin. If a threat is detected, the software pulls the GPIO pin high, physically snapping the relay open and cutting the copper Ethernet connection in under 50 microseconds to air-gap the system.",
    specs: [
      { label: "Bypass Ports", value: "Dual Gigabit Ethernet (Normally Closed)" },
      { label: "Kinetic Relay", value: "Solid-State physical line-cut relay" },
      { label: "Trigger Time", value: "Sub-50µs reaction window" },
      { label: "Board Type", value: "Custom carrier board + System-on-Module" },
      { label: "Form Factor", value: "Ruggedized industrial DIN-rail enclosure" }
    ]
  },
  {
    id: "prism",
    title: "Synz Prism",
    category: "B2C Consumer / Endpoint",
    badge: "CDR Software",
    overview: "A lightweight, software-only Content Disarm and Reconstruction (CDR) agent for laptops and home offices.",
    description: "Automatically intercepts file downloads locally. If a file is flagged as suspicious, Prism strips active threats—such as macros in Office documents (vbaProject.bin) or Javascript triggers in PDFs (/Launch, /JS)—and reconstructs a clean, threat-free copy in-place. All processing is 100% local, preserving absolute data privacy.",
    specs: [
      { label: "Threat Sanitization", value: "Strips macros & JavaScript elements" },
      { label: "File Processing", value: "In-place Content Disarm & Reconstruction" },
      { label: "Cloud Uploads", value: "Zero (100% local-first operations)" },
      { label: "Supported Files", value: "PDF, DOCX, XLSX, PPTX, ZIP, HTML" },
      { label: "Platform Support", value: "Windows, macOS, Linux endpoint agent" }
    ]
  },
  {
    id: "phantom",
    title: "Synz Phantom",
    category: "Local Orchestrator Engine",
    badge: "Core Service Engine",
    overview: "The core local background service and orchestrator governing both appliances and software endpoints.",
    description: "Acts as the background daemon that controls Synz Intercept appliances and Synz Prism software agents. It securely loads the encrypted ONNX model (.onnx.enc) in memory, parses incoming raw packets, decrypts session tokens, and manages real-time telemetry flows to the control plane.",
    specs: [
      { label: "Model Runtime", value: "In-memory encrypted ONNX (.onnx.enc)" },
      { label: "Execution Layer", value: "Bare-metal eBPF XDP zero-copy parser" },
      { label: "Agent Management", value: "Controls local Intercept & Prism daemons" },
      { label: "Library Footprint", value: "Under 50MB runtime memory allocation" },
      { label: "Cryptography", value: "Local secure hardware key verification" }
    ]
  },
  {
    id: "core",
    title: "Synz Core",
    category: "B2B Enterprise Control Plane",
    badge: "Control Console",
    overview: "The air-gapped management console and central registry for enterprise security teams.",
    description: "Built in ASP.NET Core (API and Portal), Synz Core runs as a localized or air-gapped server. It aggregates fleet telemetry logs, routes event metrics to Splunk/SIEM systems, logs NERC CIP / IEC 62443 compliance indices, and manages the training 'Foundry' where QGAN neural models are compressed.",
    specs: [
      { label: "Console Stack", value: "ASP.NET Core (Portal + REST API)" },
      { label: "Telemetry Feed", value: "High-frequency Syslog & SIEM routers" },
      { label: "Fleet Controls", value: "Command center for thousands of nodes" },
      { label: "Model Foundry", value: "QGAN model retraining & export control" },
      { label: "Compliance Mappings", value: "Automated SOC 2, NERC CIP, IEC 62443 logs" }
    ]
  }
];

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 font-sans">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
        <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Product Ecosystem</span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Active Kinetic Defense: The Synzcuor Ecosystem
        </h1>
        <p className="text-lg text-slate-500">
          We bridge the gap between low-level kernel software and physical active-defense hardware, providing real-time protection for enterprise and consumer systems.
        </p>
      </div>

      {/* Product Details Grid */}
      <div className="space-y-24">
        {products.map((product) => (
          <div 
            key={product.id} 
            id={product.id}
            className="scroll-mt-24 bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm flex flex-col lg:flex-row gap-12"
          >
            {/* Product description block */}
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block">
                  {product.category}
                </span>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {product.title}
                  </h2>
                  <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    {product.badge}
                  </span>
                </div>
              </div>
              <p className="text-slate-800 font-semibold text-sm leading-relaxed">
                {product.overview}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                {product.description}
              </p>
              <div className="pt-2">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-5 h-10 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all uppercase tracking-wider"
                >
                  Request Product Demo
                </Link>
              </div>
            </div>

            {/* Specifications Table */}
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-6 md:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                  Technical Specifications
                </h3>
                <div className="border-t border-slate-200 divide-y divide-slate-200">
                  {product.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="py-3 flex justify-between gap-4 text-xs font-mono">
                      <span className="text-slate-500 font-medium">{spec.label}</span>
                      <span className="text-slate-900 font-bold text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>SYSTEM REGISTRY: SZ-{product.id.slice(0, 3).toUpperCase()}-2026</span>
                <span>STATUS: OPERATIONAL</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shared QGAN AI Engine Deep Dive */}
      <div className="mt-24 space-y-10 border-t border-slate-200 pt-20">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Core AI Intelligence</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            The Shared Quantum Threat Engine
          </h2>
          <p className="text-base text-slate-500">
            Our proprietary Split-Head Quantum Generative Adversarial Network (QGAN) powers active anomaly detection across the entire platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Section 1 */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm relative">
            <span className="text-3xl font-extrabold text-slate-200 font-mono absolute top-4 right-6 select-none">22.8M</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Massive Training Dataset</h3>
            <p className="text-slate-600 text-xs leading-relaxed font-sans">
              The neural threat engine is trained against a corpus of 22.8 million real cybersecurity samples. By synthesizing zero-day threat patterns, the QGAN detects novel intrusion loops without relying on signature files.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm relative">
            <span className="text-3xl font-extrabold text-slate-200 font-mono absolute top-4 right-6 select-none">Dual</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Split-Head Architecture</h3>
            <p className="text-slate-600 text-xs leading-relaxed font-sans">
              The model evaluates threats on two vectors simultaneously:
              <strong> Network Head</strong> evaluates packet structures and entropy.
              <strong> CPU Head</strong> monitors host machine Performance Counters (PMUs) to detect CPU cache-miss anomalies caused by ransomware loops.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm relative">
            <span className="text-3xl font-extrabold text-slate-200 font-mono absolute top-4 right-6 select-none">91%</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">TT-SVD Compression</h3>
            <p className="text-slate-600 text-xs leading-relaxed font-sans">
              Using Tensor Train SVD Decomposition, we reduce model parameter weight sizes by 91% down to just **0.02 MB**, enabling real-time local execution at sub-50 microsecond latencies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
