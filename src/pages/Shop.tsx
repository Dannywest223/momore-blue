import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productsAPI, cartAPI, wishlistAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { useToast } from "@/hooks/use-toast";

const categories = ["All Categories", "Clothing", "Bags & Accessories", "Homeware", "Art & Decor", "Beauty Products", "Jewelry"];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("featured");
  const { user } = useAuth();
  const { socket } = useSocket();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm, sortBy]);

  useEffect(() => {
    if (socket) {
      socket.on('productAdded', (product) => {
        setProducts(prev => [product, ...prev]);
      });

      socket.on('productUpdated', (product) => {
        setProducts(prev => 
          prev.map(p => p._id === product._id ? product : p)
        );
      });

      socket.on('productDeleted', (productId) => {
        setProducts(prev => prev.filter(p => p._id !== productId));
      });

      return () => {
        socket.off('productAdded');
        socket.off('productUpdated');
        socket.off('productDeleted');
      };
    }
  }, [socket]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        category: selectedCategory !== "All Categories" ? selectedCategory : undefined,
        search: searchTerm || undefined,
      };
      
      const response = await productsAPI.getAll(params);
      let fetchedProducts = response.data.products;

      // Sort products
      if (sortBy === 'price-low') {
        fetchedProducts.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        fetchedProducts.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'name') {
        fetchedProducts.sort((a, b) => a.name.localeCompare(b.name));
      }

      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      await cartAPI.add(productId, 1);
      toast({
        title: "Added to Cart",
        description: "Product added to your cart successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      await wishlistAPI.add(productId);
      toast({
        title: "Added to Wishlist",
        description: "Product added to your wishlist successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to wishlist",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Shop Collection
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto animate-slide-up">
            Discover our curated selection of premium products
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, index) => (
              <Card
                key={product._id}
                className="card-hover group border-0 shadow-medium overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                <Link to={`/product/${product._id}`}>
  <img
    src={
      product.images && product.images.length > 0
        ? `${import.meta.env.VITE_API_URL}${product.images[0]}`
        : 'https://via.placeholder.com/400x300?text=No+Image'
    }
    alt={product.name}
    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.target as HTMLImageElement;
      target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
    }}
  />
</Link>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/90 text-primary hover:bg-white hover:text-primary mb-2"
                      onClick={() => handleAddToWishlist(product._id)}
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <Button 
                      className="w-full bg-white text-primary hover:bg-white/90"
                      onClick={() => handleAddToCart(product._id)}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-sm text-accent font-medium mb-2">{product.category}</p>
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xl font-bold text-primary">${product.price}</p>
                </CardContent>
              </Card>
            ))}
            </div>
          )}
          
          {!loading && products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;