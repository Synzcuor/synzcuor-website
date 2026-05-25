"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function InteractiveCliDemo() {
  const [lines, setLines] = useState<string[]>([]);
  
  useEffect(() => {
    const sequence = [
      "Initializing Synzcuor Phantom eBPF wedge...",
      "Hooking into ring -1 kernel space [SUCCESS]",
      "Listening on eth0...",
      "Packet parsing... 41µs [SAFE]",
      "Packet parsing... 43µs [SAFE]",
      "Packet parsing... 42µs [SAFE]",
      "Packet parsing... 40µs [SAFE]",
      "WARNING: Anomalous entropy detected in payload",
      "Mutated payload detected... 48µs [WIRE CUT]",
      "System secured. Awaiting manual reset."
    ];
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < sequence.length) {
        setLines(prev => [...prev, sequence[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 800); // Add a new line every 800ms
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black mb-4">
            Try Phantom
          </h2>
          <p className="text-xl text-gray-700">
            Line-rate interception without the latency penalty.
          </p>
        </div>

        <div className="bg-[#0A0A0A] border border-gray-300 rounded-md overflow-hidden shadow-2xl">
          <div className="bg-[#121212] border-b border-gray-800 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            <span className="text-xs font-mono text-synz-light ml-2">root@synzcuor-phantom:~</span>
          </div>
          <div className="p-6 font-mono text-sm h-80 overflow-y-auto">
            {lines.map((line, i) => {
              if (!line) return null;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`mb-2 ${
                    line.includes("[WIRE CUT]") 
                      ? "text-synz-accent font-bold" 
                      : line.includes("WARNING")
                      ? "text-yellow-500"
                      : "text-synz-light"
                  }`}
                >
                  <span className="text-synz-gray mr-4">{`0x${(i * 1024).toString(16).padStart(4, '0')}`}</span>
                  {line}
                </motion.div>
              );
            })}
            <motion.div 
              animate={{ opacity: [1, 0] }} 
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-synz-accent mt-2"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-transparent text-black font-bold tracking-wide py-3 px-8 border border-gray-300 hover:border-black transition-colors"
          >
            Pull Docker Image
          </a>
        </div>
      </div>
    </section>
  );
}
