import { useState, useEffect, useRef } from 'react';
import type { InventoryItem } from '../lib/supabase';

interface Props { product: InventoryItem; onClose: () => void; }
type Media = { type: 'image' | 'video'; url: string };

export default function ProductModal({ product, onClose }: Props) {
  const [idx, setIdx] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const images = product.images ? product.images.split(',').map(u => u.trim()).filter(Boolean) : [];
  const videos = product.videos ? product.videos.split(',').map(u => u.trim()).filter(Boolean) : [];
  const media: Media[] = [...images.map((url): Media => ({ type: 'image', url })), ...videos.map((url): Media => ({ type: 'video', url }))];
  const total = media.length;
  const pieces = Number(product.pieces) || 1;
  const unitPrice = Number(product.selling_price) || 0;
  const totalPrice = unitPrice * pieces;

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && total > 1) setIdx(i => (i + 1) % total);
      if (e.key === 'ArrowLeft' && total > 1) setIdx(i => (i - 1 + total) % total);
    };
    document.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
  }, [onClose, total]);

  const onStart = (x: number) => { setIsDragging(true); startX.current = x; };
  const onMove = (x: number) => { if (isDragging) setDragX(x - startX.current); };
  const onEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (total > 1 && Math.abs(dragX) > 50) {
      setIdx(i => dragX < 0 ? (i + 1) % total : (i - 1 + total) % total);
    }
    setDragX(0);
  };

  const wp = `Hi! I'm interested in "${product.item_name}" (£${totalPrice.toLocaleString()}${pieces > 1 ? ' for ' + pieces + ' pieces' : ''}). Please let me know the shipping cost to my country.`;
  const wu = `https://wa.me/923238226427?text=${encodeURIComponent(wp)}`;
  const eb = `Hi EraVault,\n\nI'm interested in "${product.item_name}" (£${totalPrice.toLocaleString()}${pieces > 1 ? ' for ' + pieces + ' pieces' : ''}).\n\nPlease let me know the shipping cost to my country.\n\nThank you!`;
  const eu = `mailto:eravaultvintage@gmail.com?subject=${encodeURIComponent('Inquiry: ' + product.item_name)}&body=${encodeURIComponent(eb)}`;

  const cond = () => {
    const c = product.condition?.toLowerCase();
    if (c === 'new' || c === 'brand new') return 'from-emerald-500 to-green-500';
    if (c === 'like new') return 'from-blue-500 to-cyan-500';
    if (c === 'good') return 'from-amber-500 to-yellow-500';
    return 'from-gray-500 to-gray-600';
  };

  // 3D style for each slide based on position
  const getSlideStyle = (i: number) => {
    const diff = i - idx;
    const drag = isDragging ? dragX / 4 : 0;
    const rotateY = diff * 45 + drag * 0.1;
    const translateX = diff * 110 + (isDragging ? dragX * 0.3 : 0);
    const translateZ = Math.abs(diff) * -150;
    const scale = diff === 0 ? 1 : 0.8;
    const opacity = Math.abs(diff) > 1 ? 0 : diff === 0 ? 1 : 0.6;
    return {
      transform: `perspective(1000px) translateX(${translateX}%) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`,
      opacity,
      transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
      zIndex: diff === 0 ? 10 : 5 - Math.abs(diff),
      pointerEvents: (diff === 0 ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
    };
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center modal-overlay" onClick={onClose}>
      <div className="absolute inset-0 bg-black/85" />

      <div className="relative w-full sm:w-[95vw] md:w-auto md:max-w-5xl max-h-[96vh] sm:max-h-[92vh] rounded-t-3xl sm:rounded-3xl overflow-hidden modal-content shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="relative bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden">
          <button onClick={onClose} className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md flex items-center justify-center transition-all group">
            <svg className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="md:flex max-h-[96vh] sm:max-h-[92vh]">
            {/* ── 3D CAROUSEL ── */}
            <div className="md:w-[55%] relative bg-gradient-to-br from-brand-50 via-white to-brand-100 flex-shrink-0 select-none overflow-hidden">
              <div
                className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-auto md:h-full cursor-grab active:cursor-grabbing"
                style={{ perspective: '1200px' }}
                onMouseDown={e => onStart(e.clientX)}
                onMouseMove={e => onMove(e.clientX)}
                onMouseUp={onEnd}
                onMouseLeave={() => { if (isDragging) onEnd(); }}
                onTouchStart={e => onStart(e.touches[0].clientX)}
                onTouchMove={e => onMove(e.touches[0].clientX)}
                onTouchEnd={onEnd}
              >
                {/* 3D Rotating Cards Stack */}
                {total > 0 ? media.map((item, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 will-change-transform"
                    style={getSlideStyle(i)}
                  >
                    <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-white">
                      {item.type === 'image' ? (
                        <img src={item.url} alt={product.item_name} className="w-full h-full object-contain" draggable={false} />
                      ) : (
                        <video src={item.url} controls={i === idx} playsInline className="w-full h-full object-contain" draggable={false} />
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-300 gap-2">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-xs">No media</span>
                  </div>
                )}

                {/* Arrows */}
                {total > 1 && !isDragging && (
                  <>
                    <button onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + total) % total); }} className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-20">
                      <svg className="w-5 h-5 text-brand-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % total); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-20">
                      <svg className="w-5 h-5 text-brand-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </>
                )}

                {/* Counter */}
                {total > 1 && <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-white/90 shadow-md text-brand-800 text-xs font-bold z-20">{idx + 1} / {total}</div>}
                {media[idx]?.type === 'video' && <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center gap-2 z-20 shadow-lg"><div className="w-2 h-2 rounded-full bg-white animate-pulse" />VIDEO</div>}
              </div>

              {/* Thumbnails */}
              {total > 1 && (
                <div className="flex justify-center gap-2 py-3 px-3 bg-white border-t border-brand-100">
                  {media.map((item, i) => (
                    <button key={i} onClick={() => setIdx(i)}
                      className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden transition-all duration-300 ${i === idx ? 'ring-2 ring-brand-500 ring-offset-2 scale-110 shadow-lg' : 'opacity-40 hover:opacity-70 hover:scale-105'}`}>
                      {item.type === 'image' ? <img src={item.url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-brand-100 flex items-center justify-center"><svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Details ── */}
            <div className="md:w-[45%] overflow-y-auto max-h-[50vh] sm:max-h-none bg-white">
              <div className="p-5 sm:p-7 space-y-5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider">{product.category}</span>
                  {product.condition && <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${cond()} text-white text-xs font-bold shadow-sm`}>{product.condition}</span>}
                  {pieces <= 1 && <span className="px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold animate-pulse">Last Piece!</span>}
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-950 leading-tight">{product.item_name}</h2>
                <div>
                  <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">£{totalPrice.toLocaleString()}</p>
                  {pieces > 1 && <p className="text-sm text-brand-600 mt-1 font-medium">£{unitPrice.toLocaleString()} × {pieces} pieces</p>}
                  <p className="text-xs text-brand-400 mt-1 flex items-center gap-1.5"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>+ Shipping (depends on your country)</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.size && <div className="px-4 py-2.5 bg-brand-50 rounded-xl border border-brand-200/60"><span className="text-[10px] text-brand-500 uppercase font-bold">Size</span><p className="font-bold text-brand-900 text-sm -mt-0.5">{product.size}</p></div>}
                  {pieces > 0 && <div className="px-4 py-2.5 bg-brand-50 rounded-xl border border-brand-200/60"><span className="text-[10px] text-brand-500 uppercase font-bold">Stock</span><p className="font-bold text-brand-900 text-sm -mt-0.5">{pieces} pc{pieces !== 1 ? 's' : ''}</p></div>}
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/60">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                  <div><p className="font-bold text-blue-900 text-xs">Worldwide Shipping</p><p className="text-blue-600 text-[11px]">Buyer pays shipping. Contact for rates.</p></div>
                </div>
                <div className="space-y-2.5 pt-1">
                  <a href={wu} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2.5 w-full py-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold rounded-2xl transition-all duration-200 hover:shadow-xl hover:shadow-[#25D366]/30 active:scale-[0.98] text-base"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>Buy Now on WhatsApp</a>
                  <div className="grid grid-cols-2 gap-2.5">
                    <a href={eu} className="flex items-center justify-center gap-2 py-3 bg-brand-50 hover:bg-brand-100 text-brand-800 font-semibold rounded-xl transition-all border border-brand-200 text-sm active:scale-[0.98]"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>Email</a>
                    <a href="https://instagram.com/Eravault_vintage" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#833AB4]/10 to-[#E1306C]/10 hover:from-[#833AB4]/20 hover:to-[#E1306C]/20 text-[#E1306C] font-semibold rounded-xl transition-all border border-[#E1306C]/20 text-sm active:scale-[0.98]"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/><circle cx="12" cy="12" r="3.5"/></svg>Instagram</a>
                  </div>
                  <p className="text-center text-[11px] text-brand-400 pt-1">📞 +92 323 8226427 &nbsp;•&nbsp; eravaultvintage@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
