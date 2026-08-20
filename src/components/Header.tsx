"use client";

import React, { useState } from "react";
import Link from "next/link";
import Mark from "./Mark";

const nav = [
  { href: "/approach", label: "Approach" },
  { href: "/participate", label: "Participate" },
  { href: "/research", label: "Research" },
  { href: "/careers", label: "Careers" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-paper/85 backdrop-blur-md border-b border-rule">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Mark className="w-6 h-6 text-accent transition-transform group-hover:rotate-30 duration-500" />
          <span className="font-display text-xl tracking-tight text-ink lowercase">synzcuor</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-ink transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/contact"
            className="px-4 py-2 text-xs font-medium text-paper bg-ink hover:bg-accent transition-colors rounded-md"
          >
            Get in touch
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          aria-expanded={open}
          className="md:hidden p-2 -mr-2 text-ink"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-rule bg-paper px-6 py-4 space-y-3">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-ink-2"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-accent"
          >
            Get in touch
          </Link>
        </div>
      )}
    </header>
  );
}
