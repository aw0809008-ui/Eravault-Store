import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!ref.current) return;
      const x = (e.clientX / innerWidth - .5) * 40;
      const y = (e.clientY / innerHeight - .5) * 40;
      ref.current.querySelectorAll<HTMLElement>('.prl').forEach((el, i) => {
        const s = (i + 1) * .35;
        el.style.transform = `translate(${x * s}px,${y * s}px)`;
      });
    };
    addEventListener('mousemove', move);
    return () => removeEventListener('mousemove', move);
  }, []);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* BG Image */}
      <div className="absolute inset-0">
        <img src="/images/hero-bg.jpg" alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020008]/60 via-[#020008]/30 to-[#020008]" />
      </div>

      {/* Aurora overlay */}
      <div className="absolute inset-0 aurora" />

      {/* 3D Grid Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[55vh] grid-floor opacity-40" />

      {/* === FLOATING 3D SHAPES === */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Cube 1 */}
        <div className="prl absolute top-[10%] left-[6%] transition-transform duration-300">
          <div className="cube-wrap">
            <div className="cube w-20 h-20 relative">
              <div className="cube-face" style={{ transform:'rotateY(0deg) translateZ(40px)' }} />
              <div className="cube-face" style={{ transform:'rotateY(90deg) translateZ(40px)' }} />
              <div className="cube-face" style={{ transform:'rotateY(180deg) translateZ(40px)' }} />
              <div className="cube-face" style={{ transform:'rotateY(270deg) translateZ(40px)' }} />
              <div className="cube-face" style={{ transform:'rotateX(90deg) translateZ(40px)' }} />
              <div className="cube-face" style={{ transform:'rotateX(-90deg) translateZ(40px)' }} />
            </div>
          </div>
        </div>

        {/* Cube 2 small */}
        <div className="prl absolute bottom-[22%] right-[8%] transition-transform duration-300">
          <div className="cube-wrap">
            <div className="cube w-14 h-14 relative" style={{ animationDuration:'12s', animationDelay:'2s' }}>
              <div className="cube-face" style={{ transform:'rotateY(0deg) translateZ(28px)', borderColor:'rgba(124,58,237,.15)', background:'rgba(124,58,237,.03)' }} />
              <div className="cube-face" style={{ transform:'rotateY(90deg) translateZ(28px)', borderColor:'rgba(124,58,237,.15)', background:'rgba(124,58,237,.03)' }} />
              <div className="cube-face" style={{ transform:'rotateY(180deg) translateZ(28px)', borderColor:'rgba(124,58,237,.15)', background:'rgba(124,58,237,.03)' }} />
              <div className="cube-face" style={{ transform:'rotateY(270deg) translateZ(28px)', borderColor:'rgba(124,58,237,.15)', background:'rgba(124,58,237,.03)' }} />
            </div>
          </div>
        </div>

        {/* Orbit rings */}
        <div className="prl absolute top-[18%] right-[12%] transition-transform duration-300">
          <div className="orbit w-36 h-36 rounded-full border border-dashed border-[rgba(212,168,83,.12)] flex items-center justify-center" style={{ animationDuration:'35s' }}>
            <div className="orbit-reverse w-20 h-20 rounded-full border border-[rgba(124,58,237,.1)] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[var(--gold)] shadow-[0_0_20px_var(--gold),0_0_60px_rgba(212,168,83,.2)]" />
            </div>
            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full bg-[var(--purple)] shadow-[0_0_12px_var(--purple)]" />
            <div className="absolute bottom-0 right-1/4 w-1 h-1 rounded-full bg-[var(--cyan)] shadow-[0_0_10px_var(--cyan)]" />
          </div>
        </div>

        {/* Diamond */}
        <div className="prl absolute bottom-[28%] left-[10%] float float-d2 transition-transform duration-300">
          <div className="w-14 h-14 rotate-45 border border-[rgba(34,211,238,.15)] bg-[rgba(34,211,238,.03)] shadow-[0_0_30px_rgba(34,211,238,.08)]" />
        </div>

        {/* Hexagon */}
        <div className="prl absolute top-[50%] left-[4%] float-slow float-d3 transition-transform duration-300">
          <div className="hex w-12 h-14 bg-gradient-to-br from-[rgba(212,168,83,.08)] to-[rgba(124,58,237,.04)]" />
        </div>

        {/* Glowing sphere */}
        <div className="prl absolute top-[65%] right-[6%] float float-d1 transition-transform duration-300">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[rgba(124,58,237,.08)] to-[rgba(236,72,153,.05)] border border-[rgba(124,58,237,.1)] shadow-[0_0_40px_rgba(124,58,237,.1)]">
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/5 to-transparent" />
          </div>
        </div>

        {/* Large faint ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/[.01] orbit" style={{ animationDuration:'80s' }}>
          <div className="absolute top-0 left-1/2 w-1 h-1 rounded-full bg-[var(--gold)]/30" />
          <div className="absolute bottom-0 left-1/3 w-0.5 h-0.5 rounded-full bg-[var(--cyan)]/20" />
        </div>

        {/* Morph blob */}
        <div className="prl absolute top-[25%] left-[25%] transition-transform duration-300">
          <div className="morph-blob w-52 h-52 bg-gradient-to-br from-[rgba(212,168,83,.04)] via-[rgba(124,58,237,.03)] to-[rgba(34,211,238,.02)] blur-2xl" />
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto scene">
        {/* Badge */}
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:.8, delay:.3 }} className="mb-8">
          <span className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full neon-glow text-[11px] font-bold tracking-[.3em] uppercase" style={{ fontFamily:"'Orbitron',sans-serif", background:'rgba(212,168,83,.04)', border:'1px solid rgba(212,168,83,.12)', color:'var(--gold)' }}>
            <span className="w-2 h-2 rounded-full bg-[var(--gold)] shadow-[0_0_10px_var(--gold)] animate-pulse" />
            Premium Vintage
            <span className="w-2 h-2 rounded-full bg-[var(--gold)] shadow-[0_0_10px_var(--gold)] animate-pulse" />
          </span>
        </motion.div>

        {/* Title */}
        <motion.div initial={{ opacity:0, y:50 }} animate={{ opacity:1, y:0 }} transition={{ duration:1, delay:.5 }}>
          <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black tracking-tighter leading-[.85]" style={{ fontFamily:"'Playfair Display',serif" }}>
            <span className="text-gradient-gold glow-text">Era</span>
            <span className="text-gradient-white">Vault</span>
          </h1>
          <div className="flex items-center justify-center gap-5 mt-4 mb-8">
            <div className="h-px w-20 sm:w-32 bg-gradient-to-r from-transparent to-[var(--gold)]/40" />
            <span className="text-[9px] sm:text-[10px] tracking-[.5em] uppercase text-[var(--gold)]/40" style={{ fontFamily:"'Orbitron',sans-serif" }}>Since 2024</span>
            <div className="h-px w-20 sm:w-32 bg-gradient-to-l from-transparent to-[var(--gold)]/40" />
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:.8, delay:.8 }}
          className="text-base sm:text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-14 leading-relaxed font-light">
          Extraordinary vintage artifacts — <span className="text-[var(--gold)]/70">authenticated</span>,{' '}
          <span className="text-[var(--purple)]/70">curated</span>, and preserved for collectors who demand the exceptional.
        </motion.p>

        {/* Buttons */}
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:.8, delay:1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <a href="#collection" className="group relative px-10 py-4.5 rounded-2xl overflow-hidden" style={{ fontFamily:"'Space Grotesk',sans-serif" }}>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--gold)] via-[#f5c842] to-[var(--gold)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f5c842] via-white/30 to-[#f5c842] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 text-black font-bold text-sm tracking-wide flex items-center gap-2">✦ Explore Collection</span>
            <div className="absolute inset-0 shadow-[0_0_50px_rgba(212,168,83,.4)] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          </a>
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
            className="group glass px-10 py-4.5 rounded-2xl font-bold text-sm tracking-wide flex items-center gap-3 hover:shadow-[0_0_30px_rgba(37,211,102,.1)] transition-all" style={{ fontFamily:"'Space Grotesk',sans-serif" }}>
            <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span className="text-white/60 group-hover:text-green-300 transition-colors">WhatsApp</span>
          </a>
        </motion.div>

        {/* 3D Stats */}
        <motion.div initial={{ opacity:0, y:60 }} animate={{ opacity:1, y:0 }} transition={{ duration:1, delay:1.2 }}
          className="grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mx-auto">
          {[{ n:'500+', l:'Rare Items', i:'💎' },{ n:'100%', l:'Authentic', i:'🏆' },{ n:'24/7', l:'Support', i:'⚡' }].map((s,i) => (
            <div key={i} className="card-3d holo-card glass rounded-2xl p-4 sm:p-6 text-center group cursor-default">
              <div className="text-2xl mb-2">{s.i}</div>
              <div className="text-xl sm:text-2xl font-black text-gradient-gold" style={{ fontFamily:"'Orbitron',sans-serif" }}>{s.n}</div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-[.2em] text-white/30 mt-1" style={{ fontFamily:"'Space Grotesk',sans-serif" }}>{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[8px] tracking-[.5em] uppercase text-white/20" style={{ fontFamily:"'Orbitron',sans-serif" }}>Scroll</span>
        <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2, repeat:Infinity }} className="w-5 h-8 rounded-full border border-white/10 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-gradient-to-b from-[var(--gold)] to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
