import { useState, useEffect } from 'react';

interface NavbarProps {
  onNavigate: (section: string) => void;
  onAdminClick: () => void;
  productCount?: number;
}

export default function Navbar({ onNavigate, onAdminClick, productCount = 0 }: NavbarProps) {
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
              <button key={link.section} onClick={() => handleClick(link.section)}
                className={`relative px-5 py-2 text-sm font-medium tracking-wide uppercase transition-all duration-300 rounded-full hover:scale-105 ${scrolled ? 'text-brand-700 hover:text-brand-900 hover:bg-brand-100' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
                {link.label}
                {link.section === 'shop' && productCount > 0 && <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${scrolled ? 'bg-brand-500 text-white' : 'bg-white/20 text-white'}`}>{productCount}</span>}
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
            {/* WhatsApp link in mobile menu */}
            <a
              href="https://wa.me/923238226427?text=Hi!%20I'm%20interested%20in%20EraVault%20products"
              target="_blank"
              rel="noopener noreferrer"
              className="text-left px-4 py-3.5 text-green-700 font-medium rounded-xl hover:bg-green-50 transition-all animate-fade-in-up flex items-center gap-2"
              style={{ animationDelay: `${links.length * 0.05}s` }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Chat
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
