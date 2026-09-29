import React from "react";

/** Line icons for the three parts, in a teal disc: the site's one repeated motif. */
export default function PillarIcon({ kind }: { kind: string }) {
  const paths: Record<string, React.ReactNode> = {
    Pooling: (
      <>
        <circle cx="12" cy="12" r="3" />
        <circle cx="4.5" cy="6" r="1.8" />
        <circle cx="19.5" cy="6" r="1.8" />
        <circle cx="12" cy="20.5" r="1.8" />
        <path d="M6 7.2 9.6 10.4M18 7.2l-3.6 3.2M12 15v3.7" />
      </>
    ),
    Security: (
      <>
        <path d="M12 3 5 6v5.5c0 4.3 3 7.8 7 9.5 4-1.7 7-5.2 7-9.5V6l-7-3Z" />
        <path d="m9 12 2 2 4-4.5" />
      </>
    ),
    Validation: (
      <>
        <path d="M9.5 3h5M10.5 3v5.2L5.4 18a2 2 0 0 0 1.8 3h9.6a2 2 0 0 0 1.8-3l-5.1-9.8V3" />
        <path d="M7.5 14.5h9" />
      </>
    ),
  };
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-paper">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {paths[kind]}
      </svg>
    </span>
  );
}
