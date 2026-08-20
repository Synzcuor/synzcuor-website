import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import FederationDiagram from "../../../components/FederationDiagram";

export const metadata: Metadata = {
  title: "Approach — synzcuor",
  description:
    "How federated training with secure aggregation works, where the ownership line sits, and what is still unproven.",
};

export default function ApproachPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="eyebrow mb-5">Approach</p>
      <h1 className="font-display text-4xl sm:text-5xl leading-tight tracking-tight text-ink">
        How it works, including the parts that don&rsquo;t work yet
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-2">
        This page is written for someone technical. If a claim here is load-bearing and
        unproven, it says so — you would find out in ten minutes anyway, and it is better
        that it comes from us.
      </p>

      <hr className="my-14 border-rule" />

      <h2 className="font-display text-2xl text-ink">The loop</h2>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        The server broadcasts model weights. Each participant runs local training on its
        own examples and returns an update. The server averages the updates, weighted by
        data volume, and broadcasts again. Raw data never moves. That much is standard
        federated learning, and on its own it is <em>not private</em>.
      </p>

      <div className="my-10 -mx-6 sm:mx-0">
        <div className="px-6 sm:px-0">
          <FederationDiagram />
        </div>
      </div>

      <h2 className="font-display text-2xl text-ink mt-14">
        Why plain federated learning is not enough
      </h2>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        Model updates leak. Gradient inversion attacks can reconstruct training examples
        from shared gradients — which for a materials group means reconstructing the
        experiments themselves. Anyone selling federated learning as private without
        addressing this is either not aware of it or hoping you are not.
      </p>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        So the aggregation step uses <strong className="font-semibold text-ink">secure
        aggregation</strong>: every pair of participants agrees a shared seed, and each
        adds a pseudorandom mask derived from it. The masks cancel exactly in the sum. The
        aggregator can compute the total and learns nothing about any individual update.
      </p>

      <div className="mt-8 rounded-lg border border-rule bg-card p-6">
        <p className="eyebrow mb-3">The honest engineering</p>
        <p className="text-sm leading-relaxed text-muted">
          The hard problems here are not the cryptography — that is well-studied and
          published. They are non-IID data (participants&rsquo; distributions differ
          sharply, so local optima diverge and the average drifts), inter-lab systematic
          bias (real labs disagree with each other by more than the signal), and shipping
          a client that a corporate IT department will install, audit and operate without
          giving us access.
        </p>
      </div>

      <h2 className="font-display text-2xl text-ink mt-14">Where the ownership line sits</h2>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        Nearly all materials ML factorises the same way: a general encoder that turns
        structure and composition into a representation, and a task-specific head that
        turns that representation into a prediction about a particular property.
      </p>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        The encoder is learned from everyone and no single group would ever build it — no
        one lab&rsquo;s task justifies its generality. The head is different for every
        participant by nature. So the ownership line goes on that seam: the shared encoder
        is held by a neutral custodian, and everything above the embedding is yours.
      </p>

      <div className="mt-8 rounded-lg border border-rule bg-paper-2 p-6 font-mono text-xs leading-relaxed text-ink-2 overflow-x-auto">
        <pre className="min-w-max">{`structure / composition / measurement
        |
   [ ENCODER ]   <- learned across everyone, held in custody
        |
    embedding
        |
   [ HEAD ]      <- your property, your instrument. Yours.
        |
   your answer`}</pre>
      </div>

      <h2 className="font-display text-2xl text-ink mt-14">
        We deliberately hold no architecture position
      </h2>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        The pipeline takes the model family as a parameter. If your group has an
        architecture it believes in, we will train that one. This is not diplomacy:
        architectures turn over every couple of years, and any company whose asset is one
        specific architecture gets obsoleted by a paper. The durable asset is the pipeline,
        the harmonised representation across labs, and the evaluation.
      </p>

      <h2 className="font-display text-2xl text-ink mt-14">The layer that arrives later</h2>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        Secure aggregation is <em>computationally</em> secure: it holds against an
        adversary with bounded compute. There is a quantum construction that is{" "}
        <em>information-theoretically</em> secure — it holds against unlimited compute,
        permanently. For experimental data with a thirty-year commercial life, that
        difference eventually matters, and it is where this ends up.
      </p>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        It needs hardware that does not exist yet, on published roadmaps that put it around
        2029. <strong className="font-semibold text-ink">Nothing we offer today depends
        on it</strong>, and we would rather say that plainly than let it decorate a
        pitch.
      </p>

      <div className="mt-14 rounded-lg border border-flag/25 bg-flag-soft p-7">
        <p className="eyebrow mb-4" style={{ color: "var(--color-flag)" }}>
          Stated plainly
        </p>
        <ul className="space-y-3 text-sm leading-relaxed text-ink-2">
          {[
            "The size of the pooling gain is unmeasured for this domain and split structure. Everything depends on it, and it is the first thing we are measuring.",
            "There is no demonstrated real-world quantum machine learning advantage as of 2026. We do not claim the quantum model is better — we claim it is privately trainable with an unconditional guarantee.",
            "Quantum generative models do not beat classical diffusion and flow models at crystal generation. Classical leads.",
            "Delegation-grade quantum hardware around 2029 is a roadmap extrapolation, not a commitment.",
            "Post-quantum cryptography materially weakens the argument that you eventually need the quantum version. We are not going to pretend otherwise.",
            "Circuit size and depth still leak in the blind delegation construction, even when the computation itself does not.",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="text-flag mt-0.5">—</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-14 flex flex-wrap gap-3">
        <Link
          href="/participate"
          className="px-5 py-2.5 rounded-md bg-ink text-paper text-sm font-medium hover:bg-accent transition-colors"
        >
          What participating involves
        </Link>
        <Link
          href="/research"
          className="px-5 py-2.5 rounded-md border border-rule bg-card text-ink text-sm font-medium hover:border-accent hover:text-accent transition-colors"
        >
          Research and publications
        </Link>
      </div>
    </div>
  );
}
