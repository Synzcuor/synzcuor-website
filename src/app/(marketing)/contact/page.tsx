import React from "react";
import type { Metadata } from "next";
import InterestForm from "../../../components/InterestForm";

export const metadata: Metadata = {
  title: "Contact — synzcuor",
  description: "One inbox, one person reading it.",
};

// TODO: set this to the real address before launch.
const EMAIL = "hello@synzcuor.com";

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="eyebrow mb-5">Contact</p>
      <h1 className="font-display text-4xl sm:text-5xl leading-tight tracking-tight text-ink">
        One inbox, one person reading it
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-2">
        There is no sales team, no qualification process and no automated follow-up
        sequence. If you write, you get a reply from the person building this.
      </p>

      <div className="mt-12 grid md:grid-cols-[1fr_240px] gap-12 items-start">
        <div className="rounded-lg border border-rule bg-card p-7 md:p-8">
          <InterestForm />
        </div>

        <aside className="space-y-8">
          <div>
            <p className="eyebrow mb-2">Direct</p>
            <a href={`mailto:${EMAIL}`} className="link text-sm break-all">
              {EMAIL}
            </a>
          </div>
          <div>
            <p className="eyebrow mb-2">Most useful to hear</p>
            <ul className="space-y-2 text-sm text-muted">
              <li>You hold materials data and would consider contributing it</li>
              <li>You think the approach is flawed and can say precisely where</li>
              <li>You have run a research consortium and know what breaks</li>
              <li>You want to build this</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-2">Least useful</p>
            <p className="text-sm text-muted">
              Agency outreach, SEO offers, and anything beginning &ldquo;I came across your
              website and thought&rdquo;.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
