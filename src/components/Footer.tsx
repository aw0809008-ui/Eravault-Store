import { Heart, MessageCircle, ArrowUp } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden" style={{ background:'#020008' }}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--gold)]/[.02] rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gold)] to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(212,168,83,.25)]">
                <span className="text-black font-black" style={{ fontFamily:"'Orbitron',sans-serif" }}>E</span>
              </div>
              <span className="text-xl font-bold" style={{ fontFamily:"'Playfair Display',serif" }}><span className="text-gradient-gold">Era</span><span className="text-white">Vault</span></span>
            </div>
            <p className="text-white/20 text-sm leading-relaxed max-w-sm mb-8">Where history meets luxury. Every piece authenticated and ready to become part of your story.</p>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-green-500/[.06] border border-green-500/15 text-green-400 hover:bg-green-500/10 transition-all group">
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-sm" style={{ fontFamily:"'Space Grotesk',sans-serif" }}>WhatsApp</span>
            </a>
          </div>
          <div className="md:col-span-3">
            <h4 className="text-[9px] font-bold tracking-[.35em] uppercase text-[var(--gold)]/40 mb-6" style={{ fontFamily:"'Orbitron',sans-serif" }}>Links</h4>
            {['Home','Collection','Contact'].map(l => (
              <a key={l} href={l==='Home'?'#':`#${l.toLowerCase()}`} className="block text-white/20 hover:text-[var(--gold)] transition-all text-sm hover:translate-x-2 py-1.5">{l}</a>
            ))}
          </div>
          <div className="md:col-span-4">
            <h4 className="text-[9px] font-bold tracking-[.35em] uppercase text-[var(--gold)]/40 mb-6" style={{ fontFamily:"'Orbitron',sans-serif" }}>Why Us</h4>
            {['💎 100% Authenticated','📦 Secure Delivery','👨‍💼 Expert Curation','⚡ 24/7 Support'].map(t => (
              <div key={t} className="text-sm text-white/20 py-1.5">{t}</div>
            ))}
          </div>
        </div>

        {/* Marquee */}
        <div className="overflow-hidden py-4 border-y border-white/[.02] mb-10">
          <div className="marquee flex gap-16 whitespace-nowrap">
            {Array.from({ length:12 }).map((_,i) => (
              <span key={i} className="text-[10px] tracking-[.4em] uppercase text-white/[.02] font-black" style={{ fontFamily:"'Orbitron',sans-serif" }}>
                EraVault ◆ Premium ◈ Authenticated ◇ Curated ✦
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/10 text-xs">© {new Date().getFullYear()} EraVault</p>
          <p className="text-white/10 text-xs flex items-center gap-1">Made with <Heart className="w-3 h-3 text-red-500/50 fill-red-500/50" /> for vintage lovers</p>
        </div>
      </div>

      <button onClick={() => scrollTo({ top:0, behavior:'smooth' })}
        className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-xl glass flex items-center justify-center text-white/20 hover:text-[var(--gold)] transition-all group">
        <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </footer>
  );
}
