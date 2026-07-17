import { useState, useEffect, useRef, useCallback } from 'react';
import type { InventoryItem } from '../lib/supabase';

interface Props { product: InventoryItem; onClose: () => void; }
type Media = { type: 'image' | 'video'; url: string };

export default function ProductModal({ product, onClose }: Props) {
  const [idx, setIdx] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const dragging = useRef(false);
  const startX = useRef(0);

  const images = product.images ? product.images.split(',').map(u => u.trim()).filter(Boolean) : [];
  const videos = product.videos ? product.videos.split(',').map(u => u.trim()).filter(Boolean) : [];
  const media: Media[] = [...images.map((url): Media => ({ type: 'image', url })), ...videos.map((url): Media => ({ type: 'video', url }))];
  const total = media.length;
  const pieces = Number(product.pieces) || 1;
  const unitPrice = Number(product.selling_price) || 0;
  const totalPrice = unitPrice * pieces;

  const goPrev = useCallback(() => { if (total > 1) { setIdx(i => (i - 1 + total) % total); setZoomed(false); } }, [total]);
  const goNext = useCallback(() => { if (total > 1) { setIdx(i => (i + 1) % total); setZoomed(false); } }, [total]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    document.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
  }, [onClose, goNext, goPrev]);

  const onStart = (x: number) => { dragging.current = true; startX.current = x; };
  const onMove = (x: number) => { if (dragging.current) setDragX(x - startX.current); };
  const onEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (total > 1 && Math.abs(dragX) > 40) { dragX < 0 ? goNext() : goPrev(); }
    setDragX(0);
  };

  const eb = `Hi EraVault,\n\nI'm interested in "${product.item_name}" (£${totalPrice.toLocaleString()}${pieces > 1 ? ' for ' + pieces + ' pieces' : ''}).\n\nPlease let me know the shipping cost to my country.\n\nThank you!`;
  const eu = `mailto:eravaultvintage@gmail.com?subject=${encodeURIComponent('Inquiry: ' + product.item_name)}&body=${encodeURIComponent(eb)}`;
  const listingLink = product.listing_link?.trim() || '';

  const condColor = () => {
    const c = product.condition?.toLowerCase();
    if (c === 'new' || c === 'brand new') return 'from-emerald-500 to-green-500';
    if (c === 'like new') return 'from-blue-500 to-cyan-500';
    if (c === 'good') return 'from-amber-500 to-yellow-500';
    return 'from-gray-500 to-gray-600';
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const slideStyle = (i: number): React.CSSProperties => {
    const diff = i - idx;
    const d = dragging.current ? dragX / 5 : 0;
    if (isMobile) {
      return { position: 'absolute', inset: 0, transform: `translateX(${diff * 100 + d}%)`, opacity: Math.abs(diff) > 1 ? 0 : 1, transition: dragging.current ? 'none' : 'transform 0.3s ease-out', zIndex: 10 - Math.abs(diff), pointerEvents: diff === 0 ? 'auto' : 'none' } as React.CSSProperties;
    }
    return { position: 'absolute', inset: 0, transform: `perspective(1200px) translateX(${diff * 100 + d}%) rotateY(${diff * -30}deg) scale(${diff === 0 ? 1 : 0.88})`, opacity: Math.abs(diff) > 1 ? 0 : diff === 0 ? 1 : 0.5, transition: dragging.current ? 'none' : 'all 0.4s cubic-bezier(0.32, 0.72, 0, 1)', zIndex: 10 - Math.abs(diff), pointerEvents: diff === 0 ? 'auto' : 'none' } as React.CSSProperties;
  };

  return (
    <div className="fixed inset-0 z-[100] modal-overlay" onClick={onClose}>
      <div className="absolute inset-0 bg-black/85" />

      {/* ── MOBILE: full screen scroll / DESKTOP: centered flex ── */}
      <div className="absolute inset-0 sm:flex sm:items-center sm:justify-center sm:p-4 overflow-y-auto sm:overflow-visible" onClick={e => e.stopPropagation()}>
        <div className="relative w-full sm:max-w-6xl sm:w-[96vw] sm:max-h-[94vh] sm:rounded-3xl overflow-hidden modal-content shadow-2xl bg-white">

          {/* Close — always visible */}
          <button onClick={onClose} className="fixed sm:absolute top-3 right-3 z-40 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center transition-all group">
            <svg className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="md:flex md:max-h-[94vh]">
            {/* ── MEDIA ── */}
            <div className="md:w-[58%] relative bg-gradient-to-br from-brand-50 via-white to-brand-100 flex-shrink-0 select-none">
              {/* Carousel */}
              <div
                className="relative w-full aspect-[3/4] sm:aspect-square md:aspect-auto md:h-full overflow-hidden"
                style={{ perspective: '1200px' }}
                onTouchStart={e => onStart(e.touches[0].clientX)}
                onTouchMove={e => onMove(e.touches[0].clientX)}
                onTouchEnd={onEnd}
                onMouseDown={e => { e.preventDefault(); onStart(e.clientX); }}
                onMouseMove={e => onMove(e.clientX)}
                onMouseUp={onEnd}
                onMouseLeave={() => { if (dragging.current) onEnd(); }}
              >
                {total > 0 ? media.map((item, i) => (
                  <div key={i} className="flex items-center justify-center" style={slideStyle(i)}>
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={product.item_name}
                        className={`w-full h-full transition-transform duration-300 ${zoomed && i === idx ? 'object-cover scale-150 cursor-zoom-out' : 'object-contain cursor-zoom-in'}`}
                        draggable={false}
                        onClick={e => { if (i === idx) { e.stopPropagation(); setZoomed(z => !z); } }}
                      />
                    ) : (
                      <video src={item.url} controls playsInline preload="none" className="w-full h-full object-contain" draggable={false} />
                    )}
                  </div>
                )) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-300 gap-2">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-xs">No media</span>
                  </div>
                )}

                {/* Arrows */}
                {total > 1 && (
                  <>
                    <button onMouseDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); goPrev(); }}
                      className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-brand-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onMouseDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); goNext(); }}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-brand-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </>
                )}

                {total > 1 && <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-white/90 shadow-md text-brand-800 text-xs font-bold z-20">{idx + 1} / {total}</div>}
                {media[idx]?.type === 'video' && <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center gap-2 z-20 shadow-lg"><div className="w-2 h-2 rounded-full bg-white animate-pulse" />VIDEO</div>}
              </div>

              {/* Thumbnails */}
              {total > 1 && (
                <div className="flex justify-center gap-2 py-2.5 px-3 bg-white border-t border-brand-100 overflow-x-auto hide-scrollbar">
                  {media.map((item, i) => (
                    <button key={i} onClick={() => setIdx(i)}
                      className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden transition-all duration-300 ${i === idx ? 'ring-2 ring-brand-500 ring-offset-1 scale-110 shadow-lg' : 'opacity-40 hover:opacity-70'}`}>
                      {item.type === 'image' ? <img src={item.url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-brand-100 flex items-center justify-center"><svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── DETAILS — fully scrollable on mobile ── */}
            <div className="md:w-[42%] md:overflow-y-auto md:max-h-[94vh] bg-white">
              <div className="p-5 sm:p-8 space-y-4 sm:space-y-5 pb-8">
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider">{product.category}</span>
                  {product.condition && <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${condColor()} text-white text-xs font-bold shadow-sm`}>{product.condition}</span>}
                  {pieces <= 1 && <span className="px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold animate-pulse">Last Piece!</span>}
                </div>

                <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-brand-950 leading-tight">{product.item_name}</h2>

                {/* Price */}
                <div>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">£{totalPrice.toLocaleString()}</p>
                  {pieces > 1 && <p className="text-xs sm:text-sm text-brand-600 mt-1 font-medium">£{unitPrice.toLocaleString()} × {pieces} pieces</p>}
                  <p className="text-[11px] sm:text-xs text-brand-400 mt-1 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    + Shipping (depends on your country)
                  </p>
                </div>

                {/* Quick details */}
                <div className="flex flex-wrap gap-2">
                  {product.size && <div className="px-3 sm:px-4 py-2 bg-brand-50 rounded-xl border border-brand-200/60"><span className="text-[10px] text-brand-500 uppercase font-bold">Size</span><p className="font-bold text-brand-900 text-sm -mt-0.5">{product.size}</p></div>}
                  {pieces > 0 && <div className="px-3 sm:px-4 py-2 bg-brand-50 rounded-xl border border-brand-200/60"><span className="text-[10px] text-brand-500 uppercase font-bold">Stock</span><p className="font-bold text-brand-900 text-sm -mt-0.5">{pieces} pc{pieces !== 1 ? 's' : ''}</p></div>}
                </div>

                {/* Shipping */}
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/60">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                  <div><p className="font-bold text-blue-900 text-xs">Worldwide Shipping</p><p className="text-blue-600 text-[11px]">Buyer pays shipping. Contact for rates.</p></div>
                </div>

                {/* Buttons */}
                <div className="space-y-2.5">
                  {/* Listing Link — primary button if available */}
                  {listingLink && (
                    <a href={listingLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2.5 w-full py-3.5 sm:py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-2xl transition-all duration-200 hover:shadow-xl hover:shadow-brand-500/30 active:scale-[0.98] text-sm sm:text-base">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      View Original Listing
                    </a>
                  )}
                  {/* Email — primary if no listing link */}
                  <a href={eu} className={`flex items-center justify-center gap-2 w-full py-3.5 sm:py-4 font-bold rounded-2xl transition-all duration-200 active:scale-[0.98] text-sm sm:text-base ${listingLink ? 'bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200' : 'bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:shadow-xl hover:shadow-brand-500/30'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Email Us
                  </a>
                  {/* Instagram */}
                  <a href="https://instagram.com/Eravault_vintage" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#833AB4]/10 to-[#E1306C]/10 hover:from-[#833AB4]/20 hover:to-[#E1306C]/20 text-[#E1306C] font-semibold rounded-xl transition-all border border-[#E1306C]/20 text-xs sm:text-sm active:scale-[0.98]">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/><circle cx="12" cy="12" r="3.5"/></svg>
                    @Eravault_vintage
                  </a>
                  <p className="text-center text-[11px] text-brand-400 pt-0.5">eravaultvintage@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
