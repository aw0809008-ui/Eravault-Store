import { useState, useEffect, useCallback } from 'react';
import { fetchInventory, fetchCategories } from './lib/supabase';
import type { InventoryItem } from './lib/supabase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ShopSection from './components/ShopSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import WhatsAppFloat from './components/WhatsAppFloat';
import AdminDashboard from './components/AdminDashboard';
import SplashScreen from './components/SplashScreen';
import BackToTop from './components/BackToTop';


export default function App() {
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [inv, cats] = await Promise.all([fetchInventory(), fetchCategories()]);
        setProducts(inv);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleNavigate = useCallback((section: string) => {
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSelectProduct = useCallback((product: InventoryItem) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleAdminClose = useCallback(() => {
    setShowAdmin(false);
    fetchInventory().then(setProducts);
    fetchCategories().then(setCategories);
  }, []);

  return (
    <div className="min-h-screen bg-brand-50">
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      <Navbar onNavigate={handleNavigate} onAdminClick={() => setShowAdmin(true)} productCount={products.length} />
      <Hero onShopNow={() => handleNavigate('shop')} />
      
      {/* Features Strip */}
      <div className="relative overflow-hidden border-b border-brand-200/50" style={{ background: 'linear-gradient(90deg, #faf7f2, #ffffff 30%, #ffffff 70%, #faf7f2)' }}>
        {/* Visible decorative elements */}
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(196,154,98,0.1) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full" style={{ background: 'radial-gradient(circle, rgba(196,154,98,0.08) 0%, transparent 70%)' }} />
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,154,98,0.2), transparent)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {[
              { icon: '✓', text: '100% Authentic', color: 'text-emerald-600' },
              { icon: '📦', text: 'Secure Packaging', color: 'text-blue-600' },
              { icon: '💬', text: 'WhatsApp Support', color: 'text-green-600' },
              { icon: '🌍', text: 'Worldwide Shipping', color: 'text-purple-600' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-brand-50 border border-brand-100 shadow-sm hover-3d-lift animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className={`text-2xl ${item.color}`}>{item.icon}</span>
                <span className="font-semibold text-brand-800 text-xs sm:text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ShopSection
        products={products}
        categories={categories}
        loading={loading}
        onSelectProduct={handleSelectProduct}
      />
      <AboutSection />
      <ContactSection />
      <Footer />
      <WhatsAppFloat />
      <BackToTop />

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}

      {showAdmin && (
        <AdminDashboard onClose={handleAdminClose} />
      )}
    </div>
  );
}
