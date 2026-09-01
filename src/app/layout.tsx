import type { Metadata } from "next";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  // ponytail: Vercel supplies the production host; NEXT_PUBLIC_SITE_URL overrides it
  // once there is a custom domain. No hardcoded URL to go stale.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: "synzcuor — the pooled model for materials R&D",
  description:
    "Materials data is locked inside organisations that compete. We train a shared model across those silos without the data ever leaving its owner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <noscript>
          {/* Motion.tsx never runs, so unhide what globals.css hid for it. */}
          <style>{`[data-reveal],[data-stagger] > *,[data-enter]{opacity:1}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
