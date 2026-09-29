import React from "react";
import Image from "next/image";

/**
 * The company mark: independent holders around one shared centre.
 * Source artwork lives in /logo; public/logo-mark.png is the cropped,
 * background-removed export used everywhere on the site.
 */
export default function Mark({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <Image
      src="/logo-mark.png"
      alt=""
      aria-hidden="true"
      width={96}
      height={96}
      priority
      className={className}
    />
  );
}
