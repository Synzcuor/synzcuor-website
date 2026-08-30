import React from "react";
import Link from "next/link";
import Mark from "./Mark";

export default function Footer() {
  return (
    <footer className="w-full border-t border-rule bg-paper-2 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <Mark className="w-10 h-10 -ml-1" />
            <span className="font-display text-xl tracking-tight text-ink lowercase">synzcuor</span>
          </div>
          <p className="text-sm leading-relaxed text-muted max-w-sm">
            A shared model for materials research, trained across data that never moves.
          </p>
          <p className="text-xs text-muted/80 max-w-sm">
            Pre-seed and pre-product. Nothing on this site is a commercial offer.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="eyebrow">The work</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/approach" className="hover:text-ink transition-colors">Approach</Link></li>
            <li><Link href="/participate" className="hover:text-ink transition-colors">Participate</Link></li>
            <li><Link href="/research" className="hover:text-ink transition-colors">Research</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="eyebrow">Company</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/careers" className="hover:text-ink transition-colors">Careers</Link></li>
            <li><Link href="/contact" className="hover:text-ink transition-colors">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 border-t border-rule flex flex-col sm:flex-row justify-between gap-3 text-xs text-muted">
        <span>&copy; {new Date().getFullYear()} synzcuor</span>
        <span className="font-mono">Not incorporated. No funding. No customers yet.</span>
      </div>
    </footer>
  );
}
