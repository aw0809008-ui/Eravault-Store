import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eye, Tag, Star, Ruler } from 'lucide-react';
import { StoreItem } from '../lib/supabase';

interface ProductCardProps {
  item: StoreItem;
  index: number;
  onQuickView: (item: StoreItem) => void;
}

export default function ProductCard({ item, index, onQuickView }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTransform({
      rotateX: (0.5 - y) * 25,
      rotateY: (x - 0.5) * 25,
      x: x * 100,
      y: y * 100,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform({ rotateX: 0, rotateY: 0, x: 50, y: 50 });
    setIsHovered(false);
  }, []);

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in "${item.name}" (Size: ${item.size})${item.price ? ` — £${item.price}` : ''}. Is it still available?`
  );
  const whatsappLink = `https://wa.me/919876543210?text=${whatsappMessage}`;

  // First image or video for display
  const coverImage = item.images.length > 0 ? item.images[0] : null;
  const coverVideo = item.videos.length > 0 ? item.videos[0] : null;

  const conditionColors: Record<string, string> = {
    a: 'from-emerald-400 to-green-500 shadow-emerald-500/30',
    ab: 'from-blue-400 to-cyan-500 shadow-blue-500/30',
    b: 'from-amber-400 to-orange-500 shadow-amber-500/30',
    bc: 'from-orange-400 to-red-400 shadow-orange-500/30',
    c: 'from-red-400 to-rose-500 shadow-red-500/30',
    abc: 'from-purple-400 to-pink-500 shadow-purple-500/30',
  };

  const conditionLabel: Record<string, string> = {
    a: 'Excellent', ab: 'Very Good', b: 'Good', bc: 'Fair', c: 'Acceptable', abc: 'Mixed',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
      style={{ perspective: '1200px' }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-3xl overflow-hidden cursor-pointer"
        style={{
          transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) translateZ(0)`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Animated border gradient */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{
            background: 'linear-gradient(135deg, rgba(245,166,35,0.5), rgba(168,85,247,0.3), rgba(6,182,212,0.3), rgba(245,166,35,0.5))',
            backgroundSize: '300% 300%',
            animation: 'borderGlow 3s ease infinite',
            padding: '1.5px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Card body */}
        <div className="relative bg-gradient-to-br from-[#0c0c1d] via-[#0a0a1a] to-[#0f0f25] border border-white/[0.04] rounded-3xl overflow-hidden">
          {/* Holographic shine */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
            style={{
              background: `radial-gradient(circle at ${transform.x}% ${transform.y}%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
            }}
          />

          {/* Scan line effect */}
          <div className="absolute inset-0 scan-line opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />

          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {coverImage ? (
              <img
                src={coverImage}
                alt={item.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                loading="lazy"
              />
            ) : coverVideo ? (
              <video
                src={coverVideo}
                className="w-full h-full object-cover"
                muted loop autoPlay playsInline
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0c0c1d] to-[#0a0a1a]">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-amber-500/10 to-purple-500/5 border border-white/5 flex items-center justify-center">
                    <Tag className="w-9 h-9 text-amber-400/30" />
                  </div>
                  <span className="text-gray-700 text-xs tracking-wider uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>No Image</span>
                </div>
              </div>
            )}

            {/* Dark overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c1d] via-[#0c0c1d]/30 to-transparent" />

            {/* Top badges */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
              {item.condition && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${conditionColors[item.condition.toLowerCase()] || 'from-gray-400 to-gray-500'} text-black shadow-lg`}>
                  <Star className="w-3 h-3" />
                  {conditionLabel[item.condition.toLowerCase()] || item.condition}
                </span>
              )}
              {item.category && (
                <span className="px-3 py-1.5 rounded-xl text-[10px] font-semibold uppercase tracking-wider glass text-gray-300"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {item.category}
                </span>
              )}
            </div>

            {/* Media count badge */}
            {(item.images.length + item.videos.length) > 1 && (
              <div className="absolute bottom-4 left-4 z-10 px-2.5 py-1 rounded-lg glass text-[10px] text-gray-300 font-medium">
                📸 {item.images.length + item.videos.length}
              </div>
            )}

            {/* Quick view button */}
            <motion.button
              initial={false}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
              onClick={(e) => { e.stopPropagation(); onQuickView(item); }}
              className="absolute bottom-4 right-4 z-10 w-12 h-12 rounded-2xl glass flex items-center justify-center text-white hover:text-amber-300 hover:shadow-[0_0_20px_rgba(245,166,35,0.3)] transition-all duration-300"
            >
              <Eye className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 relative z-10" style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}>
            <h3
              className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-amber-300 transition-colors duration-500"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {item.name}
            </h3>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-2 mb-5">
              {item.size && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] text-gray-500">
                  <Ruler className="w-3 h-3 text-amber-400/50" />
                  {item.size}
                </span>
              )}
              {item.pieces > 1 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] text-gray-500">
                  📦 {item.pieces} pcs
                </span>
              )}
              {item.notes && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] text-gray-400 line-clamp-1 max-w-[150px]">
                  💬 {item.notes}
                </span>
              )}
            </div>

            {/* Price + WhatsApp */}
            <div className="flex items-end justify-between gap-3">
              <div>
                {item.price ? (
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-600 block mb-0.5" style={{ fontFamily: "'Orbitron', sans-serif" }}>Price</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-sm text-amber-400/60">£</span>
                      <span className="text-3xl font-black bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent price-3d"
                        style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        {item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 italic">Ask for price</span>
                )}
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="relative inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold hover:from-green-400 hover:to-emerald-500 transition-all duration-300 wa-pulse hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(37,211,102,0.3)]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Buy Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
