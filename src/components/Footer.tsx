import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Block */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-base font-sans select-none">
              S
            </div>
            <span className="font-semibold text-lg text-white font-sans tracking-wide">Synz Labs</span>
          </div>
          <p className="text-xs leading-relaxed font-sans text-slate-400 max-w-xs">
            Hardware-enforced active cyber defense and in-memory anomaly inference for critical industrial infrastructure.
          </p>
        </div>

        {/* Column 1: Products */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Products</h4>
          <ul className="space-y-2.5 text-xs font-sans">
            <li>
              <Link href="/overview" className="hover:text-white transition-colors">Synz Phantom Appliance</Link>
            </li>
            <li>
              <Link href="/overview#features" className="hover:text-white transition-colors">Edge Interceptor SoM</Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white transition-colors">Threat Console Portal</Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Resources */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Resources</h4>
          <ul className="space-y-2.5 text-xs font-sans">
            <li>
              <Link href="/blog" className="hover:text-white transition-colors">Threat Research Blog</Link>
            </li>
            <li>
              <Link href="/overview#specs" className="hover:text-white transition-colors">Technical Specifications</Link>
            </li>
            <li>
              <Link href="/compliance" className="hover:text-white transition-colors">Compliance Certifications</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Company</h4>
          <ul className="space-y-2.5 text-xs font-sans">
            <li>
              <Link href="/overview#about" className="hover:text-white transition-colors">Corporate Overview</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">Contact operations</Link>
            </li>
            <li>
              <a href="mailto:info@synzlabs.io" className="hover:text-white transition-colors">info@synzlabs.io</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans text-slate-500">
        <span>&copy; {new Date().getFullYear()} Synz Labs Inc. All rights reserved.</span>
        <div className="flex gap-6">
          <Link href="/overview" className="hover:text-slate-400">Security Specs</Link>
          <Link href="/compliance" className="hover:text-slate-400">Compliance Badges</Link>
          <a href="#" className="hover:text-slate-400">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
