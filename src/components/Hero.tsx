"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-16 overflow-hidden bg-white">
      {/* Background Grids and Glows */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.03] bg-grid-glow pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-synz-accent/10 rounded-full blur-[120px] pointer-events-none z-0"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-block border border-gray-200 px-3 py-1 text-xs font-mono tracking-widest uppercase mb-8 bg-gray-50 text-black"
        >
          System Status: <span className="text-synz-accent">Armed</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-black mb-6 leading-[1.1]"
        >
          Physical network <br />
          kill-switches for factories.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 font-medium tracking-wide"
        >
          Sub-50 microsecond inline interception. When the math detects a threat, the metal cuts the wire.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/demo"
            className="w-full sm:w-auto bg-synz-accent text-black font-bold tracking-wide py-3 px-8 hover:bg-black hover:text-synz-accent transition-colors"
          >
            Request Demo
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-transparent text-black font-bold tracking-wide py-3 px-8 border border-gray-300 hover:border-black transition-colors"
          >
            View Open Source
          </a>
        </motion.div>
      </div>
      
      {/* Decorative lines representing connections */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: "100%" }}
        transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
        className="absolute top-0 left-1/4 w-[1px] bg-gradient-to-b from-transparent via-gray-200 to-transparent z-0"
      />
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: "100%" }}
        transition={{ duration: 1.5, delay: 0.7, ease: "circOut" }}
        className="absolute top-0 right-1/4 w-[1px] bg-gradient-to-b from-transparent via-gray-200 to-transparent z-0"
      />
    </section>
  );
}
