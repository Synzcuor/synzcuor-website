import React from "react";
import type { Metadata } from "next";
import InterestForm from "../../../components/InterestForm";

export const metadata: Metadata = {
  title: "Contact — synzcuor",
  description: "Contact Synzcuor: design partners, research laboratories, investors and prospective team members.",
};

// TODO: set this to the real address before launch.
const EMAIL = "hello@synzcuor.com";

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="eyebrow mb-5">Contact</p>
      <h1 className="font-display text-4xl sm:text-5xl leading-tight tracking-tight text-ink">
        Contact
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-2">
        Every message is read and answered by the founder.
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
            <p className="eyebrow mb-2">We would like to hear from you if</p>
            <ul className="space-y-2 text-sm text-muted">
              <li>You hold materials data and would consider a pilot</li>
              <li>You see a specific flaw in the approach</li>
              <li>You have run a research consortium</li>
              <li>You would like to join the team or invest</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
