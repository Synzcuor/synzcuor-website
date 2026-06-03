import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Flat Geometric Monolithic Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <svg className="w-6 h-6 text-black select-none transition-transform group-hover:scale-105" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="4" width="4" height="24" fill="currentColor" />
            <path d="M6 8H10V22H14V26H6V8Z" fill="currentColor" />
            <path d="M26 8H22V22H18V26H26V8Z" fill="currentColor" />
          </svg>
          <span className="font-black tracking-tighter text-xl text-black font-sans lowercase">
            synzcuor
          </span>
        </Link>

        {/* Navigation Links with Products Dropdown */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          
          {/* Products Dropdown (Scale AI style) */}
          <div className="relative group">
            <button className="hover:text-black transition-colors py-8 flex items-center gap-1 cursor-pointer">
              Products
              <svg className="w-3 h-3 text-slate-400 group-hover:text-black transition-transform group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            {/* Dropdown Box */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-[560px] bg-white border border-slate-200/80 rounded-2xl shadow-xl p-6 grid grid-cols-2 gap-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {/* Column 1: Synz Prism */}
              <div className="space-y-4">
                <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase block">Synz Prism (B2C)</span>
                <div className="space-y-2">
                  <Link href="/products#prism" className="block hover:bg-slate-50 p-2 rounded-lg transition-colors">
                    <div className="font-semibold text-slate-900 text-xs">Local File Shield</div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Content Disarm & Reconstruction runs 100% locally on your machine.</p>
                  </Link>
                  <Link href="/products#prism" className="block hover:bg-slate-50 p-2 rounded-lg transition-colors">
                    <div className="font-semibold text-slate-900 text-xs">Zero-Day Interceptor</div>
                    <p className="text-[10px] text-slate-500 mt-0.5">In-memory neural engine blocks hidden ransomware triggers before execution.</p>
                  </Link>
                </div>
              </div>
              
              {/* Column 2: Tech Foundation */}
              <div className="space-y-4">
                <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase block">Core Technology</span>
                <div className="space-y-2">
                  <Link href="/products#phantom" className="block hover:bg-slate-50 p-2 rounded-lg transition-colors">
                    <div className="font-semibold text-slate-900 text-xs">Split-Head QGAN</div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Proprietary ML model analyzing file entropy and OS performance counters.</p>
                  </Link>
                  <Link href="/products#phantom" className="block hover:bg-slate-50 p-2 rounded-lg transition-colors">
                    <div className="font-semibold text-slate-900 text-xs">TT-SVD Compression</div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Our 0.02 MB model footprint guarantees sub-50µs offline execution.</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link href="/products" className="hover:text-black transition-colors">Solutions</Link>
          <Link href="/compliance" className="hover:text-black transition-colors">Compliance</Link>
          <Link href="/blog" className="hover:text-black transition-colors">Research</Link>
          <Link href="/careers" className="hover:text-black transition-colors">Careers</Link>
        </nav>

        {/* Action Buttons (Scale AI style) */}
        <div className="flex items-center gap-3">
          {/* Console (Login) - Outline style */}
          <Link 
            href="/login" 
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors rounded-lg font-sans"
          >
            Console
          </Link>
          {/* Waitlist - Solid black style */}
          <Link 
            href="#contact" 
            className="px-4 py-2 text-xs font-semibold text-white bg-black hover:bg-neutral-800 transition-colors rounded-lg shadow-sm font-sans"
          >
            Join Waitlist
          </Link>
        </div>
      </div>
    </header>
  );
}
