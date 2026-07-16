import { useState, useEffect } from 'react';

interface Props { onDone: () => void; }

export default function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState(0); // 0=logo, 1=text, 2=fade out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 2000);
    const t3 = setTimeout(() => onDone(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className={`fixed inset-0 z-[999] flex items-center justify-center bg-brand-950 transition-opacity duration-500 ${phase === 2 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl animate-morph-blob" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-400/8 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-600/8 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '1s' }} />
        {/* Particle dots */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-brand-400/40 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative text-center" style={{ perspective: '800px' }}>
        {/* Logo */}
        <div
          className={`w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 flex items-center justify-center shadow-2xl shadow-brand-500/50 transition-all duration-700 ${
            phase >= 0 ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-45'
          }`}
          style={{
            animation: 'splashLogoIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both',
          }}
        >
          <span className="text-white font-display font-bold text-5xl sm:text-6xl">E</span>
        </div>

        {/* Brand Name */}
        <div className={`transition-all duration-700 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2 tracking-wide">
            Era<span className="gradient-text">Vault</span>
          </h1>
          <p className="text-brand-400 text-sm sm:text-base tracking-[0.3em] uppercase font-medium">Vintage Store</p>
        </div>
      </div>

      <style>{`
        @keyframes splashLogoIn {
          0% { opacity: 0; transform: perspective(800px) rotateY(90deg) scale(0.5); }
          50% { transform: perspective(800px) rotateY(-10deg) scale(1.1); }
          100% { opacity: 1; transform: perspective(800px) rotateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
