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
    <section className="py-20 bg-background overflow-hidden"> {/* ✅ added overflow-hidden */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Shop By Category
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse collection of authentic African craftsmanship
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Card
              key={category.name}
              className="card-hover group border-0 shadow-medium overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden w-full h-64">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {category.description}
                </p>
                <Button className="w-full btn-hero-primary">Explore</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
