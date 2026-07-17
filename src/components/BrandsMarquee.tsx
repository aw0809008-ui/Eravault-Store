export default function BrandsMarquee() {
  const brands = [
    'Nike', 'Adidas', 'Ralph Lauren', 'Burberry', 'Levi\'s', 
    'Tommy Hilfiger', 'The North Face', 'Carhartt', 'Polo',
    'Champion', 'Lacoste', 'Vintage Denim', 'Stone Island',
    'Nike', 'Adidas', 'Ralph Lauren', 'Burberry', 'Levi\'s', 
    'Tommy Hilfiger', 'The North Face', 'Carhartt', 'Polo',
    'Champion', 'Lacoste', 'Vintage Denim', 'Stone Island',
  ];

  return (
    <div className="relative overflow-hidden py-4 sm:py-6 border-y border-brand-200/50" style={{ background: 'linear-gradient(90deg, #faf7f2, #ffffff 30%, #ffffff 70%, #faf7f2)' }}>
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-10" style={{ background: 'linear-gradient(90deg, #faf7f2, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-10" style={{ background: 'linear-gradient(270deg, #faf7f2, transparent)' }} />
      
      <div className="flex animate-marquee whitespace-nowrap">
        {brands.map((brand, i) => (
          <span 
            key={i} 
            className="mx-6 sm:mx-10 text-brand-400/60 font-display text-lg sm:text-xl font-semibold tracking-wide uppercase flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400/30" />
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
}
