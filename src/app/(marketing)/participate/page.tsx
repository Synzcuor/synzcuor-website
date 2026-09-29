import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Participate — synzcuor",
  description:
    "What participation involves, what you own, what Synzcuor holds, and what happens if you leave.",
};

const give = [
  ["Data", "Made available to a training process that runs inside your own environment. It is never transferred, copied or stored by Synzcuor."],
  ["Compute", "Sufficient to run local training. The models tested so far train on a standard workstation."],
  ["A technical contact", "One person able to install the client and answer questions about the data."],
];

const get = [
  ["Your own model", "The shared encoder with a final layer fitted privately on your data, retrained regularly."],
  ["An independent measurement", "Your pooled model compared with a model trained on your data alone, scored on your own data. In simulation, the strongest specialist performed worse with pooling, so the result may be negative. It is reported to you regardless."],
  ["All downstream results", "Every prediction, candidate and discovery made with your model. Synzcuor claims no interest in them."],
  ["Publication rights", "Nothing restricts you from publishing your own research. Academic groups are offered co-authorship on the methods work."],
  ["Input on the roadmap", "Which properties, architectures and datasets to prioritise, and how often models are released."],
];

export default function ParticipatePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="eyebrow mb-5">Participate</p>
      <h1 className="font-display text-4xl sm:text-5xl leading-tight tracking-tight text-ink">
        What participation involves
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-2">
        We are seeking a first design partner among battery R&amp;D teams, alongside research
        laboratories with measured or synthesis data. The terms below are written with
        industrial legal review in mind. All of them are proposals.
      </p>

      <div className="mt-8 rounded-lg border border-flag/25 bg-flag-soft px-6 py-4">
        <p className="text-sm leading-relaxed text-ink-2">
          <strong className="font-semibold text-ink">Nobody has signed anything yet.</strong>{" "}
          There is no pool to join today. What is available now is a discussion of whether this
          would work for your data, a free pilot on your own machines, and the benchmark results
          on public data.
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

      <h2 className="font-display text-2xl text-ink mt-14">What you would get</h2>
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
            a: "Your data never leaves. Model updates do, masked so that the server sees only the total across participants. This protection requires at least three participants, assumes a majority do not collude, and does not cover what the trained model itself might reveal about unusual data points. Differential privacy, the standard remedy for the latter, is not yet implemented. These assumptions would be stated in the agreement in plain language.",
          },
          {
            q: "Who owns the model?",
            a: "You own your fine-tuned model and everything you produce with it. The shared encoder, trained across all participants, is held by Synzcuor as neutral custodian, because no single participant can hold it without the others' trust.",
          },
          {
            q: "What if you go out of business, or get acquired by our competitor?",
            a: "We propose that the shared encoder is held in escrow and released to you if Synzcuor becomes insolvent, is acquired by one of your competitors, or fails to deliver a retrained model. This would be included in the first draft of the agreement.",
          },
          {
            q: "What happens to our contribution if we leave?",
            a: "What the model has already learned from your data remains in it; reliably removing one participant's influence (\"unlearning\") is not something we can offer. You would retain a permanent licence to the last model delivered to you and stop contributing.",
          },
          {
            q: "We compete with the other participants. Is this even legal?",
            a: "Pre-competitive research collaborations between competitors are common, but their lawfulness depends on structure and jurisdiction. This design limits what participants can learn about each other's data, remains upstream of products (property prediction, not formulations) and does not involve pricing, capacity, output or launch timing. Competition counsel would review it before any multi-party agreement. This is not legal advice.",
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
        Nothing, for the first participants. Early partners take a risk on an unproven system,
        so they receive priority, input on the roadmap and, for academic groups, co-authorship.
        Pricing for later members has not been set.
      </p>

      <div className="mt-14 rounded-lg border border-rule bg-card p-8">
        <h2 className="font-display text-2xl text-ink">
          Or tell us where it fails
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          A specific reason this would not work for your data is as useful to us as an
          expression of interest.
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
