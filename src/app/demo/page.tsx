import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RequestDemoForm from "@/components/RequestDemoForm";

export default function Demo() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        <RequestDemoForm />
      </div>
      <Footer />
    </main>
  );
}
