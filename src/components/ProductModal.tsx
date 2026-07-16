import { useState, useEffect } from 'react';
import type { InventoryItem } from '../lib/supabase';

interface ProductModalProps {
  product: InventoryItem;
  onClose: () => void;
}

type MediaItem = { type: 'image'; url: string } | { type: 'video'; url: string };

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageUrls = product.images
    ? product.images.split(',').map((u: string) => u.trim()).filter(Boolean)
    : [];
  const videoUrls = product.videos
    ? product.videos.split(',').map((u: string) => u.trim()).filter(Boolean)
    : [];

  // Combine images + videos into one media array
  const media: MediaItem[] = [
    ...imageUrls.map((url): MediaItem => ({ type: 'image', url })),
    ...videoUrls.map((url): MediaItem => ({ type: 'video', url })),
  ];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && media.length > 1) setCurrentIndex(p => (p + 1) % media.length);
      if (e.key === 'ArrowLeft' && media.length > 1) setCurrentIndex(p => (p - 1 + media.length) % media.length);
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [onClose, media.length]);

  const next = () => setCurrentIndex(p => (p + 1) % media.length);
  const prev = () => setCurrentIndex(p => (p - 1 + media.length) % media.length);

  const whatsappMessage = `Hi! I'm interested in "${product.item_name}" (£${Number(product.selling_price).toLocaleString()}). Please let me know the shipping cost to my country.`;
  const whatsappUrl = `https://wa.me/923238226427?text=${encodeURIComponent(whatsappMessage)}`;
  const emailSubject = `Inquiry: ${product.item_name}`;
  const emailBody = `Hi EraVault,\n\nI'm interested in "${product.item_name}" (£${Number(product.selling_price).toLocaleString()}).\n\nPlease let me know the shipping cost to my country.\n\nThank you!`;
  const emailUrl = `mailto:eravaultvintage@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const conditionBadge = () => {
    switch (product.condition?.toLowerCase()) {
      case 'new': case 'brand new': return 'from-emerald-500 to-green-500';
      case 'like new': return 'from-blue-500 to-cyan-500';
      case 'good': return 'from-amber-500 to-yellow-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const currentMedia = media[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center modal-overlay" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" />

      {/* Modal */}
      <div
        className="relative bg-white w-full sm:w-[95vw] md:w-auto md:max-w-5xl max-h-[96vh] sm:max-h-[92vh] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all group">
          <svg className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="md:flex max-h-[96vh] sm:max-h-[92vh]">
          {/* ── LEFT: Media Gallery ── */}
          <div className="md:w-[55%] relative bg-black flex-shrink-0">
            {/* Main Media View — full image, no crop */}
            <div className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-auto md:h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
              {media.length > 0 ? (
                currentMedia.type === 'image' ? (
                  <img
                    src={currentMedia.url}
                    alt={product.item_name}
                    className="w-full h-full object-contain transition-all duration-500"
                  />
                ) : (
                  <video
                    src={currentMedia.url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )
              ) : (
                <div className="flex flex-col items-center gap-3 text-white/30">
                  <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">No media</span>
                </div>
              )}

              {/* Navigation arrows */}
              {media.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-all">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button onClick={next} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-all">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}

              {/* Counter badge */}
              {media.length > 1 && (
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                  {currentIndex + 1} / {media.length}
                </div>
              )}

              {/* Media type indicator */}
              {currentMedia?.type === 'video' && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-red-500/80 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  VIDEO
                </div>
              )}
            </div>

            {/* Thumbnails — images + videos together */}
            {media.length > 1 && (
              <div className="flex gap-1.5 p-2 sm:p-3 overflow-x-auto hide-scrollbar bg-black/80 backdrop-blur-sm">
                {media.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all ${
                      i === currentIndex
                        ? 'ring-2 ring-brand-400 ring-offset-2 ring-offset-black scale-105'
                        : 'opacity-50 hover:opacity-80'
                    }`}
                  >
                    {item.type === 'image' ? (
                      <img src={item.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    )}
                    {item.type === 'video' && (
                      <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Product Details ── */}
          <div className="md:w-[45%] overflow-y-auto max-h-[50vh] sm:max-h-none">
            <div className="p-5 sm:p-7 space-y-5">
              {/* Category + Condition */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider">
                  {product.category}
                </span>
                {product.condition && (
                  <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${conditionBadge()} text-white text-xs font-bold`}>
                    {product.condition}
                  </span>
                )}
                {product.pieces !== undefined && product.pieces <= 1 && (
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold animate-pulse">
                    Last Piece!
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-950 leading-tight">
                {product.item_name}
              </h2>

              {/* Price */}
              <div>
                <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">
                  £{Number(product.selling_price).toLocaleString()}
                </p>
                <p className="text-xs text-brand-500 mt-1 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  + Shipping (depends on your country)
                </p>
              </div>

              {/* Quick Details */}
              <div className="flex flex-wrap gap-2">
                {product.size && (
                  <div className="px-4 py-2 bg-brand-50 rounded-xl border border-brand-200">
                    <span className="text-[10px] text-brand-500 uppercase font-semibold">Size</span>
                    <p className="font-bold text-brand-900 text-sm">{product.size}</p>
                  </div>
                )}
                {product.pieces !== undefined && (
                  <div className="px-4 py-2 bg-brand-50 rounded-xl border border-brand-200">
                    <span className="text-[10px] text-brand-500 uppercase font-semibold">Stock</span>
                    <p className="font-bold text-brand-900 text-sm">{product.pieces} pc{product.pieces !== 1 ? 's' : ''}</p>
                  </div>
                )}
              </div>

              {/* Shipping Banner */}
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="font-bold text-blue-900 text-xs">Worldwide Shipping</p>
                  <p className="text-blue-600 text-[11px] leading-snug">Buyer pays shipping. Contact us for rates.</p>
                </div>
              </div>

              {/* ── Buy Buttons ── */}
              <div className="space-y-2.5 pt-2">
                {/* WhatsApp */}
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#25D366] text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-[#25D366]/30 text-base">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Buy Now on WhatsApp
                </a>

                {/* Email & Instagram */}
                <div className="grid grid-cols-2 gap-2.5">
                  <a href={emailUrl} className="flex items-center justify-center gap-2 py-3 bg-brand-50 hover:bg-brand-100 text-brand-800 font-semibold rounded-xl transition-all border border-brand-200 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Email
                  </a>
                  <a href="https://instagram.com/Eravault_vintage" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#833AB4]/10 to-[#E1306C]/10 hover:from-[#833AB4]/20 hover:to-[#E1306C]/20 text-[#E1306C] font-semibold rounded-xl transition-all border border-[#E1306C]/20 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/><circle cx="12" cy="12" r="3.5"/></svg>
                    Instagram
                  </a>
                </div>

                {/* Contact footer */}
                <p className="text-center text-[11px] text-brand-400 pt-1">
                  📞 +92 323 8226427 &nbsp;•&nbsp; eravaultvintage@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
