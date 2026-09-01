import React from "react";
import Link from "next/link";
import FederationDiagram from "../../components/FederationDiagram";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative border-b border-rule">
        <div className="absolute inset-0 grid-paper pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24">
          <p data-enter className="eyebrow mb-6">Private federated learning for materials R&D</p>
          <h1 data-enter className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.08] tracking-tight text-ink max-w-4xl">
            The training data for materials AI does not exist.
            <span className="block text-muted italic mt-2">
              It is locked inside companies that compete.
            </span>
          </h1>
          <p data-enter className="mt-8 text-lg leading-relaxed text-ink-2 max-w-2xl">
            Every group working on batteries, catalysts and semiconductors holds
            experimental data that would make everyone&rsquo;s models better if it were
            combined — and none of them will hand it over, because that data is the
            company. So each one trains alone on a dataset too small to matter, and the
            field moves at the speed of the smallest silo.
          </p>
          <p data-enter className="mt-5 text-lg leading-relaxed text-ink-2 max-w-2xl">
            We train a shared model across those silos{" "}
            <strong className="font-semibold text-ink">
              without the data ever leaving its owner
            </strong>
            .
          </p>

          <div data-enter className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/participate"
              className="px-5 py-2.5 rounded-md bg-ink text-paper text-sm font-medium hover:bg-accent transition-colors"
            >
              For research groups
            </Link>
            <Link
              href="/approach"
              className="px-5 py-2.5 rounded-md border border-rule bg-card text-ink text-sm font-medium hover:border-accent hover:text-accent transition-colors"
            >
              How it works
            </Link>
          </div>

          <p data-enter className="mt-10 font-mono text-xs text-muted">
            Pre-seed · pre-product · one person · nothing shipped yet
          </p>
        </div>
      </section>

      {/* The mechanism */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p data-reveal className="eyebrow mb-4">The mechanism</p>
        <h2 data-reveal className="font-display text-3xl sm:text-4xl tracking-tight text-ink max-w-2xl">
          Nothing crosses the boundary except a masked sum
        </h2>
        <p data-reveal className="mt-5 text-base leading-relaxed text-ink-2 max-w-2xl">
          Each participant trains on its own hardware, behind its own firewall. Only
          model updates leave, and they leave under a mask that cancels in the sum — so
          the aggregator sees the total and never an individual contribution.
        </p>

        <div data-reveal className="mt-12">
          <FederationDiagram />
        </div>

        <div data-stagger className="mt-12 grid md:grid-cols-3 gap-8">
          {[
            {
              n: "01",
              h: "The data never moves",
              p: "Not encrypted in transit — never transmitted. Raw measurements stay inside the organisation that produced them, on infrastructure it controls.",
            },
            {
              n: "02",
              h: "Updates are masked before they leave",
              p: "Plain federated learning is not private: updates leak, and gradient inversion can reconstruct training examples. Secure aggregation is the difference between a promise and a guarantee.",
            },
            {
              n: "03",
              h: "Each participant gets a private model",
              p: "Fine-tuned on their own data, measurably better than anything they could have trained alone. That gap is the entire product, and it is the number we are measuring first.",
            },
          ].map((s) => (
            <div key={s.n} className="space-y-3">
              <span className="font-mono text-xs text-accent">{s.n}</span>
              <h3 className="font-display text-xl text-ink">{s.h}</h3>
              <p className="text-sm leading-relaxed text-muted">{s.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The seam */}
      <section className="border-y border-rule bg-paper-2">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p data-reveal className="eyebrow mb-4">What you keep</p>
          <h2 data-reveal className="font-display text-3xl sm:text-4xl tracking-tight text-ink max-w-2xl">
            You own your model. We maintain the foundation it stands on.
          </h2>
          <p data-reveal className="mt-5 text-base leading-relaxed text-ink-2 max-w-2xl">
            The ownership line sits on the technical seam that is already there. The
            general representation is learned from everyone and no single group would
            ever build it — no one lab&rsquo;s task justifies its generality. Everything
            task-specific is different for every participant by nature, and it is yours.
          </p>

          <div data-stagger className="mt-10 grid md:grid-cols-2 gap-5">
            <div className="rounded-lg border border-rule bg-card p-7">
              <h3 className="font-display text-xl text-ink">Yours, outright</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-2">
                {[
                  "Your raw data — it never left",
                  "Your fine-tuned model and every output from it",
                  "Every discovery you make with it. We claim nothing downstream",
                  "A perpetual offline deployment",
                  "An escrow claim on the shared encoder",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span className="text-accent mt-0.5">—</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-rule bg-card p-7">
              <h3 className="font-display text-xl text-ink">Held by us, as custodian</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-2">
                {[
                  "The shared encoder trained across everyone",
                  "The pipeline, and the harmonisation across labs that makes it work",
                  "The evaluation — the only place the pooled comparison can be computed",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span className="text-muted mt-0.5">—</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-muted border-t border-rule pt-4">
                Somebody has to hold the shared part, and it structurally cannot be one of
                the participants — no company accepts that a competitor holds the asset
                built from its own data. That is a position, not a technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why a company */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p data-reveal className="eyebrow mb-4">Why this is a company</p>
        <h2 data-reveal className="font-display text-3xl sm:text-4xl tracking-tight text-ink max-w-3xl">
          The last time this worked, it was a research project — and it stopped when the
          funding did.
        </h2>
        <div data-stagger className="mt-10 grid md:grid-cols-3 gap-10">
          {[
            {
              h: "Continuity",
              p: "A consortium is a project with an end date. A pooled model only stays valuable if it keeps training. A consortium cannot sell itself continuity.",
            },
            {
              h: "Neutrality",
              p: "A consortium of rivals still needs a trusted operator, and standing one up is a governance project none of them wants to run.",
            },
            {
              h: "The mechanism is open",
              p: "We publish the method and the code. That is deliberate: participants can verify the custodian cannot peek. What accumulates is the model, and it cannot be rebuilt from the code that built it.",
            },
          ].map((c) => (
            <div key={c.h} className="space-y-3">
              <h3 className="font-display text-xl text-ink">{c.h}</h3>
              <p className="text-sm leading-relaxed text-muted">{c.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Honest status */}
      <section className="border-t border-rule">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div data-reveal className="rounded-lg border border-flag/25 bg-flag-soft p-8 md:p-10">
            <p className="eyebrow mb-4" style={{ color: "var(--color-flag)" }}>
              Where we actually are
            </p>
            <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-ink">
              Most of this does not exist yet, and saying so is the point.
            </h2>
            <div data-stagger className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                ["Company", "Not incorporated"],
                ["Funding", "None"],
                ["Customers", "None. Nobody has signed anything"],
                ["Team", "One person"],
              ].map(([k, v]) => (
                <div key={k} className="space-y-1.5">
                  <span className="eyebrow block">{k}</span>
                  <span className="text-sm text-ink-2">{v}</span>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm leading-relaxed text-ink-2 max-w-2xl">
              What exists is the research, one peer-reviewed publication behind the
              technical thesis, and a benchmark under construction. The next milestone is
              a working two-party private training run on real materials data. If that run
              shows pooling does not help enough to matter, we will publish that result and
              stop — the threshold is written down in advance.
            </p>
            <Link href="/research" className="link mt-5 inline-block text-sm">
              What is proven, and what is not
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-8">
        <div data-reveal className="rounded-lg border border-rule bg-card p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-ink">
              The first participants are academic groups
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              They have data, they want co-authorship, and they have no IP counsel to
              satisfy. If that is you — or if you think the whole idea is wrong and can say
              why — that is the conversation we want.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 px-6 py-3 rounded-md bg-ink text-paper text-sm font-medium hover:bg-accent transition-colors text-center"
          >
            Start a conversation
          </Link>
        </div>
      </section>
    </>
  );
}
