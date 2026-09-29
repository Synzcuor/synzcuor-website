import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Results — synzcuor",
  description:
    "All results measured so far, on public data, with their methods and limitations.",
};

type Row = (string | React.ReactNode)[];

function Table({ head, rows, caption }: { head: string[]; rows: Row[]; caption?: string }) {
  return (
    <div className="mt-6">
      <div className="overflow-x-auto rounded-lg border border-rule bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule bg-paper-2">
              {head.map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-muted font-normal whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-rule last:border-0">
                {r.map((c, j) => (
                  <td key={j} className="px-4 py-2.5 text-ink-2 tabular-nums align-top">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <p className="mt-2 text-xs leading-relaxed text-muted">{caption}</p>}
    </div>
  );
}

function Limits({ items }: { items: string[] }) {
  return (
    <div className="mt-6 rounded-lg border border-flag/25 bg-flag-soft p-5">
      <p className="eyebrow mb-2" style={{ color: "var(--color-flag)" }}>
        Limits
      </p>
      <ul className="space-y-2 text-sm leading-relaxed text-ink-2">
        {items.map((t) => (
          <li key={t} className="flex gap-3">
            <span className="text-flag mt-0.5">—</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-16 scroll-mt-24">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="font-display text-2xl sm:text-3xl text-ink tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-4 text-base leading-relaxed text-ink-2">{children}</p>
);

export default function ResultsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="eyebrow mb-5">Results</p>
      <h1 className="font-display text-4xl sm:text-5xl leading-tight tracking-tight text-ink">
        What has been measured, and what it does not show
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-2">
        All results on this page come from public data; no company or laboratory data has been
        used. &ldquo;Holders&rdquo; and &ldquo;members&rdquo; are simulated: one public dataset
        split by chemical system, so that each simulated laboratory works on a different
        chemistry.
      </p>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        Where a measurement has a pass threshold, it was set before the measurement ran; where
        a test was changed after results were seen, this is stated. The code is in a private
        repository, so these results cannot yet be independently verified.
      </p>

      <div className="mt-10 grid sm:grid-cols-3 gap-4">
        {[
          ["34–40%", "Pooling: lower error than the best single laboratory", "#pooling"],
          ["3.2×", "Security: time overhead of full privacy, with no loss of accuracy", "#network"],
          ["6 of 6", "Validation: size-matched runs outperforming both baselines", "#validator"],
        ].map(([n, l, href]) => (
          <a key={n} href={href} className="rounded-xl border border-rule bg-card p-5 hover:border-accent transition-colors">
            <p className="font-display text-4xl tracking-tight text-accent">{n}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{l}</p>
          </a>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-rule bg-paper-2 p-5 text-sm leading-relaxed text-ink-2">
        <p className="eyebrow mb-3">How to read these numbers</p>
        <ul className="space-y-2">
          <li>
            <strong className="font-semibold text-ink">Error</strong>{" "}is the average distance
            between the model&rsquo;s prediction and the measured value, in the
            property&rsquo;s own units: eV for band gaps, MPa for steel strength. Lower is
            better.
          </li>
          <li>
            <strong className="font-semibold text-ink">A percentage gain</strong> is how much
            lower the error is than the comparison stated next to it. Negative means worse.
          </li>
          <li>
            <strong className="font-semibold text-ink">A threshold set in advance</strong> is a
            pass mark written down before the experiment ran, so it could not be chosen to fit
            the result.
          </li>
        </ul>
      </div>

      <nav className="mt-6 rounded-lg border border-rule bg-card p-5 text-sm">
        <p className="eyebrow mb-3">On this page</p>
        <ol className="space-y-1.5 list-decimal list-inside text-ink-2">
          <li><a className="link" href="#pooling">Does pooling improve the model?</a></li>
          <li><a className="link" href="#private">Private pooling</a></li>
          <li><a className="link" href="#network">Private pooling over a network</a></li>
          <li><a className="link" href="#members">Does pooling benefit each member?</a></li>
          <li><a className="link" href="#finetune">Fine-tuning on a single customer&rsquo;s data</a></li>
          <li><a className="link" href="#security">Security tests and open problems</a></li>
          <li><a className="link" href="#validator">Validation: which materials can be synthesised</a></li>
        </ol>
      </nav>

      <Section id="pooling" eyebrow="Pooling" title="Does pooling improve the model?">
        <P>
          Each simulated holder trains a model on its own data, and one model is trained on all
          of their data combined. The figure is the reduction in the pooled model&rsquo;s error
          relative to the <em>best</em> single holder, on the same held-out test set (the standard
          MatBench split). Each holder&rsquo;s data volume is held constant as holders are added.
          Predefined threshold: a gain below 10% would have indicated no viable product.
        </P>
        <Table
          head={["Dataset", "Holders", "Random forest", "Gradient boosting"]}
          rows={[
            ["Experimental band gap (4,604)", "16", "+34.1%  (+32.7% with bias)", "+39.9%  (+35.9% with bias)"],
            ["Steel yield strength (312)", "3*", "+27.6%  (+24.8% with bias)", "+22.2%  (+13.5% with bias)"],
          ]}
          caption="Chemical-system split, largest number of holders. “With bias” adds a constant per-holder label offset drawn from N(0, 0.1 × std of the target), a simple model of inter-lab systematic error. *The steels dataset only has three distinct chemical systems."
        />
        <P>
          When holders are split by property range instead of chemistry, two holders at opposite
          ends of the range produce a <em>worse</em> pooled model than the better of the two alone
          (−9.0% random forest, −12.5% gradient boosting). A model frozen at the start has 42%
          (random forest) to 57% (gradient boosting) more error than one retrained as five
          further chemistries join.
        </P>
        <Limits
          items={[
            "Simulated holders drawn from one public dataset, not real laboratories with different instruments and protocols.",
            "The bias model is a constant offset per holder; real inter-laboratory disagreement is more complex, and larger offsets are untested.",
            "The pooled model is scored on a test set spanning all chemistries, which is not the same as being better for each member (section 4).",
            "The decay figure comes from adding data rather than real-world drift, so it is a lower bound on what a frozen copy loses.",
          ]}
        />
      </Section>

      <Section id="private" eyebrow="Pooling · security" title="Private pooling">
        <P>
          The same pooling performed privately: each simulated laboratory trains on its own data
          and sends only a masked update, so the server sees only the total. Each laboratory holds
          a different chemistry. All ran within one program on one computer.
        </P>
        <Table
          head={["Dataset · model", "Best client alone", "Federated, masked", "Centralised"]}
          rows={[
            ["Band gap · MLP, 4 clients", "0.720 eV", "0.666 eV (+7.4%)", "0.634 eV"],
            ["Steels · MLP, 3 clients", "188.9 MPa", "152.2 MPa (+19.4%)", "147.8 MPa"],
            ["Band gap · linear, 4 clients", "0.893 eV", "0.846 eV (+5.3%)", "0.950 eV"],
            ["Steels · linear, 3 clients", "236.5 MPa", "208.5 MPa (+11.8%)", "231.0 MPa"],
          ]}
          caption="Mean absolute error on the test set; lower is better. “Centralised” pools all data in the clear and is the reference upper bound."
        />
        <Limits
          items={[
            "The federated model sometimes matches or exceeds the centralised one. This reflects run-to-run variation, not an advantage of federation; the two should be treated as equal.",
            "A server-side drift correction was tested on all four configurations and selected on held-out validation data. Validation selected no correction in every case (a null result).",
            "Masking cost almost nothing here because it ran within a single process; the network cost is given in section 3.",
          ]}
        />
      </Section>

      <Section id="network" eyebrow="Security" title="Private pooling over a network">
        <P>
          Three simulated laboratories and a coordinating server, each a separate program
          communicating over a network, using an established open-source implementation of secure
          aggregation (SecAgg+, in the Flower framework). Band-gap data, twelve training rounds.
        </P>
        <Table
          head={["", "Test error", "Wall clock"]}
          rows={[
            ["Worst member, alone", "0.7365 eV", ""],
            ["Best member, alone", "0.6914 eV", ""],
            ["Shared model, SecAgg+ on", "0.6923 eV", "490.7 s"],
            ["Shared model, masking off", "0.6922 eV", "151.6 s"],
            ["Centralised, data in the clear", "0.6298 eV", ""],
          ]}
        />
        <P>
          Secure aggregation cost no accuracy and 3.2× the wall-clock time, approximately 26
          additional seconds per round. After twelve rounds, the shared model matches the best
          single member but does not exceed it.
        </P>
        <Limits
          items={[
            "All processes ran on one machine; no run has yet crossed a physical machine boundary.",
            "Twelve rounds is a short run: it demonstrates the mechanism over a network, not a converged model.",
            "TLS is implemented, so members verify the coordinator. The coordinator does not yet authenticate members, so anyone who can reach the port can attempt to join.",
          ]}
        />
      </Section>

      <Section id="members" eyebrow="Pooling" title="Does pooling benefit each member?">
        <P>
          The benchmarks above score the pooled model across all chemistries. A member asks a
          narrower question: is it better on <em>its own</em> data? Scored on each simulated
          member&rsquo;s own held-out data, from a separate twelve-round run over the network:
        </P>
        <Table
          head={["Member", "Own model alone", "Pooled model", "Pooled + own head"]}
          rows={[
            ["lab0", "0.7904", "0.7520 (+4.9%)", "0.7357 (+6.9%)"],
            ["lab1", "0.7022", "0.7019 (0.0%)", "0.6973 (+0.7%)"],
            ["lab2", "0.6246", "0.6467 (−3.5%)", "0.6284 (−0.6%)"],
          ]}
          caption="Error in eV; percentages relative to the member's own model. “Own head”: the pooled model with an additional final layer, fitted on the member's own data to correct the pooled model's errors for that member."
        />
        <P>
          The strongest specialist performs worse with the pooled model. A final layer fitted to
          that member&rsquo;s own data narrows the gap but does not close it. &ldquo;Pooling
          improves the model&rdquo; and &ldquo;pooling improves your model&rdquo; are distinct
          claims; only the first has been shown in general.
        </P>
      </Section>

      <Section id="finetune" eyebrow="Phase 1" title="Fine-tuning on a single customer’s data">
        <P>
          Before any pool exists, the question is simpler: does further training of a publicly
          trained model on one customer&rsquo;s small dataset (&ldquo;fine-tuning&rdquo;)
          outperform both the unchanged model and a model trained only on the customer&rsquo;s
          data? Improvement in error, averaged over the simulated customers:
        </P>
        <Table
          head={["Dataset · model", "Customer rows", "vs model as-is", "vs training from scratch"]}
          rows={[
            ["Band gap · MLP", "50", "−15.0%", "+13.6%"],
            ["", "100", "−8.2%", "+12.0%"],
            ["", "250", "−3.9%", "+7.0%"],
            ["", "500", "+3.1%", "+7.0%"],
            ["Band gap · linear", "50", "−0.9%", "+3.6%"],
            ["", "100", "+6.7%", "+1.2%"],
            ["", "250", "+7.1%", "+0.8%"],
            ["", "500", "+6.3%", "−0.2%"],
            ["Steels · MLP", "50", "+20.2%", "−1.1%"],
            ["", "100", "+41.5%", "+12.2%"],
            ["Steels · linear", "50", "+21.7%", "−2.1%"],
            ["", "100", "+38.3%", "−10.1%"],
          ]}
          caption="Negative means fine-tuning was worse. The steels dataset is too small for larger customer sizes."
        />
        <P>
          Fine-tuning outperformed training from scratch in 8 of 12 cases and the unchanged model
          in 8 of 12. With too little customer data, it can reduce accuracy. This table indicates
          when fine-tuning is worthwhile.
        </P>
        <Limits
          items={[
            "Band gap and steel strength stand in for ionic conductivity, the property Phase 1 is aimed at. No conductivity data has been used yet.",
            "The starting model is trained on public MatBench data, not a real pretrained materials model.",
            "No pass threshold has been set for this measurement; the acceptance criterion for a customer is not yet defined.",
          ]}
        />
      </Section>

      <Section id="security" eyebrow="Security" title="Security tests and open problems">
        <h3 className="font-display text-xl text-ink mt-6">Poisoning</h3>
        <P>
          In a poisoning test, one member deliberately doubles its update to push the shared model
          off course. With four members, the shared model&rsquo;s error rises from 0.693 to 1.253 eV
          (+80.7%); with eight, by 19.3%; with two, training diverges. Norm clipping recovers part
          of the loss (to 0.807), but only when the server can see individual updates, which
          secure aggregation prevents. Robust aggregation that operates on masked updates has not
          been built; this remains an open problem.
        </P>
        <h3 className="font-display text-xl text-ink mt-8">Post-quantum key exchange for the masks</h3>
        <P>
          The secrets behind the masks are normally agreed through classical key exchange, which a
          future large quantum computer could break. We replaced it with ML-KEM-768, the
          NIST-standardised post-quantum method (FIPS 203), and the masks still cancel exactly.
          The cost is 7–13 ms per pair of members, approximately 2.2 s in total for 25 members,
          incurred once per pool. This replaces only the key exchange, which, like any key
          exchange, still requires an authenticated channel.
        </P>
        <h3 className="font-display text-xl text-ink mt-8">Verifying that nothing leaves the machine</h3>
        <P>
          A wrapper intercepts and reports every outbound network connection a training run
          attempts, so that &ldquo;nothing leaves the machine&rdquo; can be verified for a given
          run rather than asserted. It is not a sandbox, it supports Linux with glibc only, and it
          has not yet been run against a packaged customer deployment, as none exists.
        </P>
      </Section>

      <Section id="validator" eyebrow="Validation" title="Which materials can be synthesised?">
        <P>
          The third part of Synzcuor predicts which candidate materials can be synthesised.
          Public data contains no failed syntheses, so all results are proxies: synthesised
          compounds compared with plausible compounds that have no record of synthesis.
        </P>
        <Table
          head={["Test", "Result"]}
          rows={[
            ["Does pooling successes across simulated labs help?", "Yes: 38–42% fewer ranking errors than the best single lab, in all four settings (threshold 10%)"],
            ["Is it more than a similarity detector, on compounds reported after the training cutoff?", "Passes in both size-matched settings on all 3 random splits, beating both baselines by 0.15–0.31 AUC. Does not pass in the unmatched settings"],
          ]}
        />
        <Limits
          items={[
            "No failure data yet; the central claim, that pooled failure records improve prediction, requires a partner laboratory.",
            "Composition features only so far; physics features from the full Alexandria database are in progress.",
            "“First reported” means first appearance in a text-mined corpus, not first synthesis.",
          ]}
        />
        <Link href="/validator" className="link mt-4 inline-block text-sm">
          How validation works: full results and limitations
        </Link>
      </Section>

      <div className="mt-16 rounded-lg border border-rule bg-card p-6">
        <p className="text-sm leading-relaxed text-muted">
          If you believe any of these measurements is flawed, we would like to know which, and
          why.
        </p>
        <Link href="/contact" className="link mt-3 inline-block text-sm">
          Tell us
        </Link>
      </div>
    </div>
  );
}
