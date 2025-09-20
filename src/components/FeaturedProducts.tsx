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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg p-12 max-w-2xl mx-auto border">
              <h2 className="text-4xl font-serif text-gray-900 mb-6">
                Featured Products
              </h2>
              <div className="w-24 h-px bg-gray-300 mx-auto mb-8"></div>
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <p className="text-gray-600 text-lg">
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
      <style dangerouslySetInnerHTML={{
  __html: `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-in-up { animation: fadeInUp 0.6s ease-out both; }
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .modern-shadow { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .modern-hover { transition: all 0.4s ease; }
    .modern-hover:hover { transform: translateY(-8px); box-shadow: 0 12px 40px rgba(0,0,0,0.15); }

    .image-wrapper {
      position: relative;
      width: 100%;
      height: 320px;
      overflow: hidden;
      border-radius: 12px 12px 0 0;
      background: #ffffff;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover; /* fill container */
      display: block;
      border-radius: 12px 12px 0 0;
    }

    .overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(135deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.02) 50%, rgba(0,0,0,0.05) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .product-card:hover .overlay { opacity: 1; }
    .wishlist-btn { background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); transition: all 0.3s ease; }
    .wishlist-btn:hover { background: rgba(255,255,255,1); transform: scale(1.1); }
    .wishlist-btn.active { background: rgba(239,68,68,0.95); color: white; }
    .stock-badge { background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); }
    .featured-badge { background: linear-gradient(135deg,#fbbf24,#f59e0b); color:#92400e; font-weight:600; text-shadow:0 1px 2px rgba(0,0,0,0.1); }
  `
}} />
      
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-4xl mx-auto border">
              <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
                Featured Products
              </h2>
              <div className="w-24 h-px bg-gray-300 mx-auto mb-8"></div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                Discover our complete collection of premium products
              </p>
              
              <div className="mt-6 flex flex-col items-center gap-4">
                <p className="text-sm text-gray-500">
                  Showing {featuredProducts?.length || 0} total products
                </p>
                <Button 
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={isRefreshing}
                  className="bg-white hover:bg-gray-50 border-gray-300"
                >
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Products
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product: Product, index: number) => (
                <div
                  key={product._id}
                  className="product-card bg-white rounded-2xl modern-shadow modern-hover overflow-hidden fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image Container */}
                  <div className="relative">
                    <Link to={`/product/${product._id}`}>
                      <div className="image-wrapper">
                        <img
                          src={product.images && product.images.length > 0 
                            ? `http://localhost:5000${product.images[0]}`
                            : 'https://via.placeholder.com/400x300?text=No+Image'
                          }
                          alt={product.name}
                          className="product-image"
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                          }}
                        />
                        <div className="overlay"></div>
                      </div>
                    </Link>
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={() => handleWishlistToggle(product)}
                      className={`wishlist-btn absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center shadow-lg ${
                        isInWishlist(product._id) ? 'active' : ''
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isInWishlist(product._id) ? 'fill-current' : ''
                        }`}
                      />
                    </button>

                    {/* Stock indicator */}
                    <div className="absolute bottom-4 left-4">
                      <span className={`stock-badge text-xs px-3 py-1.5 rounded-full font-medium ${
                        product.inStock 
                          ? 'text-green-700' 
                          : 'text-red-700'
                      }`}>
                        {product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {product.featured && (
                      <div className="absolute top-4 left-4">
                        <span className="featured-badge text-xs px-3 py-1.5 rounded-full shadow-sm">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="text-sm text-blue-600 uppercase tracking-wider font-medium">
                        {product.category}
                      </span>
                    </div>
                    
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-xl font-serif text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer leading-tight">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400">
                        Added {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className={`w-full py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium ${
                        product.inStock
                          ? 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto border">
                <h3 className="text-2xl font-serif text-gray-900 mb-4">
                  No Products Found
                </h3>
                <p className="text-gray-600 mb-6">
                  It looks like there are no products in your database. Add some products to see them here.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={handleRefresh} 
                    disabled={isRefreshing}
                    className="bg-gray-900 hover:bg-gray-800"
                  >
                    {isRefreshing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Refreshing...
                      </>
                    ) : (
                      'Try Again'
                    )}
                  </Button>
                  <Link to="/shop">
                    <Button variant="outline">
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
                <button className="bg-white border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  View All Products
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default FeaturedProducts;