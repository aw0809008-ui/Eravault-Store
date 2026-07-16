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
  const { items, loading, error, categories } = useInventory();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return items;
    return items.filter(item => item.category === activeCategory);
  }, [items, activeCategory]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#030014] text-white noise-overlay">
      {/* Global particles */}
      <ParticleField />

      {/* Navigation */}
      <Navbar onSearchOpen={() => setSearchOpen(true)} />

      {/* Hero */}
      <Hero />

      {/* Divider */}
      <div className="relative h-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#030014]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      </div>

      {/* ===== COLLECTION SECTION ===== */}
      <section id="collection" className="relative py-20 sm:py-28">
        {/* Background */}
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-32 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-3xl" />
          <div className="absolute bottom-20 -right-32 w-[400px] h-[400px] bg-purple-500/[0.03] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/[0.02] rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 sm:mb-20"
          >
            <span
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-6 text-[10px] font-bold uppercase tracking-[0.3em]"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                background: 'rgba(245,166,35,0.06)',
                border: '1px solid rgba(245,166,35,0.12)',
                color: 'rgba(245,166,35,0.7)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,166,35,0.8)]" />
              Our Collection
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,166,35,0.8)]" />
            </span>

            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-5 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Curated{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-400 bg-clip-text text-transparent">
                  Treasures
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </span>
            </h2>

            <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Each piece has been carefully selected, authenticated, and preserved 
              for collectors who appreciate the extraordinary.
            </p>
          </motion.div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <motion.div
              id="categories"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-14"
            >
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl glass border-red-500/20 text-red-400">
                <span className="text-sm">⚠️ {error}</span>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!error && filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="w-28 h-28 mx-auto mb-8 rounded-3xl glass flex items-center justify-center relative">
                <PackageOpen className="w-12 h-12 text-gray-600" />
                <div className="absolute inset-0 rounded-3xl scan-line overflow-hidden" />
              </div>
              <h3
                className="text-2xl font-bold text-gray-400 mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                No items found
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                {activeCategory !== 'all'
                  ? 'No items in this category yet.'
                  : 'Check back soon for new additions.'}
              </p>
              {activeCategory !== 'all' && (
                <button
                  onClick={() => setActiveCategory('all')}
                  className="px-8 py-3 rounded-xl glass text-amber-400 text-sm font-medium hover:bg-white/5 transition-colors"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  ← View All Items
                </button>
              )}
            </motion.div>
          )}

          {/* Product Grid */}
          {filteredItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 scene-3d">
              {filteredItems.map((item, index) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  index={index}
                  onQuickView={setSelectedItem}
                />
              ))}
            </div>
          )}

          {/* Count */}
          {filteredItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-14"
            >
              <span className="text-[11px] uppercase tracking-[0.3em] text-gray-700"
                style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Showing {filteredItems.length} of {items.length} treasures
              </span>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 aurora-bg" />
        <div className="absolute inset-0 grid-pattern" />

        {/* Floating shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 float-y">
            <div className="w-full h-full rounded-2xl rotate-45 border border-amber-400/10 bg-amber-400/[0.03]" />
          </div>
          <div className="absolute bottom-10 right-10 float-y-delay-2">
            <div className="w-16 h-16 rounded-full border border-purple-400/10 bg-purple-400/[0.03]" />
          </div>
          <div className="absolute top-1/2 right-1/4 float-y-delay-1">
            <div className="hexagon w-12 h-12 bg-cyan-400/[0.03] border border-cyan-400/10" />
          </div>
        </div>

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400/50 block mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Get in Touch
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Have Something{' '}
              <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                Special
              </span>
              ?
            </h2>
            <p className="text-gray-400 mb-10 max-w-lg mx-auto text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Whether you're selling vintage treasures or looking for something specific, 
              reach out to us. Let's make history together.
            </p>
            <a
              href="https://wa.me/919876543210?text=Hi!%20I%20have%20some%20vintage%20items%20to%20discuss."
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl overflow-hidden font-bold text-lg"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500" />
              <div className="absolute inset-[1px] rounded-[14px] bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 group-hover:from-amber-400 group-hover:via-yellow-400 group-hover:to-amber-500 transition-all duration-500" />
              <span className="relative z-10 text-black flex items-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contact Us on WhatsApp
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_60px_rgba(245,166,35,0.4)] rounded-2xl" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <QuickViewModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        items={items}
        onItemClick={setSelectedItem}
      />
    </div>
  );
}
