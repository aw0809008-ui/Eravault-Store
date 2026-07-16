import { useState, useEffect } from 'react';
import { 
  fetchAllInventory, fetchAllCategories, addProduct, updateProduct, 
  deleteProduct, toggleShowOnWebsite, getStats, type InventoryItem 
} from '../lib/supabase';

interface AdminProps { onClose: () => void; }

export default function AdminDashboard({ onClose }: AdminProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'add'>('dashboard');
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalProducts: 0, listedProducts: 0, totalValue: 0, totalPieces: 0, totalCategories: 0 });
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const ADMIN_PASSWORD = 'eravault2024';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { setIsLoggedIn(true); setLoginError(''); loadData(); }
    else setLoginError('Invalid password');
  };

  const loadData = async () => {
    setLoading(true);
    const [prods, cats, statsData] = await Promise.all([fetchAllInventory(), fetchAllCategories(), getStats()]);
    setProducts(prods); setCategories(cats); setStats(statsData); setLoading(false);
  };

  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);

  const handleToggleShow = async (id: number, currentShow: boolean) => {
    const success = await toggleShowOnWebsite(id, !currentShow);
    if (success) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, show_on_website: !currentShow } : p));
      setStats(prev => ({ ...prev, listedProducts: prev.listedProducts + (!currentShow ? 1 : -1) }));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    const success = await deleteProduct(id);
    if (success) { setProducts(prev => prev.filter(p => p.id !== id)); loadData(); }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const switchTab = (tab: typeof activeTab) => { setActiveTab(tab); setEditingProduct(null); setSidebarOpen(false); };

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gradient-to-br from-brand-950 via-[#1a1a2e] to-brand-950">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl animate-float-slow" />
        </div>
        <div className="relative glass-dark rounded-3xl p-6 sm:p-8 w-full max-w-md animate-scale-in">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="text-center mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-2xl shadow-brand-500/30">
              <span className="text-white font-display font-bold text-2xl sm:text-3xl">E</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">Admin Panel</h2>
            <p className="text-white/60 text-sm">Enter password to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter admin password" className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-brand-500" />
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-brand-500/30 transition-all">Login</button>
          </form>
        </div>
      </div>
    );
  }

  // Main Admin Dashboard — mobile responsive
  return (
    <div className="fixed inset-0 z-[200] flex bg-[#0f0f1a]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-[201] md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar — hidden on mobile, slide in when open */}
      <div className={`fixed md:relative z-[202] h-full w-64 admin-sidebar flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <span className="text-white font-display font-bold">E</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-sm">EraVault</h2>
              <p className="text-[10px] text-white/50">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/60"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {([['dashboard','Dashboard','📊'],['products','Products','📦'],['add','Add Product','➕']] as const).map(([id,label,icon]) => (
            <button key={id} onClick={() => switchTab(id as typeof activeTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === id ? 'bg-gradient-to-r from-brand-500/20 to-brand-600/20 text-brand-400 border border-brand-500/30' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
              <span className="text-lg">{icon}</span><span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={onClose} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm">
            <span className="text-lg">🚪</span><span className="font-medium">Exit Admin</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0f0f1a]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3 sm:py-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 bg-white/10 rounded-lg text-white flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <h1 className="text-lg sm:text-2xl font-bold text-white truncate">
                {activeTab === 'dashboard' && '📊 Dashboard'}
                {activeTab === 'products' && '📦 Products'}
                {activeTab === 'add' && (editingProduct ? '✏️ Edit' : '➕ Add')}
              </h1>
            </div>
            <button onClick={loadData} className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all flex items-center gap-1.5 text-sm flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-6 sm:space-y-8 animate-fade-in">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                      {[
                        { label: 'Total Products', value: stats.totalProducts, icon: '📦', gradient: 'from-blue-500 to-cyan-500' },
                        { label: 'Listed', value: stats.listedProducts, icon: '🌐', gradient: 'from-green-500 to-emerald-500' },
                        { label: 'Total Value', value: '£' + stats.totalValue.toLocaleString(), icon: '💰', gradient: 'from-brand-500 to-brand-600' },
                        { label: 'Categories', value: stats.totalCategories, icon: '🏷️', gradient: 'from-purple-500 to-pink-500' },
                      ].map((stat, i) => (
                        <div key={i} className="admin-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
                          <div className={'w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ' + stat.gradient + ' flex items-center justify-center text-lg sm:text-2xl mb-3 sm:mb-4 shadow-lg'}>{stat.icon}</div>
                          <p className="text-white/60 text-xs sm:text-sm mb-0.5">{stat.label}</p>
                          <p className="text-white text-lg sm:text-2xl font-bold">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="admin-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
                      <h3 className="text-white font-bold text-base sm:text-lg mb-4">Recent Products</h3>
                      <div className="space-y-2 sm:space-y-3">
                        {products.slice(0, 5).map((p) => (
                          <div key={p.id} className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-xl gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-brand-500/20 overflow-hidden flex-shrink-0">
                                {p.images?.split(',')[0] && <img src={p.images.split(',')[0].trim()} alt="" className="w-full h-full object-cover" />}
                              </div>
                              <div className="min-w-0">
                                <p className="text-white font-medium text-sm truncate">{p.item_name}</p>
                                <p className="text-white/50 text-xs">{p.category}</p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-brand-400 font-bold text-sm">£{(Number(p.selling_price) * Number(p.pieces || 1)).toLocaleString()}</p>
                              {Number(p.pieces) > 1 && <p className="text-white/30 text-[10px]">{p.pieces}×£{Number(p.selling_price).toLocaleString()}</p>}
                              <span className={'text-[10px] px-2 py-0.5 rounded-full ' + (p.show_on_website ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')}>{p.show_on_website ? 'Listed' : 'Hidden'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Products Tab — Card layout for mobile */}
                {activeTab === 'products' && (
                  <div className="space-y-4 sm:space-y-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm" />
                      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm">
                        <option value="All">All Categories</option>
                        {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <p className="text-white/50 text-sm">{filteredProducts.length} products</p>

                    {/* Mobile: Card layout / Desktop: Table */}
                    <div className="space-y-3">
                      {filteredProducts.map((p) => (
                        <div key={p.id} className="admin-card rounded-xl p-4 hover:border-brand-500/30">
                          <div className="flex items-start gap-3">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-brand-500/20 overflow-hidden flex-shrink-0">
                              {p.images?.split(',')[0] && <img src={p.images.split(',')[0].trim()} alt="" className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-semibold text-sm truncate">{p.item_name}</p>
                              <p className="text-white/50 text-xs mt-0.5">{p.category} • {p.size || 'N/A'} • {p.condition}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-brand-400 font-bold text-sm">£{(Number(p.selling_price) * Number(p.pieces || 1)).toLocaleString()}</span>
                            {Number(p.pieces) > 1 && <span className="text-white/30 text-[10px] ml-1">({p.pieces}×£{Number(p.selling_price).toLocaleString()})</span>}
                                <span className="text-white/40 text-xs">Stock: {p.pieces}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleToggleShow(p.id!, p.show_on_website)} className={'toggle-switch ' + (p.show_on_website ? 'active' : '')} />
                              <span className="text-white/60 text-xs">{p.show_on_website ? 'Listed' : 'Hidden'}</span>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => { setEditingProduct(p); setActiveTab('add'); }} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                              </button>
                              <button onClick={() => handleDelete(p.id!)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add/Edit Product */}
                {activeTab === 'add' && (
                  <ProductForm product={editingProduct} categories={categories}
                    onSave={async (data) => {
                      if (editingProduct?.id) await updateProduct(editingProduct.id, data);
                      else await addProduct(data);
                      loadData(); setEditingProduct(null); setActiveTab('products');
                    }}
                    onCancel={() => { setEditingProduct(null); setActiveTab('products'); }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Form
function ProductForm({ product, categories, onSave, onCancel }: { 
  product: InventoryItem | null; categories: string[]; 
  onSave: (data: Omit<InventoryItem, 'id' | 'created_at'>) => void; onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    item_name: product?.item_name || '', category: product?.category || '', size: product?.size || '',
    condition: product?.condition || 'Good', selling_price: product?.selling_price || 0,
    images: product?.images || '', videos: product?.videos || '', pieces: product?.pieces || 1,
    show_on_website: product?.show_on_website ?? true,
    thumbnail: product?.thumbnail || '',
  });

  // Parse images for thumbnail picker
  const imageList = formData.images ? formData.images.split(',').map(u => u.trim()).filter(Boolean) : [];

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); };
  const set = (key: string, val: string | number | boolean) => setFormData(p => ({ ...p, [key]: val }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 animate-fade-in max-w-3xl">
      <div className="admin-card rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6">
        <h3 className="text-white font-bold text-base sm:text-lg border-b border-white/10 pb-3">Product Details</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/70 text-xs sm:text-sm mb-1.5">Product Name *</label>
            <input type="text" required value={formData.item_name} onChange={(e) => set('item_name', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm" placeholder="e.g., Vintage Leather Jacket" />
          </div>
          <div>
            <label className="block text-white/70 text-xs sm:text-sm mb-1.5">Category *</label>
            <input type="text" required list="categories" value={formData.category} onChange={(e) => set('category', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm" placeholder="e.g., Jackets" />
            <datalist id="categories">{categories.map((cat) => <option key={cat} value={cat} />)}</datalist>
          </div>
          <div>
            <label className="block text-white/70 text-xs sm:text-sm mb-1.5">Size</label>
            <input type="text" value={formData.size} onChange={(e) => set('size', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm" placeholder="e.g., M, L, XL" />
          </div>
          <div>
            <label className="block text-white/70 text-xs sm:text-sm mb-1.5">Condition</label>
            <select value={formData.condition} onChange={(e) => set('condition', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm">
              <option value="Brand New">Brand New</option><option value="Like New">Like New</option>
              <option value="Good">Good</option><option value="Fair">Fair</option>
            </select>
          </div>
          <div>
            <label className="block text-white/70 text-xs sm:text-sm mb-1.5">Selling Price (£) *</label>
            <input type="number" required value={formData.selling_price} onChange={(e) => set('selling_price', Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm" placeholder="0" />
          </div>
          <div>
            <label className="block text-white/70 text-xs sm:text-sm mb-1.5">Stock Quantity</label>
            <input type="number" value={formData.pieces} onChange={(e) => set('pieces', Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm" placeholder="1" />
          </div>
        </div>
        <div>
          <label className="block text-white/70 text-xs sm:text-sm mb-1.5">Images (comma separated URLs)</label>
          <textarea value={formData.images} onChange={(e) => set('images', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white h-20 text-sm" placeholder="https://..." />
        </div>
        {/* Thumbnail Selector */}
        {imageList.length > 0 && (
          <div>
            <label className="block text-white/70 text-xs sm:text-sm mb-2">Select Thumbnail (shown on website)</label>
            <div className="flex flex-wrap gap-2">
              {imageList.map((url, i) => {
                const isSelected = formData.thumbnail === url;
                return (
                  <button key={i} type="button" onClick={() => set('thumbnail', isSelected ? '' : url)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden transition-all duration-200 ${isSelected ? 'ring-3 ring-brand-400 ring-offset-2 ring-offset-[#1a1a2e] scale-105' : 'opacity-50 hover:opacity-80 hover:scale-105'}`}>
                    <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-brand-500/30 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      </div>
                    )}
                    {!isSelected && (
                      <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[8px] text-white font-bold">{i + 1}</div>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-white/40 text-[11px] mt-1.5">{formData.thumbnail ? '✅ Thumbnail selected' : 'Click an image to set as thumbnail. If none selected, first image will be used.'}</p>
          </div>
        )}

        <div>
          <label className="block text-white/70 text-xs sm:text-sm mb-1.5">Videos (comma separated URLs)</label>
          <textarea value={formData.videos} onChange={(e) => set('videos', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white h-20 text-sm" placeholder="https://..." />
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => set('show_on_website', !formData.show_on_website)}
            className={'toggle-switch ' + (formData.show_on_website ? 'active' : '')} />
          <span className="text-white text-sm">Show on Website</span>
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" className="flex-1 py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-xl hover:shadow-lg transition-all text-sm">{product ? 'Update Product' : 'Add Product'}</button>
        <button type="button" onClick={onCancel} className="px-6 py-3.5 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-sm">Cancel</button>
      </div>
    </form>
  );
}
