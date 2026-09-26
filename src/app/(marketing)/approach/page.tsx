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
        This page explains how the system works in plain terms, with enough detail for a
        specialist to check it. Where something important is unproven, it says so.
      </p>

      <hr className="my-14 border-rule" />

      <h2 className="font-display text-2xl text-ink">The loop</h2>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        The server sends out the current model. Each participant trains it further on its
        own data and sends back an update: the change to the model, not the data. The
        server averages the updates, weighting each by how much data is behind it, and
        sends out the new model. This is standard federated learning. Raw data never
        moves, but on its own it is <em>not private</em>.
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
        Model updates carry information about the data they were computed from. Published
        attacks have reconstructed individual training examples from shared updates in
        some settings, mostly images and text so far. How much could be recovered from a
        materials model&rsquo;s updates has not been measured. It is enough of a risk to
        design against.
      </p>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        So the combining step uses <strong className="font-semibold text-ink">secure
        aggregation</strong>. Every pair of participants agrees on a shared secret, and each
        adds a random-looking mask derived from it to its update. The masks cancel exactly
        when all updates are added. The server can compute the total, but not any single
        participant&rsquo;s update.
      </p>

      <div className="mt-8 rounded-lg border border-rule bg-card p-6">
        <p className="eyebrow mb-3">The hard parts</p>
        <p className="text-sm leading-relaxed text-muted">
          The cryptography is well studied. The harder problems are elsewhere. Each
          participant&rsquo;s data covers different chemistry, so their updates pull the
          model in different directions and the average can suffer (known as non-IID data).
          Different labs measure the same property with systematic differences, sometimes
          larger than the effect being learned. And the software has to be something a
          company&rsquo;s IT department will install, audit and run without giving us
          access.
        </p>
      </div>

      <h2 className="font-display text-2xl text-ink mt-14">What secure aggregation does not do</h2>
      <ul className="mt-4 space-y-3 text-base leading-relaxed text-ink-2">
        {[
          "With only two participants, each can subtract its own update from the total and recover the other's. A pool needs at least three.",
          "Masks can be reconstructed if enough participants collude: the setting we use is a simple majority, which trades some protection for surviving dropouts.",
          "It protects updates in transit, not the finished model. A trained model can reveal things about unusual training examples. The standard remedy, differential privacy, adds noise and costs accuracy, and we have not implemented it.",
          "It stops the server from inspecting updates, which also stops the standard defences against a participant submitting a corrupted update.",
        ].map((t) => (
          <li key={t} className="flex gap-3">
            <span className="text-flag mt-0.5">—</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>

      <h2 className="font-display text-2xl text-ink mt-14">Where the ownership line sits</h2>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        Many neural models for materials split into two parts: an encoder, which turns a
        material&rsquo;s composition or structure into a set of numbers describing it, and a
        head, a small final part that turns those numbers into a prediction of one
        property.
      </p>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        The encoder benefits most from data across many groups. The head is specific to
        each participant&rsquo;s property and instruments. So we propose drawing the
        ownership line there: the shared encoder held by a neutral custodian, and the head,
        with everything it produces, belonging to the participant.
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
        The pipeline takes the model type as a setting. If your group has an architecture
        it prefers, we can train that one. Model architectures change every few years, so
        we would rather the value sit in the pipeline, the cross-lab data work and the
        evaluation than in one particular model design.
      </p>

      <h2 className="font-display text-2xl text-ink mt-14">Quantum computers, and what they change</h2>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        The key exchange behind secure aggregation is <em>computationally</em> secure: it
        holds as long as certain maths problems stay hard to solve. Traffic recorded today
        could in principle be decrypted later by a large enough quantum computer. We have
        tested swapping in a NIST-standard post-quantum key exchange, and it works with the
        masking. Separately, there are quantum protocols for delegated computation whose
        privacy does not depend on any maths problem being hard. For data that stays
        valuable for decades, that could eventually matter.
      </p>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        Those protocols need quantum hardware that does not exist at the required scale.
        Some published roadmaps suggest the end of the decade, and roadmaps slip.{" "}
        <strong className="font-semibold text-ink">Nothing we offer today depends on
        it.</strong>
      </p>

      <div className="mt-14 rounded-lg border border-flag/25 bg-flag-soft p-7">
        <p className="eyebrow mb-4" style={{ color: "var(--color-flag)" }}>
          Stated plainly
        </p>
        <ul className="space-y-3 text-sm leading-relaxed text-ink-2">
          {[
            "The pooling gain has been measured only on public benchmarks with simulated holders. No real lab's data has been through it, and for a strong specialist the pooled model was worse on its own chemistry.",
            "Secure aggregation stops the server from seeing individual updates, which also stops the standard defences against a member submitting a corrupted one. That tension is measured and not solved.",
            "The coordinator does not yet authenticate members, and nothing has run across two physical machines.",
            "There is no demonstrated real-world advantage for quantum machine learning as of 2026. We do not claim a quantum model would be more accurate. The possible benefit is a privacy guarantee that does not depend on computational assumptions.",
            "Quantum generative models do not beat classical diffusion and flow models at crystal generation. Classical leads.",
            "Quantum hardware able to run those protocols is a roadmap projection, not a commitment.",
            "Post-quantum cryptography, which already works in our tests, weakens the case that the quantum version will ever be needed.",
            "Even in the quantum protocols, the size of the computation is visible to the server, though its content is not.",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="text-flag mt-0.5">—</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-sm text-muted">
        The measurements behind these statements are on the{" "}
        <Link href="/results" className="link">results page</Link>.
      </p>

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
