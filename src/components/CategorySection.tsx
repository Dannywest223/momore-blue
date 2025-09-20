import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import clothingImg from "@/assets/99.jpg";
import homewareImg from "@/assets/98.jpg";

const categories = [
  {
    name: "Clothing",
    image: clothingImg,
    description: "Authentic African print dresses, shirts, and traditional wear",
  },
  {
    name: "Bags & Accessories",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Handcrafted bags, jewelry, and accessories with cultural flair",
  },
  {
    name: "Homeware",
    image: homewareImg,
    description: "Beautiful home decor and functional items for modern living",
  },
  {
    name: "Art & Decor",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    description: "Hand-painted artwork and cultural pieces for your space",
  },
];

const CategorySection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-background via-background/95 to-muted/20 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary),0.05)_0%,transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--primary),0.03)_0%,transparent_50%)] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-primary/70 uppercase tracking-wider bg-primary/10 px-4 py-2 rounded-full">
              Categories
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Shop By Category
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore our diverse collection of authentic African craftsmanship and modern elegance
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <Card
              key={category.name}
              className="group border-2 border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl hover:border-primary/30 transition-all duration-500 overflow-hidden bg-white dark:bg-gray-900/80 backdrop-blur-sm hover:scale-[1.02] animate-fade-in-up rounded-2xl"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Image Container - Full Size Display */}
              <div className="relative overflow-hidden w-full h-96 lg:h-80 xl:h-96">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-500"></div>
                
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'center',
                    backgroundColor: '#f8f9fa'
                  }}
                />
                
                {/* Overlay Content */}
                <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                  <div className="transform transition-all duration-500 group-hover:translate-y-[-4px]">
                    <h3 className="text-2xl lg:text-2xl font-bold text-white mb-2 drop-shadow-lg">
                      {category.name}
                    </h3>
                    <div className="w-12 h-1 bg-primary group-hover:w-20 group-hover:bg-white transition-all duration-500 rounded-full"></div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-15"></div>
              </div>

              {/* Card Content */}
              <CardContent className="p-6 lg:p-7 relative bg-white dark:bg-gray-900/50">
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed text-sm lg:text-base line-clamp-3 group-hover:text-foreground/80 transition-colors duration-300">
                    {category.description}
                  </p>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:translate-y-[-2px] group-hover:from-primary/80 group-hover:to-primary/60"
                  >
                    Explore Collection
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"></div>
                  </Button>
                </div>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-muted-foreground mb-6 text-lg">
            Can't find what you're looking for?
          </p>
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary/30 text-primary hover:bg-primary hover:text-white transition-all duration-300 px-8 py-3 font-semibold hover:scale-105 hover:shadow-lg"
          >
            View All Products
          </Button>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
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
          animation: fade-in 1s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default CategorySection;