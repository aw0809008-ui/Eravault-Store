import { motion } from 'framer-motion';
import { Heart, MessageCircle, ArrowUp } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-[#030014] overflow-hidden">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      {/* Background shapes */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(245,166,35,0.3)]">
                <span className="text-black font-black text-lg" style={{ fontFamily: "'Orbitron', sans-serif" }}>E</span>
              </div>
              <div>
                <span className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <span className="text-amber-300">Era</span>
                  <span className="text-white">Vault</span>
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              Where history meets luxury. We curate the finest vintage and antique pieces from around the world, each one authenticated and ready to become part of your story.
            </p>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/15 hover:shadow-[0_0_25px_rgba(37,211,102,0.15)] transition-all duration-500 group"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Chat on WhatsApp
              </span>
            </a>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400/60 mb-6" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Quick Links
            </h4>
            <div className="space-y-4">
              {[
                { name: 'Home', href: '#' },
                { name: 'Collection', href: '#collection' },
                { name: 'Categories', href: '#categories' },
                { name: 'Contact Us', href: '#contact' },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-gray-500 hover:text-amber-300 transition-all duration-300 text-sm hover:translate-x-2"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400/60 mb-6" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Why EraVault?
            </h4>
            <div className="space-y-4">
              {[
                { icon: '◆', text: '100% Authenticated Items' },
                { icon: '◈', text: 'Secure Packaging & Delivery' },
                { icon: '◇', text: 'Expert Curation Team' },
                { icon: '✦', text: '24/7 WhatsApp Support' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="text-amber-400/40">{item.icon}</span>
                  <span style={{ fontFamily: "'Inter', sans-serif" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="relative mb-12 overflow-hidden py-4 border-y border-white/[0.03]">
          <div className="marquee-track flex gap-12 whitespace-nowrap">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="text-[11px] uppercase tracking-[0.4em] text-white/[0.04] font-black"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                EraVault ◆ Premium Vintage ◈ Authenticated ◇ Curated ✦
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-700 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
            © {new Date().getFullYear()} EraVault. All rights reserved.
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-700 text-xs flex items-center gap-1.5"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Crafted with <Heart className="w-3 h-3 text-red-500/70 fill-red-500/70" /> for vintage enthusiasts
          </motion.p>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-2xl glass flex items-center justify-center text-gray-400 hover:text-amber-300 hover:shadow-[0_0_20px_rgba(245,166,35,0.15)] transition-all duration-300 group"
      >
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </footer>
  );
}
