import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 30;
      const y = (clientY / innerHeight - 0.5) * 30;

      const shapes = heroRef.current.querySelectorAll<HTMLElement>('.parallax-shape');
      shapes.forEach((shape, i) => {
        const speed = (i + 1) * 0.4;
        shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Deep space background */}
      <div className="absolute inset-0 bg-[#030014]" />

      {/* Aurora gradients */}
      <div className="absolute inset-0 aurora-bg" />

      {/* Grid floor (3D perspective) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[60vh] opacity-20"
        style={{
          background: `
            linear-gradient(180deg, transparent 0%, #030014 100%),
            repeating-linear-gradient(90deg, rgba(245,166,35,0.1) 0px, transparent 1px, transparent 80px),
            repeating-linear-gradient(0deg, rgba(245,166,35,0.05) 0px, transparent 1px, transparent 80px)
          `,
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* 3D Floating shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Rotating cube 1 */}
        <div className="parallax-shape absolute top-[12%] left-[8%] w-24 h-24 transition-transform duration-200">
          <div className="cube-3d w-full h-full relative" style={{ animationDuration: '25s' }}>
            <div className="cube-face" style={{ transform: 'rotateY(0deg) translateZ(48px)' }} />
            <div className="cube-face" style={{ transform: 'rotateY(90deg) translateZ(48px)' }} />
            <div className="cube-face" style={{ transform: 'rotateY(180deg) translateZ(48px)' }} />
            <div className="cube-face" style={{ transform: 'rotateY(270deg) translateZ(48px)' }} />
            <div className="cube-face" style={{ transform: 'rotateX(90deg) translateZ(48px)' }} />
            <div className="cube-face" style={{ transform: 'rotateX(-90deg) translateZ(48px)' }} />
          </div>
        </div>

        {/* Glowing ring */}
        <div className="parallax-shape absolute top-[20%] right-[10%] transition-transform duration-200">
          <div className="ring-rotate w-32 h-32 rounded-full border-2 border-dashed border-amber-400/20 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border border-purple-500/20 ring-rotate-reverse flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-amber-400/40 shadow-[0_0_20px_rgba(245,166,35,0.5)]" />
            </div>
          </div>
        </div>

        {/* Diamond shape */}
        <div className="parallax-shape absolute bottom-[25%] left-[12%] transition-transform duration-200 float-y-delay-2">
          <div className="w-16 h-16 rotate-45 border border-cyan-400/20 bg-cyan-400/5 backdrop-blur-sm shadow-[0_0_30px_rgba(6,182,212,0.1)]" />
        </div>

        {/* Glowing sphere */}
        <div className="parallax-shape absolute bottom-[30%] right-[15%] transition-transform duration-200 float-y-delay-1">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/15 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/5 to-transparent" />
          </div>
        </div>

        {/* Floating hexagons */}
        <div className="parallax-shape absolute top-[45%] left-[5%] transition-transform duration-200 float-y-delay-3">
          <div className="hexagon w-14 h-14 bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-400/10" />
        </div>

        {/* Orbit circles */}
        <div className="parallax-shape absolute top-[60%] right-[8%] transition-transform duration-200">
          <div className="ring-rotate" style={{ animationDuration: '40s' }}>
            <div className="w-28 h-28 rounded-full border border-amber-400/10 relative">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,166,35,0.8)]" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
            </div>
          </div>
        </div>

        {/* Morphing blob */}
        <div className="parallax-shape absolute top-[30%] left-[30%] transition-transform duration-200">
          <div className="morph-blob w-40 h-40 bg-gradient-to-br from-amber-500/5 via-purple-500/5 to-cyan-500/5 blur-2xl" />
        </div>

        {/* Large decorative ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/[0.02] ring-rotate opacity-50" style={{ animationDuration: '60s' }}>
          <div className="absolute top-0 left-1/2 w-1 h-1 rounded-full bg-amber-400/50" />
          <div className="absolute bottom-0 left-1/2 w-1 h-1 rounded-full bg-purple-400/50" />
          <div className="absolute top-1/2 left-0 w-1 h-1 rounded-full bg-cyan-400/50" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto scene-3d">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full neon-border text-amber-300 text-[11px] font-semibold tracking-[0.25em] uppercase"
            style={{ fontFamily: "'Orbitron', sans-serif", background: 'rgba(245,166,35,0.06)' }}>
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,166,35,0.8)] animate-pulse" />
            Premium Vintage Collection
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,166,35,0.8)] animate-pulse" />
          </span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent glow-text drop-shadow-2xl">
                Era
              </span>
            </span>
            <span className="relative inline-block ml-2">
              <span className="bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                Vault
              </span>
            </span>
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-amber-500/50" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-amber-400/50 font-medium" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Est. 2024
            </span>
            <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-gray-400/80 max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Discover extraordinary artifacts from forgotten eras. 
          Each masterpiece is <span className="text-amber-300/80">authenticated</span>, 
          <span className="text-purple-300/80"> curated</span>, and waiting to find its next guardian.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-20"
        >
          <a
            href="#collection"
            className="group relative px-10 py-4 rounded-2xl overflow-hidden font-bold text-base tracking-wide"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-[1px] rounded-[14px] bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 group-hover:from-amber-400 group-hover:via-yellow-400 group-hover:to-amber-500 transition-all" />
            <span className="relative z-10 text-black flex items-center gap-3">
              ✦ Explore Collection
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_60px_rgba(245,166,35,0.4)]" />
          </a>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="group px-10 py-4 rounded-2xl glass text-white font-bold text-base tracking-wide hover:shadow-[0_0_30px_rgba(37,211,102,0.15)] transition-all duration-500 flex items-center gap-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="text-gray-300 group-hover:text-green-300 transition-colors">WhatsApp Us</span>
          </a>
        </motion.div>

        {/* 3D Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="grid grid-cols-3 gap-3 sm:gap-6 max-w-xl mx-auto"
        >
          {[
            { num: '500+', label: 'Rare Items', icon: '◆' },
            { num: '100%', label: 'Authentic', icon: '◈' },
            { num: '24/7', label: 'Support', icon: '◇' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="card-3d relative rounded-2xl p-4 sm:p-6 glass text-center group cursor-default holo-shine"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div className="text-amber-400/60 text-lg mb-2">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-black bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-transparent mb-1"
                style={{ fontFamily: "'Orbitron', sans-serif" }}>
                {stat.num}
              </div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gray-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[9px] uppercase tracking-[0.4em] text-gray-600" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-9 rounded-full border border-white/10 flex justify-center pt-2"
        >
          <div className="w-1 h-2.5 rounded-full bg-gradient-to-b from-amber-400 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
