import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team — synzcuor",
  description: "The people building Synzcuor, what each is responsible for, and the roles we are hiring for.",
};

// Fill `name` and `bio` once confirmed. An empty name renders as the role alone.
const people = [
  {
    initials: "JC",
    name: "Jeremy Chang",
    role: "Founder & CEO",
    bio: "Leads product, research direction and fundraising. Co-author of SH-QGAN, a hybrid quantum-classical generative model for crystal structures (preprint, in revision after peer review). Built Synzcuor's pooling benchmark, private training over a network, and the first validation model.",
    owns: ["Vision and product", "Validation research", "Fundraising and partnerships"],
  },
  {
    initials: "FE",
    name: "",
    role: "Founding Engineer",
    bio: "Leads the implementation of pooling and security, and the deployment of the client into customer environments.",
    owns: ["Private training system", "Security and deployment", "Engineering hiring"],
  },
];

const open = [
  ["Co-founder: Go-to-Market, Operations & Marketing", "Customers, pilots, operations and the company's public presence"],
  ["Machine Learning Engineer, Private Training", "Federated training, secure aggregation and privacy"],
  ["Software Engineer, Deployment & Infrastructure", "On-premises packaging, security review and reproducibility"],
  ["Computational Materials Engineer, Validation", "Novelty checks, stability and the synthesizability model"],
];

export default function TeamPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <p className="eyebrow mb-5">Team</p>
      <h1 className="font-display text-4xl sm:text-5xl leading-tight tracking-tight text-ink max-w-3xl">
        The people building Synzcuor
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-2 max-w-2xl">
        A small team covering the three components: pooling, security and validation. We are
        hiring for go-to-market and for each engineering discipline the product depends on.
      </p>

      <div className="mt-14 grid md:grid-cols-2 gap-6">
        {people.map((p) => (
          <article key={p.role} className="rounded-xl border border-rule bg-card p-8">
            <div className="flex items-center gap-5">
              <span
                aria-hidden="true"
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent font-display text-2xl text-paper"
              >
                {p.initials}
              </span>
              <div>
                <h2 className="font-display text-2xl text-ink">{p.name || p.role}</h2>
                {p.name && <p className="text-sm text-accent">{p.role}</p>}
              </div>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-ink-2">{p.bio}</p>
            <p className="eyebrow mt-6 mb-3">Responsible for</p>
            <ul className="flex flex-wrap gap-2">
              {p.owns.map((o) => (
                <li key={o} className="rounded-full border border-rule bg-paper-2 px-3 py-1 text-xs text-ink-2">
                  {o}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section className="mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Open roles</p>
            <h2 className="font-display text-3xl tracking-tight text-ink">Join the team</h2>
          </div>
          <Link href="/careers" className="link text-sm">
            Full role descriptions and terms
          </Link>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {open.map(([title, what]) => (
            <Link
              key={title}
              href="/careers"
              className="group rounded-xl border border-rule bg-card p-6 hover:border-accent transition-colors"
            >
              <h3 className="font-display text-lg text-ink group-hover:text-accent transition-colors">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{what}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-xl border border-rule bg-paper-2 p-8 md:p-10 grid md:grid-cols-[1fr_auto] gap-6 items-center">
        <div>
          <p className="eyebrow mb-3">Scientific advisors</p>
          <h2 className="font-display text-2xl text-ink">An advisory group in synthesis and battery materials</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted max-w-2xl">
            We are forming a small group of advisors in solid-state synthesis, battery electrolytes
            and synthesizability prediction, to review our methods and benchmarks.
          </p>
        </div>
        <Link
          href="/contact"
          className="shrink-0 px-5 py-3 rounded-md bg-ink text-paper text-sm font-medium hover:bg-accent transition-colors text-center"
        >
          Get in touch
        </Link>
      </section>
    </div>
  );
}
