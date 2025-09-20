import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { wishlistAPI, cartAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const response = await wishlistAPI.get();
      setWishlistItems(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await wishlistAPI.remove(productId);
      setWishlistItems(response.data);
      toast({
        title: "Removed from Wishlist",
        description: "Item removed from your wishlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  const addToCart = async (productId: string) => {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-4">
            Please Login
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">You need to login to view your wishlist</p>
          <Button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" asChild>
            <Link to="/admin">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-slate-600 dark:text-slate-400">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-2 rounded-full mb-6">
            <Heart className="h-5 w-5" />
            <span className="font-medium">My Wishlist</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-4">
            Saved Items
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} waiting for you
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 p-8 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <Heart className="h-16 w-16 text-pink-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Your wishlist is empty</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg max-w-md mx-auto">
              Discover amazing products and save your favorites for later
            </p>
            <Button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" asChild>
              <Link to="/shop">Explore Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((product, index) => (
              <Card
                key={product._id}
                className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={`http://localhost:5000${product.images[0]}`}
                      alt={product.name}
                      className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110"
                    />
                  </Link>
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Remove button */}
                  <div className="absolute top-4 right-4">
                    <Button
                      size="icon"
                      className="bg-white/90 hover:bg-white text-rose-500 hover:text-rose-600 rounded-full shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110"
                      onClick={() => removeFromWishlist(product._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Rating badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-slate-700">4.8</span>
                    </div>
                  </div>
                  
                  {/* Add to cart button - appears on hover */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <Button 
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-full shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105"
                      onClick={() => addToCart(product._id)}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-3">
                    <span className="inline-block bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 text-pink-700 dark:text-pink-300 px-3 py-1 rounded-full text-sm font-medium">
                      {product.category}
                    </span>
                  </div>
                  
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      ${product.price}
                    </p>
                    <Heart className="h-5 w-5 text-pink-500 fill-current" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;