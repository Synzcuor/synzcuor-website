import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers — synzcuor",
  description:
    "Open conversations, not open roles. What we would want, what is honestly on offer, and the risks stated up front.",
};

const roles = [
  {
    title: "Co-founder / CTO",
    status: "Open conversation",
    lede: "The person who owns whether this actually works.",
    body: "Take the private training benchmark from a research script to something a research group runs on its own hardware, behind its own firewall, without us present. Own the honest answer to how much pooling really buys. Own the security posture — the whole claim is that the data does not leave, and that claim will be tested by people paid to test it.",
    want: [
      "Built and shipped distributed ML systems that ran somewhere other than your laptop",
      "Depth in federated learning, secure aggregation, applied cryptography or privacy-preserving ML",
      "Comfortable as the most senior engineer in the room with nobody to escalate to",
    ],
    not: "Quantum background is not required. The quantum layer is years out.",
  },
  {
    title: "Chief Scientist",
    status: "Open conversation",
    lede: "The person who owns the scientific question the company rests on.",
    body: "Define the benchmark — what task, what datasets, what baseline, what result would falsify the thesis — and write it down before running it. Establish the honest delta between a federated model and a single-silo model on real materials data. If that number is small, the company needs to know in month three, not year three.",
    want: [
      "Track record in computational materials science, chemistry or scientific ML, with publications we can read",
      "Still writes code and runs experiments",
      "Rigour about negative results — the most valuable thing you could do in year one is establish that the effect is real, or that it is not",
    ],
    not: "If a full-time move is not possible, an advisor arrangement is a real alternative and we would take it gladly.",
  },
  {
    title: "Chief Commercial Officer",
    status: "Later — after the benchmark",
    lede: "The hardest problem here is the first three participants, and it is commercial, not technical.",
    body: "The technology can be demonstrated on public data. What cannot be demonstrated in advance is that a research director will put proprietary experimental data into a training run operated by a startup. Build the buyer map, run the conversations that validate or kill the thesis, land the first two participants.",
    want: [
      "Sold complex, high-consideration deals into R&D or technical buyers",
      "Opened a market that did not have a category yet, and can describe how",
      "An existing network in materials, chemicals, batteries, semiconductors or pharma R&D — close to decisive, because the founder's is honestly zero",
    ],
    not: "Overstating a guarantee to close a deal would end this company. That is not aggression here, it is a misrepresentation in a signed contract.",
  },
  {
    title: "Chief Operating Officer",
    status: "Not yet — roughly ten people out",
    lede: "Listed for honesty, not because we are hiring it.",
    body: "A pre-revenue research company with one person does not need a COO, and hiring one early is a recognisable failure mode. When it exists, the job is consortium operations: onboarding a participant is a six-to-twelve-month process across their legal, security, IT and research teams, and making that repeatable is the difference between a company that scales and three heroic deals.",
    want: [
      "Ran operations at a company selling into large, careful, regulated organisations",
      "Personally negotiated complex commercial contracts, not just approved them",
      "Consortium or joint-venture experience — rare, and close to decisive",
    ],
    not: "If you join and there is no operational load yet, you will be underemployed and you will leave. Better to have that conversation now.",
  },
];

export default function CareersPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="eyebrow mb-5">Careers</p>
      <h1 className="font-display text-4xl sm:text-5xl leading-tight tracking-tight text-ink">
        Open conversations, not open roles
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-2">
        There is no money to pay anyone yet, so nothing below is a job posting. What is
        real is that the right person changes what this company can attempt, and those
        conversations are worth having before there is a budget rather than after.
      </p>

      <div className="mt-10 rounded-lg border border-flag/25 bg-flag-soft p-7">
        <p className="eyebrow mb-4" style={{ color: "var(--color-flag)" }}>
          What is honestly on offer
        </p>
        <ul className="space-y-2.5 text-sm leading-relaxed text-ink-2">
          {[
            "Not incorporated. No funding. No revenue. No customers. No other employees.",
            "One publication behind the technical thesis, by the founder.",
            "Cash: none until a round closes. Below market after that until first revenue.",
            "Equity: real, documented, and meaningful — with a ten-year exercise window rather than the usual ninety days, so if this works you keep what you earned regardless of what happens between us.",
            "The base case for any company at this stage is that it fails and the equity is worth zero.",
            "The upside case is a category that does not exist yet, and a decade of work.",
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
          "A 45-minute call, half of it your questions. If you have no hard questions about the risk, you have not understood the risk.",
          "A paid work sample — four to six hours, on a real problem from the roadmap. Paid at a real rate even pre-funding. Never unpaid, never a puzzle.",
          "A 90-minute deep dive on the work sample and your strongest past project.",
          "Three references, before the offer rather than after.",
        ].map((s, i) => (
          <li key={s} className="flex gap-4">
            <span className="font-mono text-xs text-accent pt-0.5">{String(i + 1).padStart(2, "0")}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-sm text-muted">
        A no arrives by the end of the week. A slow no is the most expensive thing a small
        company does to its reputation.
      </p>

      <div className="mt-14 rounded-lg border border-rule bg-card p-8">
        <h2 className="font-display text-2xl text-ink">Questions we hope you ask</h2>
        <ul className="mt-4 space-y-2 text-sm text-ink-2">
          {[
            "What happens to the pooled model when a participant leaves?",
            "What is the actual privacy guarantee, stated precisely, with its assumptions?",
            "Why does participant number four join, once one to three are in?",
            "What is the kill line, and are you actually prepared to act on it?",
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
          There are written answers to all of these, including the uncomfortable ones.
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
