import { useState, useEffect } from 'react';

interface NavbarProps {
  onNavigate: (section: string) => void;
  onAdminClick: () => void;
}

export default function Navbar({ onNavigate, onAdminClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: 'Home', section: 'hero' },
    { label: 'Shop', section: 'shop' },
    { label: 'About', section: 'about' },
    { label: 'Contact', section: 'contact' },
  ];

  const handleClick = (section: string) => {
    onNavigate(section);
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-brand-900/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button 
            onClick={() => handleClick('hero')} 
            className="flex items-center gap-3 group"
            onDoubleClick={onAdminClick}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              scrolled 
                ? 'bg-gradient-to-br from-brand-600 to-brand-800 shadow-lg shadow-brand-500/30' 
                : 'bg-white/20 backdrop-blur-sm border border-white/30'
            }`}>
              <span className="text-white font-display font-bold text-xl">E</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className={`font-display font-bold text-xl tracking-wide transition-all duration-300 ${
                scrolled ? 'text-brand-950' : 'text-white'
              }`}>
                EraVault
              </span>
              <span className={`text-[10px] uppercase tracking-[0.25em] transition-all duration-300 ${
                scrolled ? 'text-brand-500' : 'text-brand-200'
              }`}>
                Vintage Store
              </span>
            </div>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <button
                key={link.section}
                onClick={() => handleClick(link.section)}
                className={`relative px-5 py-2 text-sm font-medium tracking-wide uppercase transition-all duration-300 rounded-full hover:scale-105 ${
                  scrolled 
                    ? 'text-brand-700 hover:text-brand-900 hover:bg-brand-100' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-xl transition-all ${
              scrolled ? 'hover:bg-brand-100' : 'hover:bg-white/10'
            }`}
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 rounded-full transition-all duration-300 ${
                scrolled ? 'bg-brand-900' : 'bg-white'
              } ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 rounded-full transition-all duration-300 ${
                scrolled ? 'bg-brand-900' : 'bg-white'
              } ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 rounded-full transition-all duration-300 ${
                scrolled ? 'bg-brand-900' : 'bg-white'
              } ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-brand-100 animate-slide-down shadow-xl">
          <div className="px-4 py-4 flex flex-col gap-1">
            {links.map((link, i) => (
              <button
                key={link.section}
                onClick={() => handleClick(link.section)}
                className="text-left px-4 py-3.5 text-brand-800 font-medium rounded-xl hover:bg-brand-50 transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
