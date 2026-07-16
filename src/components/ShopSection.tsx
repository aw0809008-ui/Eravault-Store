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

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (activeCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.item_name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.condition?.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => Number(a.selling_price) - Number(b.selling_price));
        break;
      case 'price-high':
        filtered.sort((a, b) => Number(b.selling_price) - Number(a.selling_price));
        break;
      case 'name':
        filtered.sort((a, b) => (a.item_name || '').localeCompare(b.item_name || ''));
        break;
    }

    return filtered;
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <section id="shop" className="py-12 sm:py-20 md:py-32 bg-gradient-to-b from-brand-50 via-white to-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-16">
          <span className="inline-block px-3 sm:px-4 py-1.5 bg-brand-100 text-brand-600 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full mb-3 sm:mb-4">
            Our Collection
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold text-brand-950 mb-4 sm:mb-6">
            Shop the <span className="gradient-text">Vault</span>
          </h2>
          <p className="text-brand-600 max-w-2xl mx-auto text-sm sm:text-lg px-2">
            Browse our curated selection of premium vintage and pre-owned fashion pieces.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 sm:mb-12 space-y-4 sm:space-y-6">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto px-1">
            <div className="relative group">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-brand-400 transition-colors group-focus-within:text-brand-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 sm:pl-14 pr-4 py-3.5 sm:py-5 bg-white border-2 border-brand-200 rounded-2xl text-brand-900 placeholder-brand-400 focus:border-brand-500 transition-all shadow-lg shadow-brand-900/5 text-sm sm:text-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-brand-100 hover:bg-brand-200 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-1">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeCategory === 'All'
                  ? 'bg-gradient-to-r from-brand-700 to-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105'
                  : 'bg-white text-brand-700 hover:bg-brand-50 border-2 border-brand-200 hover:border-brand-300'
              }`}
            >
              All ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-brand-700 to-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105'
                      : 'bg-white text-brand-700 hover:bg-brand-50 border-2 border-brand-200 hover:border-brand-300'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Sort & Count */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
            <p className="text-brand-600 font-medium">
              <span className="font-bold text-brand-800">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-5 py-3 bg-white border-2 border-brand-200 rounded-xl text-sm font-medium text-brand-700 focus:border-brand-500 shadow-sm cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg">
                <div className="aspect-[4/5] skeleton" />
                <div className="p-5 space-y-3">
                  <div className="h-3 skeleton rounded-full w-1/3" />
                  <div className="h-5 skeleton rounded-full w-3/4" />
                  <div className="h-6 skeleton rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard
                key={product.id || i}
                product={product}
                index={i}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
              <svg className="w-12 h-12 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-display text-2xl font-bold text-brand-800 mb-3">No products found</h3>
            <p className="text-brand-500 text-lg">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </section>
  );
}
