import React from "react";

const stages: { name: string; what: string; cost: string; ours?: boolean }[] = [
  { name: "Validity checks", what: "Charge balance, atom distances, symmetry", cost: "seconds" },
  { name: "ML relaxation", what: "A pretrained interatomic potential settles the structure", cost: "seconds" },
  { name: "Novelty check", what: "Matched against known structures, after relaxation", cost: "seconds" },
  { name: "Energy above hull", what: "ML estimate, then DFT on the shortlist", cost: "minutes → hours" },
  { name: "Synthesizability", what: "Trained on lab outcomes, failed syntheses included", cost: "seconds", ours: true },
  { name: "Property model", what: "Gain over the best known material for the job", cost: "seconds" },
];

/**
 * The screening pipeline as a figure: each stage is cheaper than a lab attempt, and a
 * candidate's score discounts its value rather than acting as a hard pass/fail.
 * The one stage that needs data nobody else has is highlighted.
 */
export default function ValidationPipeline() {
  return (
    <figure className="mt-8">
      <div className="rounded-xl border border-rule bg-card p-5 sm:p-7">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
          Candidates from any generator, substitution or the literature
        </p>
        <ol className="mt-4 space-y-2.5">
          {stages.map((s, i) => (
            <li
              key={s.name}
              className={
                "grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-lg px-3 py-3 " +
                (s.ours ? "bg-accent text-paper" : "bg-paper-2")
              }
            >
              <span
                className={
                  "flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs " +
                  (s.ours ? "bg-paper text-accent" : "bg-card text-muted border border-rule")
                }
              >
                {i + 1}
              </span>
              <span>
                <span className={"block text-sm font-semibold " + (s.ours ? "text-paper" : "text-ink")}>
                  {s.name}
                  {s.ours && (
                    <span className="ml-2 align-middle font-mono text-[10px] uppercase tracking-wider text-[#cfe6e2]">
                      needs private data
                    </span>
                  )}
                </span>
                <span className={"block text-xs leading-relaxed " + (s.ours ? "text-[#e3efec]" : "text-muted")}>
                  {s.what}
                </span>
              </span>
              <span className={"font-mono text-[11px] whitespace-nowrap " + (s.ours ? "text-[#cfe6e2]" : "text-muted")}>
                {s.cost}
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-4 rounded-lg border border-dashed border-accent/50 px-4 py-3 text-sm text-ink-2">
          <span className="font-semibold text-ink">Rank</span> by chance of being made × value − cost of an
          attempt, plus a bonus for exploring. <span className="font-semibold text-ink">Then a lab attempt</span>,
          and its outcome, success <em>or</em> failure, goes back into training.
        </div>
      </div>
      <figcaption className="mt-3 text-xs leading-relaxed text-muted">
        Only the highlighted stage needs data nobody else has. The other stages use existing tools, and we
        don&rsquo;t claim them as ours.
      </figcaption>
    </figure>
  );
}
