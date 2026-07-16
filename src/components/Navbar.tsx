import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';

interface NavbarProps {
  onSearchOpen: () => void;
}

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Collection', href: '#collection' },
    { name: 'Categories', href: '#categories' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'glass-strong shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#" className="relative group flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(245,166,35,0.4)] group-hover:shadow-[0_0_40px_rgba(245,166,35,0.6)] transition-shadow duration-500">
                  <span className="text-black font-black text-lg" style={{ fontFamily: "'Orbitron', sans-serif" }}>E</span>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 blur-lg opacity-40 group-hover:opacity-70 transition-opacity" />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">Era</span>
                  <span className="text-white">Vault</span>
                </span>
                <div className="text-[9px] uppercase tracking-[0.3em] text-amber-400/60 font-medium" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  Premium Vintage
                </div>
              </div>
            </a>

            {/* Desktop Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.15em] text-gray-400 hover:text-amber-300 transition-all duration-300 group"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {link.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-amber-400 to-orange-500 group-hover:w-3/4 transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(245,166,35,0.5)]" />
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onSearchOpen}
                className="w-11 h-11 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-amber-300 hover:shadow-[0_0_20px_rgba(245,166,35,0.15)] transition-all duration-300 group"
              >
                <Search className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden w-11 h-11 rounded-xl glass flex items-center justify-center text-gray-400"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom glow line */}
        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        )}
      </motion.header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100]"
          >
            <div className="absolute inset-0 bg-[#030014]/98 backdrop-blur-2xl" />
            <div className="relative h-full flex flex-col px-8 py-8">
              <div className="flex justify-between items-center mb-16">
                <span className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <span className="text-amber-300">Era</span>
                  <span className="text-white">Vault</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-2 flex-1 justify-center">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    initial={{ opacity: 0, x: -60, rotateY: -15 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-4xl sm:text-5xl font-bold text-white/80 hover:text-amber-300 transition-all duration-300 py-3 border-b border-white/5 hover:border-amber-400/20 hover:pl-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              <div className="text-center text-gray-600 text-xs tracking-widest uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Premium Vintage Collection
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
