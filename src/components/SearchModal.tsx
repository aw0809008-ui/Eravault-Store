import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Tag, ArrowRight } from 'lucide-react';
import { StoreItem } from '../lib/supabase';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: StoreItem[];
  onItemClick: (item: StoreItem) => void;
}

export default function SearchModal({ isOpen, onClose, items, onItemClick }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
    else setQuery('');
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.notes?.toLowerCase().includes(query.toLowerCase()) ||
    item.category?.toLowerCase().includes(query.toLowerCase()) ||
    item.size?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-start justify-center pt-[12vh] px-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />

          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95, rotateX: -5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-br from-[#0c0c1d] to-[#0a0a1a] border border-white/[0.06] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8),0_0_40px_rgba(245,166,35,0.05)] overflow-hidden"
          >
            {/* Search line */}
            <div className="flex items-center gap-4 p-6 border-b border-white/5">
              <Search className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search vintage items..."
                className="flex-1 bg-transparent text-white text-lg outline-none placeholder:text-gray-700"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              <kbd className="hidden sm:inline-flex px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-600 font-mono">ESC</kbd>
              <button
                onClick={onClose}
                className="sm:hidden w-8 h-8 rounded-lg glass flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto p-4">
              {query.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl glass flex items-center justify-center">
                    <Search className="w-7 h-7 text-gray-700" />
                  </div>
                  <p className="text-gray-600 text-sm">Start typing to search...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-600 text-sm">No items found for "<span className="text-amber-400">{query}</span>"</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((item, i) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => { onItemClick(item); onClose(); }}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/[0.03] transition-all duration-300 text-left group border border-transparent hover:border-white/5"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#0a0a1a] border border-white/5 flex-shrink-0">
                        {item.images.length > 0 ? (
                          <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Tag className="w-5 h-5 text-gray-800" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate group-hover:text-amber-300 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-gray-600 truncate mt-0.5">
                          {item.category} · {item.size}{item.price ? ` · £${item.price.toLocaleString()}` : ''}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-amber-400 transition-all group-hover:translate-x-1" />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
