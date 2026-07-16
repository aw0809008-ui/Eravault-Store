export default function AboutSection() {
  const features = [
    {
      icon: '🛡️',
      title: 'Authenticity Guaranteed',
      desc: 'Every piece is verified for authenticity and quality before listing.',
      gradient: 'from-emerald-500 to-green-500',
    },
    {
      icon: '❤️',
      title: 'Handpicked Selection',
      desc: 'Curated pieces chosen for their unique character and timeless style.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: '♻️',
      title: 'Sustainable Fashion',
      desc: 'Giving pre-loved fashion a second life, reducing waste one piece at a time.',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: '💬',
      title: 'WhatsApp Support',
      desc: 'Direct support for seamless shopping and instant responses.',
      gradient: 'from-brand-500 to-brand-700',
    },
  ];

  const stats = [
    { value: '500+', label: 'Items Sold', icon: '🛍️' },
    { value: '100%', label: 'Authentic', icon: '✓' },
    { value: '🌍', label: 'Worldwide Shipping', icon: '📦' },
    { value: '24/7', label: 'Support', icon: '💬' },
  ];

  return (
    <section id="about" className="py-12 sm:py-20 md:py-32 relative overflow-hidden section-3d-divider" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f5efe4 40%, #faf7f2 70%, #ffffff 100%)' }}>
      {/* Background decoration — VISIBLE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Warm gradient wash on right side */}
        <div className="absolute top-0 right-0 w-2/3 h-full" style={{ background: 'linear-gradient(to left, rgba(240,232,216,0.6), transparent)' }} />
        
        {/* Visible blobs */}
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(196,154,98,0.1) 0%, transparent 65%)' }} />
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(196,154,98,0.08) 0%, transparent 60%)' }} />
        
        {/* Cross-hatch pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="aboutpat" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M0 25h50M25 0v50" stroke="#885935" strokeWidth="0.4" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#aboutpat)" />
        </svg>
        
        {/* Top golden divider */}
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,154,98,0.3), transparent)' }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand-600 text-sm font-bold uppercase tracking-wider rounded-full mb-4">
              Our Story
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-950 mb-6 sm:mb-8 leading-tight">
              About <span className="gradient-text">EraVault</span>
            </h2>
            <div className="space-y-4 sm:space-y-6 text-brand-700 text-base sm:text-lg leading-relaxed">
              <p>
                EraVault is more than just a store — it's a treasure trove of fashion history. 
                We specialize in sourcing and curating premium vintage and pre-owned fashion 
                pieces from around the world.
              </p>
              <p>
                Each item in our collection has been carefully inspected and authenticated. 
                We believe that great fashion doesn't have an expiration date, and every piece 
                in our vault tells its own unique story.
              </p>
              <p>
                From rare designer finds to everyday vintage staples, our mission is to make 
                sustainable fashion accessible, stylish, and affordable for everyone.
              </p>
            </div>
          </div>

          {/* Right - Features Grid */}
          <div className="grid grid-cols-2 gap-5">
            {features.map((feature, i) => (
              <div
                key={i}
                className="hover-3d-lift bg-gradient-to-br from-white to-brand-50 rounded-3xl p-6 border border-brand-100 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-brand-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-brand-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="stat-card text-center py-8 px-6 bg-gradient-to-br from-brand-50 to-white rounded-3xl border border-brand-100 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <p className="font-display text-4xl md:text-5xl font-black bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-brand-500 font-medium mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
