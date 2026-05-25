import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-50 pt-24 pb-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Image 
              src="/logo.png" 
              alt="Synzcuor Logo" 
              width={40} 
              height={40} 
              className="object-contain"
            />
            <span className="font-bold text-2xl tracking-tight text-black">
              Synzcuor
            </span>
          </div>
          <p className="text-gray-600 mb-8 max-w-sm">
            Physical network kill-switches for factories. When the math detects a threat, the metal cuts the wire.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-black uppercase tracking-widest mb-6 text-sm">Platform</h4>
          <ul className="space-y-4">
            <li><a href="/products" className="text-gray-600 hover:text-black transition-colors text-sm">Products</a></li>
            <li><a href="https://github.com" className="text-gray-600 hover:text-black transition-colors text-sm">Open Source</a></li>
            <li><a href="#" className="text-gray-600 hover:text-black transition-colors text-sm">Documentation</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-black uppercase tracking-widest mb-6 text-sm">Company</h4>
          <ul className="space-y-4">
            <li><a href="/company" className="text-gray-600 hover:text-black transition-colors text-sm">About Us</a></li>
            <li><a href="/blog" className="text-gray-600 hover:text-black transition-colors text-sm">Engineering Blog</a></li>
            <li><a href="/company#careers" className="text-gray-600 hover:text-black transition-colors text-sm">Careers</a></li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto px-6 border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm font-mono">
          &copy; {new Date().getFullYear()} Synzcuor. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm">
          <a href="#" className="text-gray-500 hover:text-black transition-colors font-mono">Privacy</a>
          <a href="#" className="text-gray-500 hover:text-black transition-colors font-mono">Terms</a>
        </div>
      </div>
    </footer>
  );
}
