import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';

export default function Navbar({ onSearchOpen }: { onSearchOpen: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  useEffect(() => { const f = () => setScrolled(scrollY > 40); addEventListener('scroll', f); return () => removeEventListener('scroll', f); }, []);

  const links = [{ n:'Home', h:'#' },{ n:'Collection', h:'#collection' },{ n:'Contact', h:'#contact' }];

  return (
    <>
      <motion.header initial={{ y:-100 }} animate={{ y:0 }} transition={{ duration:.8 }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${scrolled ? 'glass-strong shadow-[0_8px_40px_rgba(0,0,0,.5)]' : 'bg-transparent'}`}
        style={ scrolled ? { background:'rgba(2,0,8,.75)', backdropFilter:'blur(30px)', borderBottom:'1px solid rgba(255,255,255,.03)' } : {} }>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gold)] via-[#f5c842] to-[var(--gold)] flex items-center justify-center shadow-[0_0_25px_rgba(212,168,83,.3)] group-hover:shadow-[0_0_40px_rgba(212,168,83,.5)] transition-shadow">
                <span className="text-black font-black text-base" style={{ fontFamily:"'Orbitron',sans-serif" }}>E</span>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--gold)] to-orange-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
            </div>
            <div>
              <span className="text-xl font-bold" style={{ fontFamily:"'Playfair Display',serif" }}>
                <span className="text-gradient-gold">Era</span><span className="text-white">Vault</span>
              </span>
              <div className="text-[7px] tracking-[.35em] uppercase text-[var(--gold)]/30 font-semibold" style={{ fontFamily:"'Orbitron',sans-serif" }}>Premium Vintage</div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <a key={l.n} href={l.h} className="relative px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[.2em] text-white/30 hover:text-[var(--gold)] transition-all group" style={{ fontFamily:"'Space Grotesk',sans-serif" }}>
                {l.n}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-[var(--gold)] to-[var(--purple)] group-hover:w-3/4 transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(212,168,83,.5)]" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={onSearchOpen} className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/30 hover:text-[var(--gold)] transition-colors"><Search className="w-4 h-4" /></button>
            <button onClick={() => setMob(true)} className="md:hidden w-10 h-10 rounded-xl glass flex items-center justify-center text-white/30"><Menu className="w-5 h-5" /></button>
          </div>
        </div>
        {scrolled && <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/20 to-transparent" />}
      </motion.header>

      <AnimatePresence>
        {mob && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-[100]" style={{ background:'rgba(2,0,8,.97)', backdropFilter:'blur(30px)' }}>
            <div className="flex flex-col h-full px-8 py-8">
              <div className="flex justify-between items-center mb-16">
                <span className="text-2xl font-bold" style={{ fontFamily:"'Playfair Display',serif" }}><span className="text-[var(--gold)]">Era</span><span className="text-white">Vault</span></span>
                <button onClick={() => setMob(false)} className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-white"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-3">
                {links.map((l,i) => (
                  <motion.a key={l.n} initial={{ opacity:0, x:-50 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*.1 }}
                    href={l.h} onClick={() => setMob(false)}
                    className="text-4xl font-bold text-white/60 hover:text-[var(--gold)] transition-all py-3 border-b border-white/[.03] hover:pl-4" style={{ fontFamily:"'Playfair Display',serif" }}>{l.n}</motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
