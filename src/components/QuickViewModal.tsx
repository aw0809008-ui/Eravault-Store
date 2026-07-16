import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, Star, Ruler, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { StoreItem } from '../lib/supabase';

interface QuickViewModalProps {
  item: StoreItem | null;
  onClose: () => void;
}

export default function QuickViewModal({ item, onClose }: QuickViewModalProps) {
  const [mediaIdx, setMediaIdx] = useState(0);

  if (!item) return null;

  const allMedia = [
    ...item.videos.map(u => ({ url: u, type: 'video' as const })),
    ...item.images.map(u => ({ url: u, type: 'image' as const })),
  ];

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in buying "${item.name}" (Size: ${item.size})${item.price ? ` — £${item.price}` : ''}. Is it available?`
  );
  const whatsappLink = `https://wa.me/919876543210?text=${whatsappMessage}`;

  const conditionLabel: Record<string, string> = {
    a: 'A - Excellent', ab: 'AB - Very Good', b: 'B - Good', bc: 'BC - Fair', c: 'C - Acceptable', abc: 'ABC - Mixed',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/85 backdrop-blur-2xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotateX: -10, y: 60 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, rotateX: 10, y: 60 }}
          transition={{ type: 'spring', damping: 22, stiffness: 250 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-br from-[#0c0c1d] via-[#0a0a1a] to-[#0f0f25] border border-white/[0.06] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]"
        >
          <div className="absolute inset-0 scan-line pointer-events-none rounded-3xl overflow-hidden" />

          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-11 h-11 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white hover:rotate-90 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="md:flex">
            {/* Media */}
            <div className="md:w-1/2 relative aspect-square md:aspect-auto overflow-hidden bg-black min-h-[300px]">
              {allMedia.length > 0 ? (
                <>
                  {allMedia[mediaIdx]?.type === 'video' ? (
                    <video src={allMedia[mediaIdx].url} className="w-full h-full object-contain" controls autoPlay muted loop playsInline />
                  ) : (
                    <img src={allMedia[mediaIdx]?.url} alt={item.name} className="w-full h-full object-contain" />
                  )}
                  {allMedia.length > 1 && (
                    <>
                      <button onClick={() => setMediaIdx((mediaIdx - 1 + allMedia.length) % allMedia.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button onClick={() => setMediaIdx((mediaIdx + 1) % allMedia.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-md">
                        {mediaIdx + 1}/{allMedia.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Tag className="w-20 h-20 text-amber-400/15" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0c0c1d]/50 hidden md:block" />
            </div>

            {/* Details */}
            <div className="md:w-1/2 p-7 sm:p-10 flex flex-col justify-center">
              {item.category && (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl w-fit text-[10px] font-bold uppercase tracking-[0.2em] mb-5"
                  style={{ fontFamily: "'Orbitron', sans-serif", background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)', color: 'rgb(245,166,35)' }}>
                  <Package className="w-3 h-3" />
                  {item.category}
                </span>
              )}

              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                {item.name}
              </h2>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {item.condition && (
                  <div className="p-3 rounded-xl glass">
                    <Star className="w-4 h-4 text-amber-400 mb-1" />
                    <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-0.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>Condition</div>
                    <div className="text-white text-sm font-semibold">{conditionLabel[item.condition.toLowerCase()] || item.condition}</div>
                  </div>
                )}
                {item.size && (
                  <div className="p-3 rounded-xl glass">
                    <Ruler className="w-4 h-4 text-amber-400 mb-1" />
                    <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-0.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>Size</div>
                    <div className="text-white text-sm font-semibold">{item.size}</div>
                  </div>
                )}
                {item.pieces > 1 && (
                  <div className="p-3 rounded-xl glass">
                    <Package className="w-4 h-4 text-amber-400 mb-1" />
                    <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-0.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>Pieces</div>
                    <div className="text-white text-sm font-semibold">{item.pieces} available</div>
                  </div>
                )}
              </div>

              {item.notes && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-8">
                  <p className="text-sm text-gray-400 italic leading-relaxed">"{item.notes}"</p>
                </div>
              )}

              {/* Price */}
              <div className="mb-8">
                {item.price ? (
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-600 block mb-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>Price</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl text-amber-400/60">£</span>
                      <span className="text-5xl font-black bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent"
                        style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        {item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-lg text-gray-500 italic">Price on request</span>
                )}
              </div>

              {/* Buy button */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold hover:from-green-400 hover:to-emerald-500 transition-all duration-300 wa-pulse hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_30px_rgba(37,211,102,0.3)]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Buy on WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
