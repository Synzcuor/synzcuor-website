import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const articles = [
  {
    title: "Sub-50µs eBPF Interception at Ring -1",
    excerpt: "How we bypass standard networking stacks to achieve line-rate inspection without triggering latency watchdogs in PLCs.",
    date: "May 10, 2026",
    category: "Software Engineering"
  },
  {
    title: "Hardware Relays in Dirty Power Environments",
    excerpt: "Overcoming voltage spikes and ground loops when deploying solid-state disconnects on the factory floor.",
    date: "April 22, 2026",
    category: "Hardware"
  },
  {
    title: "Training QGANs on Industrial Telemetry",
    excerpt: "Why standard LLMs fail in OT security, and how we use Quantum Generative Adversarial Networks to synthesize adversarial mutations.",
    date: "March 15, 2026",
    category: "AI / Research"
  }
];

export default async function Blog() {
  // Attempt to fetch from Supabase
  let activeArticles = articles; // fallback
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        // Map backend schema to expected shape if needed
        activeArticles = data.map(blog => ({
          title: blog.title,
          excerpt: blog.excerpt,
          date: new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          category: blog.category || 'Engineering'
        }));
      }
    }
  } catch (e) {
    console.error("Failed to fetch blogs", e);
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />
      <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black mb-6">
            Engineering Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Deep technical dives into kernel hacking, bare-metal hardware, and offensive OT security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeArticles.map((article, idx) => (
            <article key={idx} className="border border-gray-200 bg-gray-50 p-8 flex flex-col hover:border-synz-accent transition-colors group">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-mono text-synz-accent uppercase tracking-widest">{article.category}</span>
                <span className="text-xs font-mono text-gray-500">{article.date}</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-4 group-hover:text-synz-accent transition-colors">
                {article.title}
              </h2>
              <p className="text-gray-600 mb-8 flex-grow">
                {article.excerpt}
              </p>
              <a href="#" className="text-sm font-bold uppercase tracking-widest text-black hover:text-synz-accent transition-colors">
                Read Article &rarr;
              </a>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
