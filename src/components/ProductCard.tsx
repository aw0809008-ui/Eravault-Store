import { useRef } from 'react';
import type { InventoryItem } from '../lib/supabase';

interface ProductCardProps {
  product: InventoryItem;
  index: number;
  onSelect: (product: InventoryItem) => void;
}

export default function ProductCard({ product, index, onSelect }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageUrls = product.images ? product.images.split(',').map((url: string) => url.trim()).filter(Boolean) : [];
  const thumbImage = product.thumbnail?.trim() || imageUrls[0] || '';
  const pieces = Number(product.pieces) || 1;
  const unitPrice = Number(product.selling_price) || 0;
  const totalPrice = unitPrice * pieces;

  const conditionColor = () => {
    switch (product.condition?.toLowerCase()) {
      case 'new': case 'brand new': return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white';
      case 'like new': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'good': return 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white';
      case 'fair': return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  // 3D tilt — desktop only
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.01)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = '';
  };

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-brand-900/5 border border-brand-100 cursor-pointer group animate-fade-in-up"
      style={{ animationDelay: `${index * 0.08}s`, transition: 'transform 0.2s ease-out, box-shadow 0.3s ease', transformStyle: 'preserve-3d' }}
      onClick={() => onSelect(product)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-brand-50 to-brand-100">
        {thumbImage ? (
          <img src={thumbImage} alt={product.item_name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-300">
            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
          <span className="px-6 py-2.5 bg-white text-brand-900 rounded-full text-sm font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">View Details</span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.condition && <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg ${conditionColor()}`}>{product.condition}</span>}
        </div>

        {product.pieces !== undefined && product.pieces <= 1 && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-pulse">Last Piece!</span>
          </div>
        )}

        {/* Pieces count */}
        {pieces > 1 && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold">
            {pieces} pcs
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-5" style={{ transform: 'translateZ(20px)' }}>
        <p className="text-[10px] sm:text-xs text-brand-500 font-semibold uppercase tracking-wider mb-1 sm:mb-2">{product.category}</p>
        <h3 className="font-bold text-brand-950 text-sm sm:text-lg leading-tight mb-2 sm:mb-3 line-clamp-2 group-hover:text-brand-700 transition-colors">{product.item_name}</h3>
        
        <div className="space-y-1">
          {/* Total Price (price × pieces) */}
          <p className="text-lg sm:text-2xl font-black bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">
            £{totalPrice.toLocaleString()}
          </p>
          
          {/* Price breakdown if multiple pieces */}
          {pieces > 1 && (
            <p className="text-[10px] sm:text-xs text-brand-400">
              £{unitPrice.toLocaleString()} × {pieces} pieces
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-[10px] text-brand-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            + Shipping
          </p>
          {product.size && (
            <span className="hidden sm:inline text-[10px] text-brand-600 bg-brand-100 px-2.5 py-1 rounded-full font-semibold">{product.size}</span>
          )}
        </div>
      </div>
    </div>
  );
}
