import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollContainerRef = useRef(null);
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

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoScrolling || !scrollContainerRef.current || products.length === 0) return;

    const scrollContainer = scrollContainerRef.current;
    let scrollPosition = 0;
    const scrollSpeed = 1; // pixels per frame
    const scrollDelay = 3000; // delay at start/end in ms

    let animationId;
    let isWaiting = false;

    const autoScroll = () => {
      if (isWaiting) return;

      scrollPosition += scrollSpeed;
      
      // Check if we've reached the end
      if (scrollPosition >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        isWaiting = true;
        setTimeout(() => {
          scrollPosition = 0;
          scrollContainer.scrollLeft = 0;
          isWaiting = false;
        }, scrollDelay);
      } else {
        scrollContainer.scrollLeft = scrollPosition;
      }

      animationId = requestAnimationFrame(autoScroll);
    };

    // Start after initial delay
    const initialTimeout = setTimeout(() => {
      animationId = requestAnimationFrame(autoScroll);
    }, scrollDelay);

    return () => {
      clearTimeout(initialTimeout);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isAutoScrolling, products]);

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

  const handleManualScroll = () => {
    setIsAutoScrolling(false);
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
      setIsAutoScrolling(false);
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
      setIsAutoScrolling(false);
    }
  };

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

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 1s ease-out forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        .golden-line {
          background: linear-gradient(90deg, transparent, #d97706, #b45309, #d97706, transparent);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        .text-shadow-soft {
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
        }

        .product-card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .product-card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(217, 119, 6, 0.2);
        }

        .horizontal-scroll {
          scrollbar-width: thin;
          scrollbar-color: #d97706 #fef3c7;
        }

        .horizontal-scroll::-webkit-scrollbar {
          height: 8px;
        }

        .horizontal-scroll::-webkit-scrollbar-track {
          background: #fef3c7;
          border-radius: 10px;
        }

        .horizontal-scroll::-webkit-scrollbar-thumb {
          background: #d97706;
          border-radius: 10px;
        }

        .horizontal-scroll::-webkit-scrollbar-thumb:hover {
          background: #b45309;
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
                Premium Collection
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-shadow-soft">
              Shop Collection
            </h1>
            <p className="text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto animate-slide-up leading-relaxed">
              Discover our curated selection of handcrafted African treasures
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

      {/* Filters and Search */}
      <section className="py-8 bg-white/50 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-40 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1 max-w-md animate-slide-in-left">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-700 h-5 w-5" />
                <Input
                  placeholder="Search for treasures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-2 border-amber-200 focus:border-amber-500 bg-white rounded-xl shadow-sm focus:shadow-md transition-all"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-56 h-12 border-2 border-amber-200 focus:border-amber-500 bg-white rounded-xl shadow-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="border-amber-200">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="cursor-pointer hover:bg-amber-50">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-56 h-12 border-2 border-amber-200 focus:border-amber-500 bg-white rounded-xl shadow-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="border-amber-200">
                <SelectItem value="featured" className="cursor-pointer hover:bg-amber-50">Featured</SelectItem>
                <SelectItem value="price-low" className="cursor-pointer hover:bg-amber-50">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="cursor-pointer hover:bg-amber-50">Price: High to Low</SelectItem>
                <SelectItem value="name" className="cursor-pointer hover:bg-amber-50">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Products Horizontal Sliding Section */}
      <section className="py-16 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-600"></div>
              <p className="text-xl text-amber-900 mt-6 font-semibold">Loading our collection...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              {/* Auto-Scroll Toggle */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 bg-clip-text text-transparent">
                  Featured Products
                </h2>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAutoScrolling}
                      onChange={(e) => setIsAutoScrolling(e.target.checked)}
                      className="w-5 h-5 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-amber-900">Auto-scroll</span>
                  </label>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleScrollLeft}
                      className="bg-amber-600 hover:bg-amber-700 text-white rounded-full h-10 w-10 p-0 shadow-lg"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={handleScrollRight}
                      className="bg-amber-600 hover:bg-amber-700 text-white rounded-full h-10 w-10 p-0 shadow-lg"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Horizontal Scrolling Container */}
              <div
                ref={scrollContainerRef}
                onMouseEnter={handleManualScroll}
                onTouchStart={handleManualScroll}
                className="flex gap-6 overflow-x-auto pb-6 horizontal-scroll scroll-smooth"
                style={{ scrollbarWidth: 'thin' }}
              >
                {products.map((product, index) => (
                  <Card
                    key={product._id}
                    className="product-card-hover group border-0 shadow-lg overflow-hidden bg-white rounded-2xl flex-shrink-0 w-64 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative overflow-hidden h-72 bg-gray-50">
                      <Link to={`/product/${product._id}`} className="block h-full">
                        <img
                          src={
                            product.images && product.images.length > 0
                              ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${product.images[0]}`
                              : 'https://via.placeholder.com/256x288?text=No+Image'
                          }
                          alt={product.name}
                          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/256x288?text=Image+Error';
                          }}
                        />
                      </Link>

                      {/* Wishlist Button */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-white/95 text-amber-700 hover:bg-white hover:text-red-600 shadow-lg rounded-full h-12 w-12"
                          onClick={() => handleAddToWishlist(product._id)}
                        >
                          <Heart className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          {product.category}
                        </span>
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Add to Cart Button */}
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <Button 
                          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-xl h-12 rounded-xl font-bold"
                          onClick={() => handleAddToCart(product._id)}
                        >
                          <ShoppingBag className="h-5 w-5 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <Link to={`/product/${product._id}`}>
                        <h3 className="text-lg font-bold text-stone-800 mb-3 group-hover:text-amber-700 transition-colors line-clamp-2 min-h-[3.5rem]">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
                          ${product.price}
                        </p>
                        {product.stock && (
                          <span className="text-xs text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto border-4 border-amber-100">
                <p className="text-2xl font-bold text-amber-900 mb-4">No Products Found</p>
                <p className="text-stone-600">Try adjusting your search or filter criteria</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg text-amber-100 max-w-2xl mx-auto mb-8">
            Contact us for custom orders and special requests
          </p>
          <Button className="bg-white text-amber-900 hover:bg-amber-50 font-bold px-10 py-6 rounded-xl shadow-2xl hover:shadow-amber-900/50 transition-all duration-300 transform hover:scale-105 border-2 border-amber-200 text-lg">
            Contact Us
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Shop;