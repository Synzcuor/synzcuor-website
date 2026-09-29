"use client";

import { useEffect } from "react";
import { animate, stagger, utils } from "animejs";
import type { AnimationParams } from "animejs";

/**
 * Page motion, driven by anime.js. Mount once per route; it wires every
 * element on the page that opts in via a data attribute:
 *
 *   data-enter    — above the fold. Animates on mount, staggered in DOM order.
 *   data-reveal   — animates once when it scrolls into view.
 *   data-stagger  — same, but its direct children come in one after another.
 *
 * globals.css holds these at opacity 0 until we get here, so the reduced-motion
 * branch has to be a real early return: it leaves the CSS media query to show
 * everything at rest.
 */
export default function Motion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rise: AnimationParams = { opacity: [0, 1], y: [16, 0], duration: 750, ease: "out(3)" };

    animate(utils.$("[data-enter]"), { ...rise, delay: stagger(90, { start: 60 }) });

    // ponytail: IntersectionObserver triggers, anime.js animates. anime's own
    // onScroll observers measure their bounds once at construction and, with
    // repeat:false, unregister themselves while the container is iterating them
    // — which silently skipped neighbouring sections and left them invisible
    // for good. IntersectionObserver keeps no such state and reports what is on
    // screen right now, including on its first callback, so a reload partway
    // down the page (or an #anchor, or a back-nav) reveals correctly.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          const staggered = entry.target.hasAttribute("data-stagger");
          animate(staggered ? Array.from(entry.target.children) : entry.target, {
            ...rise,
            delay: staggered ? stagger(110) : 0,
          });
        }
      },
      // Wait until the element is 80px in, so it animates where it can be seen.
      { rootMargin: "0px 0px -80px 0px" },
    );

    utils.$("[data-reveal],[data-stagger]").forEach((el) => io.observe(el as Element));

    return () => io.disconnect();
  }, []);

  return null;
}
