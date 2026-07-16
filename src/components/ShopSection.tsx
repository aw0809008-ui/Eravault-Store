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

  // Extract unique sizes and conditions
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
      {/* Background decorations — VISIBLE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large visible gradient blobs */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(196,154,98,0.12) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(196,154,98,0.10) 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(136,89,53,0.06) 0%, transparent 60%)' }} />

        {/* Diamond pattern — MORE visible */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="shopdots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="#885935" />
            <path d="M0 0L40 0L40 40L0 40Z" fill="none" stroke="#885935" strokeWidth="0.3" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#shopdots)" />
        </svg>
        
        {/* Decorative lines */}
        <div className="absolute top-24 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(196,154,98,0.15) 30%, rgba(196,154,98,0.15) 70%, transparent 100%)' }} />
        <div className="absolute bottom-32 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(196,154,98,0.12) 30%, rgba(196,154,98,0.12) 70%, transparent 100%)' }} />
        
        {/* Corner accents */}
        <div className="absolute top-0 right-0 w-80 h-80" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(196,154,98,0.1) 0%, transparent 60%)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80" style={{ background: 'radial-gradient(circle at 0% 100%, rgba(196,154,98,0.08) 0%, transparent 60%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-14">
          <span className="inline-block px-3 sm:px-4 py-1.5 bg-brand-100 text-brand-600 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full mb-3 sm:mb-4">Our Collection</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold text-brand-950 mb-4 sm:mb-6">
            Shop the <span className="gradient-text">Vault</span>
          </h2>
          <p className="text-brand-600 max-w-2xl mx-auto text-sm sm:text-lg px-2">Browse our curated selection of premium vintage fashion pieces.</p>
        </div>

        {/* Search + Filter Toggle */}
        <div className="mb-6 sm:mb-8 space-y-4">
          <div className="max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search by name, category, size..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-brand-200 rounded-2xl text-brand-900 placeholder-brand-400 focus:border-brand-500 transition-all shadow-lg shadow-brand-900/5 text-sm" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-brand-100 hover:bg-brand-200 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>}
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all border-2 ${showFilters ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-500/30' : 'bg-white text-brand-700 border-brand-200 hover:border-brand-300'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{activeFiltersCount}</span>}
            </button>
          </div>

          {/* Expandable Filters Panel */}
          {showFilters && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border-2 border-brand-200 shadow-xl p-4 sm:p-6 animate-slide-down space-y-4">
              {/* Categories */}
              <div>
                <p className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setActiveCategory('All')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === 'All' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'}`}>All</button>
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === cat ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'}`}>{cat} ({products.filter(p => p.category === cat).length})</button>
                  ))}
                </div>
              </div>

              {/* Size */}
              {allSizes.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setFilterSize('All')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterSize === 'All' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>All Sizes</button>
                    {allSizes.map(s => (
                      <button key={s} onClick={() => setFilterSize(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterSize === s ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Condition */}
              {allConditions.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-2">Condition</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setFilterCondition('All')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterCondition === 'All' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>All</button>
                    {allConditions.map(c => (
                      <button key={c} onClick={() => setFilterCondition(c)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterCondition === c ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>{c}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sort + Clear */}
              <div className="flex items-center justify-between pt-2 border-t border-brand-100">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 bg-brand-50 border border-brand-200 rounded-lg text-xs font-medium text-brand-700 cursor-pointer">
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="name">Name: A → Z</option>
                </select>
                {activeFiltersCount > 0 && <button onClick={clearAll} className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  Clear All
                </button>}
              </div>
            </div>
          )}

          {/* Quick category pills (always visible) */}
          {!showFilters && (
            <div className="flex flex-wrap justify-center gap-2 px-1">
              <button onClick={() => setActiveCategory('All')} className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${activeCategory === 'All' ? 'bg-gradient-to-r from-brand-700 to-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105' : 'bg-white text-brand-700 border-2 border-brand-200 hover:border-brand-300'}`}>All ({products.length})</button>
              {categories.map(cat => {
                const count = products.filter(p => p.category === cat).length;
                return <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${activeCategory === cat ? 'bg-gradient-to-r from-brand-700 to-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105' : 'bg-white text-brand-700 border-2 border-brand-200 hover:border-brand-300'}`}>{cat} ({count})</button>;
              })}
            </div>
          )}

          {/* Active filters tags */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {activeCategory !== 'All' && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold">📂 {activeCategory} <button onClick={() => setActiveCategory('All')} className="ml-1 hover:text-red-500">×</button></span>}
              {filterSize !== 'All' && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">📏 {filterSize} <button onClick={() => setFilterSize('All')} className="ml-1 hover:text-red-500">×</button></span>}
              {filterCondition !== 'All' && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">✨ {filterCondition} <button onClick={() => setFilterCondition('All')} className="ml-1 hover:text-red-500">×</button></span>}
            </div>
          )}

          {/* Results count */}
          <p className="text-center text-brand-500 text-sm"><span className="font-bold text-brand-700">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg"><div className="aspect-[4/5] skeleton" /><div className="p-5 space-y-3"><div className="h-3 skeleton rounded-full w-1/3" /><div className="h-5 skeleton rounded-full w-3/4" /><div className="h-6 skeleton rounded-full w-1/2" /></div></div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product, i) => <ProductCard key={product.id || i} product={product} index={i} onSelect={onSelectProduct} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-4xl">🔍</div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-800 mb-2">No products found</h3>
            <p className="text-brand-500 mb-4">Try changing your filters</p>
            <button onClick={clearAll} className="px-6 py-2.5 bg-brand-600 text-white font-bold rounded-full hover:bg-brand-700 transition-all text-sm">Clear All Filters</button>
          </div>
        )}
      </div>
    </section>
  );
}
