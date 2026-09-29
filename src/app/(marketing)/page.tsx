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
            <p data-enter className="eyebrow mb-6">AI for materials R&amp;D · pooling · security · validation</p>
            <h1 data-enter className="font-display text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.06] tracking-tight text-ink">
              Public materials data is mostly computed.
              <span className="block text-accent italic mt-3">
                The measured data stays inside the companies that paid for it.
              </span>
            </h1>
            <p data-enter className="mt-8 text-lg leading-relaxed text-ink-2 max-w-xl">
              We train models on that measured data{" "}
              <strong className="font-semibold text-ink">without it ever leaving its owner</strong>
              , first inside one company, then across many. And we use it to predict which new
              materials can actually be made.
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
                See what&rsquo;s measured
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
              ["34–40%", "less prediction error when simulated labs pool their data, compared with the best single lab"],
              ["3.2×", "the time cost of full privacy over a real network, with no measurable loss in accuracy"],
              ["6 of 6", "size-matched validation runs where the model beats both simple baselines on newly reported compounds"],
            ].map(([n, l]) => (
              <div key={n} className="space-y-3">
                <p className="font-display text-5xl lg:text-6xl tracking-tight text-[#8fd0c7]">{n}</p>
                <p className="text-sm leading-relaxed text-[#c9cdd2] max-w-xs">{l}</p>
              </div>
            ))}
          </div>
          <div data-reveal className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-[#9aa0a6] max-w-2xl">
              All measured on public benchmark data with simulated labs. No company&rsquo;s data has
              been through it yet, and every number comes with its setup and limits.
            </p>
            <Link href="/results" className="text-sm font-medium text-[#8fd0c7] hover:text-white transition-colors">
              All results and their limits &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Three parts */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-b border-rule">
        <p data-reveal className="eyebrow mb-4">What we build</p>
        <h2 data-reveal className="font-display text-3xl sm:text-4xl tracking-tight text-ink max-w-3xl">
          Three parts, each needed for the others to be worth anything
        </h2>
        <div data-stagger className="mt-10 grid md:grid-cols-3 gap-5">
          {[
            {
              h: "Pooling",
              p: "One shared model that learns from many companies' measurements, so each gets a model better than it could build alone.",
              st: "34–40% less error than the best single lab, on public benchmarks",
              href: "/results#pooling",
            },
            {
              h: "Security",
              p: "The data never leaves its owner. Updates are masked, so nobody, including us, sees any one company's contribution.",
              st: "Working over a real network; its limits stated openly",
              href: "/approach",
            },
            {
              h: "Validation",
              p: "Predicting which new materials can actually be made, learning from lab records that are rarely published, especially failures.",
              st: "Earliest part: public proxies only, no failure data yet",
              href: "/validator",
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
          Each participant trains on its own hardware, behind its own firewall. When
          several participants pool, only model updates leave, never the data. Each
          update is scrambled with a random mask before it leaves, and the masks cancel
          out when all the updates are added together. So the server that combines them
          sees only the total, not any one participant&rsquo;s update.
        </p>

        <div data-reveal className="mt-12">
          <FederationDiagram />
        </div>

        <div data-stagger className="mt-12 grid md:grid-cols-3 gap-8">
          {[
            {
              n: "01",
              h: "The data never moves",
              p: "Raw measurements are not sent anywhere, encrypted or otherwise. They stay inside the organisation that produced them, on machines it controls.",
            },
            {
              n: "02",
              h: "Updates are masked before they leave",
              p: "Sending model updates instead of data is not private on its own: updates can leak information about the data behind them. Masking (secure aggregation) hides each individual update from the server. It does not stop the finished model itself from leaking something, and we say where that line is.",
            },
            {
              n: "03",
              h: "Each participant gets a private model",
              p: "Fine-tuned on their own data. The goal is a model better than anything they could train alone. In simulation that holds for some members and not yet for the strongest specialist, and that gap is the number we are working on.",
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
            The proposed split: your model is yours, the shared part is held neutrally
          </h2>
          <p data-reveal className="mt-5 text-base leading-relaxed text-ink-2 max-w-2xl">
            Many materials models split naturally into two parts: a shared part that
            learns general patterns from everyone&rsquo;s data, and a small final part
            fitted to one participant&rsquo;s own property and instruments. We propose
            drawing the ownership line there. These are proposed terms. Nobody has
            signed them.
          </p>

          <div data-stagger className="mt-10 grid md:grid-cols-2 gap-5">
            <div className="rounded-lg border border-rule bg-card p-7">
              <h3 className="font-display text-xl text-ink">Yours, outright</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-2">
                {[
                  "Your raw data — it never left",
                  "Your fine-tuned model and every output from it",
                  "Every discovery you make with it. We claim nothing downstream",
                  "A permanent copy you can run offline",
                  "A claim on the shared part, held in escrow, if we fail or are bought by a competitor",
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
                  "The shared part, trained across everyone",
                  "The training pipeline, and the work of making different labs' data comparable",
                  "The evaluation of whether pooling helped each member",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span className="text-muted mt-0.5">—</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-muted border-t border-rule pt-4">
                Somebody has to hold the shared part. In a pool of competitors, it is hard
                for any one of them to do it, because the others would be trusting a rival
                with an asset built partly from their own data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Phases */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-b border-rule">
        <p data-reveal className="eyebrow mb-4">Where it starts</p>
        <h2 data-reveal className="font-display text-3xl sm:text-4xl tracking-tight text-ink max-w-3xl">
          One company first. The shared model comes second.
        </h2>
        <div data-stagger className="mt-10 grid md:grid-cols-3 gap-10">
          {[
            {
              n: "Phase 1",
              h: "Private fine-tuning, on-prem",
              p: "A model fine-tuned on one company's own measurements, on its own machines. First market: solid-state battery electrolytes, where measured ionic conductivity data is scarce and proprietary. So far this is measured only on stand-in public datasets, and with too little data fine-tuning can make a model worse.",
            },
            {
              n: "Phase 2",
              h: "Pooling across companies",
              p: "The same client software, joined to others under secure aggregation. This is where a shared model can learn from data no single company has.",
            },
            {
              n: "Alongside both",
              h: "Validation",
              p: "Scoring which candidate materials can actually be made, trained on lab records, failed syntheses included. It starts on public data and improves as partners contribute records.",
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
          How validation works, and what it has shown so far
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
              p: "MELLODDY, where ten pharmaceutical companies trained shared models without sharing data, ran as a three-year research consortium. A shared model keeps its value only if it keeps training as new data arrives, which a project with an end date is not set up to do.",
            },
            {
              h: "Neutrality",
              p: "A group of competitors still needs someone neutral to operate the pool, and setting that up themselves is a governance project most of them would rather not run.",
            },
            {
              h: "The mechanism is open",
              p: "We plan to publish the method and the code, so participants can check for themselves that we cannot see their data. The code is not public yet. The value is in the trained model, which cannot be rebuilt from the code alone.",
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
              Most of this is not built yet
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
              What exists is the research, one paper behind the technical thesis (a
              preprint, being revised after peer review), and benchmark code that is not yet public. On public data,
              pooling cleared its advance threshold, and private training ran across three
              processes on one machine with secure aggregation. No real company or lab data
              has been through any of it. The next milestone is conversations with battery R&amp;D
              teams and a first design partner. If real data shows pooling or fine-tuning
              does not help enough to matter, we will publish that and stop.
            </p>
            <div className="mt-5 flex flex-wrap gap-5 text-sm">
              <Link href="/results" className="link">
                What has been measured
              </Link>
              <Link href="/research" className="link">
                What is proven, and what is not
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
              The first participants are academic groups
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              They have measured data, an interest in co-authorship, and usually a simpler
              path to a research agreement than a company. If that is you, or if you think
              the idea is wrong and can say why, we would like to talk.
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
