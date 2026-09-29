import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research — synzcuor",
  description:
    "Publications, open-source plans, and an account of what is proven and what is not.",
};

// Fill these in as they land. Empty string renders as plain text with no dead link.
const PUBLICATIONS = [
  {
    title: "SH-QGAN: a split-head quantum generative model for crystal structures",
    note: "Preprint, in revision after peer review. A hybrid quantum-classical model for generating crystal structures, tested at small scale. It does not claim an advantage over classical generative models.",
    url: "",
  },
];

const openQuestions = [
  {
    q: "How much does pooling improve the model?",
    s: "Measured on public data",
    d: "On a public band-gap dataset split by chemical system across 16 simulated holders, the pooled model reduced test error by 34–40% relative to the best single holder; on a small steels dataset with three holders, by 22–28%. The predefined threshold was 10%. The holders are simulated from one public dataset, not real laboratories.",
  },
  {
    q: "Does pooling help each member, or only the pool?",
    s: "Measured: not always",
    d: "Scored on each member's own chemistry, the strongest specialist performed worse with the pooled model. A member-specific head on the shared encoder narrows that gap but does not close it.",
  },
  {
    q: "Does the gain survive realistic inter-lab measurement bias?",
    s: "Partly measured",
    d: "A constant per-laboratory offset of 0.1 standard deviations reduces the gain but does not eliminate it. Real inter-laboratory disagreement is more complex than a constant offset, and larger offsets are untested.",
  },
  {
    q: "How fast does a frozen checkpoint lose value against a continuously retrained model?",
    s: "Lower bound measured",
    d: "A copy frozen at the start has 42–57% more error than a model retrained as five further chemistries join. This was measured by adding data rather than by real-world drift, so it is a lower bound.",
  },
  {
    q: "Can one member damage the pool without being detected?",
    s: "Open problem",
    d: "Yes. One member doubling its update raised the shared model's error by 81% in a four-member pool. The standard defences require the server to see individual updates, which secure aggregation prevents. No defence that operates on masked updates has been built.",
  },
  {
    q: "Can pooled lab records, including failures, predict what can be made?",
    s: "Proxy results",
    d: "Public data contains no failed syntheses. On public successes, pooling helps, and on compounds reported after the training cutoff the model outperforms both a similarity-only and a size-only baseline in both size-matched settings, on all three random splits tested. Testing the central claim requires a partner laboratory's failure records.",
  },
  {
    q: "Could training run on a remote quantum computer that sees neither the data nor the model?",
    s: "Open",
    d: "Quantum protocols for this kind of hidden (blind) computation exist in theory. Whether they can preserve both pooling privacy and computation privacy at once, for training of this kind, is unresolved, and they require hardware that does not yet exist.",
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
        So far this comprises one paper and the results on this site; the code is not yet
        public. We intend to publish it, because a privacy claim is credible only if
        participants can verify it, and because the company&rsquo;s results should be
        reproducible by others.
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
        One co-authored paper, currently a preprint. The publication record is limited, and we
        say so.
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
        We plan to open-source the training and aggregation client. There is precedent: Owkin
        open-sourced Substra, the software behind the MELLODDY pharmaceutical consortium, and
        transferred it to the Linux Foundation. The lasting value lies in the trained model, the
        harmonisation of data across laboratories, and the neutral position, not in the code.
      </p>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        The benchmark code exists but is not yet public; until it is, the results on this site
        cannot be independently verified. Once released, a reader should be able to reproduce a
        headline result in under thirty minutes, and the threat model and its limits will be
        published with the code.
      </p>

      <div className="mt-14 rounded-lg border border-flag/25 bg-flag-soft p-7">
        <p className="eyebrow mb-3" style={{ color: "var(--color-flag)" }}>
          Our standard
        </p>
        <p className="font-display text-xl leading-snug text-ink">
          No claim without a result that demonstrates it, and no market without a named buyer.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink-2">
          Every result we publish is reported with its method and limitations, and with a
          confidence interval wherever the experiment was repeated enough to compute one. The
          cost of privacy is reported even when it is unfavourable.
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
