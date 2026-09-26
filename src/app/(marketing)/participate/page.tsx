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
  ["Compute", "Enough to run local training rounds. The models tested so far train on a normal workstation."],
  ["A technical contact", "One person who can install the client and answer questions about the data."],
];

const get = [
  ["Your own model", "The shared encoder plus a final layer fitted privately on your data, retrained regularly."],
  ["An honest measurement", "Your pooled model compared with a model trained on your data alone, scored on your own data. In our simulations the strongest specialist came out worse, so this can go either way, and you should see it."],
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
        We expect the first participants to be academic materials groups: they have
        measured data, an interest in co-authorship, and usually a simpler path to a
        research agreement than a company. Industrial R&amp;D groups would follow, and the
        terms below are written with their lawyers in mind. All of them are proposals.
      </p>

      <div className="mt-8 rounded-lg border border-flag/25 bg-flag-soft px-6 py-4">
        <p className="text-sm leading-relaxed text-ink-2">
          <strong className="font-semibold text-ink">Nobody has signed anything yet.</strong>{" "}
          There is no pool to join today. What is available now is a conversation about
          whether this would work for your data, and a look at the benchmark results on
          public data.
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
            a: "Your data never leaves. Model updates do, masked so that the server sees only the total across participants. That protection needs at least three participants, assumes a majority of them do not collude, and does not cover what the finished model itself might reveal about unusual data points. We have not added differential privacy, the standard remedy for that last point. These assumptions would be written into the agreement in plain language.",
          },
          {
            q: "Who owns the model?",
            a: "You own your fine-tuned model and everything you produce with it. The shared encoder — the part trained across all participants — is held by us as neutral custodian, because it structurally cannot be held by one of the participants.",
          },
          {
            q: "What if you go out of business, or get acquired by our competitor?",
            a: "The proposal is that the shared encoder is held in escrow and released to you if we become insolvent, are acquired by a competitor of yours, or fail to deliver a retrained model. It would be in the first draft of the agreement.",
          },
          {
            q: "What happens to our contribution if we leave?",
            a: "What the model has already learned from your data stays in it. Reliably removing one participant's influence from a trained model (\"unlearning\") is not something we can offer. You would keep a permanent licence to the last model delivered to you, and stop contributing.",
          },
          {
            q: "We compete with the other participants. Is this even legal?",
            a: "Pre-competitive research collaborations between competitors are common, but whether one is lawful depends on how it is structured and where. This design limits what participants can learn about each other's data, stays upstream of products (property prediction, not formulations) and does not touch pricing, capacity, output or launch timing. Competition counsel would review it before any multi-party agreement. This is not legal advice.",
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
        For the first participants: nothing. Early groups take a risk on something
        unproven, so they would get priority, a say in the roadmap and co-authorship
        instead of a bill. Pricing for later members is not decided.
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
