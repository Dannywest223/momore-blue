import { useState, useEffect } from "react";
import { Heart, ShoppingBag, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { productsAPI } from "@/lib/api"; // Direct API import

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  featured: boolean;
  stockQuantity: number;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

// Image Carousel Component
const ImageCarousel = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }
  }, [images.length]);

  if (!images || images.length === 0) {
    return (
      <img
        src="https://via.placeholder.com/400x300?text=No+Image"
        alt={productName}
        className="w-full h-full object-contain transition-transform duration-300"
        loading="lazy"
      />
    );
  }

  if (images.length === 1) {
    return (
      <img
        src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${images[0]}`}
        alt={productName}
        className="w-full h-full object-contain transition-transform duration-300"
        loading="lazy"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
        }}
      />
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {images.map((image, index) => (
        <img
          key={index}
          src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${image}`}
          alt={`${productName} ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ${
            index === currentIndex 
              ? 'opacity-100 transform scale-100' 
              : 'opacity-0 transform scale-95'
          }`}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
          }}
        />
      ))}
      
      {/* Image indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white shadow-lg' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  // Fetch all products (both featured and non-featured)
  const fetchFeaturedProducts = async () => {
    try {
      const allProductsResponse = await productsAPI.getAll();
      const allProducts = allProductsResponse.data.products || allProductsResponse.data;
      setFeaturedProducts(allProducts);
      
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      setLoading(true);
      await fetchFeaturedProducts();
      toast({
        title: "Refreshed",
        description: "Featured products have been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh products",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (!product.inStock) {
      toast({
        title: "Out of Stock",
        description: "This item is currently out of stock",
        variant: "destructive",
      });
      return;
    }

    try {
      // Make direct API call to backend first
      const { cartAPI } = await import('@/lib/api');
      await cartAPI.add(product._id, 1);
      
      // Then update local context
      addToCart(product);
      
      toast({
        title: "Added to Cart",
        description: `${product.name} added to your cart successfully`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWishlistToggle = async (product: Product) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      const { wishlistAPI } = await import('@/lib/api');
      
      if (isInWishlist(product._id)) {
        // Make API call first, then update context
        await wishlistAPI.remove(product._id);
        removeFromWishlist(product._id);
        
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} removed from wishlist`,
        });
      } else {
        // Make API call first, then update context  
        await wishlistAPI.add(product._id);
        addToWishlist(product);
        
        toast({
          title: "Added to Wishlist", 
          description: `${product.name} added to wishlist successfully`,
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadFeaturedProducts = async () => {
      if (isMounted) {
        await fetchFeaturedProducts();
      }
    };
    
    loadFeaturedProducts();
    
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-background via-background/95 to-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-12 max-w-2xl mx-auto border border-primary/10">
              <h2 className="text-4xl font-bold mb-6" style={{ 
                background: 'linear-gradient(120deg, rgba(78, 35, 16, 0.95) 0%, rgba(120, 53, 15, 0.90) 30%, rgba(146, 64, 14, 0.85) 60%, rgba(180, 83, 9, 0.75) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Featured Products
              </h2>
              <div className="w-24 h-1 mx-auto mb-8 rounded-full" style={{ background: 'linear-gradient(120deg, rgba(78, 35, 16, 0.95) 0%, rgba(120, 53, 15, 0.90) 30%, rgba(146, 64, 14, 0.85) 60%, rgba(180, 83, 9, 0.75) 100%)' }}></div>
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" style={{ color: 'rgba(146, 64, 14, 0.85)' }} />
                <p className="text-muted-foreground text-lg">
                  Loading our featured products...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Lightweight CSS */}
      <style>{`
        .product-fade-in { animation: fadeIn 0.6s ease-out both; }
        .product-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .product-hover:hover { transform: translateY(-4px); }
        .product-image-container { 
          position: relative; 
          width: 100%; 
          height: 280px; 
          overflow: hidden; 
          border-radius: 16px 16px 0 0;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      
      <section className="py-20 bg-gradient-to-br from-background via-background/95 to-muted/10 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(var(--primary),0.03)_0%,transparent_50%)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Elegant Header */}
          <div className="text-center mb-16">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 sm:p-12 max-w-4xl mx-auto border border-primary/10">
              <div className="inline-block mb-4">
                <span className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider px-3 sm:px-4 py-1.5 sm:py-2 rounded-full" style={{ background: 'linear-gradient(120deg, rgba(78, 35, 16, 0.95) 0%, rgba(120, 53, 15, 0.90) 30%, rgba(146, 64, 14, 0.85) 60%, rgba(180, 83, 9, 0.75) 100%)' }}>
                  Premium Collection
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6" style={{ 
                background: 'linear-gradient(120deg, rgba(78, 35, 16, 0.95) 0%, rgba(120, 53, 15, 0.90) 30%, rgba(146, 64, 14, 0.85) 60%, rgba(180, 83, 9, 0.75) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Featured Products
              </h2>
              <div className="w-24 h-1 mx-auto mb-8 rounded-full" style={{ background: 'linear-gradient(120deg, rgba(78, 35, 16, 0.95) 0%, rgba(120, 53, 15, 0.90) 30%, rgba(146, 64, 14, 0.85) 60%, rgba(180, 83, 9, 0.75) 100%)' }}></div>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Discover our complete collection of premium products, carefully curated for excellence
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <p className="text-xs sm:text-sm text-muted-foreground/70">
                  Showing {featuredProducts?.length || 0} total products
                </p>
                <Button 
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={isRefreshing}
                  className="border-[#92400e] text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 hover:text-white transition-all duration-300"
                  style={{ 
                    borderColor: 'rgba(146, 64, 14, 0.5)',
                    background: isRefreshing ? 'transparent' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(120deg, rgba(78, 35, 16, 0.95) 0%, rgba(120, 53, 15, 0.90) 30%, rgba(146, 64, 14, 0.85) 60%, rgba(180, 83, 9, 0.75) 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                      <span className="hidden sm:inline">Refreshing...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Refresh Products</span>
                      <span className="sm:hidden">Refresh</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Optimized Products Grid */}
          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {featuredProducts.map((product: Product, index: number) => (
                <Card
                  key={product._id}
                  className="product-card bg-white dark:bg-gray-900 border-0 shadow-lg hover:shadow-2xl product-hover overflow-hidden rounded-2xl product-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Optimized Image Container with Carousel - NO BLUR */}
                  <div className="product-image-container bg-gray-50">
                    <Link to={`/product/${product._id}`} className="block h-full">
                      <ImageCarousel images={product.images} productName={product.name} />
                    </Link>
                    
                    {/* Wishlist Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleWishlistToggle(product)}
                      className={`absolute top-3 right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-300 hover:scale-110 ${
                        isInWishlist(product._id) ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:text-red-500'
                      }`}
                    >
                      <Heart
                        className={`w-3 h-3 sm:w-4 sm:h-4 transition-all ${
                          isInWishlist(product._id) ? 'fill-current scale-110' : ''
                        }`}
                      />
                    </Button>

                    {/* Stock Badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className={`text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium shadow-md ${
                        product.inStock 
                          ? 'bg-green-100/90 text-green-700' 
                          : 'bg-red-100/90 text-red-700'
                      }`}>
                        {product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {product.featured && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-semibold shadow-md">
                          ⭐ Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wider px-2 py-1 rounded-md text-white" style={{ background: 'linear-gradient(120deg, rgba(78, 35, 16, 0.95) 0%, rgba(120, 53, 15, 0.90) 30%, rgba(146, 64, 14, 0.85) 60%, rgba(180, 83, 9, 0.75) 100%)' }}>
                        {product.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-base sm:text-lg font-bold text-foreground transition-colors cursor-pointer leading-tight line-clamp-2" 
                          style={{ color: 'inherit' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(120deg, rgba(78, 35, 16, 0.95) 0%, rgba(120, 53, 15, 0.90) 30%, rgba(146, 64, 14, 0.85) 60%, rgba(180, 83, 9, 0.75) 100%)'; e.currentTarget.style.webkitBackgroundClip = 'text'; e.currentTarget.style.webkitTextFillColor = 'transparent'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.webkitTextFillColor = 'inherit'; }}>
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl sm:text-2xl font-bold text-foreground">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className={`w-full transition-all duration-300 text-xs sm:text-sm py-2 sm:py-2.5 ${
                        product.inStock
                          ? 'text-white shadow-md hover:shadow-lg hover:scale-[1.02]'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      style={product.inStock ? { 
                        background: 'linear-gradient(120deg, rgba(78, 35, 16, 0.95) 0%, rgba(120, 53, 15, 0.90) 30%, rgba(146, 64, 14, 0.85) 60%, rgba(180, 83, 9, 0.75) 100%)'
                      } : {}}
                    >
                      <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 sm:p-12 max-w-2xl mx-auto border border-primary/10">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                  No Products Found
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-6">
                  It looks like there are no products in your database. Add some products to see them here.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleRefresh} 
                    disabled={isRefreshing}
                    className="text-white text-xs sm:text-sm px-4 sm:px-6 py-2"
                    style={{ background: 'linear-gradient(120deg, rgba(78, 35, 16, 0.95) 0%, rgba(120, 53, 15, 0.90) 30%, rgba(146, 64, 14, 0.85) 60%, rgba(180, 83, 9, 0.75) 100%)' }}
                  >
                    {isRefreshing ? (
                      <>
                        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                        <span className="hidden sm:inline">Refreshing...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      'Try Again'
                    )}
                  </Button>
                  <Link to="/shop">
                    <Button variant="outline" className="border-[#92400e] hover:text-white text-xs sm:text-sm px-4 sm:px-6 py-2 w-full sm:w-auto"
                            style={{ borderColor: 'rgba(146, 64, 14, 0.5)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(120deg, rgba(78, 35, 16, 0.95) 0%, rgba(120, 53, 15, 0.90) 30%, rgba(146, 64, 14, 0.85) 60%, rgba(180, 83, 9, 0.75) 100%)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                      View Shop Page
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* View All Button */}
          {featuredProducts && featuredProducts.length > 0 && (
            <div className="text-center mt-16">
              <Link to="/shop">
                <Button 
                  size="lg"
                  className="text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold text-sm sm:text-base"
                  style={{ background: 'linear-gradient(120deg, rgba(78, 35, 16, 0.95) 0%, rgba(120, 53, 15, 0.90) 30%, rgba(146, 64, 14, 0.85) 60%, rgba(180, 83, 9, 0.75) 100%)' }}
                >
                  View All Products
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default FeaturedProducts;