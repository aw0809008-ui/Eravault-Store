import { useEffect, useRef } from 'react';

interface HeroProps {
  onShopNow: () => void;
}

export default function Hero({ onShopNow }: HeroProps) {
  const bgRef = useRef<HTMLDivElement>(null);

  // Parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax */}
      <div ref={bgRef} className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(https://images.pexels.com/photos/35045845/pexels-photo-35045845.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1920)` }} />
      
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-brand-950/60 to-black/80" />
      
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[8%] w-32 h-32 rounded-full bg-brand-500/10 blur-3xl animate-float" />
        <div className="absolute top-[30%] right-[12%] w-48 h-48 rounded-full bg-brand-400/10 blur-3xl animate-float-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[25%] left-[25%] w-40 h-40 rounded-full bg-purple-500/8 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[15%] right-[30%] w-56 h-56 rounded-full bg-brand-600/8 blur-3xl animate-float-slow" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 sm:mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/90 text-xs sm:text-sm font-medium">Premium Vintage Collection</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-6 sm:mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          Discover<br /><span className="gradient-text">Timeless Fashion</span>
        </h1>
        
        <p className="text-white/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed animate-fade-in-up px-2" style={{ animationDelay: '0.6s' }}>
          Curated vintage pieces that tell a story. Each item is handpicked for quality, authenticity, and timeless appeal.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <button onClick={onShopNow} className="group relative px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/40 hover:scale-105 uppercase tracking-wider text-sm overflow-hidden">
            <span className="relative z-10 flex items-center justify-center gap-2">
              Shop Now
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-700 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <a href="https://wa.me/923238226427?text=Hi!%20I'm%20interested%20in%20EraVault%20products" target="_blank" rel="noopener noreferrer"
            className="group px-8 sm:px-10 py-3.5 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold rounded-full transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:scale-105 uppercase tracking-wider text-sm flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
        </div>

        {/* Mini Stats */}
        <div className="flex justify-center gap-6 sm:gap-10 mt-10 sm:mt-14 animate-fade-in-up" style={{ animationDelay: '1s' }}>
          {[
            { val: '500+', label: 'Items Sold' },
            { val: '100%', label: 'Authentic' },
            { val: '🌍', label: 'Worldwide' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-white text-xl sm:text-2xl font-bold">{s.val}</p>
              <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1.5 h-2.5 bg-white/60 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-50 to-transparent" />
    </section>
  );
}
