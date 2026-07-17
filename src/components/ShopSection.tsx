import { useState, useMemo } from 'react';
import type { InventoryItem } from '../lib/supabase';
import ProductCard from './ProductCard';

interface ShopSectionProps {
  products: InventoryItem[];
  categories: string[];
  loading: boolean;
  onSelectProduct: (product: InventoryItem) => void;
}

export default function ShopSection({ products, categories, loading, onSelectProduct }: ShopSectionProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterSize, setFilterSize] = useState('All');
  const [filterCondition, setFilterCondition] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const allSizes = useMemo(() => [...new Set(products.map(p => p.size).filter(Boolean))].sort(), [products]);
  const allConditions = useMemo(() => [...new Set(products.map(p => p.condition).filter(Boolean))], [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (activeCategory !== 'All') filtered = filtered.filter(p => p.category === activeCategory);
    if (filterSize !== 'All') filtered = filtered.filter(p => p.size === filterSize);
    if (filterCondition !== 'All') filtered = filtered.filter(p => p.condition === filterCondition);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.item_name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q) || p.condition?.toLowerCase().includes(q) || p.size?.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => (Number(a.selling_price) * Number(a.pieces || 1)) - (Number(b.selling_price) * Number(b.pieces || 1))); break;
      case 'price-high': filtered.sort((a, b) => (Number(b.selling_price) * Number(b.pieces || 1)) - (Number(a.selling_price) * Number(a.pieces || 1))); break;
      case 'name': filtered.sort((a, b) => (a.item_name || '').localeCompare(b.item_name || '')); break;
    }
    return filtered;
  }, [products, activeCategory, searchQuery, sortBy, filterSize, filterCondition]);

  const activeFiltersCount = [activeCategory !== 'All', filterSize !== 'All', filterCondition !== 'All'].filter(Boolean).length;

  const clearAll = () => { setActiveCategory('All'); setFilterSize('All'); setFilterCondition('All'); setSearchQuery(''); };

  return (
    <section id="shop" className="py-12 sm:py-20 md:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #faf7f2 0%, #f0e8d8 40%, #faf7f2 70%, #f0e8d8 100%)' }}>
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(196,154,98,0.12) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(196,154,98,0.10) 0%, transparent 70%)' }} />
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="shopdots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="#885935" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#shopdots)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-14">
          <span className="inline-block px-3 sm:px-4 py-1.5 bg-brand-100 text-brand-600 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full mb-3 sm:mb-4">Our Collection</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold text-brand-950 mb-4 sm:mb-6">
            Shop the <span className="gradient-text">Vault</span>
          </h2>
          <p className="text-brand-600 max-w-2xl mx-auto text-sm sm:text-lg px-2">Browse our handpicked collection of authentic vintage fashion</p>
        </div>

        {/* Search + Filter Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-brand-200 rounded-2xl text-brand-900 placeholder-brand-400 focus:border-brand-500 transition-all shadow-lg shadow-brand-900/5 text-sm" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600">✕</button>}
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`px-4 py-3.5 rounded-2xl border-2 transition-all text-sm font-semibold ${showFilters ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-brand-700 border-brand-200 hover:border-brand-400'}`}>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                Filters
                {activeFiltersCount > 0 && <span className="w-5 h-5 bg-white text-brand-600 rounded-full text-xs flex items-center justify-center font-bold">{activeFiltersCount}</span>}
              </span>
            </button>
          </div>

          {/* Expandable Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-2xl p-6 border border-brand-200 shadow-lg animate-slide-down space-y-5">
              <div>
                <p className="text-sm font-bold text-brand-800 mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  {['All', ...categories].map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${activeCategory === cat ? 'bg-brand-500 text-white shadow-lg' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'}`}>{cat}</button>
                  ))}
                </div>
              </div>
              {allSizes.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-brand-800 mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {['All', ...allSizes].map(s => (
                      <button key={s} onClick={() => setFilterSize(s)} className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${filterSize === s ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'}`}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
              {allConditions.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-brand-800 mb-2">Condition</p>
                  <div className="flex flex-wrap gap-2">
                    {['All', ...allConditions].map(c => (
                      <button key={c} onClick={() => setFilterCondition(c)} className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${filterCondition === c ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'}`}>{c}</button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-4 py-2 rounded-xl border border-brand-200 text-sm text-brand-700 bg-white">
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="name">Name A-Z</option>
                </select>
                {activeFiltersCount > 0 && <button onClick={clearAll} className="text-sm text-red-500 hover:text-red-700 font-semibold">Clear All</button>}
              </div>
            </div>
          )}

          {/* Quick category pills */}
          {!showFilters && (
            <div className="flex overflow-x-auto gap-2 hide-scrollbar pb-1">
              {['All', ...categories].map(cat => {
                const count = cat === 'All' ? products.length : products.filter(p => p.category === cat).length;
                return <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-brand-500 text-white shadow-lg' : 'bg-white text-brand-700 border border-brand-200 hover:border-brand-400'}`}>{cat} ({count})</button>;
              })}
            </div>
          )}

          {/* Active filters tags */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeCategory !== 'All' && <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-semibold flex items-center gap-1">📂 {activeCategory} <button onClick={() => setActiveCategory('All')} className="ml-1 hover:text-red-500">×</button></span>}
              {filterSize !== 'All' && <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-semibold flex items-center gap-1">📏 {filterSize} <button onClick={() => setFilterSize('All')} className="ml-1 hover:text-red-500">×</button></span>}
              {filterCondition !== 'All' && <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-semibold flex items-center gap-1">✨ {filterCondition} <button onClick={() => setFilterCondition('All')} className="ml-1 hover:text-red-500">×</button></span>}
            </div>
          )}

          <p className="text-brand-500 text-sm font-medium">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden">
                <div className="aspect-[4/5] skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-3 skeleton rounded-full w-1/3" />
                  <div className="h-5 skeleton rounded-full w-3/4" />
                  <div className="h-6 skeleton rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id || i} product={product} index={i} onSelect={onSelectProduct} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display text-2xl font-bold text-brand-900 mb-2">No products found</h3>
            <p className="text-brand-600 mb-6">Try adjusting your filters or search query</p>
            <button onClick={clearAll} className="px-6 py-3 bg-brand-500 text-white rounded-full font-semibold hover:bg-brand-600 transition-all">Clear All Filters</button>
          </div>
        )}
      </div>
    </section>
  );
}
