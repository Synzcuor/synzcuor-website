import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import ValidationPipeline from "../../../components/ValidationPipeline";

export const metadata: Metadata = {
  title: "Validation — synzcuor",
  description:
    "The third part of Synzcuor: predicting which candidate materials can be synthesised, using laboratory records that are rarely published. Design, results and limitations.",
};

function Table({ head, rows, caption }: { head: string[]; rows: (string | React.ReactNode)[][]; caption?: string }) {
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

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-4 text-base leading-relaxed text-ink-2">{children}</p>
);

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-2xl text-ink mt-14">{children}</h2>
);

export default function ValidatorPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="eyebrow mb-5">Validation · one of three core parts · earliest stage</p>
      <h1 className="font-display text-4xl sm:text-5xl leading-tight tracking-tight text-ink">
        Which candidate materials can be synthesised?
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-2">
        Generative models now propose candidate crystals faster than they can be tested. The bottleneck is no longer producing candidates but identifying which merit a laboratory attempt.
      </p>

      <div className="mt-8 rounded-lg border border-flag/25 bg-flag-soft p-6">
        <p className="eyebrow mb-2" style={{ color: "var(--color-flag)" }}>
          Status
        </p>
        <p className="text-sm leading-relaxed text-ink-2">
          Validation is one of Synzcuor&rsquo;s three core parts, alongside pooling and
          security, and it is the least mature. Everything measured so far uses public data,
          which contains no failed syntheses. Whether R&amp;D teams find failed syntheses costly
          enough to pay to avoid them, and whether laboratories will contribute their records, must be established in our first conversations.
        </p>
      </div>

      <div className="mt-10 grid sm:grid-cols-3 gap-4">
        {[
          ["6 of 6", "size-matched runs outperforming both baselines on newly reported compounds"],
          ["38–42%", "fewer ranking errors when simulated laboratories pool their records"],
          ["0", "failed-synthesis records used so far; the next step requires a partner laboratory"],
        ].map(([n, l]) => (
          <div key={n} className="rounded-xl border border-rule bg-card p-5">
            <p className="font-display text-4xl tracking-tight text-accent">{n}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{l}</p>
          </div>
        ))}
      </div>

      <H2>Why the usual check is not enough</H2>
      <P>
        The standard screen is a computed stability check. Quantum-mechanical simulation
        (density functional theory, DFT) estimates a compound&rsquo;s energy, and compares it
        with every mix of competing compounds it could break down into. The gap is called the
        energy above the hull; zero means nothing it could decompose into is more stable. It is a useful filter but an unreliable verdict:
      </P>
      <ul className="mt-4 space-y-2.5 text-base leading-relaxed text-ink-2">
        {[
          "The errors of standard DFT methods are often about as large as the energy margins that decide whether a compound counts as stable.",
          "It says nothing about kinetics, precursors, temperature, atmosphere, or which competing phase forms first.",
          "Many materials that have been made are metastable, above the hull. Many compounds computed to be stable have never been made.",
        ].map((t) => (
          <li key={t} className="flex gap-3">
            <span className="text-accent mt-0.5">—</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
      <P>
        The true label is experimental: whether the compound was made, by which route, and whether the intended phase formed. Public data suffers from survivorship bias: successful syntheses are published and failed attempts rarely are, so a model trained on public data sees almost only successes. Many laboratories keep records of failed attempts that they have little reason or freedom to publish. Validation therefore depends on the other two components: the data it needs is private by nature, so it can be gathered only through pooling, and only if the security holds.
      </P>

      <H2>The design</H2>
      <P>
        A screening pipeline, where each stage is cheaper than the one after it and a
        candidate&rsquo;s score discounts its value rather than acting as a hard pass or fail:
      </P>
      <ValidationPipeline />

      <h3 className="font-display text-xl text-ink mt-10">
        &ldquo;Feasible&rdquo; must not mean &ldquo;already known&rdquo;
      </h3>
      <P>
        A model trained only on reported successes can score well by learning &ldquo;looks
        like something already made&rdquo;. A generator optimised against that score drifts back towards known crystals. The design therefore keeps four separate scores and combines them only at ranking:
      </P>
      <Table
        head={["Score", "What it is"]}
        rows={[
          ["Novel", "A lookup, not a learned score: structure matching after relaxation against known databases, including checks for ordered versions of known disordered compounds. It cannot be gamed by a generator."],
          ["Stable", "Energy above hull. Used as a feature and a coarse filter, not the verdict."],
          ["Synthesizable", "The learned model: probability that the target phase forms by a given route, with an uncertainty."],
          ["Useful", "Predicted improvement over the best known material for the application. A copy of a known material scores zero here, however feasible it is."],
        ]}
      />
      <P>
        Results would be reported as a funnel per thousand candidates (valid, novel, stable, synthesisable, useful, confirmed, made) rather than as a single &ldquo;percent feasible&rdquo;, which can be inflated by generating near-copies.
      </P>

      <h3 className="font-display text-xl text-ink mt-10">The model, as designed</h3>
      <P>
        A prior trained centrally on public data, plus a route-dependent correction trained
        only on lab attempts, where both successes and failures come with their route. The
        correction is the only part trained across labs, under secure aggregation. Each lab
        also keeps a private offset for its own equipment and technique. Routes enter only the
        correction, because in public data only successes have routes, so a route feature there would leak the label. The intended output is a distribution over which phases form, rather than a binary outcome, because a failure that records which competing phase
        won carries more information than a zero.
      </P>
      <P>
        None of the neural components has been built. Each must outperform a gradient-boosting baseline on the same splits before it is.
      </P>

      <H2>What has been measured</H2>
      <P>
        Public data has no failed syntheses, so there are no true &ldquo;cannot be
        made&rdquo; examples to learn from. Both experiments below instead compare two groups.
        The first is about 7,000 compositions that papers report having made, from a public
        dataset of synthesis recipes extracted automatically from the literature. The second
        is compounds a simulation says are close to stable (within 50 meV per atom of the
        hull), from one file of the Alexandria database, with no record of being made. Some
        of the second group have in fact been made and are simply missing from the recipe
        dataset. This is called positive-unlabeled learning, and it means every score here
        is approximate.
      </P>

      <h3 className="font-display text-xl text-ink mt-10">1 · Does pooling successes help?</h3>
      <P>
        The same test as the pooling benchmark: simulated labs each hold one slice of
        chemistry, and the model is scored on families of compounds none of them trained
        on.
        Scores are AUC: the chance that the model ranks a randomly chosen made compound above
        a randomly chosen unlabeled one. 0.5 is chance level and 1.0 is perfect. Threshold set
        in advance: at eight labs, the pooled model must make at least 10% fewer ranking
        errors than the best single lab, with the lower end of the 95% confidence interval
        above zero.
      </P>
      <Table
        head={["Setting", "Pooled AUC", "Size-only control AUC", "Gain at 8 labs (95% lower)"]}
        rows={[
          ["All compounds", "0.976", "0.801", "+39.0% (+33.9%)"],
          ["Classes matched on formula size", "0.968", "0.731", "+42.4% (+35.8%)"],
          ["Oxides only", "0.889", "0.745", "+38.1% (+26.9%)"],
          ["Oxides, matched", "0.855", "0.573", "+40.0% (+37.5%)"],
        ]}
        caption="Averaged over five random repeats per setting. The control model sees only the number of elements and the formula size. A control at 0.80 means those two facts alone separate the groups fairly well, so part of the raw task is trivial. That is why the size-matched and oxide-only versions exist."
      />
      <P>
        It passes in every setting. However, this pools <em>successes</em> only; it does not yet test whether pooling <em>failures</em> helps, which is the central claim and requires a partner laboratory. Part of the gain reflects more data: each single lab at eight holds only a few
        hundred rows.
      </P>

      <h3 className="font-display text-xl text-ink mt-10">
        2 · Is the model more than a similarity detector?
      </h3>
      <P>
        This test addresses that concern directly. Compounds get a first-reported year
        from the publication date of the papers they appear in. The model is trained on
        compounds reported up to a cutoff (2015 or 2016, set by rule at the 80th percentile)
        and tested on compounds first reported after it. The hardest version puts those later
        compounds into training as <em>unlabeled</em>, reflecting what a model built at the cutoff would have seen. Test candidates are binned by distance from the
        nearest known compound. The test counts only the farthest third, since near-copies inflate any average.
      </P>
      <P>
        There are two baselines. The first scores a candidate only by its closeness to the nearest known
        compound, so it learns nothing but similarity. The second sees only element count and
        formula size. To pass, the model must beat both by at least 0.05 AUC in the far bin,
        with the lower 95% bound above zero. Bounds come from resampling whole chemical
        systems.
      </P>
      <P>
        The model is gradient boosting on composition features: element-property statistics,
        charge-balance rules, and a Magpie-style descriptor set. Which features and settings to
        use is chosen on an earlier cutoff using training data only, and a candidate that sat in
        training as unlabeled is scored only by a copy of the model that never saw it. We ran
        the whole test on three different random splits.
      </P>
      <Table
        head={["Setting", "Passes", "Model", "Similarity only", "Size only"]}
        rows={[
          ["Matched on formula size", "3 of 3", "0.91–0.93", "0.62–0.65", "0.66–0.67"],
          ["Oxides, matched on size", "3 of 3", "0.76–0.93", "0.56–0.68", "0.60–0.62"],
          ["Oxides only", "1 of 3", "0.69–0.83", "0.59–0.71", "0.48–0.69"],
          ["All compounds", "0 of 3", "0.81–0.86", "0.54–0.58", "0.79–0.81"],
        ]}
        caption="AUC in the third of test candidates farthest from known compounds, hardest time split, range across three random splits. The far third holds roughly 20 to 300 made compounds depending on the setting, which is why the intervals are wide."
      />
      <P>
        <strong className="font-semibold text-ink">
          In both size-matched settings it passes on every split, 6 runs out of 6,
        </strong>{" "}
        beating both baselines by 0.15 to 0.31 AUC far from known materials. This indicates that it has learned more than similarity to known compounds. It does not pass
        when the size cue is left in: across all compounds, formula size alone is nearly as
        predictive as the model, which reflects the public benchmark as much as the model. Among unmatched oxides it remains ahead of similarity on average, but not by a statistically significant margin on two of the three splits.
      </P>
      <div className="mt-6 rounded-lg border border-rule bg-card p-5">
        <p className="eyebrow mb-2">How the test changed while we built it</p>
        <p className="text-sm leading-relaxed text-muted">
          The first version compared the model to the similarity baseline only and did not put
          later compounds into training. It passed in all four settings, so we made it
          stricter: the size-only baseline and the harder split were added. The out-of-sample
          scoring and the model-selection step followed once the harder split showed that a
          model scores its own unlabeled training examples low. Richer composition features
          were then added after seeing weak oxide results on one split. Because that risks
          tuning the method to that split, we reran everything on two fresh splits. One
          single-split oxide pass did not hold up there, and the table above reports the
          replicated result.
        </p>
      </div>

      <H2>Outstanding work</H2>
      <ul className="mt-4 space-y-2.5 text-base leading-relaxed text-ink-2">
        {[
          "Failed-synthesis data: everything above compares successes with unlabeled compounds.",
          "Physics features (hull energy, decomposition, formation energy). In progress: the full Alexandria database is being downloaded so the same physics can be computed for both groups. Reaction-driving-force features will follow.",
          "“First reported” means first appearance in the text-mined corpus, not first synthesis. Some compounds counted as new after the cutoff are older, and filtering them needs an experimental structure database.",
          "The novelty check, the property model and the ranking are designed but not yet built.",
          "Laboratory validation: no candidate has yet been synthesised on the basis of this work.",
          "A literature review sufficient to establish which parts of the design, if any, are novel. Synthesizability prediction is an active field, and we claim no priority.",
        ].map((t) => (
          <li key={t} className="flex gap-3">
            <span className="text-flag mt-0.5">—</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>

      <div className="mt-14 rounded-lg border border-rule bg-card p-8">
        <h2 className="font-display text-2xl text-ink">For synthesis laboratories</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          These questions cannot be answered from public data. What fraction of planned syntheses fail? What does a failed attempt cost? Do you keep records of failed attempts, including what formed instead? Would you allow them to inform a shared model if nothing left your premises? Brief answers are welcome.
        </p>
        <Link href="/contact" className="link mt-4 inline-block text-sm">
          Start a conversation
        </Link>
      </div>

      <div className="mt-10 flex flex-wrap gap-4 text-sm">
        <Link href="/results" className="link">All measured results</Link>
        <Link href="/research" className="link">Research and open questions</Link>
      </div>
    </div>
  );
}
