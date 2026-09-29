import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers — synzcuor",
  description:
    "Open conversations rather than posted roles: what each role involves, what is on offer, and the risks.",
};

const roles = [
  {
    title: "Founding Engineer & Head of Engineering",
    status: "Open conversation",
    lede: "Responsible for building and shipping pooling and security.",
    body: "Package private fine-tuning to run on a single workstation inside a customer's firewall, with no outbound network calls. Run the customer-facing benchmark on real ionic-conductivity data. Then build the multi-company training system, including secure aggregation, member authentication and defences against corrupted updates, and lead the first engineering hires.",
    want: [
      "Experience building and shipping machine-learning systems beyond a single laptop",
      "Depth in federated learning, secure aggregation, applied cryptography or privacy-preserving ML",
      "Comfort working as the senior engineer without a larger team to rely on",
    ],
    not: "A quantum-computing background is not required.",
  },
  {
    title: "Co-founder: Go-to-Market, Operations & Marketing",
    status: "Open conversation",
    lede: "Responsible for everything between the product and the customer.",
    body: "Run outreach to battery-materials companies and research laboratories, conduct customer conversations, and convert interest into pilots and pilots into customers. Handle incorporation and contracts with counsel, the hiring process, budgets and grants. Own the website, the company's public presence and conference work, keeping every claim within the evidence.",
    want: [
      "A technical background in chemistry, chemical engineering or materials science, or the ability to discuss R&D credibly",
      "Consistent follow-through on outreach and operations",
      "Experience or contacts in battery, materials or chemicals R&D is a strong advantage",
    ],
    not: "Overstating a guarantee to secure a deal would misrepresent the product in a signed contract, and is not acceptable here.",
  },
  {
    title: "Scientific advisors",
    status: "Open conversation",
    lede: "Guidance on materials synthesis and solid-state electrolytes.",
    body: "A few hours a month: reviewing the validation method and benchmarks, advising on what laboratories record and share, and making introductions where appropriate. Academic advisors are offered co-authorship on the methods work.",
    want: [
      "Research experience in solid-state synthesis, battery electrolytes or synthesizability prediction",
      "Familiarity with how laboratories record successful and failed syntheses",
      "Willingness to identify where the approach is weak",
    ],
    not: "Advisory arrangements are documented, with a small equity grant.",
  },
];

export default function CareersPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="eyebrow mb-5">Careers</p>
      <h1 className="font-display text-4xl sm:text-5xl leading-tight tracking-tight text-ink">
        Roles under discussion
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-2">
        The company is not yet funded, so these are not job postings. We are nonetheless
        holding conversations now, because the right people will shape what the company can
        attempt.
      </p>

      <div className="mt-10 rounded-lg border border-flag/25 bg-flag-soft p-7">
        <p className="eyebrow mb-4" style={{ color: "var(--color-flag)" }}>
          Terms and current status
        </p>
        <ul className="space-y-2.5 text-sm leading-relaxed text-ink-2">
          {[
            "Not yet incorporated. No funding, revenue or customers yet.",
            "One co-authored paper behind the technical thesis: a preprint, in revision after peer review.",
            "Cash: none until a funding round closes; below market until first revenue.",
            "Equity, once the company is incorporated: documented, with four-year vesting and a planned ten-year exercise window instead of the usual ninety days.",
            "Most companies at this stage fail, in which case the equity is worth nothing.",
            "If it succeeds, the result is a lasting company in an emerging field, built over a decade.",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="text-flag mt-0.5">—</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      <hr className="my-14 border-rule" />

      <div className="space-y-12">
        {roles.map((r) => (
          <article key={r.title} className="rounded-lg border border-rule bg-card p-7 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="font-display text-2xl text-ink">{r.title}</h2>
              <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-paper-2 text-muted border border-rule">
                {r.status}
              </span>
            </div>
            <p className="mt-3 text-base italic text-ink-2 font-display">{r.lede}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{r.body}</p>
            <p className="eyebrow mt-6 mb-3">What we would look for</p>
            <ul className="space-y-2 text-sm text-ink-2">
              {r.want.map((w) => (
                <li key={w} className="flex gap-2.5">
                  <span className="text-accent mt-0.5">—</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-muted border-t border-rule pt-4">
              {r.not}
            </p>
          </article>
        ))}
      </div>

      <h2 className="font-display text-2xl text-ink mt-16">How the process runs</h2>
      <ol className="mt-6 space-y-3 text-sm leading-relaxed text-ink-2">
        {[
          "A written brief for the role, sent before the first call.",
          "A 45-minute call, half of which is reserved for your questions, including about the risks.",
          "A paid work sample of four to six hours on a real problem from the roadmap.",
          "A 90-minute technical discussion of the work sample and your strongest previous project.",
          "Three references, taken before any offer.",
        ].map((s, i) => (
          <li key={s} className="flex gap-4">
            <span className="font-mono text-xs text-accent pt-0.5">{String(i + 1).padStart(2, "0")}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-sm text-muted">
        Every candidate receives a decision within a week.
      </p>

      <div className="mt-14 rounded-lg border border-rule bg-card p-8">
        <h2 className="font-display text-2xl text-ink">Questions we hope you ask</h2>
        <ul className="mt-4 space-y-2 text-sm text-ink-2">
          {[
            "What happens to the pooled model when a participant leaves?",
            "What is the privacy guarantee, stated precisely, with its assumptions?",
            "Why would a fourth participant join once three are in?",
            "What result would end the company, and would you act on it?",
            "Who has said no so far, and why?",
            "What did you get wrong in the last twelve months?",
          ].map((q) => (
            <li key={q} className="flex gap-2.5">
              <span className="text-accent mt-0.5">—</span>
              <span>{q}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-muted">
          Written answers to each of these are available on request.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block px-5 py-2.5 rounded-md bg-ink text-paper text-sm font-medium hover:bg-accent transition-colors"
        >
          Start a conversation
        </Link>
      </div>
    </div>
  );
}
