import { useState, useEffect } from 'react';
import type { InventoryItem } from '../lib/supabase';

interface ProductModalProps {
  product: InventoryItem;
  onClose: () => void;
}

type MediaItem = { type: 'image'; url: string } | { type: 'video'; url: string };

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgKey, setImgKey] = useState(0); // for re-triggering animation on swap

  const imageUrls = product.images
    ? product.images.split(',').map((u: string) => u.trim()).filter(Boolean)
    : [];
  const videoUrls = product.videos
    ? product.videos.split(',').map((u: string) => u.trim()).filter(Boolean)
    : [];

  const media: MediaItem[] = [
    ...imageUrls.map((url): MediaItem => ({ type: 'image', url })),
    ...videoUrls.map((url): MediaItem => ({ type: 'video', url })),
  ];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && media.length > 1) goTo((currentIndex + 1) % media.length);
      if (e.key === 'ArrowLeft' && media.length > 1) goTo((currentIndex - 1 + media.length) % media.length);
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [onClose, media.length, currentIndex]);

  const goTo = (i: number) => { setCurrentIndex(i); setImgKey(k => k + 1); };

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

  const cur = media[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center modal-overlay" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80" />

      {/* Floating particles behind modal */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-40 h-40 rounded-full bg-brand-500/8 blur-3xl animate-float" />
        <div className="absolute bottom-[20%] right-[10%] w-60 h-60 rounded-full bg-brand-400/8 blur-3xl animate-float-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[50%] left-[50%] w-32 h-32 rounded-full bg-purple-500/5 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* ── Modal ── */}
      <div
        className="relative w-full sm:w-[95vw] md:w-auto md:max-w-5xl max-h-[96vh] sm:max-h-[92vh] rounded-t-[28px] sm:rounded-[28px] overflow-hidden modal-content"
        style={{ transformStyle: 'preserve-3d' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ring around modal */}
        <div className="absolute -inset-[1px] rounded-t-[28px] sm:rounded-[28px] bg-gradient-to-br from-brand-400/30 via-transparent to-brand-500/20 pointer-events-none" />
        
        <div className="relative bg-white rounded-t-[28px] sm:rounded-[28px] overflow-hidden">
          {/* Close */}
          <button onClick={onClose} className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md flex items-center justify-center transition-all group modal-badge-bounce" style={{ animationDelay: '0.6s' }}>
            <svg className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="md:flex max-h-[96vh] sm:max-h-[92vh]">
            {/* ── LEFT: Media ── */}
            <div className="md:w-[55%] relative bg-gradient-to-br from-gray-950 via-black to-gray-900 flex-shrink-0">
              {/* Main media */}
              <div className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-auto md:h-full flex items-center justify-center overflow-hidden">
                {media.length > 0 ? (
                  cur.type === 'image' ? (
                    <img
                      key={imgKey}
                      src={cur.url}
                      alt={product.item_name}
                      className="w-full h-full object-contain modal-image-swap"
                    />
                  ) : (
                    <video key={imgKey} src={cur.url} controls autoPlay className="w-full h-full object-contain modal-image-swap" />
                  )
                ) : (
                  <div className="flex flex-col items-center gap-3 text-white/20 modal-img-reveal">
                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-sm">No media</span>
                  </div>
                )}

                {/* Arrows */}
                {media.length > 1 && (
                  <>
                    <button onClick={() => goTo((currentIndex - 1 + media.length) % media.length)} className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={() => goTo((currentIndex + 1) % media.length)} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </>
                )}

                {/* Counter */}
                {media.length > 1 && (
                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-bold modal-counter-pop">
                    {currentIndex + 1} / {media.length}
                  </div>
                )}

                {/* Video badge */}
                {cur?.type === 'video' && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-2 modal-badge-bounce">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    VIDEO
                  </div>
                )}

                {/* Gradient overlays for depth */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
              </div>

              {/* Thumbnails */}
              {media.length > 1 && (
                <div className="flex gap-1.5 p-2.5 sm:p-3 overflow-x-auto hide-scrollbar bg-black/90 backdrop-blur-md">
                  {media.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`modal-thumb-enter relative flex-shrink-0 w-13 h-13 sm:w-16 sm:h-16 rounded-xl overflow-hidden transition-all duration-300 ${
                        i === currentIndex
                          ? 'ring-2 ring-brand-400 ring-offset-2 ring-offset-black scale-110 shadow-lg shadow-brand-500/30'
                          : 'opacity-40 hover:opacity-80 hover:scale-105'
                      }`}
                      style={{ animationDelay: `${0.4 + i * 0.06}s` }}
                    >
                      {item.type === 'image' ? (
                        <img src={item.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      )}
                      {item.type === 'video' && (
                        <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Details ── */}
            <div className="md:w-[45%] overflow-y-auto max-h-[50vh] sm:max-h-none bg-white">
              <div className="p-5 sm:p-7 space-y-5">
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap modal-detail-slide">
                  <span className="modal-badge-bounce px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider" style={{ animationDelay: '0.3s' }}>
                    {product.category}
                  </span>
                  {product.condition && (
                    <span className={`modal-badge-bounce px-3 py-1 rounded-full bg-gradient-to-r ${conditionBadge()} text-white text-xs font-bold shadow-md`} style={{ animationDelay: '0.4s' }}>
                      {product.condition}
                    </span>
                  )}
                  {product.pieces !== undefined && product.pieces <= 1 && (
                    <span className="modal-badge-bounce px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold animate-pulse shadow-md" style={{ animationDelay: '0.5s' }}>
                      Last Piece!
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-950 leading-tight modal-detail-slide" style={{ animationDelay: '0.35s' }}>
                  {product.item_name}
                </h2>

                {/* Price */}
                <div className="modal-price-pop">
                  <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">
                    £{Number(product.selling_price).toLocaleString()}
                  </p>
                  <p className="text-xs text-brand-500 mt-1.5 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    + Shipping (depends on your country)
                  </p>
                </div>

                {/* Details chips */}
                <div className="flex flex-wrap gap-2 modal-detail-slide" style={{ animationDelay: '0.5s' }}>
                  {product.size && (
                    <div className="px-4 py-2.5 bg-gradient-to-br from-brand-50 to-brand-100/80 rounded-xl border border-brand-200/60">
                      <span className="text-[10px] text-brand-500 uppercase font-bold tracking-wider">Size</span>
                      <p className="font-bold text-brand-900 text-sm -mt-0.5">{product.size}</p>
                    </div>
                  )}
                  {product.pieces !== undefined && (
                    <div className="px-4 py-2.5 bg-gradient-to-br from-brand-50 to-brand-100/80 rounded-xl border border-brand-200/60">
                      <span className="text-[10px] text-brand-500 uppercase font-bold tracking-wider">Stock</span>
                      <p className="font-bold text-brand-900 text-sm -mt-0.5">{product.pieces} pc{product.pieces !== 1 ? 's' : ''}</p>
                    </div>
                  )}
                </div>

                {/* Shipping */}
                <div className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/60 modal-ship-slide">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="font-bold text-blue-900 text-xs">Worldwide Shipping</p>
                    <p className="text-blue-600 text-[11px] leading-snug">Buyer pays shipping. Contact us for rates.</p>
                  </div>
                </div>

                {/* ── CTA Buttons ── */}
                <div className="space-y-2.5 pt-1">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                    className="modal-btn-slide flex items-center justify-center gap-2.5 w-full py-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-[#25D366]/30 hover:scale-[1.02] active:scale-[0.98] text-base"
                    style={{ animationDelay: '0.6s' }}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Buy Now on WhatsApp
                  </a>
                  <div className="grid grid-cols-2 gap-2.5">
                    <a href={emailUrl}
                      className="modal-btn-slide flex items-center justify-center gap-2 py-3 bg-brand-50 hover:bg-brand-100 text-brand-800 font-semibold rounded-xl transition-all border border-brand-200 text-sm hover:scale-[1.02] active:scale-[0.98]"
                      style={{ animationDelay: '0.7s' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      Email
                    </a>
                    <a href="https://instagram.com/Eravault_vintage" target="_blank" rel="noopener noreferrer"
                      className="modal-btn-slide flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#833AB4]/10 to-[#E1306C]/10 hover:from-[#833AB4]/20 hover:to-[#E1306C]/20 text-[#E1306C] font-semibold rounded-xl transition-all border border-[#E1306C]/20 text-sm hover:scale-[1.02] active:scale-[0.98]"
                      style={{ animationDelay: '0.75s' }}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/><circle cx="12" cy="12" r="3.5"/></svg>
                      Instagram
                    </a>
                  </div>
                  <p className="modal-btn-slide text-center text-[11px] text-brand-400 pt-1" style={{ animationDelay: '0.85s' }}>
                    📞 +92 323 8226427 &nbsp;•&nbsp; eravaultvintage@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
