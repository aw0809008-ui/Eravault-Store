import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, Search, X } from 'lucide-react';

interface NavbarProps {
  favoritesCount: number;
  onSearch: () => void;
  onFavorites: () => void;
}

const links = [
  ['New drop', '#collection'],
  ['Our story', '#story'],
  ['How it works', '#how-it-works'],
  ['FAQ', '#faq'],
];

export default function Navbar({ favoritesCount, onSearch, onFavorites }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${solid ? 'border-black/10 bg-[#f3f0e8]/95 text-[#171713] backdrop-blur-xl' : 'border-white/20 bg-transparent text-white'}`}>
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#top" className="focus-ring display text-3xl font-semibold tracking-[-0.06em]">
            EraVault
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map(([label, href]) => (
              <a key={label} href={href} className="underline-link focus-ring text-xs font-bold uppercase tracking-[0.17em]">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button onClick={onSearch} aria-label="Search collection" className="focus-ring grid h-11 w-11 place-items-center transition-opacity hover:opacity-60">
              <Search className="h-5 w-5" strokeWidth={1.7} />
            </button>
            <button onClick={onFavorites} aria-label="View saved items" className="focus-ring relative grid h-11 w-11 place-items-center transition-opacity hover:opacity-60">
              <Heart className="h-5 w-5" strokeWidth={1.7} />
              {favoritesCount > 0 && (
                <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-[#d8ff45] px-1 text-[10px] font-extrabold text-[#171713]">
                  {favoritesCount}
                </span>
              )}
            </button>
            <button onClick={() => setOpen(true)} aria-label="Open menu" className="focus-ring grid h-11 w-11 place-items-center lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-[#171713] text-white lg:hidden">
            <div className="flex h-full flex-col px-6 py-6">
              <div className="flex items-center justify-between">
                <span className="display text-3xl font-semibold tracking-[-0.06em]">EraVault</span>
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="focus-ring grid h-12 w-12 place-items-center border border-white/20">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="my-auto">
                {links.map(([label, href], index) => (
                  <motion.a
                    key={label}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.07 }}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="display block border-b border-white/15 py-5 text-5xl"
                  >
                    {label}
                  </motion.a>
                ))}
              </nav>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">One-off clothing. No restocks.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}