import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Participate — synzcuor",
  description:
    "What contributing to the pool involves, what you own, what we hold, and what happens if you leave.",
};

const give = [
  ["Data", "Made available to a training process that runs inside your own environment. It is not transferred, copied or stored by us."],
  ["Compute", "Enough to run local training rounds. Modest — this is not a foundation-model-scale workload."],
  ["A technical contact", "One person who can install the client and answer questions about the data."],
];

const get = [
  ["Your own model", "The shared encoder plus a head fine-tuned privately on your data, retrained on a regular cadence."],
  ["The measurement that matters", "A benchmark of your pooled model against a model trained on your data alone. If that number is unimpressive, you should know it and so should we."],
  ["Everything downstream", "Every prediction, candidate and discovery you make with it. We claim no interest in your results."],
  ["Publication rights", "Nothing here restricts you publishing your own research. For academic groups, co-authorship on the methods work is on the table."],
  ["A seat on the roadmap", "Which properties, which architectures, which datasets, which release cadence."],
];

export default function ParticipatePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="eyebrow mb-5">Participate</p>
      <h1 className="font-display text-4xl sm:text-5xl leading-tight tracking-tight text-ink">
        What it actually involves
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-2">
        The first participants are academic materials groups — they have data, they want
        co-authorship, and they have no IP counsel to satisfy. Industrial R&amp;D groups
        come after that, and the terms below are written with their lawyers in mind.
      </p>

      <div className="mt-8 rounded-lg border border-flag/25 bg-flag-soft px-6 py-4">
        <p className="text-sm leading-relaxed text-ink-2">
          <strong className="font-semibold text-ink">Nobody has signed anything yet.</strong>{" "}
          There is no pool to join today. What is available right now is a conversation
          about whether this would work for your data, and an early look at the benchmark
          when it lands.
        </p>
      </div>

      <hr className="my-14 border-rule" />

      <h2 className="font-display text-2xl text-ink">What you contribute</h2>
      <dl className="mt-6 space-y-5">
        {give.map(([k, v]) => (
          <div key={k} className="grid sm:grid-cols-[160px_1fr] gap-2 sm:gap-6">
            <dt className="font-medium text-sm text-ink">{k}</dt>
            <dd className="text-sm leading-relaxed text-muted">{v}</dd>
          </div>
        ))}
      </dl>

      <h2 className="font-display text-2xl text-ink mt-14">What you get</h2>
      <dl className="mt-6 space-y-5">
        {get.map(([k, v]) => (
          <div key={k} className="grid sm:grid-cols-[160px_1fr] gap-2 sm:gap-6">
            <dt className="font-medium text-sm text-ink">{k}</dt>
            <dd className="text-sm leading-relaxed text-muted">{v}</dd>
          </div>
        ))}
      </dl>

      <h2 className="font-display text-2xl text-ink mt-14">The questions lawyers ask first</h2>
      <div className="mt-6 space-y-7">
        {[
          {
            q: "Can our data be reconstructed from what leaves the building?",
            a: "Updates are masked before they leave and the masks cancel in the sum, so the aggregator sees only the total. This is a computational guarantee with stated assumptions, not magic — the assumptions are written down in the agreement, in plain language, including what they do not cover.",
          },
          {
            q: "Who owns the model?",
            a: "You own your fine-tuned model and everything you produce with it. The shared encoder — the part trained across all participants — is held by us as neutral custodian, because it structurally cannot be held by one of the participants.",
          },
          {
            q: "What if you go out of business, or get acquired by our competitor?",
            a: "The encoder sits in escrow. It releases to you on our insolvency, on an acquisition by a competitor of yours, or if we fail to deliver a retrained model. We offer this in the first draft rather than waiting to be asked.",
          },
          {
            q: "What happens to our contribution if we leave?",
            a: "It stays in the model. Model unlearning is not offered and we do not represent it as feasible. You keep a perpetual licence to the last model delivered to you, and you stop contributing. We would rather say this in the first meeting than have you find it in redlines.",
          },
          {
            q: "We compete with the other participants. Is this even legal?",
            a: "Pre-competitive research collaboration is lawful and common, and this structure is unusually defensible: participants learn nothing about each other's inputs, so there is no information exchange to scrutinise. The arrangement stays upstream of products — property prediction, never formulation — and never touches pricing, capacity, output or launch timing. Specialist counsel reviews it before any multi-party agreement.",
          },
        ].map((f) => (
          <div key={f.q} className="border-l-2 border-accent pl-5">
            <h3 className="font-display text-lg text-ink">{f.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-2xl text-ink mt-14">What it costs</h2>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        For the first participants: nothing. Early groups are paid in priority, influence
        and co-authorship rather than charged, because they are the ones taking a risk on
        something unproven. Pricing for later members is a question we will answer when we
        have earned the right to.
      </p>

      <div className="mt-14 rounded-lg border border-rule bg-card p-8">
        <h2 className="font-display text-2xl text-ink">
          Or tell us why this is wrong
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          A well-argued reason this will not work for your data is worth more to us right
          now than a polite expression of interest. We will say so if you change our mind.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block px-5 py-2.5 rounded-md bg-ink text-paper text-sm font-medium hover:bg-accent transition-colors"
        >
          Get in touch
        </Link>
      </div>
    </div>
  );
}
