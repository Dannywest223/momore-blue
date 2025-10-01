import { useState } from "react";

const categories = [
  {
    name: "Clothing",
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80",
    description: "Authentic African print dresses, shirts, and traditional wear",
  },
  {
    name: "Bags & Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    description: "Handcrafted bags, jewelry, and accessories with cultural flair",
  },
  {
    name: "Homeware",
    image: "https://images.unsplash.com/photo-1615800098779-1be32e60cca3?w=800&q=80",
    description: "Beautiful home decor and functional items for modern living",
  },
  {
    name: "Art & Decor",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    description: "Hand-painted artwork and cultural pieces for your space",
  },
];

export default function CategorySection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50/50 overflow-hidden relative">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .golden-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(251, 191, 36, 0.3) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
        }

        .card-hover-shimmer:hover .golden-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>

      {/* Elegant Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-amber-200/30 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-amber-300/20 to-transparent blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="text-sm font-bold text-amber-800 uppercase tracking-widest bg-gradient-to-r from-amber-100 to-amber-50 px-6 py-2.5 rounded-full border-2 border-amber-200/50 shadow-sm">
              Our Collections
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 bg-clip-text text-transparent">
            Shop By Category
          </h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed font-light">
            Explore our diverse collection of authentic African craftsmanship and modern elegance
          </p>
          <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Premium Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className="card-hover-shimmer group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-amber-100/50 hover:border-amber-300/60 transform hover:scale-[1.02] hover:-translate-y-2">
                
                {/* Premium Image Container */}
                <div className="relative overflow-hidden w-full h-96 lg:h-80 xl:h-96 bg-gradient-to-br from-stone-100 to-amber-50">
                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-950/70 via-amber-900/20 to-transparent z-10 group-hover:from-amber-950/50 transition-all duration-500"></div>
                  <div className="absolute inset-0 golden-shimmer z-5"></div>
                  
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                    style={{
                      objectFit: 'contain',
                      objectPosition: 'center',
                    }}
                  />
                  
                  {/* Title Overlay - Classic Style */}
                  <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-amber-950/95 via-amber-900/80 to-transparent p-6 pt-16">
                    <div className="transform transition-all duration-500 group-hover:translate-y-[-6px]">
                      <h3 className="text-2xl lg:text-2xl font-bold text-white mb-3 drop-shadow-2xl tracking-wide">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="h-0.5 w-12 bg-gradient-to-r from-amber-400 to-amber-600 group-hover:w-24 transition-all duration-500 rounded-full shadow-lg shadow-amber-500/50"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-400 group-hover:scale-150 transition-transform duration-500 shadow-lg shadow-amber-500/50"></div>
                      </div>
                    </div>
                  </div>

                  {/* Premium Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 via-amber-500/0 to-amber-600/0 group-hover:from-amber-400/20 group-hover:via-amber-500/10 group-hover:to-amber-600/5 opacity-0 group-hover:opacity-100 transition-all duration-700 z-15"></div>
                </div>

                {/* Premium Card Content */}
                <div className="p-6 lg:p-7 relative bg-gradient-to-br from-white via-amber-50/30 to-white">
                  <div className="space-y-5">
                    <p className="text-stone-600 leading-relaxed text-sm lg:text-base line-clamp-3 group-hover:text-stone-700 transition-colors duration-300">
                      {category.description}
                    </p>
                    
                    <button className="w-full bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-800 hover:via-amber-900 hover:to-amber-950 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-1 border-2 border-amber-600/30 relative overflow-hidden group">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Explore Collection
                        <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-300/30 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </button>
                  </div>

                  {/* Premium Bottom Accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center shadow-lg"></div>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-300/50 group-hover:border-amber-400 transition-colors duration-500 rounded-tr-2xl opacity-0 group-hover:opacity-100 z-30"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Bottom CTA */}
        <div className="text-center mt-20 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="inline-block bg-white rounded-2xl shadow-xl p-8 border-2 border-amber-100">
            <p className="text-stone-600 mb-6 text-lg font-light">
              Can't find what you're looking for?
            </p>
            <button className="bg-gradient-to-r from-white to-amber-50 text-amber-900 hover:from-amber-700 hover:to-amber-900 hover:text-white font-bold px-10 py-4 rounded-xl border-2 border-amber-300/50 hover:border-amber-600 transition-all duration-300 shadow-md hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1">
              View All Products
              <span className="ml-2 inline-block transform group-hover:translate-x-2 transition-transform duration-300">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}