import React from "react";

const INK = "#14161a";
const MUTED = "#6b7079";
const ACCENT = "#0f5c57";
const RULE = "#d8d4ca";
const CARD = "#ffffff";
const SOFT = "#e7f0ee";

const holders = [
  { y: 52, label: "Holder A", sub: "battery lab" },
  { y: 126, label: "Holder B", sub: "catalyst group" },
  { y: 200, label: "Holder C", sub: "semiconductor R&D" },
];

export default function FederationDiagram() {
  return (
    <figure>
      <div className="overflow-x-auto">
      <svg
        viewBox="0 0 880 322"
        className="w-full min-w-[720px] h-auto"
        role="img"
        aria-label="Three data holders train locally. Only masked model updates leave their infrastructure. An aggregator sums the masks, which cancel, producing a pooled model that is sent back to each holder."
      >
        <defs>
          <marker id="arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill={MUTED} />
          </marker>
          <marker id="arwA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill={ACCENT} />
          </marker>
        </defs>

        {/* Trust boundary */}
        <rect
          x="8" y="26" width="266" height="248" rx="10"
          fill="none" stroke={ACCENT} strokeWidth="1.25" strokeDasharray="5 4"
        />
        <text x="16" y="18" fontSize="11" fill={ACCENT} fontFamily="var(--font-mono)">
          YOUR INFRASTRUCTURE — RAW DATA NEVER CROSSES THIS LINE
        </text>

        {holders.map((h, i) => (
          <g key={h.label} style={{ ["--d" as string]: `${i * 0.45}s` }}>
            <rect x="26" y={h.y} width="230" height="52" rx="7" fill={CARD} stroke={RULE} />
            <text x="42" y={h.y + 22} fontSize="13" fill={INK} fontWeight="500">
              {h.label}
            </text>
            <text x="42" y={h.y + 39} fontSize="11" fill={MUTED}>
              {h.sub} · trains locally
            </text>
            {/* update leaves, masked */}
            <line
              className="flow" style={{ animationDelay: "var(--d)" }}
              x1="256" y1={h.y + 26} x2="330" y2={h.y + 26}
              stroke={MUTED} strokeWidth="1.25" markerEnd="url(#arw)"
            />
            <g className="pulse" style={{ animationDelay: "var(--d)" }}>
              <rect x="286" y={h.y + 15} width="22" height="22" rx="5" fill={SOFT} stroke={ACCENT} strokeWidth="1" />
              <text x="297" y={h.y + 30} fontSize="11" fill={ACCENT} textAnchor="middle" fontFamily="var(--font-mono)">
                +r
              </text>
            </g>
            <line
              className="flow" style={{ animationDelay: "var(--d)" }}
              x1="340" y1={h.y + 26} x2="398" y2={h.y + 26}
              stroke={MUTED} strokeWidth="1.25" markerEnd="url(#arw)"
            />
          </g>
        ))}

        <text x="327" y="44" fontSize="11" fill={MUTED} textAnchor="middle" fontFamily="var(--font-mono)">
          MASKED UPDATE
        </text>

        {/* Aggregator */}
        <rect x="400" y="104" width="168" height="96" rx="8" fill={CARD} stroke={RULE} />
        <text x="484" y="136" fontSize="13" fill={INK} textAnchor="middle" fontWeight="500">
          Aggregator
        </text>
        <text x="484" y="156" fontSize="11" fill={MUTED} textAnchor="middle">
          masks sum to zero
        </text>
        <text x="484" y="174" fontSize="11" fill={ACCENT} textAnchor="middle" fontFamily="var(--font-mono)">
          sees the total only
        </text>

        {/* to pooled model */}
        <line className="flow" x1="568" y1="152" x2="638" y2="152" stroke={ACCENT} strokeWidth="1.5" markerEnd="url(#arwA)" />

        {/* Pooled model */}
        <rect x="646" y="112" width="216" height="80" rx="8" fill={SOFT} stroke={ACCENT} strokeWidth="1.25" />
        <text x="754" y="144" fontSize="13" fill={INK} textAnchor="middle" fontWeight="500">
          Pooled model
        </text>
        <text x="754" y="164" fontSize="11" fill={ACCENT} textAnchor="middle">
          better than any silo alone
        </text>

        {/* Return path */}
        <path
          className="flow flow-return"
          d="M754 192 L754 296 L141 296 L141 278"
          fill="none" stroke={ACCENT} strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arwA)"
        />
        <text x="448" y="290" fontSize="11" fill={ACCENT} textAnchor="middle" fontFamily="var(--font-mono)">
          RETURNED, PLUS A PRIVATE HEAD FINE-TUNED ON YOUR DATA
        </text>
      </svg>
      </div>
      <figcaption className="mt-4 text-xs text-muted">
        Federated training with secure aggregation. The masks are generated pairwise and
        cancel exactly in the sum, so the aggregator can compute the total without ever
        seeing a single participant&rsquo;s update.
      </figcaption>
    </figure>
  );
}
