import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductEcosystem from "@/components/ProductEcosystem";
import InteractiveCliDemo from "@/components/InteractiveCliDemo";

export default function Products() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        <ProductEcosystem />
        <InteractiveCliDemo />
      </div>
      <Footer />
    </main>
  );
}
