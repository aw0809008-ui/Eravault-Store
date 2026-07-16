import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PackageOpen } from 'lucide-react';
import { useInventory } from './hooks/useInventory';
import { StoreItem } from './lib/supabase';
import ParticleField from './components/ParticleField';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import QuickViewModal from './components/QuickViewModal';
import SearchModal from './components/SearchModal';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const { items, loading, categories } = useInventory();
  const [cat, setCat] = useState('all');
  const [selected, setSelected] = useState<StoreItem | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const filtered = useMemo(() => cat === 'all' ? items : items.filter(i => i.category === cat), [items, cat]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen noise" style={{ background:'#020008' }}>
      <ParticleField />
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <Hero />

      {/* Divider */}
      <div className="relative h-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020008]" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/15 to-transparent" />
      </div>

      {/* ===== COLLECTION ===== */}
      <section id="collection" className="relative py-20 sm:py-28">
        {/* BG effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-40 w-[500px] h-[500px] bg-[var(--gold)]/[.02] rounded-full blur-3xl" />
          <div className="absolute bottom-20 -right-40 w-[400px] h-[400px] bg-[var(--purple)]/[.02] rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div initial={{ opacity:0, y:50 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.8 }} className="text-center mb-16 sm:mb-20">
            <span className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-6 text-[9px] font-bold tracking-[.35em] uppercase"
              style={{ fontFamily:"'Orbitron',sans-serif", background:'rgba(212,168,83,.04)', border:'1px solid rgba(212,168,83,.08)', color:'rgba(212,168,83,.5)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] shadow-[0_0_8px_var(--gold)]" />
              Our Collection
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-5 tracking-tight" style={{ fontFamily:"'Playfair Display',serif" }}>
              <span className="text-white">Curated </span>
              <span className="relative inline-block">
                <span className="text-gradient-gold">Treasures</span>
                <motion.div className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-[var(--gold)] to-[var(--purple)]"
                  initial={{ scaleX:0 }} whileInView={{ scaleX:1 }} viewport={{ once:true }} transition={{ duration:.8, delay:.3 }} />
              </span>
            </h2>
            <p className="text-white/25 max-w-lg mx-auto text-sm leading-relaxed">Authenticated vintage pieces, handpicked for the discerning collector.</p>
          </motion.div>

          {/* Categories */}
          {categories.length > 0 && (
            <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:.6, delay:.2 }} className="mb-14">
              <CategoryFilter categories={categories} active={cat} onChange={setCat} items={items} />
            </motion.div>
          )}

          {/* Empty */}
          {filtered.length === 0 && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center py-24">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl glass flex items-center justify-center"><PackageOpen className="w-10 h-10 text-white/10" /></div>
              <h3 className="text-xl font-bold text-white/30 mb-2" style={{ fontFamily:"'Playfair Display',serif" }}>No items found</h3>
              <p className="text-white/15 text-sm mb-6">{cat !== 'all' ? 'No items in this category.' : 'Check back soon!'}</p>
              {cat !== 'all' && <button onClick={() => setCat('all')} className="px-6 py-2.5 rounded-xl glass text-[var(--gold)] text-sm font-medium">← View All</button>}
            </motion.div>
          )}

          {/* Grid */}
          {filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filtered.map((item, i) => <ProductCard key={item.id} item={item} index={i} onQuickView={setSelected} />)}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="text-center mt-14">
              <span className="text-[10px] tracking-[.3em] uppercase text-white/10" style={{ fontFamily:"'Orbitron',sans-serif" }}>
                {filtered.length} of {items.length} treasures
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 aurora" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-16 h-16 float rotate-45 border border-[var(--gold)]/[.06] bg-[var(--gold)]/[.02]" />
          <div className="absolute bottom-10 right-10 w-12 h-12 float-slow float-d2 rounded-full border border-[var(--purple)]/[.06] bg-[var(--purple)]/[.02]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity:0, y:50 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5" style={{ fontFamily:"'Playfair Display',serif" }}>
              Have Something <span className="text-gradient-gold">Special</span>?
            </h2>
            <p className="text-white/25 mb-10 max-w-md mx-auto text-sm leading-relaxed">Selling or looking for something specific? Let's talk.</p>
            <a href="https://wa.me/919876543210?text=Hi!" target="_blank" rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl overflow-hidden font-bold text-base" style={{ fontFamily:"'Space Grotesk',sans-serif" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--gold)] via-[#f5c842] to-[var(--gold)]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#f5c842] via-white/30 to-[#f5c842] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 text-black flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Contact on WhatsApp
              </span>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
      <QuickViewModal item={selected} onClose={() => setSelected(null)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} items={items} onItemClick={setSelected} />
    </div>
  );
}
