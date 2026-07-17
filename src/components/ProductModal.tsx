import { useState, useEffect, useCallback } from 'react';
import type { InventoryItem } from '../lib/supabase';

interface Props { product: InventoryItem; onClose: () => void; }

export default function ProductModal({ product, onClose }: Props) {
  const [idx, setIdx] = useState(0);

  const images = product.images ? product.images.split(',').map(u => u.trim()).filter(Boolean) : [];
  const videos = product.videos ? product.videos.split(',').map(u => u.trim()).filter(Boolean) : [];
  const media = [...images.map(url => ({ type: 'image' as const, url })), ...videos.map(url => ({ type: 'video' as const, url }))];
  const total = media.length;
  const pieces = Number(product.pieces) || 1;
  const unitPrice = Number(product.selling_price) || 0;
  const totalPrice = unitPrice * pieces;

  const goPrev = useCallback(() => { if (total > 1) setIdx(i => (i - 1 + total) % total); }, [total]);
  const goNext = useCallback(() => { if (total > 1) setIdx(i => (i + 1) % total); }, [total]);

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

  return (
    <div className="fixed inset-0 z-[100] modal-overlay" onClick={onClose}>
      <div className="absolute inset-0 bg-black/85" />
      <div className="absolute inset-0 sm:flex sm:items-center sm:justify-center sm:p-4 overflow-y-auto sm:overflow-visible" onClick={e => e.stopPropagation()}>
        <div className="relative w-full sm:max-w-6xl sm:w-[96vw] sm:max-h-[94vh] sm:rounded-3xl overflow-hidden modal-content shadow-2xl bg-white">
          
          <button onClick={onClose} className="fixed sm:absolute top-3 right-3 z-40 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center transition-all group">
            <svg className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="md:flex md:max-h-[94vh]">
            {/* Media */}
            <div className="md:w-[58%] relative bg-gradient-to-br from-brand-50 via-white to-brand-100 flex-shrink-0 select-none">
              <div className="relative w-full aspect-[3/4] sm:aspect-square md:aspect-auto md:h-full overflow-hidden">
                {media.length > 0 ? (
                  media[idx]?.type === 'video' ? (
                    <video src={media[idx].url} controls className="w-full h-full object-contain bg-black" />
                  ) : (
                    <img src={media[idx]?.url} alt={product.item_name} className="w-full h-full object-contain" />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-300">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}

                {total > 1 && (
                  <>
                    <button onClick={goPrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {media.map((_, i) => (
                        <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'w-6 bg-brand-500' : 'bg-white/50'}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="md:w-[42%] p-6 sm:p-8 md:p-10 overflow-y-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                {product.condition && <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${condColor()} text-white`}>{product.condition}</span>}
                {product.category && <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-700">{product.category}</span>}
                {product.size && <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-700">Size: {product.size}</span>}
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-950 mb-4 leading-tight">{product.item_name}</h2>

              {product.description && <p className="text-brand-600 text-sm leading-relaxed mb-6">{product.description}</p>}

              <div className="mb-8 p-4 bg-gradient-to-br from-brand-50 to-white rounded-2xl border border-brand-100">
                <div className="text-3xl font-black gradient-text mb-1">£{totalPrice.toLocaleString()}</div>
                {pieces > 1 && <p className="text-brand-500 text-sm">£{unitPrice.toLocaleString()} × {pieces} pieces</p>}
              </div>

              <div className="space-y-3">
                <a href={eu} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-brand-500/30 transition-all text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Inquire via Email
                </a>
                <a href="https://instagram.com/Eravault_vintage" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-pink-500/30 transition-all text-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/><circle cx="12" cy="12" r="3.5"/></svg>
                  DM on Instagram
                </a>
                {listingLink && (
                  <a href={listingLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-brand-200 text-brand-700 font-bold rounded-2xl hover:border-brand-400 transition-all text-sm">
                    🔗 View Original Listing
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
