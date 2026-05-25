import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image 
            src="/logo.png" 
            alt="Synzcuor Logo" 
            width={32} 
            height={32} 
            className="transition-transform group-hover:scale-110 object-contain"
          />
          <span className="font-bold text-xl tracking-tight text-black">
            Synzcuor
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm text-gray-600 hover:text-black transition-colors hidden md:block"
          >
            Products
          </Link>
          <Link
            href="/blog"
            className="text-sm text-gray-600 hover:text-black transition-colors hidden md:block"
          >
            Engineering Blog
          </Link>
          <Link
            href="/company"
            className="text-sm text-gray-600 hover:text-black transition-colors hidden md:block"
          >
            Company
          </Link>
          <Link
            href="/demo"
            className="bg-synz-accent text-synz-black px-4 py-2 text-sm font-bold hover:bg-synz-accent-hover transition-colors rounded-none"
          >
            Request Demo
          </Link>
        </div>
      </div>
    </nav>
  );
}
