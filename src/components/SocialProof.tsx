"use client";

import { motion } from "framer-motion";

export default function SocialProof() {
  const industries = ["Automotive", "Aerospace", "Energy Grid", "Defense", "Manufacturing", "Robotics", "Maritime", "Telecom"];
  // Duplicate for seamless loop
  const duplicatedIndustries = [...industries, ...industries];

  return (
    <section className="py-24 bg-white border-y border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center px-6">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-black mb-12">
          Tested by expert Red Teamers. <br className="hidden md:block" />
          <span className="text-gray-500">Deployed in top-tier manufacturing hubs.</span>
        </h2>
      </div>
      
      <div className="relative flex overflow-hidden">
        {/* Left fade out */}
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        
        <motion.div
          className="flex whitespace-nowrap gap-16 opacity-50 grayscale w-fit"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 25,
          }}
        >
          {duplicatedIndustries.map((industry, index) => (
            <div key={index} className="text-xl font-bold uppercase tracking-widest text-black font-mono shrink-0">
              {industry}
            </div>
          ))}
        </motion.div>

        {/* Right fade out */}
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
