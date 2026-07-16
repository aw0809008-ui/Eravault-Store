import { useState, useEffect } from 'react';
import type { InventoryItem } from '../lib/supabase';

interface ProductModalProps {
  product: InventoryItem;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const imageUrls = product.images
    ? product.images.split(',').map((url: string) => url.trim()).filter(Boolean)
    : [];

  const videoUrls = product.videos
    ? product.videos.split(',').map((url: string) => url.trim()).filter(Boolean)
    : [];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentImage((prev) => (prev + 1) % imageUrls.length);
      if (e.key === 'ArrowLeft') setCurrentImage((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, imageUrls.length]);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % imageUrls.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);

  const whatsappMessage = `Hi! I'm interested in "${product.item_name}" (£${Number(product.selling_price).toLocaleString()}). Please let me know the shipping cost to my country.`;
  const whatsappUrl = `https://wa.me/923238226427?text=${encodeURIComponent(whatsappMessage)}`;
  const emailSubject = `Inquiry: ${product.item_name}`;
  const emailBody = `Hi EraVault,\n\nI'm interested in "${product.item_name}" (£${Number(product.selling_price).toLocaleString()}).\n\nPlease let me know the shipping cost to my country.\n\nThank you!`;
  const emailUrl = `mailto:eravaultvintage@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const conditionColor = () => {
    switch (product.condition?.toLowerCase()) {
      case 'new':
      case 'brand new':
        return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white';
      case 'like new':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'good':
        return 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 modal-overlay"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-xl flex items-center justify-center transition-all hover:scale-110 hover:rotate-90"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="md:flex">
          {/* Image Carousel */}
          <div className="md:w-1/2 relative bg-gradient-to-br from-brand-50 to-brand-100">
            <div className="aspect-square relative overflow-hidden">
              {imageUrls.length > 0 ? (
                <>
                  <img
                    src={imageUrls[currentImage]}
                    alt={product.item_name}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  {imageUrls.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-xl flex items-center justify-center transition-all hover:scale-110"
                      >
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-xl flex items-center justify-center transition-all hover:scale-110"
                      >
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {/* Dots */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {imageUrls.map((_: string, i: number) => (
                          <button
                            key={i}
                            onClick={() => setCurrentImage(i)}
                            className={`w-3 h-3 rounded-full transition-all ${
                              i === currentImage
                                ? 'bg-white scale-125 shadow-lg'
                                : 'bg-white/50 hover:bg-white/75'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-300">
                  <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {imageUrls.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto hide-scrollbar bg-white/50 backdrop-blur-sm">
                {imageUrls.map((url: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all ${
                      i === currentImage
                        ? 'border-brand-500 shadow-lg scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-6 sm:p-10 flex flex-col max-h-[60vh] md:max-h-[95vh] overflow-y-auto">
            <p className="text-sm text-brand-500 font-bold uppercase tracking-wider mb-2">
              {product.category}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-950 mb-4 leading-tight">
              {product.item_name}
            </h2>
            <p className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent mb-2">
              £{Number(product.selling_price).toLocaleString()}
            </p>
            <p className="text-sm text-brand-500 mb-6 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              + Shipping (depends on your country)
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {product.size && (
                <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl p-4 border border-brand-200">
                  <p className="text-xs text-brand-500 uppercase tracking-wider font-semibold mb-1">Size</p>
                  <p className="font-bold text-brand-900 text-lg">{product.size}</p>
                </div>
              )}
              {product.condition && (
                <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl p-4 border border-brand-200">
                  <p className="text-xs text-brand-500 uppercase tracking-wider font-semibold mb-1">Condition</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${conditionColor()}`}>
                    {product.condition}
                  </span>
                </div>
              )}
              {product.pieces !== undefined && (
                <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl p-4 border border-brand-200">
                  <p className="text-xs text-brand-500 uppercase tracking-wider font-semibold mb-1">Available</p>
                  <p className="font-bold text-brand-900 text-lg">{product.pieces} piece{product.pieces !== 1 ? 's' : ''}</p>
                </div>
              )}
            </div>

            {/* Shipping Info */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-blue-900 text-sm">Worldwide Shipping</p>
                  <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                    Shipping cost depends on your country. Buyer pays shipping charges. 
                    Contact us for exact shipping rates to your location.
                  </p>
                </div>
              </div>
            </div>

            {/* Videos */}
            {videoUrls.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-bold text-brand-800 mb-3 uppercase tracking-wider">Videos</p>
                <div className="flex gap-3 overflow-x-auto hide-scrollbar">
                  {videoUrls.map((url: string, i: number) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 flex items-center gap-2 bg-gradient-to-r from-brand-100 to-brand-50 hover:from-brand-200 hover:to-brand-100 px-5 py-3 rounded-xl text-sm font-bold text-brand-700 transition-all hover:scale-105 border border-brand-200"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Video {i + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1" />

            {/* Buy Now - All Contact Options */}
            <div className="space-y-3">
              {/* WhatsApp - Primary */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-5 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#25D366] text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-[#25D366]/30 hover:scale-[1.02] text-lg"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Buy Now on WhatsApp
              </a>

              {/* Email & Instagram Row */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={emailUrl}
                  className="flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-brand-100 to-brand-50 hover:from-brand-200 hover:to-brand-100 text-brand-800 font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] border border-brand-200 text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Us
                </a>
                <a
                  href="https://instagram.com/Eravault_vintage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#833AB4]/10 to-[#E1306C]/10 hover:from-[#833AB4]/20 hover:to-[#E1306C]/20 text-[#E1306C] font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] border border-[#E1306C]/20 text-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                    <circle cx="12" cy="12" r="3.5"/>
                  </svg>
                  Instagram
                </a>
              </div>

              {/* Contact info bar */}
              <div className="flex items-center justify-center gap-4 pt-2 text-xs text-brand-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  0323-8226427
                </span>
                <span>•</span>
                <span>eravaultvintage@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
