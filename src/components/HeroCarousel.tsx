import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    image: "https://plus.unsplash.com/premium_photo-1664202526047-405824c633e7?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Cultural Elegance, Crafted for You",
    subtitle: "Discover our unique collection of handmade African print products and accessories that celebrate African culture through premium craftsmanship",
    primaryButton: "Shop Now",
    primaryLink: "/shop",
    secondaryButton: "Learn More",
    secondaryLink: "/about",
  },
  {
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Authentic African Fashion",
    subtitle: "Handcrafted clothing and accessories that blend traditional techniques with contemporary design",
    primaryButton: "Shop Clothing",
    primaryLink: "/shop",
    secondaryButton: "View Collection",
    secondaryLink: "/shop",
  },
  {
    image: "https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Heritage & Style",
    subtitle: "Every piece tells a story and supports skilled artisans across Africa while preserving cultural craftsmanship",
    primaryButton: "Shop Now",
    primaryLink: "/shop",
    secondaryButton: "Our Story",
    secondaryLink: "/about",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-stone-900">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeInUp 1s ease-out;
        }
        .hero-text-shadow {
          text-shadow: 0 4px 16px rgba(0, 0, 0, 0.8), 0 2px 6px rgba(0, 0, 0, 0.6);
        }
      `}</style>

      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          
          {/* Premium Brown Gradient Overlay */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'linear-gradient(120deg, rgba(78, 35, 16, 0.95) 0%, rgba(120, 53, 15, 0.90) 30%, rgba(146, 64, 14, 0.85) 60%, rgba(180, 83, 9, 0.75) 100%)'
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl animate-fade-in">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight hero-text-shadow">
                  {slide.title}
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-amber-50 mb-6 sm:mb-8 leading-relaxed hero-text-shadow">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button 
                    onClick={() => handleNavigate(slide.primaryLink)}
                    className="bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-lg shadow-2xl hover:shadow-amber-900/60 transform hover:scale-105 transition-all duration-300 border-2 border-amber-600/30"
                  >
                    {slide.primaryButton}
                  </button>
                  <button 
                    onClick={() => handleNavigate(slide.secondaryLink)}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-lg border-2 border-white/40 hover:border-white/60 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    {slide.secondaryButton}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-amber-900/40 hover:border-amber-600 h-10 w-10 sm:h-14 sm:w-14 rounded-full backdrop-blur-sm border-2 border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5 sm:h-7 sm:w-7" />
      </button>
      <button
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-amber-900/40 hover:border-amber-600 h-10 w-10 sm:h-14 sm:w-14 rounded-full backdrop-blur-sm border-2 border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5 sm:h-7 sm:w-7" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex space-x-2 sm:space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "w-8 sm:w-10 bg-gradient-to-r from-amber-400 to-amber-600 shadow-lg shadow-amber-500/50" 
                  : "w-2 sm:w-3 bg-white/60 hover:bg-amber-400/80 backdrop-blur-sm"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}