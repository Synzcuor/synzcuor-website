import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Synthesizability — synzcuor",
  description:
    "A research track under test: predicting which candidate materials can be made, using lab records that are rarely published. Design, proxy results and limits.",
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
      <p className="eyebrow mb-5">Research track · under test</p>
      <h1 className="font-display text-4xl sm:text-5xl leading-tight tracking-tight text-ink">
        Which candidate materials can actually be made?
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-2">
        Generative models now propose candidate crystals faster than anyone can check them.
        The expensive part is no longer producing candidates. It is knowing which ones are
        worth a lab attempt.
      </p>

      <div className="mt-8 rounded-lg border border-flag/25 bg-flag-soft p-6">
        <p className="eyebrow mb-2" style={{ color: "var(--color-flag)" }}>
          Status
        </p>
        <p className="text-sm leading-relaxed text-ink-2">
          This is a research direction, not the product and not a decision. It becomes a
          priority only if R&amp;D teams tell us failed syntheses cost them real time and
          money, and only if labs are willing to contribute their records. Neither has been
          confirmed. Almost everything below is design. What has been measured uses public
          proxies and is labelled as such.
        </p>
      </div>

      <H2>Why the usual check is not enough</H2>
      <P>
        The standard screen is a computed stability check. Quantum-mechanical simulation
        (density functional theory, DFT) estimates a compound&rsquo;s energy, and compares it
        with every mix of competing compounds it could break down into. The gap is called the
        energy above the hull; zero means nothing it could decompose into is more stable. It
        is a useful filter and a weak verdict:
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
        The real label is experimental: was it made, by which route, and did the intended phase
        form. Public data has a survivorship problem here. Successful syntheses get published
        and failed attempts rarely are, so a model trained on public data sees almost only
        successes. Many labs keep records of failed attempts that they have little reason or
        freedom to publish. Collecting that kind
        of data without exposing it is what the private pooling work is for.
      </P>

      <H2>The design</H2>
      <P>
        A screening pipeline, where each stage is cheaper than the one after it and a
        candidate&rsquo;s score discounts its value rather than acting as a hard pass or fail:
      </P>
      <div className="mt-6 rounded-lg border border-rule bg-paper-2 p-6 font-mono text-xs leading-relaxed text-ink-2 overflow-x-auto">
        <pre className="min-w-max">{`candidates (any generator, substitution, literature)
   |
   |- validity checks          charge, distances, symmetry      seconds
   |- ML relaxation            pretrained interatomic potential  seconds
   |- novelty check            match against known structures,
   |                           AFTER relaxation                  seconds
   |- energy above hull        ML, then DFT on the shortlist     minutes -> hours
   |- synthesizability         trained on lab outcomes           seconds
   |- property model           gain over the best known material
   |
   ranking: P(made) x value - cost of an attempt, plus an exploration bonus
   |
   lab attempt  ->  outcome, success OR failure  ->  back into training`}</pre>
      </div>
      <P>
        Only the synthesizability stage needs data nobody else has. The other stages use
        existing tools, and we do not claim them as ours.
      </P>

      <h3 className="font-display text-xl text-ink mt-10">
        &ldquo;Feasible&rdquo; must not mean &ldquo;already known&rdquo;
      </h3>
      <P>
        A model trained only on reported successes can score well by learning &ldquo;looks
        like something already made&rdquo;. A generator optimised against that score drifts back
        toward known crystals. So the design keeps four separate scores and combines them only
        at ranking:
      </P>
      <Table
        head={["Score", "What it is"]}
        rows={[
          ["Novel", "A lookup, not a learned score: structure matching after relaxation against known databases, including checks for ordered versions of known disordered compounds. Nothing a generator can game."],
          ["Stable", "Energy above hull. Used as a feature and a coarse filter, not the verdict."],
          ["Synthesizable", "The learned model: probability that the target phase forms by a given route, with an uncertainty."],
          ["Useful", "Predicted improvement over the best known material for the application. A copy of a known material scores zero here, however feasible it is."],
        ]}
      />
      <P>
        We would report results as a funnel per thousand candidates (valid, novel, stable,
        synthesizable, useful, confirmed, made), not as a single &ldquo;percent
        feasible&rdquo;. A single percentage can be inflated by generating near-copies.
      </P>

      <h3 className="font-display text-xl text-ink mt-10">The model, as designed</h3>
      <P>
        A prior trained centrally on public data, plus a route-dependent correction trained
        only on lab attempts, where both successes and failures come with their route. The
        correction is the only part trained across labs, under secure aggregation. Each lab
        also keeps a private offset for its own equipment and technique. Routes enter only the
        correction, because in public data only successes have routes, so a route feature
        there would simply leak the label. The intended output is a distribution over which
        phases form, not a yes or no, because a failure that records which competing phase
        won carries more information than a zero.
      </P>
      <P>
        None of the neural components are built. Each one has to beat a gradient-boosting
        baseline on the same splits, or it is not built.
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
        a randomly chosen unlabeled one. 0.5 is a coin flip and 1.0 is perfect. Threshold set
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
        It passes in every setting. But this pools <em>successes</em>. It says nothing yet about
        whether pooling <em>failures</em> helps, which is the actual claim and needs a partner
        lab. Part of the gain is simply more data: each single lab at eight holds only a few
        hundred rows.
      </P>

      <h3 className="font-display text-xl text-ink mt-10">
        2 · Is the model more than a similarity detector?
      </h3>
      <P>
        We checked this directly for the concern above. Compounds get a first-reported year
        from the publication date of the papers they appear in. The model is trained on
        compounds reported up to a cutoff (2015 or 2016, set by rule at the 80th percentile)
        and tested on compounds first reported after it. The hardest version puts those later
        compounds into training as <em>unlabeled</em>, because that is what a model built at
        the cutoff would really have seen. Test candidates are binned by distance from the
        nearest known compound. The test counts only the farthest third, because near-copies
        flatter any average.
      </P>
      <P>
        Two baselines. The first scores a candidate only by its closeness to the nearest known
        compound, so it learns nothing but similarity. The second sees only element count and
        formula size. To pass, the model must beat both by at least 0.05 AUC in the far bin,
        with the lower 95% bound above zero. Bounds come from resampling whole chemical
        systems.
      </P>
      <Table
        head={["Setting", "Made compounds in far third", "Model", "Similarity", "Size only", "Result"]}
        rows={[
          ["All compounds", "23", "0.813", "0.552", "0.792", "Fail"],
          ["Matched on size", "52", "0.909", "0.650", "0.657", "Pass"],
          ["Oxides only", "306", "0.782", "0.712", "0.476", "Fail"],
          ["Oxides, matched", "32", "0.766", "0.676", "0.644", "Fail"],
        ]}
        caption="AUC in the third of test candidates farthest from known compounds, hardest time split. Model: gradient boosting, set up so that a candidate that was in the training data as unlabeled is scored only by a copy of the model that never saw it. Model settings were chosen on an earlier cutoff, using training data only, so the test data was used once."
      />
      <P>
        <strong className="font-semibold text-ink">It passes in one of four settings.</strong>{" "}
        Far from known materials, the model scores above pure similarity in every setting,
        by 0.07 to 0.26 AUC, though the interval clears zero in only two. In the unmatched setting the size-only control
        is nearly as good. Among oxides, the margin over similarity is small and its interval
        crosses zero. With about 30 positives in the far bin, the matched-oxide result is too
        uncertain to call. On composition features alone, the honest reading is: better than
        a memoriser, and not yet reliably better than simple cues within one chemistry class.
      </P>
      <div className="mt-6 rounded-lg border border-rule bg-card p-5">
        <p className="eyebrow mb-2">How the test changed while we built it</p>
        <p className="text-sm leading-relaxed text-muted">
          The first version of this test compared the model to the similarity baseline only,
          and did not put later compounds into training. It passed in all four settings. After
          seeing that, we added the size-only baseline and the harder split. Both changes make
          the test stricter. The scoring change and the model-selection step were added after
          the harder split showed that a model scores its own unlabeled training examples
          low. We report the final version&rsquo;s results, including settings where an earlier
          version passed.
        </p>
      </div>

      <H2>Not done, and needed</H2>
      <ul className="mt-4 space-y-2.5 text-base leading-relaxed text-ink-2">
        {[
          "Any failed-synthesis data. Everything above is successes against unlabeled compounds.",
          "Physics features (hull energy, decomposition, reaction driving force). The public data sources we tried were unavailable when we ran this.",
          "“First reported” means first appearance in the text-mined corpus, not first synthesis. Some compounds counted as new after the cutoff are older, and filtering them needs an experimental structure database.",
          "The novelty check, the property model and the ranking are designed and not built.",
          "Any lab validation. No candidate has been made on the strength of this work.",
          "A literature review deep enough to say which parts of the design, if any, are new. Synthesizability prediction is an active field, and we do not claim priority.",
        ].map((t) => (
          <li key={t} className="flex gap-3">
            <span className="text-flag mt-0.5">—</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>

      <div className="mt-14 rounded-lg border border-rule bg-card p-8">
        <h2 className="font-display text-2xl text-ink">If you run syntheses</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The questions we cannot answer from public data. Roughly what fraction of planned
          syntheses fail? What does a failed attempt cost you? Do you keep records of failed
          attempts, including what formed instead? Would you ever let them inform a shared
          model, if nothing left your building? Short answers help.
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
