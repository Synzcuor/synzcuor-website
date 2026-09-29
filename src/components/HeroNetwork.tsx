import React from "react";

/**
 * Hero illustration, drawn from the logo's own motif: independent holders around one
 * shared centre. Each holder keeps its data (the filled disc stays put); only a masked
 * update travels along its link to the shared model. Pure SVG + CSS, so it renders
 * without JavaScript and freezes under prefers-reduced-motion (see globals.css).
 */
const HUB = { x: 260, y: 250 };

const nodes = [
  { x: 92, y: 92, r: 30, fill: "#5aa84b", label: "Battery lab" },
  { x: 262, y: 44, r: 22, fill: "#2d5e3a", label: "" },
  { x: 438, y: 104, r: 26, fill: "#2e9b4a", label: "Cell maker" },
  { x: 486, y: 286, r: 24, fill: "#3f8f35", label: "" },
  { x: 392, y: 440, r: 30, fill: "#1e8a4c", label: "Catalyst group" },
  { x: 150, y: 452, r: 24, fill: "#7ed957", label: "" },
  { x: 40, y: 290, r: 22, fill: "#00c06a", label: "University lab" },
];

export default function HeroNetwork() {
  return (
    <figure className="relative w-full max-w-[520px] mx-auto" aria-hidden="true">
      <svg viewBox="0 0 520 500" className="w-full h-auto overflow-visible">
        <defs>
          <radialGradient id="hubglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0f5c57" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0f5c57" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={HUB.x} cy={HUB.y} r="150" fill="url(#hubglow)" />

        {nodes.map((n, i) => (
          <g key={i}>
            <line x1={n.x} y1={n.y} x2={HUB.x} y2={HUB.y} stroke="#0f5c57" strokeOpacity="0.28" strokeWidth="1.5" />
            <line
              className="flow"
              style={{ animationDelay: `${i * 0.35}s` }}
              x1={n.x} y1={n.y} x2={HUB.x} y2={HUB.y}
              stroke="#0f5c57" strokeWidth="2" strokeLinecap="round"
            />
          </g>
        ))}

        {nodes.map((n, i) => (
          <g key={`n${i}`} className="pulse" style={{ animationDelay: `${i * 0.4}s` }}>
            <circle cx={n.x} cy={n.y} r={n.r + 7} fill={n.fill} opacity="0.14" />
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.fill} />
          </g>
        ))}

        {nodes.filter((n) => n.label).map((n) => (
          <text
            key={n.label}
            x={n.x}
            y={n.y + n.r + 22}
            textAnchor="middle"
            fontSize="12"
            fill="#6b7079"
            fontFamily="var(--font-mono)"
          >
            {n.label}
          </text>
        ))}

        <circle cx={HUB.x} cy={HUB.y} r="66" fill="#2b5552" />
        <circle cx={HUB.x} cy={HUB.y} r="66" fill="none" stroke="#0f5c57" strokeWidth="2" />
        <text x={HUB.x} y={HUB.y - 4} textAnchor="middle" fontSize="14" fill="#ffffff" fontWeight="600">
          Shared model
        </text>
        <text x={HUB.x} y={HUB.y + 15} textAnchor="middle" fontSize="10" fill="#cfe6e2" fontFamily="var(--font-mono)">
          sees no one&rsquo;s data
        </text>
      </svg>
      <figcaption className="mt-2 text-center text-xs text-muted">
        Each laboratory keeps its data; only masked updates reach the shared model.
      </figcaption>
    </figure>
  );
}
