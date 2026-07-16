import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, Heart, MessageCircle, RotateCw, Search, SlidersHorizontal } from 'lucide-react';
import CategoryFilter from './components/CategoryFilter';
import Footer from './components/Footer';
import Hero from './components/Hero';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import QuickViewModal from './components/QuickViewModal';
import SearchModal from './components/SearchModal';
import { useInventory } from './hooks/useInventory';
import type { StoreItem } from './lib/supabase';
import { MEDIA, getWhatsAppUrl } from './lib/store';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name';

const faq = [
  ['Are the pieces authentic vintage?', 'Every item is individually sourced and inspected. Era and condition are assessed before a piece is released on the public store.'],
  ['How do I buy an item?', 'Open an item and tap Buy on WhatsApp. We confirm availability, final price, shipping and payment with you directly.'],
  ['How is condition graded?', 'Excellent has minimal wear, Very Good shows only light signs of use, Good has visible vintage wear, and Fair may include noted flaws.'],
  ['Do you ship internationally?', 'Yes. Share your delivery country on WhatsApp and we will confirm the tracked shipping option and total before payment.'],
  ['Can I return an item?', 'Because every piece is one-off, returns are handled by enquiry. Ask us for measurements and condition details before purchasing.'],
];

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-[#e7e0d2] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/45">Before you buy</p>
          <h2 className="display mt-4 text-6xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-7xl">Good to know.</h2>
        </div>
        <div className="border-t border-black/20">
          {faq.map(([question, answer], index) => (
            <div key={question} className="border-b border-black/20">
              <button onClick={() => setOpen(open === index ? -1 : index)} className="focus-ring flex w-full items-center justify-between gap-6 py-6 text-left">
                <span className="text-sm font-extrabold sm:text-base">{question}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${open === index ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {open === index && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="max-w-2xl pb-7 text-sm leading-7 text-black/60">{answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const { items, loading, error, categories, refetch } = useInventory();
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [selected, setSelected] = useState<StoreItem | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('eravault-favorites') || '[]') as string[]); }
    catch { return new Set(); }
  });

  const categoryCounts = useMemo(() => items.reduce<Record<string, number>>((counts, item) => {
    counts[item.category] = (counts[item.category] || 0) + 1;
    return counts;
  }, {}), [items]);

  const visibleItems = useMemo(() => {
    const value = query.trim().toLowerCase();
    const filtered = items.filter((item) => {
      const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
      const savedMatch = !savedOnly || favorites.has(item.id);
      const searchMatch = !value || [item.name, item.category, item.size, item.notes || ''].some((field) => field.toLowerCase().includes(value));
      return categoryMatch && savedMatch && searchMatch;
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'price-low') return (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER);
      if (sort === 'price-high') return (b.price ?? -1) - (a.price ?? -1);
      if (sort === 'name') return a.name.localeCompare(b.name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [activeCategory, favorites, items, query, savedOnly, sort]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem('eravault-favorites', JSON.stringify([...next]));
      return next;
    });
  };

  const showFavorites = () => {
    setSavedOnly(true);
    document.querySelector('#collection')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#f3f0e8] text-[#171713]">
      <Navbar favoritesCount={favorites.size} onSearch={() => setSearchOpen(true)} onFavorites={showFavorites} />
      <Hero />

      <div className="overflow-hidden border-y border-black/15 bg-[#d8ff45] py-3">
        <div className="marquee-track flex">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {['ONE-OFF PIECES', 'CONDITION CHECKED', 'TRACKED SHIPPING', 'NO RESTOCKS'].map((text) => (
                <span key={`${copy}-${text}`} className="flex items-center text-[10px] font-extrabold uppercase tracking-[0.22em]">
                  <span className="px-8">{text}</span><span className="h-1.5 w-1.5 rounded-full bg-[#171713]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <main>
        <section id="collection" className="editorial-grid px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/45">Shop the public archive</p>
                <h2 className="display mt-3 text-6xl font-semibold tracking-[-0.065em] sm:text-8xl">The latest drop.</h2>
              </div>
              <p className="max-w-sm text-sm leading-7 text-black/55">Every product below is live from the EraVault inventory. When a piece is released in the tool, it appears here automatically.</p>
            </div>

            <div className="mt-12">
              <CategoryFilter active={activeCategory} categories={categories} counts={categoryCounts} onChange={(category) => { setActiveCategory(category); setSavedOnly(false); }} />
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex min-h-12 flex-1 items-center border-b border-black/30 sm:max-w-md">
                <Search className="mr-3 h-4 w-4" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the archive" className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-black/35" />
              </label>
              <div className="flex items-center gap-2">
                <button onClick={() => setSavedOnly(!savedOnly)} className={`focus-ring inline-flex h-11 items-center gap-2 border px-4 text-[10px] font-extrabold uppercase tracking-[0.15em] ${savedOnly ? 'border-[#171713] bg-[#171713] text-white' : 'border-black/20'}`}>
                  <Heart className={`h-3.5 w-3.5 ${savedOnly ? 'fill-current' : ''}`} /> Saved
                </button>
                <label className="flex h-11 items-center gap-2 border border-black/20 px-3">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} className="bg-transparent text-[10px] font-extrabold uppercase tracking-[0.12em] outline-none">
                    <option value="newest">Newest</option>
                    <option value="price-low">Price low</option>
                    <option value="price-high">Price high</option>
                    <option value="name">A-Z</option>
                  </select>
                </label>
              </div>
            </div>

            {error && (
              <div className="mt-14 border border-[#9c3f24] p-6 sm:flex sm:items-center sm:justify-between">
                <div><p className="font-extrabold">The archive could not connect.</p><p className="mt-1 text-sm text-black/55">{error}</p></div>
                <button onClick={refetch} className="focus-ring mt-5 inline-flex items-center gap-2 bg-[#171713] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.14em] text-white sm:mt-0"><RotateCw className="h-4 w-4" /> Try again</button>
              </div>
            )}

            {!error && visibleItems.length > 0 && (
              <div className="mt-12 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleItems.map((item, index) => (
                  <ProductCard key={item.id} item={item} index={index} favorite={favorites.has(item.id)} onFavorite={toggleFavorite} onOpen={setSelected} />
                ))}
              </div>
            )}

            {!error && visibleItems.length === 0 && (
              <div className="mt-14 grid overflow-hidden border border-black/20 bg-[#e7e0d2] lg:grid-cols-2">
                <img src={MEDIA.racks} alt="Vintage clothing rack" className="h-full min-h-80 w-full object-cover" />
                <div className="flex flex-col justify-center p-8 sm:p-14">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/45">No pieces here yet</p>
                  <h3 className="display mt-4 text-5xl font-semibold leading-[0.95] tracking-[-0.055em]">The next piece is being curated.</h3>
                  <p className="mt-6 max-w-md text-sm leading-7 text-black/55">Try another category, clear your saved filter, or message us if you are looking for something specific.</p>
                  <button onClick={() => { setActiveCategory('all'); setSavedOnly(false); setQuery(''); }} className="focus-ring mt-8 inline-flex w-fit items-center gap-2 border-b border-black pb-1 text-xs font-extrabold uppercase tracking-[0.14em]">Clear filters <ArrowRight className="h-4 w-4" /></button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="story" className="grid bg-[#171713] text-white lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="min-h-[620px] overflow-hidden">
            <img src={MEDIA.editorial} alt="EraVault vintage jacket editorial" className="h-full w-full object-cover" />
          </motion.div>
          <div className="flex items-center px-6 py-20 sm:px-12 lg:px-20">
            <div className="max-w-xl">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d8ff45]">Why EraVault</p>
              <h2 className="display mt-5 text-6xl font-semibold leading-[0.86] tracking-[-0.06em] sm:text-8xl">Old clothes.<br /><em>New energy.</em></h2>
              <p className="mt-9 text-base leading-8 text-white/55">We source clothing with a past and enough life for a future. No endless catalogue, no anonymous stock and no restocks. Just pieces with texture, wear and a reason to exist again.</p>
              <a href="#how-it-works" className="underline-link focus-ring mt-9 inline-flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.16em]">How we curate <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto max-w-[1500px]">
            <div className="max-w-3xl">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/45">From rack to wardrobe</p>
              <h2 className="display mt-4 text-6xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-8xl">Simple by design.</h2>
            </div>
            <div className="mt-14 grid border-y border-black/20 md:grid-cols-3">
              {[
                ['01', 'We source', 'Every drop is selected by hand for fabric, silhouette, era and honest wear.'],
                ['02', 'You choose', 'Search by category or size, open the piece and review every image and condition note.'],
                ['03', 'We confirm', 'Message us on WhatsApp. We confirm availability, payment and tracked delivery personally.'],
              ].map(([number, title, copy], index) => (
                <motion.div key={number} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12 }} className="border-b border-black/20 py-9 md:border-b-0 md:border-r md:px-8 md:last:border-r-0 first:md:pl-0">
                  <span className="text-[10px] font-extrabold tracking-[0.2em] text-black/40">{number}</span>
                  <h3 className="display mt-12 text-4xl font-semibold tracking-[-0.04em]">{title}</h3>
                  <p className="mt-5 max-w-sm text-sm leading-7 text-black/55">{copy}</p>
                  <Check className="mt-8 h-5 w-5" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative min-h-[560px] overflow-hidden text-white">
          <img src={MEDIA.denim} alt="Vintage denim detail" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative mx-auto flex min-h-[560px] max-w-[1500px] items-end px-5 py-16 sm:px-8 lg:px-12">
            <div className="max-w-3xl">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d8ff45]">Looking for something?</p>
              <h2 className="display mt-4 text-6xl font-semibold leading-[0.88] tracking-[-0.06em] sm:text-8xl">Tell us what belongs in your vault.</h2>
              <a href={getWhatsAppUrl()} target="_blank" rel="noreferrer" className="focus-ring mt-9 inline-flex items-center gap-3 bg-[#d8ff45] px-6 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[#171713] transition-transform hover:-translate-y-1">Start an enquiry <MessageCircle className="h-4 w-4" /></a>
            </div>
          </div>
        </section>

        <FAQ />
      </main>

      <Footer />
      <a href={getWhatsAppUrl()} target="_blank" rel="noreferrer" aria-label="Chat with EraVault on WhatsApp" className="focus-ring fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-xl transition-transform hover:scale-105"><MessageCircle className="h-6 w-6" /></a>
      <QuickViewModal item={selected} onClose={() => setSelected(null)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} items={items} onItemClick={setSelected} />
    </div>
  );
}