import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white select-none transition-transform group-hover:scale-105">
            <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 5v22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M10 10v4c0 4 2 5.5 6 5.5s6-1.5 6-5.5v-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 27h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-semibold tracking-wide text-base text-slate-900 font-sans">Synzcuor</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          <Link href="/overview" className="hover:text-blue-600 transition-colors">Overview</Link>
          <Link href="/use-cases" className="hover:text-blue-600 transition-colors">Use Cases</Link>
          <Link href="/compliance" className="hover:text-blue-600 transition-colors">Compliance</Link>
          <Link href="/blog" className="hover:text-blue-600 transition-colors">Research</Link>
          <Link href="/careers" className="hover:text-blue-600 transition-colors">Careers</Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link 
            href="/login" 
            className="px-4 py-2 rounded bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors font-sans"
          >
            Console
          </Link>
          <Link 
            href="/contact" 
            className="px-4 py-2 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm font-sans"
          >
            Request Audit
          </Link>
        </div>
      </div>
    </header>
  );
}
