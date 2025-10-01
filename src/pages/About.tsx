import { Leaf, Recycle, Shield, HandHeart, Heart } from "lucide-react";
import ourStoryImg from "@/assets/11.jpg";
import sustainabilityImg from "@/assets/12.jpg";
import artisanImg from "@/assets/13.jpg";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50/30">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 1.2s ease-out forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }

        .golden-line {
          background: linear-gradient(90deg, transparent, #d97706, #b45309, #d97706, transparent);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        .text-shadow-soft {
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      {/* Premium Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 py-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-600 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            <div className="inline-block mb-6">
              <span className="text-sm font-bold text-amber-300 uppercase tracking-widest bg-amber-950/40 px-6 py-2.5 rounded-full border-2 border-amber-600/30 backdrop-blur-sm">
                Our Heritage
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-shadow-soft">
              About Momore Limited
            </h1>
            <p className="text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto animate-slide-up leading-relaxed">
              Learn about our mission, values, and the artisans behind our products
            </p>
            <div className="w-32 h-1 golden-line mx-auto mt-8 rounded-full"></div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#fffbeb" fillOpacity="1"/>
          </svg>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <div className="mb-6">
                <span className="text-sm font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-4 py-2 rounded-full border border-amber-200">
                  Since 2018
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 bg-clip-text text-transparent mb-8">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-stone-600 leading-relaxed">
                <p className="border-l-4 border-amber-600 pl-6 py-2">
                  Momore Limited was founded in 2018 with a passion for celebrating African heritage through 
                  beautifully crafted products. Our name "Momore" comes from the Yoruba word meaning 
                  "a child to be cherished," reflecting our commitment to nurturing African craftsmanship.
                </p>
                <p>
                  We work directly with skilled artisans across Rwanda, Nigeria, Ghana, and Kenya to create 
                  unique, high-quality items that blend traditional techniques with contemporary design. 
                  Each product tells a story of cultural heritage and artistic excellence.
                </p>
                <p>
                  Our commitment to ethical production means that every purchase supports sustainable 
                  livelihoods and preserves cultural craftsmanship for future generations. We ensure 
                  fair wages, safe working conditions, and environmental sustainability in all our operations.
                </p>
              </div>
              <div className="mt-8">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-amber-50 px-6 py-4 rounded-xl border-2 border-amber-200 shadow-lg">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-amber-700 border-2 border-white"></div>
                    <div className="w-10 h-10 rounded-full bg-amber-600 border-2 border-white"></div>
                    <div className="w-10 h-10 rounded-full bg-amber-800 border-2 border-white"></div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-amber-900">200+ Artisans</p>
                    <p className="text-sm text-amber-700">Across 4 Countries</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-fade-in order-first lg:order-last">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
                <img 
                  src={ourStoryImg}
                  alt="African artisans at work" 
                  className="relative w-full h-[500px] object-contain bg-gradient-to-br from-stone-100 to-amber-50 rounded-2xl shadow-2xl border-4 border-white group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute top-6 right-6 bg-white rounded-xl px-4 py-3 shadow-xl border-2 border-amber-200">
                  <p className="text-3xl font-bold text-amber-900">2018</p>
                  <p className="text-xs text-amber-700 font-semibold">FOUNDED</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-24 bg-gradient-to-br from-white via-amber-50/30 to-stone-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-amber-500 rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
                <img 
                  src={sustainabilityImg}
                  alt="Sustainable crafting practices" 
                  className="relative w-full h-[500px] object-contain bg-gradient-to-br from-stone-100 to-amber-50 rounded-2xl shadow-2xl border-4 border-white group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute bottom-6 left-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl px-5 py-3 shadow-xl">
                  <p className="text-sm font-bold">🌿 ECO-FRIENDLY</p>
                </div>
              </div>
            </div>
            <div className="animate-fade-in">
              <div className="mb-6">
                <span className="text-sm font-bold text-green-700 uppercase tracking-widest bg-green-100 px-4 py-2 rounded-full border border-green-200">
                  Our Commitment
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-900 via-green-700 to-amber-900 bg-clip-text text-transparent mb-8">
                Sustainability & Ethics
              </h2>
              <p className="text-lg text-stone-600 leading-relaxed mb-8">
                At Momore, we believe in fashion that respects both people and the planet. 
                Our sustainability initiatives include:
              </p>
              <div className="space-y-5">
                {[
                  { icon: Leaf, text: "Using organic, natural, and upcycled materials whenever possible", color: "green" },
                  { icon: Recycle, text: "Implementing zero-waste production techniques", color: "amber" },
                  { icon: Heart, text: "Supporting traditional crafting methods that have low environmental impact", color: "red" },
                  { icon: Shield, text: "Ensuring fair wages and safe working conditions for all artisans", color: "blue" },
                  { icon: HandHeart, text: "Investing in community development projects in our artisans' communities", color: "purple" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-shadow duration-300 border border-amber-100 group hover:border-amber-300">
                    <div className={`p-3 bg-gradient-to-br from-${item.color}-100 to-${item.color}-200 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className={`h-6 w-6 text-${item.color}-700`} />
                    </div>
                    <p className="text-stone-600 leading-relaxed pt-2">{item.text}</p>
                  </div>
                ))}
              </div>
              <p className="text-lg text-stone-600 leading-relaxed mt-8 bg-amber-50 border-l-4 border-amber-600 p-6 rounded-r-xl">
                We're committed to transparency in our supply chain and continuously work to reduce 
                our environmental footprint while maximizing our positive social impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Artisans Section */}
      <section className="py-24 bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50/50 relative">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <div className="mb-6">
                <span className="text-sm font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-4 py-2 rounded-full border border-amber-200">
                  The Heart of Momore
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 bg-clip-text text-transparent mb-8">
                Meet Our Artisans
              </h2>
              <div className="space-y-6 text-lg text-stone-600 leading-relaxed">
                <p className="border-l-4 border-amber-600 pl-6 py-2">
                  The heart of Momore is our community of talented artisans. We partner with over 
                  200 craftspeople across Africa, each bringing their unique skills and cultural 
                  heritage to our products.
                </p>
                <p>
                  From beadwork experts in Kenya to weaving masters in Ghana, from print designers 
                  in Nigeria to wood carvers in Rwanda, our network represents the rich diversity 
                  of African craftsmanship.
                </p>
                <p>
                  We provide our artisans with design support, business training, and access to 
                  global markets, helping to preserve traditional crafts while creating economic 
                  opportunities in their communities.
                </p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mt-10">
                <div className="bg-gradient-to-br from-amber-700 to-amber-900 text-white p-6 rounded-xl shadow-xl">
                  <p className="text-4xl font-bold mb-2">200+</p>
                  <p className="text-amber-100 text-sm font-semibold">Skilled Artisans</p>
                </div>
                <div className="bg-gradient-to-br from-amber-600 to-amber-800 text-white p-6 rounded-xl shadow-xl">
                  <p className="text-4xl font-bold mb-2">4</p>
                  <p className="text-amber-100 text-sm font-semibold">Countries</p>
                </div>
              </div>
            </div>
            <div className="animate-fade-in order-first lg:order-last">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
                <img 
                  src={artisanImg}
                  alt="African artisans crafting products" 
                  className="relative w-full h-[500px] object-contain bg-gradient-to-br from-stone-100 to-amber-50 rounded-2xl shadow-2xl border-4 border-white group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-950/60 via-transparent to-transparent rounded-2xl"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white text-xl font-bold mb-2">Crafting Excellence</p>
                  <p className="text-amber-200 text-sm">Preserving Heritage Through Art</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join Our Journey
          </h2>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto mb-10">
            Every purchase supports artisans and preserves cultural heritage
          </p>
          <button className="bg-white text-amber-900 hover:bg-amber-50 font-bold px-12 py-5 rounded-xl shadow-2xl hover:shadow-amber-900/50 transition-all duration-300 transform hover:scale-105 border-2 border-amber-200">
            Shop Our Collection
          </button>
        </div>
      </section>
    </div>
  );
}