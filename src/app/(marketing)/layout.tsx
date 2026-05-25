import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1 w-full bg-slate-50">{children}</main>
      <Footer />
    </div>
  );
}
