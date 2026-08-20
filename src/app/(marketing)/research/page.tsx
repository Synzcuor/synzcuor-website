import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research — synzcuor",
  description:
    "Publications, open-source posture, and an explicit account of what is proven and what is not.",
};

// Fill these in as they land. Empty string renders as plain text with no dead link.
const PUBLICATIONS = [
  {
    title: "SH-QGAN: a split-head quantum generative model for crystal structures",
    note: "Peer-reviewed. The publication behind the technical thesis — it is domain access and demonstrated capability, not a claimed advantage over classical generative models.",
    url: "",
  },
];

const openQuestions = [
  {
    q: "How much does pooling actually improve the model?",
    s: "In progress",
    d: "Split a public materials dataset across simulated holders, train each alone, train the pool, measure the gap. The threshold is set in advance: under roughly 10% gain over the best single holder on a realistic chemical-system split, there is no product, and we publish that and stop.",
  },
  {
    q: "Does the gain survive realistic inter-lab measurement bias?",
    s: "Planned",
    d: "Real labs disagree with each other by more than the signal being learned. If pooling collapses under systematic per-lab offsets, that has to surface now rather than at participant three.",
  },
  {
    q: "How fast does a frozen checkpoint decay against a continuously retrained model?",
    s: "Planned",
    d: "It decides whether access to a live model is worth more than a copy — which is the whole commercial argument, currently an assertion rather than a curve.",
  },
  {
    q: "Does running local training through the blind delegation loop preserve both guarantees?",
    s: "Open",
    d: "Genuinely unresolved, and possibly the research contribution. Stated as open until proven.",
  },
];

export default function ResearchPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="eyebrow mb-5">Research</p>
      <h1 className="font-display text-4xl sm:text-5xl leading-tight tracking-tight text-ink">
        We publish everything, including the results that go against us
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-2">
        Open publication is the strategy, not a concession. The mechanism being public
        strengthens the custodian position rather than weakening it — participants can
        verify that we cannot peek — and it means the credibility of this company rests on
        work anyone can check.
      </p>

      <hr className="my-14 border-rule" />

      <h2 className="font-display text-2xl text-ink">Publications</h2>
      <ul className="mt-6 space-y-6">
        {PUBLICATIONS.map((p) => (
          <li key={p.title} className="border-l-2 border-accent pl-5">
            {p.url ? (
              <a href={p.url} className="link font-medium text-base">
                {p.title}
              </a>
            ) : (
              <span className="font-medium text-base text-ink">{p.title}</span>
            )}
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.note}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted">
        One publication, by one person. That is the honest size of the track record behind
        this, and it is the constraint the company is most aware of.
      </p>

      <h2 className="font-display text-2xl text-ink mt-14">Open questions we are working on</h2>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        These are the live ones, in the order they block the work.
      </p>
      <div className="mt-8 space-y-6">
        {openQuestions.map((o) => (
          <div key={o.q} className="rounded-lg border border-rule bg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-lg text-ink">{o.q}</h3>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-paper-2 text-muted border border-rule">
                {o.s}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">{o.d}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-2xl text-ink mt-14">Open source</h2>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        The training and aggregation client will be open source. The precedent is
        unambiguous: the platform that ran the largest federated pharma consortium was
        open-sourced and donated to the Linux Foundation by the company that built it,
        which remained a unicorn. The code is not the asset. The pooled model, the
        harmonisation across labs and the custodian position are.
      </p>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        There is nothing to release yet. When there is, a reader should be able to
        reproduce a headline number in under thirty minutes, and the threat model and its
        limits ship in the repository rather than in a sales deck.
      </p>

      <div className="mt-14 rounded-lg border border-flag/25 bg-flag-soft p-7">
        <p className="eyebrow mb-3" style={{ color: "var(--color-flag)" }}>
          Standing rule
        </p>
        <p className="font-display text-xl leading-snug text-ink">
          A claim is not an asset until one real run demonstrates it, and a market is not a
          market until one named buyer has a budget line.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink-2">
          Every number this company publishes will carry a confidence interval, and the
          privacy overhead gets published even when it is unflattering.
        </p>
      </div>

      <div className="mt-14">
        <Link href="/approach" className="link text-sm">
          The technical approach, in detail
        </Link>
      </div>
    </div>
  );
}
