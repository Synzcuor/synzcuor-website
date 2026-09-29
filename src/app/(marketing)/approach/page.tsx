import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import FederationDiagram from "../../../components/FederationDiagram";

export const metadata: Metadata = {
  title: "Approach — synzcuor",
  description:
    "How Synzcuor pools data, keeps it private and predicts what can be made, and what remains unproven.",
};

export default function ApproachPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="eyebrow mb-5">Approach</p>
      <h1 className="font-display text-4xl sm:text-5xl leading-tight tracking-tight text-ink">
        How it works, and what remains unproven
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-2">
        An explanation of the system in plain terms, with enough detail for a specialist to
        verify it. Unproven claims are marked as such.
      </p>

      <hr className="my-14 border-rule" />

      <h2 className="font-display text-2xl text-ink">The loop</h2>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        The server distributes the current model. Each participant trains it on its own data
        and returns an update: the change to the model, not the data. The server averages the
        updates, weighted by the amount of data behind each, and distributes the new model.
        This is standard federated learning. Raw data never moves, but the process is{" "}
        <em>not private</em> on its own.
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
        Model updates carry information about the data used to compute them. Published attacks
        have reconstructed individual training examples from shared updates in some settings,
        mostly images and text. How much could be recovered from a materials model&rsquo;s
        updates has not been measured, but the risk warrants protection.
      </p>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        The aggregation step therefore uses{" "}
        <strong className="font-semibold text-ink">secure aggregation</strong>. Each pair of
        participants agrees on a shared secret, and each participant adds a mask derived from it
        to its update. The masks cancel exactly when all updates are summed, so the server can
        compute the total but no individual update.
      </p>

      <div className="mt-8 rounded-lg border border-rule bg-card p-6">
        <p className="eyebrow mb-3">The hard parts</p>
        <p className="text-sm leading-relaxed text-muted">
          The cryptography is well established; the harder problems lie elsewhere.
          Participants&rsquo; data covers different chemistries, so their updates pull the
          model in different directions and the average can degrade (non-IID data).
          Laboratories measure the same property with systematic differences that can exceed
          the effect being learned. Finally, the software must be something a company&rsquo;s
          IT department will install, audit and operate without granting us access.
        </p>
      </div>

      <h2 className="font-display text-2xl text-ink mt-14">What secure aggregation does not do</h2>
      <ul className="mt-4 space-y-3 text-base leading-relaxed text-ink-2">
        {[
          "With only two participants, each can subtract its own update from the total and recover the other's; a pool requires at least three.",
          "Masks can be reconstructed if enough participants collude. We use a simple-majority threshold, trading some protection for resilience to dropouts.",
          "It protects updates in transit, not the trained model, which can reveal information about unusual training examples. The standard remedy, differential privacy, adds noise at a cost in accuracy; it is not yet implemented.",
          "Because the server cannot inspect individual updates, the standard defences against a participant submitting a corrupted update are also unavailable.",
        ].map((t) => (
          <li key={t} className="flex gap-3">
            <span className="text-flag mt-0.5">—</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>

      <h2 className="font-display text-2xl text-ink mt-14">Where the ownership line sits</h2>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        Many neural models for materials have two parts: an encoder, which converts a
        material&rsquo;s composition or structure into a numerical description, and a head, a
        small final layer that predicts one property from that description.
      </p>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        The encoder benefits most from data across many groups; the head is specific to each
        participant&rsquo;s property and instruments. We propose drawing the ownership line
        there: the encoder held by a neutral custodian, the head and everything it produces
        owned by the participant.
      </p>

      <div className="mt-8 rounded-lg border border-rule bg-paper-2 p-6 font-mono text-xs leading-relaxed text-ink-2 overflow-x-auto">
        <pre className="min-w-max">{`structure / composition / measurement
        |
   [ ENCODER ]   <- learned across everyone, held in custody
        |
    embedding
        |
   [ HEAD ]      <- your property and instruments, owned by you
        |
   your answer`}</pre>
      </div>

      <h2 className="font-display text-2xl text-ink mt-14">
        Architecture-neutral by design
      </h2>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        The pipeline treats the model architecture as a setting and can train a
        participant&rsquo;s preferred architecture. Architectures change every few years, so the
        value should reside in the pipeline, the cross-laboratory data work and the evaluation,
        not in any single design.
      </p>

      <h2 className="font-display text-2xl text-ink mt-14">The third part: validation</h2>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        Pooling and security make private data usable. Validation is its most valuable
        application: predicting which candidate materials can be synthesised. The information
        that answers this lies mostly in failed experiments, which are rarely published. Pooled
        under the same protections, laboratories&rsquo; failure records can train a model no
        single laboratory could.
      </p>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        The design keeps four separate scores (novelty, stability, synthesisability and
        improvement over existing materials), so a model cannot score well by re-proposing
        known materials. On public data it outperforms a similarity-only baseline on compounds
        reported after its training data, where formula size is controlled for. It has not yet
        been trained on any failure records.
      </p>
      <Link href="/validator" className="link mt-4 inline-block text-sm">
        How validation works and what it has shown
      </Link>

      <h2 className="font-display text-2xl text-ink mt-14">Quantum computers, and what they change</h2>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        The key exchange behind secure aggregation is <em>computationally</em> secure: it holds
        as long as certain mathematical problems remain hard. Traffic recorded today could in
        principle be decrypted later by a sufficiently large quantum computer. We have tested a
        NIST-standard post-quantum key exchange in its place, and it works with the masking.
        Separately, quantum protocols exist for delegated computation whose privacy does not rely
        on any computational assumption. For data that remains valuable for decades, this may
        eventually matter.
      </p>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        These protocols require quantum hardware that does not yet exist at the necessary
        scale; some published roadmaps suggest the end of the decade.{" "}
        <strong className="font-semibold text-ink">Nothing we offer today depends on
        it.</strong>
      </p>

      <div className="mt-14 rounded-lg border border-flag/25 bg-flag-soft p-7">
        <p className="eyebrow mb-4" style={{ color: "var(--color-flag)" }}>
          Limitations
        </p>
        <ul className="space-y-3 text-sm leading-relaxed text-ink-2">
          {[
            "The pooling gain has been measured only on public benchmarks with simulated holders, not on any laboratory's real data. For a strong specialist, the pooled model performed worse on its own chemistry.",
            "Secure aggregation prevents the server from seeing individual updates, which also rules out the standard defences against a corrupted update. This trade-off has been measured but not resolved.",
            "The coordinator does not yet authenticate members, and no run has yet spanned two physical machines.",
            "Validation has been tested only on public proxies. No failed-synthesis records have been used, although they are central to its purpose.",
            "No real-world advantage for quantum machine learning has been demonstrated as of 2026. We do not claim a quantum model would be more accurate; the potential benefit is a privacy guarantee independent of computational assumptions.",
            "Quantum generative models do not outperform classical diffusion and flow models at crystal generation.",
            "Quantum hardware able to run those protocols is a roadmap projection, not a commitment.",
            "Post-quantum cryptography, which already works in our tests, weakens the case for ever needing the quantum version.",
            "Even in the quantum protocols, the server can see the size of the computation, though not its content.",
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
