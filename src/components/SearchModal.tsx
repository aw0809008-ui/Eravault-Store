import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Search, X } from 'lucide-react';
import type { StoreItem } from '../lib/supabase';
import { MEDIA } from '../lib/store';

interface SearchModalProps {
  isOpen: boolean;
  items: StoreItem[];
  onClose: () => void;
  onItemClick: (item: StoreItem) => void;
}

export default function SearchModal({ isOpen, items, onClose, onItemClick }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => input.current?.focus(), 100);
    else setQuery('');
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const matches = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return items.slice(0, 5);
    return items.filter((item) => [item.name, item.category, item.size, item.notes || ''].some((field) => field.toLowerCase().includes(value)));
  }, [items, query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] overflow-y-auto bg-[#f3f0e8] text-[#171713]">
          <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-10">
            <div className="flex items-center justify-between">
              <p className="display text-3xl font-semibold tracking-[-0.05em]">Find your piece</p>
              <button onClick={onClose} className="focus-ring grid h-12 w-12 place-items-center border border-black/20" aria-label="Close search"><X className="h-5 w-5" /></button>
            </div>

            <div className="mt-12 flex items-center border-b-2 border-[#171713] pb-4">
              <Search className="mr-4 h-6 w-6" />
              <input ref={input} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search jackets, denim, size..." className="display w-full bg-transparent text-3xl outline-none placeholder:text-black/25 sm:text-5xl" />
            </div>

            <p className="mt-8 text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/45">{query ? `${matches.length} results` : 'Recently added'}</p>
            <div className="mt-5 divide-y divide-black/15 border-y border-black/15">
              {matches.map((item) => (
                <button key={item.id} onClick={() => { onItemClick(item); onClose(); }} className="focus-ring group flex w-full items-center gap-5 py-4 text-left">
                  <img src={item.images[0] || MEDIA.racks} alt="" className="h-24 w-20 object-cover" />
                  <div className="min-w-0 flex-1">
                    <h3 className="display truncate text-2xl font-semibold">{item.name}</h3>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-black/45">{item.category} / {item.size || 'One size'}</p>
                  </div>
                  <p className="hidden text-sm font-extrabold sm:block">{item.price ? `GBP ${item.price.toLocaleString()}` : 'Ask'}</p>
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </button>
              ))}
              {matches.length === 0 && <p className="py-16 text-center text-sm text-black/45">Nothing matched that search. Try a category or size.</p>}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}