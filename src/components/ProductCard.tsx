import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Play, Plus } from 'lucide-react';
import type { StoreItem } from '../lib/supabase';
import { MEDIA, conditionLabel } from '../lib/store';

interface ProductCardProps {
  favorite: boolean;
  index: number;
  item: StoreItem;
  onFavorite: (id: string) => void;
  onOpen: (item: StoreItem) => void;
}

export default function ProductCard({ favorite, index, item, onFavorite, onOpen }: ProductCardProps) {
  const shell = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cover = item.images[0] || MEDIA.racks;
  const secondary = item.images[1];
  const isSold = item.status.toLowerCase() === 'sold';

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!shell.current || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = shell.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -5, y: px * 5 });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.3) }}
      className="product-perspective"
    >
      <div
        ref={shell}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        className="product-shell"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: 'transform 160ms ease-out', transformStyle: 'preserve-3d' }}
      >
        <div className="group relative aspect-[4/5] cursor-pointer overflow-hidden bg-[#ded8cb]" onClick={() => onOpen(item)}>
          <img src={cover} alt={item.name} loading="lazy" className="product-image h-full w-full object-cover" />
          {secondary && <img src={secondary} alt="" loading="lazy" className="product-image product-secondary absolute inset-0 h-full w-full object-cover opacity-0" />}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="absolute left-3 top-3 flex gap-2">
            {isSold && <span className="bg-[#171713] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">Sold</span>}
            {item.videos.length > 0 && <span className="grid h-8 w-8 place-items-center bg-white text-[#171713]"><Play className="h-3.5 w-3.5 fill-current" /></span>}
          </div>

          <button
            onClick={(event) => { event.stopPropagation(); onFavorite(item.id); }}
            aria-label={favorite ? 'Remove from saved items' : 'Save item'}
            className="focus-ring absolute right-3 top-3 grid h-10 w-10 place-items-center bg-[#f3f0e8] text-[#171713] transition-transform hover:scale-105"
          >
            <Heart className={`h-4.5 w-4.5 ${favorite ? 'fill-[#171713]' : ''}`} strokeWidth={1.7} />
          </button>

          <button onClick={() => onOpen(item)} className="absolute bottom-4 right-4 grid h-12 w-12 translate-y-4 place-items-center bg-[#d8ff45] text-[#171713] opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100" aria-label={`View ${item.name}`}>
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <button onClick={() => onOpen(item)} className="focus-ring block w-full pt-4 text-left">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="display text-xl font-semibold leading-tight tracking-[-0.025em]">{item.name}</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-black/45">
                {item.category} / {item.size || 'One size'} / {conditionLabel(item.condition)}
              </p>
            </div>
            <p className="shrink-0 text-sm font-extrabold">{item.price ? `GBP ${item.price.toLocaleString()}` : 'Ask'}</p>
          </div>
        </button>
      </div>
    </motion.article>
  );
}