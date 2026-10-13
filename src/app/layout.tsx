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
  title: "Synzcuor — predicting which new materials can be made",
  description:
    "A validator that predicts which AI-designed materials can actually be made, trained on failed syntheses pooled across laboratories without any data leaving its owner. Early stage; results on public data only.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${newsreader.variable} ${jetbrains.variable} h-full`}
    >
      <head>
        {/* Mark the page as animating before first paint, so reveal targets start hidden
            only when Motion.tsx will actually run. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
