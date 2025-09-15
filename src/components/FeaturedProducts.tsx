import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import img1 from "@/assets/1.jpeg";
import img2 from "@/assets/2.jpeg";
import img3 from "@/assets/3.jpeg";
import img4 from "@/assets/4.jpeg";
import img5 from "@/assets/5.jpeg";
import img6 from "@/assets/6.jpeg";



const featuredProducts = [
  {
    id: 1,
    name: "Ankara Maxi Dress",
    price: 89.99,
    image: img1,
    category: "Clothing",
    description: "Handmade with authentic African print fabric",
  },
  {
    id: 2,
    name: "Leather & Print Tote",
    price: 65.50,
    image: img2,
    category: "Bags & Accessories",
    description: "Handcrafted bag with African print details",
  },
  {
    id: 3,
    name: "Cultural Art Piece",
    price: 120.00,
    image: img3,
    category: "Art & Decor",
    description: "Hand-painted artwork celebrating African heritage",
  },
  {
    id: 4,
    name: "Beaded Necklace Set",
    price: 45.00,
    image: img4,
    category: "Jewelry",
    description: "Handmade jewelry with traditional African beads",
  },
  {
    id: 5,
    name: "Kente Print Shirt",
    price: 75.00,
    image: img5,
    category: "Clothing",
    description: "Traditional Kente print with modern tailoring",
  },
  {
    id: 6,
    name: "Woven Basket Set",
    price: 55.00,
    image: img6,
    category: "Homeware",
    description: "Handwoven baskets by skilled African artisans",
  },
];


const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Featured Products
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated selection of premium products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="card-hover group border-0 shadow-medium overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/90 text-primary hover:bg-white hover:text-primary mb-2"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <Button className="w-full bg-white text-primary hover:bg-white/90">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-sm text-accent font-medium mb-2">{product.category}</p>
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-2xl font-bold text-primary">${product.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="btn-hero-primary">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;