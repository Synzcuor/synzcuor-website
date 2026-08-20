"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen bg-paper text-ink">
      <Header />
      <main key={pathname} className="flex-1 w-full animate-page-enter">
        {children}
      </main>
      <Footer />
    </div>
  );
}
