import { Terminal, Cpu, Database } from "lucide-react";

const products = [
  {
    title: "Synzcuor Phantom",
    subtitle: "Ring -1 Interceptor",
    description: "The open-source, sub-50MB eBPF software wedge. Deploys seamlessly into existing infrastructure to monitor packet payloads at line rate without latency penalties.",
    icon: Terminal,
  },
  {
    title: "Synzcuor Intercept",
    subtitle: "Hardware Failsafe",
    description: "The inline hardware appliance. Built with solid-state relays that physically sever ethernet connections the moment Phantom scores a payload above the threat threshold.",
    icon: Cpu,
  },
  {
    title: "Synzcuor Core",
    subtitle: "AI Control Plane",
    description: "The air-gapped AI control plane. Trains our proprietary models on your sanitized telemetry to anticipate and synthesize adversarial mutations before they happen.",
    icon: Database,
  },
];

export default function ProductEcosystem() {
  return (
    <section className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-4">
            The Product Ecosystem
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl">
            A unified stack spanning from low-level kernel software to physical bare-metal hardware.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, idx) => {
            const Icon = product.icon;
            return (
              <div
                key={idx}
                className="group border border-gray-200 bg-gray-50 p-8 hover:border-synz-accent transition-all duration-300 flex flex-col"
              >
                <div className="mb-8">
                  <Icon className="w-10 h-10 text-gray-400 group-hover:text-synz-accent transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-black mb-2">
                  {product.title}
                </h3>
                <h4 className="text-xs font-mono text-synz-accent uppercase tracking-widest mb-6">
                  {product.subtitle}
                </h4>
                <p className="text-gray-600 leading-relaxed mt-auto">
                  {product.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
