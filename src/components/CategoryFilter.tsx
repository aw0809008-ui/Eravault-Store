import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';
import { StoreItem } from '../lib/supabase';

interface Props { categories: string[]; active: string; onChange: (c: string) => void; items: StoreItem[]; }

export default function CategoryFilter({ categories, active, onChange, items }: Props) {
  const count = (c: string) => c === 'all' ? items.length : items.filter(i => i.category === c).length;
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      <motion.button whileHover={{ scale:1.06 }} whileTap={{ scale:.95 }} onClick={() => onChange('all')}
        className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-[11px] font-bold uppercase tracking-[.15em] transition-all duration-500 ${
          active === 'all' ? 'bg-gradient-to-r from-[var(--gold)] via-[#f5c842] to-[var(--gold)] text-black shadow-[0_0_30px_rgba(212,168,83,.25)]' : 'glass text-white/30 hover:text-[var(--gold)] hover:border-[var(--gold)]/15'
        }`} style={{ fontFamily:"'Space Grotesk',sans-serif" }}>
        <LayoutGrid className="w-3.5 h-3.5" />All <span className="opacity-50">({count('all')})</span>
      </motion.button>
      {categories.map(c => (
        <motion.button key={c} whileHover={{ scale:1.06 }} whileTap={{ scale:.95 }} onClick={() => onChange(c)}
          className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-[11px] font-bold uppercase tracking-[.15em] transition-all duration-500 ${
            active === c ? 'bg-gradient-to-r from-[var(--gold)] via-[#f5c842] to-[var(--gold)] text-black shadow-[0_0_30px_rgba(212,168,83,.25)]' : 'glass text-white/30 hover:text-[var(--gold)] hover:border-[var(--gold)]/15'
          }`} style={{ fontFamily:"'Space Grotesk',sans-serif" }}>
          {c} <span className="opacity-50">({count(c)})</span>
        </motion.button>
      ))}
    </div>
  );
}
