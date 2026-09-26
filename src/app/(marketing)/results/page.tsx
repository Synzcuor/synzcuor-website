import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Results — synzcuor",
  description:
    "Every number measured so far, on public data, with its setup and its limits stated next to it.",
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
        Every number on this page comes from public data. No company or lab has put data
        through any of it. &ldquo;Holders&rdquo; and &ldquo;members&rdquo; below are
        simulated: one public dataset split by chemical system, so each simulated lab
        works on a different chemistry.
      </p>
      <p className="mt-4 text-base leading-relaxed text-ink-2">
        Where a measurement has a pass threshold, it was written down before the measurement
        ran. Where a test was changed after we saw results, the page says so. The code is in
        a private repository and not yet released. Until it is, these numbers cannot be
        checked independently, and they should be read with that in mind.
      </p>

      <div className="mt-10 rounded-lg border border-rule bg-paper-2 p-5 text-sm leading-relaxed text-ink-2">
        <p className="eyebrow mb-3">How to read these numbers</p>
        <ul className="space-y-2">
          <li>
            <strong className="font-semibold text-ink">Error</strong> is the average distance
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
          <li><a className="link" href="#pooling">Does pooling data improve a model?</a></li>
          <li><a className="link" href="#private">Pooling without anyone seeing anyone&rsquo;s data</a></li>
          <li><a className="link" href="#network">The same thing over a network</a></li>
          <li><a className="link" href="#members">Does joining help each member?</a></li>
          <li><a className="link" href="#finetune">Fine-tuning on one customer&rsquo;s own data</a></li>
          <li><a className="link" href="#security">Security measurements and open gaps</a></li>
          <li><a className="link" href="#validator">Synthesizability: early proxy results</a></li>
        </ol>
      </nav>

      <Section id="pooling" eyebrow="D1" title="Does pooling data improve a model?">
        <P>
          Each simulated holder trains a model on its own data. Then one model trains on all
          of their data together. The number is how much lower the pooled model&rsquo;s error
          is than the <em>best</em> single holder&rsquo;s, on the same held-out test set (the
          standard MatBench split). Each holder keeps the same amount of data as more holders
          are added. Threshold set in advance: a gain under 10% would have meant there is no
          product.
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
          When holders are split by property range instead of chemistry, two holders at
          opposite ends of the range pool to a <em>worse</em> model than the better of them
          alone (−9.0% random forest, −12.5% gradient boosting). A copy of the model frozen
          at the start carries 42% (random forest) to 57% (gradient boosting) more error than
          a model retrained as five more chemistries join.
        </P>
        <Limits
          items={[
            "Simulated holders cut from one public dataset, not real labs with different instruments and protocols.",
            "The bias model is a constant offset per holder. Real inter-lab disagreement is more complicated, and larger offsets have not been tested.",
            "The pooled model is scored on a test set that spans every chemistry. That is not the same as being better for each member (section 4).",
            "The decay figure comes from adding data, not from real-world drift, so it is a lower bound on what a frozen copy loses.",
          ]}
        />
      </Section>

      <Section id="private" eyebrow="D2" title="Pooling without anyone seeing anyone’s data">
        <P>
          The same pooling, but done privately: each simulated lab trains on its own data and
          sends only a masked update, and the server only ever sees the total. Each lab holds
          different chemistry. All labs ran inside one program on one computer.
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
            "The federated model sometimes matches or beats the centralised one. That is run-to-run variation in training, not an advantage of federation. Treat them as equal.",
            "A server-side drift correction was tested on all four and selected on held-out validation rows. Validation picked no correction every time. Reported as a null result.",
            "Masking cost almost nothing here because it ran in a single process. The network cost is in section 3.",
          ]}
        />
      </Section>

      <Section id="network" eyebrow="R12" title="The same thing over a network">
        <P>
          Three simulated labs and a coordinating server, each a separate program talking
          over a network connection, using an established open-source implementation of
          secure aggregation (SecAgg+, in the Flower framework). Band gap data, twelve
          training rounds.
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
          Secure aggregation cost no accuracy and 3.2× the wall-clock time, roughly 26 extra
          seconds per round. After twelve rounds the shared model is level with the best
          single member, not ahead of it.
        </P>
        <Limits
          items={[
            "All processes ran on one machine. Nothing has crossed a real machine boundary yet.",
            "Twelve rounds is a short run. It shows the mechanism working over a network, not a converged model.",
            "TLS is built, so members verify the coordinator. The coordinator does not yet authenticate members: anyone who can reach the port can try to join.",
          ]}
        />
      </Section>

      <Section id="members" eyebrow="Member report" title="Does joining help each member?">
        <P>
          The benchmarks above score the pooled model on everyone&rsquo;s chemistry. A member
          asks a different question: is it better on <em>my</em> data? Scored on each simulated
          member&rsquo;s own held-out rows, from a separate twelve-round run over the network:
        </P>
        <Table
          head={["Member", "Own model alone", "Pooled model", "Pooled + own head"]}
          rows={[
            ["lab0", "0.7904", "0.7520 (+4.9%)", "0.7357 (+6.9%)"],
            ["lab1", "0.7022", "0.7019 (0.0%)", "0.6973 (+0.7%)"],
            ["lab2", "0.6246", "0.6467 (−3.5%)", "0.6284 (−0.6%)"],
          ]}
          caption="Error in eV; percentages against the member's own model. “Own head”: the pooled model with an extra final layer fitted, on the member's own data, to correct what the pooled model gets wrong for them."
        />
        <P>
          The strongest specialist is worse off with the pooled model. Adding a final layer
          fitted to that member&rsquo;s own data nearly closes the gap, but not fully. &ldquo;Pooling improves the model&rdquo;
          and &ldquo;pooling improves your model&rdquo; are different claims, and only the
          first has been shown in general.
        </P>
      </Section>

      <Section id="finetune" eyebrow="Phase 1" title="Fine-tuning on one customer’s own data">
        <P>
          Before any pool exists, the question is simpler. Take a model already trained on
          public data and train it further on one customer&rsquo;s own small dataset
          (&ldquo;fine-tuning&rdquo;). Does that beat both the model left as it was, and a model
          trained only on the customer&rsquo;s data? Improvement in error, averaged over the
          simulated customers:
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
          Fine-tuning beat training from scratch in 8 of 12 cases and beat the unchanged model
          in 8 of 12. With too little customer data it can make things worse. Fine-tuning is
          not always an improvement, and this table is what decides when it is worth doing.
        </P>
        <Limits
          items={[
            "Band gap and steel strength stand in for ionic conductivity, the property Phase 1 is aimed at. No conductivity data has been used yet.",
            "The starting model is trained on public MatBench data, not a real pretrained materials model.",
            "No pass threshold has been set for this measurement. What counts as good enough for a customer is still an open decision.",
          ]}
        />
      </Section>

      <Section id="security" eyebrow="Security" title="Security measurements and open gaps">
        <h3 className="font-display text-xl text-ink mt-6">Poisoning</h3>
        <P>
          A &ldquo;poisoning&rdquo; test: one member deliberately doubles its update before
          submitting it, to push the shared model off course. With four members the
          shared model&rsquo;s error rises from 0.693 to 1.253 eV (+80.7%); with eight, +19.3%;
          with two, training diverges. Norm clipping recovers part of it (to 0.807), but only
          when the server can see individual updates. Under secure aggregation it cannot, so
          that defence is not available. Robust aggregation that works on masked updates is
          not built. This is an open problem, not a solved one.
        </P>
        <h3 className="font-display text-xl text-ink mt-8">Post-quantum key exchange for the masks</h3>
        <P>
          The secrets behind the masks are normally agreed with classical key exchange, which
          a future large quantum computer could break. We replaced it with ML-KEM-768, the
          NIST-standardised post-quantum method (FIPS 203), and the masks still cancel exactly. Cost: 7–13 ms per pair
          of members, about 2.2 s in total for 25 members, once per pool. This replaces the key
          exchange only. The exchange still needs an authenticated channel, like any key
          exchange.
        </P>
        <h3 className="font-display text-xl text-ink mt-8">Checking that nothing leaves the machine</h3>
        <P>
          A wrapper intercepts and reports every outbound network connection a training run
          attempts, so &ldquo;nothing leaves the machine&rdquo; can be checked for a given run
          rather than asserted. It is not a sandbox, it covers Linux with glibc only, and it
          has not yet been run against a packaged customer deployment, because none exists.
        </P>
      </Section>

      <Section id="validator" eyebrow="Research track" title="Synthesizability: early proxy results">
        <P>
          A separate research track asks whether pooled lab records, including failed
          syntheses, can predict which candidate materials can actually be made. It is under
          test and is not the product. Public data contains no failed syntheses, so every
          number so far is a proxy.
        </P>
        <Link href="/validator" className="link mt-4 inline-block text-sm">
          The synthesizability work, its design and its limits
        </Link>
      </Section>

      <div className="mt-16 rounded-lg border border-rule bg-card p-6">
        <p className="text-sm leading-relaxed text-muted">
          If you think one of these measurements is set up wrong, we want to hear why. The
          most useful thing an expert can tell us is which of these numbers would not survive
          their own review.
        </p>
        <Link href="/contact" className="link mt-3 inline-block text-sm">
          Tell us
        </Link>
      </div>
    </div>
  );
}
