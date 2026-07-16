interface CategoryFilterProps {
  active: string;
  categories: string[];
  counts: Record<string, number>;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ active, categories, counts, onChange }: CategoryFilterProps) {
  return (
    <div className="no-scrollbar flex gap-6 overflow-x-auto border-y border-black/15 py-4 sm:gap-9">
      {['All', ...categories].map((category) => {
        const value = category === 'All' ? 'all' : category;
        const count = value === 'all' ? Object.values(counts).reduce((sum, amount) => sum + amount, 0) : counts[category] || 0;
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`focus-ring flex shrink-0 items-baseline gap-2 text-xs font-extrabold uppercase tracking-[0.16em] transition-opacity ${active === value ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
          >
            {category}
            <span className="text-[10px] font-medium">{String(count).padStart(2, '0')}</span>
          </button>
        );
      })}
    </div>
  );
}