import { motion } from 'framer-motion';
import { LayoutGrid, Watch, Gem, BookOpen, Camera, Palette, Music, Shirt, Coins, Lamp, MoreHorizontal } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  watches: <Watch className="w-4 h-4" />,
  watch: <Watch className="w-4 h-4" />,
  jewelry: <Gem className="w-4 h-4" />,
  jewellery: <Gem className="w-4 h-4" />,
  books: <BookOpen className="w-4 h-4" />,
  book: <BookOpen className="w-4 h-4" />,
  cameras: <Camera className="w-4 h-4" />,
  camera: <Camera className="w-4 h-4" />,
  art: <Palette className="w-4 h-4" />,
  music: <Music className="w-4 h-4" />,
  clothing: <Shirt className="w-4 h-4" />,
  clothes: <Shirt className="w-4 h-4" />,
  coins: <Coins className="w-4 h-4" />,
  coin: <Coins className="w-4 h-4" />,
  furniture: <Lamp className="w-4 h-4" />,
};

function getIcon(category: string) {
  const key = category.toLowerCase();
  for (const [k, icon] of Object.entries(categoryIcons)) {
    if (key.includes(k)) return icon;
  }
  return <MoreHorizontal className="w-4 h-4" />;
}

export default function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="relative">
      {/* Glow behind active */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <motion.button
          whileHover={{ scale: 1.08, rotateY: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange('all')}
          className={`relative inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[12px] font-bold uppercase tracking-[0.15em] transition-all duration-500 ${
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-black shadow-[0_0_30px_rgba(245,166,35,0.3),0_8px_20px_rgba(245,166,35,0.2)]'
              : 'glass text-gray-400 hover:text-amber-300 hover:border-amber-400/20 hover:shadow-[0_0_15px_rgba(245,166,35,0.1)]'
          }`}
          style={{ fontFamily: "'Space Grotesk', sans-serif", perspective: '600px' }}
        >
          <LayoutGrid className="w-4 h-4" />
          All Items
        </motion.button>

        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.08, rotateY: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(cat)}
            className={`relative inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[12px] font-bold uppercase tracking-[0.15em] transition-all duration-500 ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-black shadow-[0_0_30px_rgba(245,166,35,0.3),0_8px_20px_rgba(245,166,35,0.2)]'
                : 'glass text-gray-400 hover:text-amber-300 hover:border-amber-400/20 hover:shadow-[0_0_15px_rgba(245,166,35,0.1)]'
            }`}
            style={{ fontFamily: "'Space Grotesk', sans-serif", perspective: '600px' }}
          >
            {getIcon(cat)}
            {cat}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
