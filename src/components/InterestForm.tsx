"use client";

import React, { useState } from "react";

type Role =
  | "academic_group"
  | "industrial_rnd"
  | "engineer"
  | "cofounder"
  | "investor"
  | "other";

const roles: { value: Role; label: string }[] = [
  { value: "academic_group", label: "Academic research group with data" },
  { value: "industrial_rnd", label: "Industrial R&D — materials, chemistry, batteries, semis" },
  { value: "engineer", label: "Engineer or scientist interested in joining" },
  { value: "cofounder", label: "Potential co-founder" },
  { value: "investor", label: "Investor" },
  { value: "other", label: "Something else" },
];

export default function InterestForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "academic_group" as Role,
    note: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("That email address does not look right.");
      return;
    }

    setPending(true);
    try {
      const configured =
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

      if (configured) {
        const { supabase } = await import("@/lib/supabaseClient");
        const { error: insertError } = await supabase.from("waitlist").insert([
          {
            name: form.name,
            email: form.email,
            company: form.company,
            role: form.role,
            note: form.note,
          },
        ]);
        if (insertError) throw new Error(insertError.message);
      }
      setSubmitted(true);
    } catch (err) {
      setError(
        `Could not send that: ${err instanceof Error ? err.message : String(err)}. Email us directly instead.`,
      );
    } finally {
      setPending(false);
    }
  };

  if (submitted) {
    return (
      <div className="border border-rule bg-card rounded-lg p-8 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-accent-soft text-accent mx-auto flex items-center justify-center">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-display text-2xl text-ink">Received</h3>
        <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed">
          One person reads these, and that person will reply. If it has been a week, the
          email went somewhere strange — write again.
        </p>
      </div>
    );
  }

  const field =
    "w-full h-11 px-3 rounded-md bg-card border border-rule text-ink text-sm placeholder:text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="space-y-1.5 block">
          <span className="eyebrow block">Name</span>
          <input
            id="form-name"
            required
            value={form.name}
            onChange={(e) => set("name")(e.target.value)}
            className={field}
            placeholder="Your name"
          />
        </label>
        <label className="space-y-1.5 block">
          <span className="eyebrow block">Email</span>
          <input
            id="form-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => set("email")(e.target.value)}
            className={field}
            placeholder="you@university.edu"
          />
        </label>
      </div>

      <label className="space-y-1.5 block">
        <span className="eyebrow block">Group, lab or company</span>
        <input
          id="form-company"
          required
          value={form.company}
          onChange={(e) => set("company")(e.target.value)}
          className={field}
          placeholder="Where you work"
        />
      </label>

      <label className="space-y-1.5 block">
        <span className="eyebrow block">Which of these is closest</span>
        <select
          id="form-role"
          value={form.role}
          onChange={(e) => set("role")(e.target.value)}
          className={field}
        >
          {roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1.5 block">
        <span className="eyebrow block">
          Anything useful — including what you think is wrong with this
        </span>
        <textarea
          id="form-note"
          rows={4}
          value={form.note}
          onChange={(e) => set("note")(e.target.value)}
          className="w-full px-3 py-2.5 rounded-md bg-card border border-rule text-ink text-sm placeholder:text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors resize-y"
          placeholder="Optional, and the most useful part."
        />
      </label>

      {error && (
        <p className="text-xs text-flag bg-flag-soft border border-flag/20 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full h-11 rounded-md bg-ink text-paper text-sm font-medium hover:bg-accent transition-colors disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send"}
      </button>
      <p className="text-xs text-muted">
        No newsletter, no drip sequence. This goes to one inbox.
      </p>
    </form>
  );
}
