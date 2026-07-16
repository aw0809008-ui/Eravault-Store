import { useState, useEffect } from 'react';
import { 
  fetchAllInventory, 
  fetchAllCategories, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  toggleShowOnWebsite,
  getStats,
  type InventoryItem 
} from '../lib/supabase';

interface AdminProps {
  onClose: () => void;
}

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

  // Admin password (in production, use proper auth)
  const ADMIN_PASSWORD = 'eravault2024';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError('');
      loadData();
    } else {
      setLoginError('Invalid password');
    }
  };

  const loadData = async () => {
    setLoading(true);
    const [prods, cats, statsData] = await Promise.all([
      fetchAllInventory(),
      fetchAllCategories(),
      getStats()
    ]);
    setProducts(prods);
    setCategories(cats);
    setStats(statsData);
    setLoading(false);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleToggleShow = async (id: number, currentShow: boolean) => {
    const success = await toggleShowOnWebsite(id, !currentShow);
    if (success) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, show_on_website: !currentShow } : p));
      setStats(prev => ({ ...prev, listedProducts: prev.listedProducts + (!currentShow ? 1 : -1) }));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const success = await deleteProduct(id);
    if (success) {
      setProducts(prev => prev.filter(p => p.id !== id));
      loadData();
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gradient-to-br from-brand-950 via-[#1a1a2e] to-brand-950">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl animate-float-slow" />
        </div>
        
        <div className="relative glass-dark rounded-3xl p-8 w-full max-w-md animate-scale-in">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-2xl shadow-brand-500/30">
              <span className="text-white font-display font-bold text-3xl">E</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-2">Admin Panel</h2>
            <p className="text-white/60">Enter password to continue</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-brand-500"
            />
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-brand-500/30 transition-all"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main Admin Dashboard
  return (
    <div className="fixed inset-0 z-[200] flex bg-[#0f0f1a]">
      {/* Sidebar */}
      <div className="w-64 admin-sidebar flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <span className="text-white font-display font-bold">E</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-white">EraVault</h2>
              <p className="text-xs text-white/50">Admin Panel</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'products', label: 'Products', icon: '📦' },
            { id: 'add', label: 'Add Product', icon: '➕' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as typeof activeTab); setEditingProduct(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-brand-500/20 to-brand-600/20 text-brand-400 border border-brand-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Exit Admin</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0f0f1a]/80 backdrop-blur-xl border-b border-white/10 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              {activeTab === 'dashboard' && '📊 Dashboard'}
              {activeTab === 'products' && '📦 Products'}
              {activeTab === 'add' && (editingProduct ? '✏️ Edit Product' : '➕ Add Product')}
            </h1>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Dashboard */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fade-in">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Products', value: stats.totalProducts, icon: '📦', gradient: 'from-blue-500 to-cyan-500' },
                      { label: 'Listed on Website', value: stats.listedProducts, icon: '🌐', gradient: 'from-green-500 to-emerald-500' },
                      { label: 'Total Value', value: `Rs. ${stats.totalValue.toLocaleString()}`, icon: '💰', gradient: 'from-brand-500 to-brand-600' },
                      { label: 'Categories', value: stats.totalCategories, icon: '🏷️', gradient: 'from-purple-500 to-pink-500' },
                    ].map((stat, i) => (
                      <div key={i} className="admin-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                          {stat.icon}
                        </div>
                        <p className="text-white/60 text-sm mb-1">{stat.label}</p>
                        <p className="text-white text-2xl font-bold">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Products */}
                  <div className="admin-card rounded-2xl p-6">
                    <h3 className="text-white font-bold text-lg mb-4">Recent Products</h3>
                    <div className="space-y-3">
                      {products.slice(0, 5).map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-brand-500/20 overflow-hidden">
                              {p.images?.split(',')[0] && (
                                <img src={p.images.split(',')[0].trim()} alt="" className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div>
                              <p className="text-white font-medium">{p.item_name}</p>
                              <p className="text-white/50 text-sm">{p.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-brand-400 font-bold">Rs. {Number(p.selling_price).toLocaleString()}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${p.show_on_website ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {p.show_on_website ? 'Listed' : 'Hidden'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Products List */}
              {activeTab === 'products' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Filters */}
                  <div className="flex flex-wrap gap-4">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 min-w-[200px] px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40"
                    />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                    >
                      <option value="All">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Products Table */}
                  <div className="admin-card rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full data-table">
                        <thead>
                          <tr className="text-left text-white/60 text-sm">
                            <th className="p-4">Product</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((p) => (
                            <tr key={p.id} className="border-t border-white/5 text-white">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-lg bg-brand-500/20 overflow-hidden flex-shrink-0">
                                    {p.images?.split(',')[0] && (
                                      <img src={p.images.split(',')[0].trim()} alt="" className="w-full h-full object-cover" />
                                    )}
                                  </div>
                                  <span className="font-medium line-clamp-1">{p.item_name}</span>
                                </div>
                              </td>
                              <td className="p-4 text-white/70">{p.category}</td>
                              <td className="p-4 font-bold text-brand-400">Rs. {Number(p.selling_price).toLocaleString()}</td>
                              <td className="p-4">{p.pieces}</td>
                              <td className="p-4">
                                <button
                                  onClick={() => handleToggleShow(p.id!, p.show_on_website)}
                                  className={`toggle-switch ${p.show_on_website ? 'active' : ''}`}
                                />
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => { setEditingProduct(p); setActiveTab('add'); }}
                                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(p.id!)}
                                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Add/Edit Product */}
              {activeTab === 'add' && (
                <ProductForm
                  product={editingProduct}
                  categories={categories}
                  onSave={async (data) => {
                    if (editingProduct?.id) {
                      await updateProduct(editingProduct.id, data);
                    } else {
                      await addProduct(data);
                    }
                    loadData();
                    setEditingProduct(null);
                    setActiveTab('products');
                  }}
                  onCancel={() => { setEditingProduct(null); setActiveTab('products'); }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Product Form Component
function ProductForm({ 
  product, 
  categories, 
  onSave, 
  onCancel 
}: { 
  product: InventoryItem | null; 
  categories: string[]; 
  onSave: (data: Omit<InventoryItem, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    item_name: product?.item_name || '',
    category: product?.category || '',
    size: product?.size || '',
    condition: product?.condition || 'Good',
    selling_price: product?.selling_price || 0,
    images: product?.images || '',
    videos: product?.videos || '',
    pieces: product?.pieces || 1,
    show_on_website: product?.show_on_website ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 animate-fade-in">
      <div className="admin-card rounded-2xl p-6 space-y-6">
        <h3 className="text-white font-bold text-lg border-b border-white/10 pb-4">Product Details</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white/70 text-sm mb-2">Product Name *</label>
            <input
              type="text"
              required
              value={formData.item_name}
              onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
              placeholder="e.g., Vintage Leather Jacket"
            />
          </div>
          
          <div>
            <label className="block text-white/70 text-sm mb-2">Category *</label>
            <input
              type="text"
              required
              list="categories"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
              placeholder="e.g., Jackets"
            />
            <datalist id="categories">
              {categories.map((cat) => <option key={cat} value={cat} />)}
            </datalist>
          </div>
          
          <div>
            <label className="block text-white/70 text-sm mb-2">Size</label>
            <input
              type="text"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
              placeholder="e.g., M, L, XL"
            />
          </div>
          
          <div>
            <label className="block text-white/70 text-sm mb-2">Condition</label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
            >
              <option value="Brand New">Brand New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white/70 text-sm mb-2">Selling Price (Rs.) *</label>
            <input
              type="number"
              required
              value={formData.selling_price}
              onChange={(e) => setFormData({ ...formData, selling_price: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-white/70 text-sm mb-2">Stock Quantity</label>
            <input
              type="number"
              value={formData.pieces}
              onChange={(e) => setFormData({ ...formData, pieces: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
              placeholder="1"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-white/70 text-sm mb-2">Images (comma separated URLs)</label>
          <textarea
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white h-24"
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          />
        </div>
        
        <div>
          <label className="block text-white/70 text-sm mb-2">Videos (comma separated URLs)</label>
          <textarea
            value={formData.videos}
            onChange={(e) => setFormData({ ...formData, videos: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white h-24"
            placeholder="https://example.com/video1.mp4"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, show_on_website: !formData.show_on_website })}
            className={`toggle-switch ${formData.show_on_website ? 'active' : ''}`}
          />
          <span className="text-white">Show on Website</span>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-brand-500/30 transition-all"
        >
          {product ? 'Update Product' : 'Add Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
