"use client";

import React, { useState } from "react";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  author: string;
  readTime: string;
  content: React.ReactNode;
}

export default function BlogPage() {
  const [activePostId, setActivePostId] = useState<string | null>(null);

  const posts: BlogPost[] = [
    {
      id: "ebpf-ring-1",
      title: "Securing Ring -1 with eBPF and XDP",
      date: "May 24, 2026",
      category: "OT Security Architecture",
      summary: "Exploring eBPF-driven zero-copy XDP pipelines to catch stealth DMA attacks prior to kernel or hypervisor interception.",
      author: "Dr. Elena Vance, Head of OT Threat Intelligence",
      readTime: "6 min read",
      content: (
        <div className="space-y-6">
          <p>
            Legacy industrial networks operate on high-reliability, low-latency protocols where typical endpoint protection agents cannot run due to CPU overhead. 
            Furthermore, sophisticated threat actors execute attacks at the hypervisor or DMA level (Ring -1/Ring -2), bypassing classical operating system kernel interceptors.
          </p>
          <h3 className="text-xl font-bold text-slate-900 mt-8">The Zero-Copy XDP Network Path</h3>
          <p>
            To intercept malicious payloads before they trigger CPU instruction execution, we utilize eBPF (Extended Berkeley Packet Filter) bound to the eXpress Data Path (XDP). 
            XDP runs directly in the network card driver context (or within hardware smartNICs), intercepting packets before they allocate socket buffers in the operating system.
          </p>
          <pre className="p-4 bg-slate-900 text-slate-300 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
            <code>{`SEC("xdp")
int synz_xdp_filter(struct xdp_md *ctx) {
    void *data_end = (void *)(long)ctx->data_end;
    void *data = (void *)(long)ctx->data;
    
    // Parse Ethernet header
    struct ethhdr *eth = data;
    if ((void*)(eth + 1) > data_end)
        return XDP_PASS;
        
    // Forward parsed packets directly to Ring -1 Critic
    return inspect_industrial_flows(eth, ctx, data_end);
}`}</code>
          </pre>
          <p>
            Combined with zero-copy ring buffers (`AF_XDP`), network frames are streamed directly to our in-memory ONNX Critic session, guaranteeing a transit inspect path under 50µs.
          </p>
          <blockquote className="border-l-4 border-blue-600 pl-4 py-2 italic text-slate-600">
            "By embedding threat checks inside driver contexts, we drop malicious payloads before they get loaded into CPU caches, eliminating CPU-target exploit vectors entirely."
          </blockquote>
        </div>
      ),
    },
    {
      id: "modbus-hijacking",
      title: "Mitigating Modbus/TCP Register Hijacking",
      date: "May 12, 2026",
      category: "Protocol Security",
      summary: "Analyzing how zero-day attackers execute unauthorized register writes on PLC controllers and how to block them inline.",
      author: "Marcus Aurelius, Principal OT Systems Engineer",
      readTime: "8 min read",
      content: (
        <div className="space-y-6">
          <p>
            The Modbus protocol remains the backbone of electrical control switches, hydraulic valves, and motor governors. 
            However, designed in 1979, Modbus lacks built-in authentication, signing, or packet integrity parameters. Any actor with network visibility can craft valid packets to write arbitrary registers.
          </p>
          <h3 className="text-xl font-bold text-slate-900 mt-8">Stealth Anomaly Detection</h3>
          <p>
            Rather than trying to parse rules statically, our QGAN Critic models normal temporal behaviors (the inter-packet arrival times, read/write patterns, and register addresses). 
            When an attacker attempts a register write sequence that deviates from standard operational telemetry, the Critic flags it as an anomaly.
          </p>
          <pre className="p-4 bg-slate-900 text-slate-300 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
            <code>{`// Example Modbus register write intercept validation
if (modbus_function_code == WRITE_MULTIPLE_REGISTERS) {
    float score = run_critic_inference(packet_features);
    if (score > THREAT_THRESHOLD) {
        trigger_hardware_lockout(); // physical cutoff
        return DROP_PACKET;
    }
}`}</code>
          </pre>
          <p>
            By combining physical link severing with in-memory inference, we prevent physical damage to critical operational equipment.
          </p>
        </div>
      ),
    },
    {
      id: "qgan-benchmarks",
      title: "QGAN vs Classical RNNs: Defense Benchmarks",
      date: "April 28, 2026",
      category: "Machine Learning Research",
      summary: "Performance metrics comparing Quantum Generative Adversarial Networks (QGANs) with classical RNN autoencoders in SCADA.",
      author: "Dr. Sarah Jenkins, Director of AI Security Research",
      readTime: "5 min read",
      content: (
        <div className="space-y-6">
          <p>
            Classical Recurrent Neural Networks (RNNs) and autoencoders are frequently deployed to detect anomalies. 
            However, in high-frequency, complex SCADA environments, these models suffer from high false positive rates and slow inference speeds.
          </p>
          <h3 className="text-xl font-bold text-slate-900 mt-8">Stealth Reconnaissance Detection Accuracy</h3>
          <p>
            Our benchmarks demonstrate that Split-Head Quantum Generative Adversarial Networks (QGANs) train significantly faster on multi-dimensional telemetry and achieve an 18% improvement in detecting low-frequency, stealth scanning patterns.
          </p>
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm mt-6">
            <table className="w-full text-left text-xs text-slate-500 font-mono">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-widest text-[9px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Metric</th>
                  <th className="py-3 px-4 text-blue-600">Synz Hybrid QGAN</th>
                  <th className="py-3 px-4">Classical RNN Autoencoder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">Inference Latency</td>
                  <td className="py-3 px-4">~22µs</td>
                  <td className="py-3 px-4">~140µs</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">F1 Score (Recon)</td>
                  <td className="py-3 px-4">0.963</td>
                  <td className="py-3 px-4">0.814</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">False Alarm Rate</td>
                  <td className="py-3 px-4">0.02%</td>
                  <td className="py-3 px-4">1.12%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
  ];

  const activePost = posts.find(p => p.id === activePostId);

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 font-sans">
      {activePost ? (
        /* Blog Detail View */
        <article className="space-y-6">
          <button
            onClick={() => setActivePostId(null)}
            className="text-xs font-mono font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase flex items-center gap-1.5"
          >
            ← Back to Threat Reports
          </button>
          
          <div className="space-y-3 border-b border-slate-200 pb-6">
            <span className="text-xs font-mono font-semibold text-blue-600 uppercase">
              {activePost.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {activePost.title}
            </h1>
            <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
              <span>{activePost.date} · {activePost.readTime}</span>
              <span>{activePost.author}</span>
            </div>
          </div>

          <div className="text-slate-700 text-sm sm:text-base leading-relaxed pt-4">
            {activePost.content}
          </div>
        </article>
      ) : (
        /* Blog Index View */
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Threat Intelligence</span>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Threat Research Blog
            </h1>
            <p className="text-sm text-slate-500">
              Technical bulletins and advisories from Synz Labs OT security research division.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => setActivePostId(post.id)}
                className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:border-blue-300 hover:shadow-md cursor-pointer transition-all flex flex-col md:flex-row justify-between items-start gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span className="text-blue-600 font-semibold">{post.category}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-sans group-hover:text-blue-600">
                    {post.title}
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-sans">
                    {post.summary}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                  <span className="text-xs font-mono text-slate-400">{post.readTime}</span>
                  <span className="text-xs font-mono text-blue-600 font-bold mt-4 hover:underline">Read Article →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
