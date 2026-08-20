import React from "react";

/**
 * Six independent holders, one shared centre, nothing crossing between them.
 * That is the whole company, so it is the mark.
 */
export default function Mark({ className = "w-6 h-6" }: { className?: string }) {
  const nodes = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return { x: 16 + 11 * Math.cos(a), y: 16 + 11 * Math.sin(a) };
  });

  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {nodes.map((n, i) => (
        <line
          key={`l${i}`}
          x1={16}
          y1={16}
          x2={n.x}
          y2={n.y}
          stroke="currentColor"
          strokeWidth="1.25"
          opacity="0.45"
        />
      ))}
      {nodes.map((n, i) => (
        <circle key={`n${i}`} cx={n.x} cy={n.y} r="2.4" fill="currentColor" />
      ))}
      <circle cx="16" cy="16" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}
