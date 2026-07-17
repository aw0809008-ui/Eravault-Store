import { useState, useEffect } from 'react';

const testimonials = [
  {
    name: 'Sarah M.',
    location: 'London, UK',
    text: 'Absolutely love my vintage Burberry coat from EraVault! The quality is amazing and it was exactly as described. Will definitely be ordering again.',
    rating: 5,
    avatar: '👩🏻',
    item: 'Burberry Trench Coat',
  },
  {
    name: 'Ahmed K.',
    location: 'Dubai, UAE',
    text: 'Fast shipping to Dubai and the packaging was perfect. The Nike vintage jacket I ordered is in pristine condition. Highly recommend!',
    rating: 5,
    avatar: '👨🏽',
    item: 'Nike Vintage Jacket',
  },
  {
    name: 'Emma L.',
    location: 'New York, USA',
    text: 'Found rare pieces I\'ve been searching for months! EraVault\'s collection is carefully curated. The Instagram page is also great for previews.',
    rating: 5,
    avatar: '👩🏼',
    item: 'Ralph Lauren Polo Set',
  },
  {
    name: 'Raj P.',
    location: 'Mumbai, India',
    text: 'Great communication via email and the products are 100% authentic. Got a vintage Adidas tracksuit that looks brand new. Amazing value!',
    rating: 5,
    avatar: '👨🏾',
    item: 'Adidas Vintage Tracksuit',
  },
  {
    name: 'Marie C.',
    location: 'Paris, France',
    text: 'Sustainable fashion at its finest! I love that I can find designer pieces that are pre-loved and still in excellent condition. Merci EraVault!',
    rating: 5,
    avatar: '👩🏻',
    item: 'Vintage Designer Bag',
  },
  {
    name: 'James W.',
    location: 'Sydney, Australia',
    text: 'Even shipping to Australia was reasonable. The vintage denim jacket is my new favourite piece. Quality you can trust from EraVault.',
    rating: 4,
    avatar: '👨🏻',
    item: 'Levi\'s Denim Jacket',
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 sm:py-20 md:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 40%, #1a1a2e 70%, #16213e 100%)' }}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(196,154,98,0.08) 0%, transparent 60%)' }} />
        <div className="absolute -bottom-40 -left-32 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(196,154,98,0.06) 0%, transparent 55%)' }} />
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,154,98,0.3), transparent)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-bold uppercase tracking-wider rounded-full mb-4">
            Customer Love
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
            What Our <span className="gradient-text">Customers</span> Say
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-sm sm:text-lg">
            Don't just take our word for it — hear from our happy customers around the world.
          </p>
        </div>

        {/* Desktop: Grid view */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((t, i) => (
            <div
              key={i}
              className="glass-dark rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-500/10 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className={`text-sm ${j < t.rating ? 'text-yellow-400' : 'text-white/20'}`}>★</span>
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-6 line-clamp-4">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <span className="text-2xl">{t.avatar}</span>
                <div>
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.location}</p>
                </div>
              </div>
              <div className="mt-3 inline-block px-3 py-1 bg-brand-500/20 rounded-full">
                <span className="text-brand-300 text-[10px] font-semibold">{t.item}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <div key={i} className="w-full flex-shrink-0 px-2">
                  <div className="glass-dark rounded-3xl p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <span key={j} className={`text-sm ${j < t.rating ? 'text-yellow-400' : 'text-white/20'}`}>★</span>
                      ))}
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed mb-6">"{t.text}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <span className="text-2xl">{t.avatar}</span>
                      <div>
                        <p className="text-white font-bold text-sm">{t.name}</p>
                        <p className="text-white/40 text-xs">{t.location}</p>
                      </div>
                    </div>
                    <div className="mt-3 inline-block px-3 py-1 bg-brand-500/20 rounded-full">
                      <span className="text-brand-300 text-[10px] font-semibold">{t.item}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? 'w-8 bg-brand-500' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 sm:mt-16 flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-60">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <div>
              <p className="text-white font-bold text-lg">4.9/5</p>
              <p className="text-white/50 text-xs">Average Rating</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            <div>
              <p className="text-white font-bold text-lg">30+</p>
              <p className="text-white/50 text-xs">Countries Served</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💯</span>
            <div>
              <p className="text-white font-bold text-lg">500+</p>
              <p className="text-white/50 text-xs">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
