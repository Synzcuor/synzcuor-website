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
    id: "appliance",
    title: "Synz Phantom Appliance",
    category: "Industrial Hardware",
    badge: "Hardware Failsafe",
    overview: "Inline, bump-in-the-wire physical hardware security device installed directly on the physical layer of the network.",
    description: "Equipped with a physical solid-state relay and dual-port gigabit bypass, the Phantom Appliance stands between your critical machinery and the outside world. If a threat is detected by the software layer, it physically cuts the copper wire within 32µs to guarantee an immediate air gap.",
    specs: [
      { label: "Reaction Time", value: "Sub-32µs physical wire cut" },
      { label: "Bypass Mode", value: "Dual-port gigabit bypass (failsafe open)" },
      { label: "Hardware Core", value: "Ruggedized System-on-Module with TPU" },
      { label: "Mounting Style", value: "Industrial standard DIN-rail mountable" },
      { label: "Power Input", value: "Redundant 24V DC input terminal" }
    ]
  },
  {
    id: "som",
    title: "Edge Interceptor SoM",
    category: "Firmware & OS",
    badge: "Bare-Metal Engine",
    overview: "Low-level bare-metal software engine running inline at the network interface card level.",
    description: "Running a custom real-time Linux kernel, the Edge Interceptor handles packet extraction using zero-copy eBPF XDP socket bindings. It streams extracted network parameters directly into the in-memory inference engine and triggers the GPIO pin-cut protocol the microsecond a threshold is crossed.",
    specs: [
      { label: "Software Kernel", value: "Custom Linux RT-Kernel + eBPF XDP" },
      { label: "Ingestion Speed", value: "Sub-20µs flow processing pipeline" },
      { label: "Inference Latency", value: "Sub-50µs hybrid QGAN model" },
      { label: "Memory Footprint", value: "Compressed under 50MB (ONNX runtime)" },
      { label: "Trigger Protocol", value: "Dedicated GPIO pin hardware cut" }
    ]
  },
  {
    id: "neural-engine",
    title: "QGAN Neural Threat Engine",
    category: "Machine Learning",
    badge: "In-Memory ML Software",
    overview: "Quantum-classical hybrid generative neural network trained to detect zero-day exploits without signature updates.",
    description: "By combining classical neural networks with parameter-efficient quantum layers, the QGAN engine maps 384-dimensional network and CPU telemetry simultaneously. The model is compressed by 90% via Tensor Train SVD to fit inside space-constrained processor cache.",
    specs: [
      { label: "Model Class", value: "Split-Head QGAN (Network + CPU)" },
      { label: "Input Dimensions", value: "384-dimensional tabular telemetry" },
      { label: "Model Compression", value: "Tensor Train WGAN parameter reduction" },
      { label: "Parameter Reduction", value: "90% parameter size reduction" },
      { label: "Export Format", value: "Fully optimized ONNX model binary" }
    ]
  },
  {
    id: "control-plane",
    title: "Synz Control Plane",
    category: "SaaS Dashboard",
    badge: "Central Control Console",
    overview: "Centralized SaaS management console for operational technology (OT) security teams.",
    description: "The dashboard ingests high-frequency telemetry streams via WebSockets, mapping active edge nodes across your industrial plants. It handles compliance logging (SOC 2, NERC CIP, IEC 62443), logs threat events, and allows live model configuration reloads.",
    specs: [
      { label: "Control Protocol", value: "Real-time bidirectional WebSockets" },
      { label: "Database Ingestion", value: "TimescaleDB high-frequency DB cluster" },
      { label: "Visualizer UI", value: "Next.js Outfit dashboard console" },
      { label: "SIEM Integration", value: "Syslog, Splunk, and API integrations" },
      { label: "Compliance Reports", value: "SOC 2, NERC CIP, IEC 62443 logging" }
    ]
  }
];

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 font-sans">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
        <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Product Catalog</span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Active Security: Bare-Metal Speed, AI Intelligence
        </h1>
        <p className="text-lg text-slate-500">
          Our three-stage cyber-defense pipeline integrates advanced quantum-classical machine learning with a physical-layer failsafe wire-cutter.
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
                  Request Technical Demo
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
                <span>MODEL REF: SP-{product.id.slice(0, 3).toUpperCase()}-2026</span>
                <span>STATUS: CERTIFIED</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cyber Defense Pipeline Diagram */}
      <div className="mt-24 space-y-10 border-t border-slate-200 pt-20">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Pipeline Architecture</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            The Three-Stage Cyber-Defense Pipeline
          </h2>
          <p className="text-base text-slate-500">
            How we bridge the gap between generative machine learning models and physical electrical circuitry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Stage 1 */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm relative">
            <span className="text-3xl font-extrabold text-slate-200 font-mono absolute top-4 right-6 select-none">01</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">QGAN Model Factory</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              We leverage Quantum-Classical Generative Adversarial Networks to train a robust classification model, generating synthetic zero-day exploits and training indicators to avoid mode collapse.
            </p>
          </div>

          {/* Stage 2 */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm relative">
            <span className="text-3xl font-extrabold text-slate-200 font-mono absolute top-4 right-6 select-none">02</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Tensor Train Compression</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Linear layers are decomposed using TT-SVD. This compresses the model parameters by 90%, shrinking the threat engine under 50MB so it can fit directly inside CPU/TPU memory cache.
            </p>
          </div>

          {/* Stage 3 */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm relative">
            <span className="text-3xl font-extrabold text-slate-200 font-mono absolute top-4 right-6 select-none">03</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Bare-Metal Deployment</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              The compiled ONNX engine runs directly on system-on-module nodes utilizing zero-copy eBPF filters. An anomaly triggers a physical GPIO pin, instantly opening the solid-state relay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
