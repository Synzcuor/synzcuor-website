import React from "react";
import Link from "next/link";
import FederationDiagram from "../../components/FederationDiagram";
import HeroNetwork from "../../components/HeroNetwork";
import PillarIcon from "../../components/PillarIcon";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative border-b border-rule overflow-hidden">
        <div className="absolute inset-0 grid-paper pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-8 items-center">
          <div>
            <p data-enter className="eyebrow mb-6">AI for materials R&amp;D · validation · pooling · security</p>
            <h1 data-enter className="font-display text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.06] tracking-tight text-ink">
              AI designs materials faster than labs can make them.
              <span className="block text-accent italic mt-3">
                Synzcuor predicts which ones can actually be made.
              </span>
            </h1>
            <p data-enter className="mt-8 text-lg leading-relaxed text-ink-2 max-w-xl">
              The answer is in failed syntheses, and laboratories never publish them. Synzcuor&rsquo;s
              validator learns from them where they live, pooled across laboratories{" "}
              <strong className="font-semibold text-ink">without any data leaving its owner</strong>.
            </p>

            <div data-enter className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="px-5 py-3 rounded-md bg-ink text-paper text-sm font-medium hover:bg-accent transition-colors"
              >
                Start a conversation
              </Link>
              <Link
                href="/results"
                className="px-5 py-3 rounded-md border border-rule bg-card text-ink text-sm font-medium hover:border-accent hover:text-accent transition-colors"
              >
                View results
              </Link>
            </div>

            <p data-enter className="mt-9 font-mono text-xs text-muted">
              Pre-seed · pre-product · team forming · public-data results only
            </p>
          </div>
          <div data-enter>
            <HeroNetwork />
          </div>
        </div>
      </section>

      {/* Proof band */}
      <section className="bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div data-stagger className="grid md:grid-cols-3 gap-10 md:gap-8">
            {[
              ["6 of 6", "size-matched validation runs in which the model outperforms both baselines on newly reported compounds"],
              ["34–40%", "reduction in prediction error from pooling, relative to the best single laboratory"],
              ["3.2×", "training-time overhead of secure aggregation over a network, with no measurable loss of accuracy"],
            ].map(([n, l]) => (
              <div key={n} className="space-y-3">
                <p className="font-display text-5xl lg:text-6xl tracking-tight text-[#8fd0c7]">{n}</p>
                <p className="text-sm leading-relaxed text-[#c9cdd2] max-w-xs">{l}</p>
              </div>
            ))}
          </div>
          <div data-reveal className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-[#9aa0a6] max-w-2xl">
              All results are from public benchmark data with simulated laboratories. No
              proprietary data has been used. Each result is reported with its method and limitations.
            </p>
            <Link href="/results" className="text-sm font-medium text-[#8fd0c7] hover:text-white transition-colors">
              Full results and limitations &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* The gap */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-b border-rule">
        <p data-reveal className="eyebrow mb-4">The gap</p>
        <h2 data-reveal className="font-display text-3xl sm:text-4xl tracking-tight text-ink max-w-3xl">
          The field is optimising the wrong step
        </h2>
        <p data-reveal className="mt-5 text-base leading-relaxed text-ink-2 max-w-2xl">
          Generative models keep improving on simulation benchmarks. Simulations can say a crystal
          should exist; only a laboratory can say it can be made, and synthesis is where the weeks
          are lost.
        </p>
        <div data-stagger className="mt-10 grid md:grid-cols-3 gap-10 md:gap-8">
          {[
            ["380,000", "stable crystals predicted by Google DeepMind's GNoME (2023)"],
            ["736", "of them made independently by laboratories at the time of publication"],
            ["~4 in 10", "designs from the best-known generative models that pass simulation checks for stability and novelty, which never test whether a laboratory can make them"],
          ].map(([n, l]) => (
            <div key={n} className="space-y-3">
              <p className="font-display text-5xl tracking-tight text-accent">{n}</p>
              <p className="text-sm leading-relaxed text-muted max-w-xs">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Three parts */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-b border-rule">
        <p data-reveal className="eyebrow mb-4">What we build</p>
        <h2 data-reveal className="font-display text-3xl sm:text-4xl tracking-tight text-ink max-w-3xl">
          A validator, fed by private pooling
        </h2>
        <div data-stagger className="mt-10 grid md:grid-cols-3 gap-5">
          {[
            {
              h: "Validation",
              p: "Predicts which candidate materials can be synthesised, learning from the laboratory records nobody publishes: failed experiments.",
              st: "Beats both baselines in 6 of 6 size-matched runs on public data; no failure data yet",
              href: "/validator",
            },
            {
              h: "Pooling",
              p: "How the validator gets its data. Every laboratory's attempts, failures included, train one shared model that no single laboratory could build alone.",
              st: "34–40% lower error than the best single laboratory, on public benchmarks",
              href: "/results#pooling",
            },
            {
              h: "Security",
              p: "Why laboratories can contribute. Data never leaves its owner; updates are masked, so no party, Synzcuor included, sees an individual contribution.",
              st: "Demonstrated over a network; limitations documented",
              href: "/approach",
            },
          ].map((c) => (
            <Link key={c.h} href={c.href} className="group rounded-xl border border-rule bg-card p-7 hover:border-accent hover:shadow-[0_8px_30px_-12px_rgba(15,92,87,0.25)] transition-all">
              <PillarIcon kind={c.h} />
              <h3 className="mt-5 font-display text-2xl text-ink group-hover:text-accent transition-colors">{c.h}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-2">{c.p}</p>
              <p className="mt-5 pt-4 border-t border-rule text-xs leading-relaxed text-muted">
                <span className="font-mono uppercase tracking-wider text-[10px] text-accent mr-2">Status</span>
                {c.st}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* The mechanism */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p data-reveal className="eyebrow mb-4">The mechanism</p>
        <h2 data-reveal className="font-display text-3xl sm:text-4xl tracking-tight text-ink max-w-2xl">
          Your data stays on your machines
        </h2>
        <p data-reveal className="mt-5 text-base leading-relaxed text-ink-2 max-w-2xl">
          Each participant trains on its own hardware, behind its own firewall. Only model
          updates leave, never the data. Each update is masked with random values that cancel
          when all updates are summed, so the aggregating server sees only the total, never an
          individual contribution.
        </p>

        <div data-reveal className="mt-12">
          <FederationDiagram />
        </div>

        <div data-stagger className="mt-12 grid md:grid-cols-3 gap-8">
          {[
            {
              n: "01",
              h: "The data never moves",
              p: "Raw measurements are never transmitted, in encrypted form or otherwise. They remain on infrastructure controlled by the organisation that produced them.",
            },
            {
              n: "02",
              h: "Updates are masked before they leave",
              p: "Model updates can reveal information about the underlying data, so each is masked through secure aggregation before it leaves. This conceals individual updates from the server. It does not prevent the trained model itself from revealing information; our threat model states where that boundary lies.",
            },
            {
              n: "03",
              h: "Each participant receives a private model",
              p: "Each model is fine-tuned on the participant's own data, with the aim of outperforming anything it could train alone. In simulation this holds for two of three members; the strongest specialist is not yet better off, and closing that gap is ongoing work.",
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
            Proposed ownership: your model is yours; the shared component is held neutrally
          </h2>
          <p data-reveal className="mt-5 text-base leading-relaxed text-ink-2 max-w-2xl">
            Most materials models divide into a shared component, which learns general patterns
            from all participants&rsquo; data, and a final component fitted to each
            participant&rsquo;s property and instruments. We propose drawing the ownership line
            at that boundary. These terms are proposals; no party has signed them.
          </p>

          <div data-stagger className="mt-10 grid md:grid-cols-2 gap-5">
            <div className="rounded-lg border border-rule bg-card p-7">
              <h3 className="font-display text-xl text-ink">Yours, outright</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-2">
                {[
                  "Your raw data, which never leaves your control",
                  "Your fine-tuned model and all of its outputs",
                  "All discoveries made with it; we claim no downstream rights",
                  "A permanent copy for offline use",
                  "An escrow claim on the shared component if Synzcuor fails or is acquired by a competitor",
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
                  "The shared component, trained across all participants",
                  "The training pipeline and the harmonisation of data across laboratories",
                  "The evaluation of whether pooling benefited each member",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span className="text-muted mt-0.5">—</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-muted border-t border-rule pt-4">
                The shared component must be held by a neutral party. No member of a pool of
                competitors can hold it, because the others would be entrusting a rival with an
                asset built partly from their own data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Phases */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-b border-rule">
        <p data-reveal className="eyebrow mb-4">Where it starts</p>
        <h2 data-reveal className="font-display text-3xl sm:text-4xl tracking-tight text-ink max-w-3xl">
          Batteries first. Then anything made by solid-state synthesis.
        </h2>
        <div data-stagger className="mt-10 grid md:grid-cols-3 gap-10">
          {[
            {
              n: "Now",
              h: "The validator on public data",
              p: "Trained on published syntheses and tested on compounds first reported after its training cutoff. It runs today as research code.",
            },
            {
              n: "Next",
              h: "A first laboratory's own records",
              p: "Installed on the laboratory's machines and trained on its own attempts, failures included. Initial market: solid-state battery electrolytes.",
            },
            {
              n: "Then",
              h: "Pooled across laboratories",
              p: "Every laboratory's failures improve everyone's validator, through secure aggregation. The same problem extends to semiconductor materials, catalysts, alloys, magnets and ceramics.",
            },
          ].map((c) => (
            <div key={c.n} className="space-y-3">
              <span className="font-mono text-xs text-accent">{c.n}</span>
              <h3 className="font-display text-xl text-ink">{c.h}</h3>
              <p className="text-sm leading-relaxed text-muted">{c.p}</p>
            </div>
          ))}
        </div>
        <Link href="/validator" className="link mt-8 inline-block text-sm">
          How validation works and what it has shown
        </Link>
      </section>

      {/* Why a company */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p data-reveal className="eyebrow mb-4">Why this is a company</p>
        <h2 data-reveal className="font-display text-3xl sm:text-4xl tracking-tight text-ink max-w-3xl">
          The best-known precedent was a fixed-term research project
        </h2>
        <div data-stagger className="mt-10 grid md:grid-cols-3 gap-10">
          {[
            {
              h: "Continuity",
              p: "MELLODDY, in which ten pharmaceutical companies trained shared models without sharing data, ran as a three-year research consortium. A shared model retains its value only if it continues to train on new data, which a fixed-term project cannot sustain.",
            },
            {
              h: "Neutrality",
              p: "Laboratories will not hand their failures to a company racing them to the same discoveries. Synzcuor does not run its own discovery programme; it serves the laboratories that do.",
            },
            {
              h: "The mechanism is open",
              p: "We intend to publish the method and code so participants can verify that we cannot access their data. The code is not yet public. The value lies in the trained model, which cannot be reconstructed from the code.",
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
              Current status
            </p>
            <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-ink">
              Most of this is not yet built
            </h2>
            <div data-stagger className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                ["Company", "Not incorporated"],
                ["Funding", "None"],
                ["Customers", "None; no agreements signed"],
                ["Team", "Solo founder; hiring"],
              ].map(([k, v]) => (
                <div key={k} className="space-y-1.5">
                  <span className="eyebrow block">{k}</span>
                  <span className="text-sm text-ink-2">{v}</span>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm leading-relaxed text-ink-2 max-w-2xl">
              What exists: a co-authored preprint (in revision after peer review), a validator
              that beats both baselines on newly reported compounds in every size-matched run, and
              private pooling that runs over a network. All on public data; no proprietary data
              has been used, and the validator has no failure data yet. The next milestone is a
              first laboratory contributing its attempt records. If real records do not improve
              the validator, we will publish that result and stop.
            </p>
            <div className="mt-5 flex flex-wrap gap-5 text-sm">
              <Link href="/results" className="link">
                Measured results
              </Link>
              <Link href="/research" className="link">
                What is proven and what is not
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-8">
        <div data-reveal className="rounded-lg border border-rule bg-card p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-ink">
              Working with synthesis laboratories and battery R&amp;D teams
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              We are seeking a first laboratory to run the validator on its own attempt records,
              failures included, in a free pilot on its own machines. Well-argued criticism of the
              approach is equally welcome.
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
