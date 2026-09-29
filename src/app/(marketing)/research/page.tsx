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
    note: "Preprint, being revised after peer review. A hybrid quantum-classical model for generating crystal structures, tested at small scale. It shows experience in the field. It does not claim an advantage over classical generative models.",
    url: "",
  },
];

const openQuestions = [
  {
    q: "How much does pooling actually improve the model?",
    s: "Measured on public data",
    d: "On a public band-gap dataset split by chemical system across 16 simulated holders, the pooled model cut test error by 34–40% against the best single holder; on a small steels dataset with three holders, 22–28%. The threshold was 10%, set in advance. These are simulated holders from one public dataset, not real labs.",
  },
  {
    q: "Does pooling help each member, or only the pool?",
    s: "Measured: not always",
    d: "Scored on each member's own chemistry, the strongest specialist was worse off with the pooled model. A member-specific head on the shared encoder nearly closes that gap, and does not close it.",
  },
  {
    q: "Does the gain survive realistic inter-lab measurement bias?",
    s: "Partly measured",
    d: "A constant per-lab offset of 0.1 standard deviations reduces the gain but does not erase it. Real inter-lab disagreement is more complicated than a constant offset, and larger offsets are untested.",
  },
  {
    q: "How fast does a frozen checkpoint lose value against a continuously retrained model?",
    s: "Lower bound measured",
    d: "A copy frozen at the start carries 42–57% more error than a model retrained as five more chemistries join. That is measured by adding data, not by real-world drift, so it is a lower bound.",
  },
  {
    q: "Can one member damage the pool without being detected?",
    s: "Open problem",
    d: "Yes. One member doubling its update raised the shared model's error by 81% in a four-member pool. The standard defences need the server to see individual updates, and secure aggregation is designed so it cannot. No defence that works on masked updates is built.",
  },
  {
    q: "Can pooled lab records, including failures, predict what can be made?",
    s: "Proxy results",
    d: "Public data has no failed syntheses. On public successes, pooling helps, and on compounds reported after the training cutoff the model beats both a similarity-only and a size-only baseline in both size-matched settings, on all three random splits tested. Testing the real claim needs a partner lab's failure records.",
  },
  {
    q: "Could training run on a remote quantum computer that sees neither the data nor the model?",
    s: "Open",
    d: "Quantum protocols for this kind of hidden (blind) computation exist on paper. Whether they can keep both the pooling privacy and the computation privacy at once, for training like ours, is unresolved. It needs hardware that does not exist yet.",
  },
];

export default function ResearchPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="eyebrow mb-5">Research</p>
      <h1 className="font-display text-4xl sm:text-5xl leading-tight tracking-tight text-ink">
        We intend to publish our results, including the ones that go against us
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-2">
        So far that is one paper and the numbers on this site. The code is not public yet.
        Publishing it is part of the plan, because a privacy claim is only worth something
        if participants can check it for themselves, and because a company like this should
        rest on work other people can reproduce.
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
        One co-authored paper, still a preprint. That is the honest size of the track record behind
        this, and it is the constraint the company is most aware of.
      </p>

      <h2 className="font-display text-2xl text-ink mt-14">Open questions we are working on</h2>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        Where each one stands. The numbers, with their setups and limits, are on the{" "}
        <Link href="/results" className="link">results page</Link>.
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
        We plan to open-source the training and aggregation client. There is precedent:
        Owkin open-sourced Substra, the software behind the MELLODDY pharma consortium, and
        moved it to the Linux Foundation. We think the lasting value is in the trained
        model, the work of making different labs&rsquo; data comparable, and the neutral
        position, not in the code.
      </p>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        The benchmark code exists but is not public yet. Until it is, the numbers on this
        site cannot be checked independently. When it is released, a reader should be able to
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
          Every number we publish comes with its setup and its limits, and with a confidence
          interval wherever the experiment was repeated enough to compute one. The cost of
          privacy gets published even when it is unflattering.
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
