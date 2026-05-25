import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";

const team = [
  {
    name: "Huan-Ming (Jeremy) Chang",
    role: "CEO & Co-founder",
    bio: "Visionary leader driving the strategic direction of Synzcuor. Background in deep-tech hardware and offensive security.",
    image: null
  },
  {
    name: "Andy Kim",
    role: "Chief Hardware Officer & Co-founder",
    bio: "Expert in bare-metal industrial control systems and physical failsafe architectures. Leads the engineering of solid-state relay interlocks.",
    image: null
  },
  {
    name: "Kien Nguyen",
    role: "CFO",
    bio: "Directs financial strategy and supply chain operations, ensuring rapid hardware scaling and enterprise deployment.",
    image: null
  }
];

export default async function Company() {
  let activeTeam = team; // fallback
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      const { data, error } = await supabase.from('team_members').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        activeTeam = data.map(member => ({
          name: member.name,
          role: member.role,
          bio: member.bio,
          image: member.image_url || "https://i.pravatar.cc/300?img=0"
        }));
      }
    }
  } catch (e) {
    console.error("Failed to fetch team members", e);
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-24 px-6 bg-white text-black border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black mb-6">
              The Company
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Software alone cannot solve physical security problems. We are a team of kernel hackers, hardware engineers, and offensive security researchers building the ultimate failsafe.
            </p>
            <div className="inline-flex items-center gap-2 border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-mono text-gray-600">
              <MapPin className="w-4 h-4 text-synz-accent" />
              <span>Future HQ: San Francisco — Closer to capital, talent, and strategic partners.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {activeTeam.map((member, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                {/* Image hidden as per request until backend provides them */}
                {member.image && (
                  <div className="w-48 h-48 mb-6 overflow-hidden border-2 border-gray-200 group-hover:border-synz-accent transition-colors">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    />
                  </div>
                )}
                <h3 className="text-2xl font-bold text-black mb-2">{member.name}</h3>
                <h4 className="text-sm font-mono text-synz-accent uppercase tracking-widest mb-4">{member.role}</h4>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="careers" className="py-24 bg-white text-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-black">Join the Mission</h2>
          <p className="text-gray-600 mb-8 text-lg">
            We are actively hiring elite systems engineers, embedded developers, and security researchers. If you are paranoid enough to build kill-switches, we want to talk to you.
          </p>
          <a href="#" className="inline-block bg-synz-accent text-black font-bold uppercase tracking-widest py-3 px-8 hover:bg-black hover:text-synz-accent transition-colors">
            View Open Roles
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
