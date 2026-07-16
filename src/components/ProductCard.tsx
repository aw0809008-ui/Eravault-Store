import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eye, Tag, Star, Ruler } from 'lucide-react';
import { StoreItem } from '../lib/supabase';

interface Props { item: StoreItem; index: number; onQuickView: (item: StoreItem) => void; }

const condColor: Record<string,string> = { a:'from-emerald-400 to-green-500', ab:'from-blue-400 to-cyan-500', b:'from-amber-400 to-yellow-500', bc:'from-orange-400 to-red-400', c:'from-red-400 to-rose-500', abc:'from-purple-400 to-pink-500' };
const condLabel: Record<string,string> = { a:'Excellent', ab:'Very Good', b:'Good', bc:'Fair', c:'Acceptable', abc:'Mixed' };

export default function ProductCard({ item, index, onQuickView }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx:0, ry:0, mx:50, my:50 });
  const [hov, setHov] = useState(false);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    setT({ rx: (0.5 - y) * 20, ry: (x - 0.5) * 20, mx: x * 100, my: y * 100 });
  }, []);

  const cover = item.images[0] || null;
  const vid = item.videos[0] || null;
  const waMsg = encodeURIComponent(`Hi! I want "${item.name}" (${item.size})${item.price ? ` — £${item.price}` : ''}. Available?`);

  return (
    <motion.div
      initial={{ opacity:0, y:80, rotateX:-10 }}
      whileInView={{ opacity:1, y:0, rotateX:0 }}
      viewport={{ once:true, margin:'-60px' }}
      transition={{ duration:.7, delay: index * .08, ease:[.25,.46,.45,.94] }}
      className="group" style={{ perspective:'1200px' }}>
      <div ref={ref} onMouseMove={onMove} onMouseEnter={() => setHov(true)}
        onMouseLeave={() => { setT({ rx:0, ry:0, mx:50, my:50 }); setHov(false); }}
        className="relative rounded-[28px] overflow-hidden cursor-pointer holo-card"
        style={{ transform:`rotateX(${t.rx}deg) rotateY(${t.ry}deg)`, transition: hov ? 'transform .1s ease' : 'transform .5s ease', transformStyle:'preserve-3d' }}>

        <div className="relative bg-gradient-to-br from-[#08081a] via-[#0a0a1e] to-[#0d0828] border border-white/[.03] rounded-[28px] overflow-hidden">
          {/* Light follow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
            style={{ background:`radial-gradient(circle at ${t.mx}% ${t.my}%,rgba(212,168,83,.1) 0%,transparent 50%)` }} />

          {/* Laser scan */}
          <div className="absolute inset-0 laser-scan opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 overflow-hidden rounded-[28px]" />

          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {cover ? (
              <img src={cover} alt={item.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" loading="lazy" />
            ) : vid ? (
              <video src={vid} className="w-full h-full object-cover" muted loop autoPlay playsInline />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0a0a1e] to-[#08081a]">
                <div className="w-20 h-20 rounded-2xl glass-gold flex items-center justify-center"><Tag className="w-8 h-8 text-[var(--gold)]/20" /></div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08081a] via-[#08081a]/20 to-transparent" />

            {/* Badges */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
              {item.condition && (
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider bg-gradient-to-r ${condColor[item.condition.toLowerCase()] || 'from-gray-400 to-gray-500'} text-black shadow-lg`}>
                  <Star className="w-3 h-3" />{condLabel[item.condition.toLowerCase()] || item.condition}
                </span>
              )}
              <span className="px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider glass text-white/50" style={{ fontFamily:"'Orbitron',sans-serif" }}>{item.category}</span>
            </div>

            {(item.images.length + item.videos.length) > 1 && (
              <div className="absolute bottom-4 left-4 z-10 px-2.5 py-1 rounded-lg glass text-[9px] text-white/40 font-semibold">📸 {item.images.length + item.videos.length}</div>
            )}

            <motion.button initial={false} animate={{ opacity: hov?1:0, scale: hov?1:.5 }} transition={{ duration:.2 }}
              onClick={(e) => { e.stopPropagation(); onQuickView(item); }}
              className="absolute bottom-4 right-4 z-10 w-11 h-11 rounded-xl glass flex items-center justify-center text-white/60 hover:text-[var(--gold)] transition-colors">
              <Eye className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6">
            <h3 className="text-lg font-bold text-white mb-3 line-clamp-1 group-hover:text-[var(--gold)] transition-colors duration-500" style={{ fontFamily:"'Playfair Display',serif" }}>{item.name}</h3>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {item.size && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[.02] border border-white/[.04] text-[10px] text-white/30"><Ruler className="w-3 h-3 text-[var(--gold)]/40" />{item.size}</span>}
              {item.pieces > 1 && <span className="px-2.5 py-1 rounded-lg bg-white/[.02] border border-white/[.04] text-[10px] text-white/30">📦 {item.pieces} pcs</span>}
            </div>

            <div className="flex items-end justify-between gap-3">
              <div>
                {item.price ? (
                  <>
                    <span className="text-[8px] uppercase tracking-[.2em] text-white/20 block mb-0.5" style={{ fontFamily:"'Orbitron',sans-serif" }}>Price</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xs text-[var(--gold)]/50">£</span>
                      <span className="text-2xl sm:text-3xl font-black text-gradient-gold" style={{ fontFamily:"'Orbitron',sans-serif" }}>{item.price.toLocaleString()}</span>
                    </div>
                  </>
                ) : <span className="text-xs text-white/20 italic">Ask for price</span>}
              </div>

              <a href={`https://wa.me/919876543210?text=${waMsg}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold wa-pulse hover:scale-105 active:scale-95 transition-transform shadow-[0_4px_25px_rgba(37,211,102,.25)]"
                style={{ fontFamily:"'Space Grotesk',sans-serif" }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Buy
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
