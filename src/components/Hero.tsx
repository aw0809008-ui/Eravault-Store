import { useEffect, useRef, useState } from 'react';

interface HeroProps { onShopNow: () => void; }

export default function Hero({ onShopNow }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const fn = () => {
      const y = window.scrollY;
      const h = window.innerHeight;
      setScroll(Math.min(y / h, 1)); // 0 to 1 as user scrolls through hero
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // 3D transforms based on scroll progress (0 → 1)
  const s = scroll;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const bgStyle: React.CSSProperties = isMobile
    ? { opacity: 1 - s * 0.5 }
    : { transform: `translateY(${s * 30}%) scale(${1 + s * 0.15})`, opacity: 1 - s * 0.3 };

  const contentStyle: React.CSSProperties = isMobile
    ? { opacity: 1 - s * 2, transform: `translateY(${s * -60}px)` }
    : { opacity: 1 - s * 1.8, transform: `perspective(1000px) translateY(${s * -120}px) rotateX(${s * 15}deg) scale(${1 - s * 0.15})` };

  const overlayOpacity = 0.6 + s * 0.4; // gets darker as you scroll

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background — zooms in + fades on scroll */}
      <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: `url(https://images.pexels.com/photos/35045845/pexels-photo-35045845.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1920)`,
        ...bgStyle,
        transition: 'none',
      }} />
      
      {/* Overlay — darkens on scroll */}
      <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${overlayOpacity})` }} />
      
      {/* Floating orbs — desktop only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-[15%] left-[8%] w-32 h-32 rounded-full bg-brand-500/10 blur-3xl animate-float" />
        <div className="absolute top-[30%] right-[12%] w-48 h-48 rounded-full bg-brand-400/10 blur-3xl animate-float-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[25%] left-[25%] w-40 h-40 rounded-full bg-purple-500/8 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content — rotates + lifts + fades on scroll */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center" style={contentStyle}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 sm:mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/90 text-xs sm:text-sm font-medium">Premium Vintage Collection</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-6 sm:mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          Discover<br /><span className="gradient-text">Timeless Fashion</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-white/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed animate-fade-in-up px-2" style={{ animationDelay: '0.6s' }}>
          Curated vintage pieces that tell a story. Each item is handpicked for quality, authenticity, and timeless appeal.
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <button onClick={onShopNow} className="group relative px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/40 hover:scale-105 uppercase tracking-wider text-sm overflow-hidden">
            <span className="relative z-10 flex items-center justify-center gap-2">
              Shop Now
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-700 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <a href="https://instagram.com/Eravault_vintage" target="_blank" rel="noopener noreferrer"
            className="group px-8 sm:px-10 py-3.5 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold rounded-full transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:scale-105 uppercase tracking-wider text-sm flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/><circle cx="12" cy="12" r="3.5"/></svg>
            Instagram
          </a>
        </div>

        {/* Mini Stats */}
        <div className="flex justify-center gap-6 sm:gap-10 mt-10 sm:mt-14 animate-fade-in-up" style={{ animationDelay: '1s' }}>
          {[{ val: '500+', label: 'Items Sold' }, { val: '100%', label: 'Authentic' }, { val: '🌍', label: 'Worldwide' }].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-white text-xl sm:text-2xl font-bold">{s.val}</p>
              <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator — hides as you scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce transition-opacity" style={{ opacity: 1 - s * 3 }}>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1.5 h-2.5 bg-white/60 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-50 to-transparent" />
    </section>
  );
}
