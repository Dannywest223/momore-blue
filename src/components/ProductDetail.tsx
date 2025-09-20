import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { productsAPI } from '@/lib/api';

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

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const response = await productsAPI.getById(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, toast]);

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (!product || !product.inStock) {
      toast({
        title: "Out of Stock",
        description: "This item is currently out of stock",
        variant: "destructive",
      });
      return;
    }

    try {
      const { cartAPI } = await import('@/lib/api');
      await cartAPI.add(product._id, quantity);
      addToCart(product, quantity);
      
      toast({
        title: "Added to Cart",
        description: `${quantity} x ${product.name} added to your cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    if (!product) return;

    try {
      const { wishlistAPI } = await import('@/lib/api');
      
      if (isInWishlist(product._id)) {
        await wishlistAPI.remove(product._id);
        removeFromWishlist(product._id);
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} removed from wishlist`,
        });
      } else {
        await wishlistAPI.add(product._id);
        addToWishlist(product);
        toast({
          title: "Added to Wishlist", 
          description: `${product.name} added to wishlist`,
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    }
  };

  const nextImage = () => {
    if (product?.images?.length && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images?.length && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/shop')} className="bg-primary hover:bg-primary/90">
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="relative aspect-square bg-white">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img
                      src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${product.images[currentImageIndex]}`}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/600x600?text=Image+Error';
                      }}
                    />
                    
                    {/* Navigation Arrows - Only show if more than 1 image */}
                    {product.images.length > 1 && (
                      <>
                        <Button
                          onClick={prevImage}
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <Button
                          onClick={nextImage}
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </Button>
                      </>
                    )}

                    {/* Image Counter */}
                    {product.images.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {product.images.length}
                      </div>
                    )}
                  </>
                ) : (
                  <img
                    src="https://via.placeholder.com/600x600?text=No+Image"
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                )}
              </div>
            </Card>

            {/* Thumbnail Images - Only show if more than 1 image */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? 'border-primary shadow-lg'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${image}`}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain bg-white p-1"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/100x100?text=Error';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <span className="text-sm text-primary font-medium uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                {product.category}
              </span>
              {product.featured && (
                <span className="ml-2 text-sm text-yellow-700 font-medium bg-yellow-100 px-3 py-1 rounded-full">
                  ⭐ Featured
                </span>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(4.0) • 24 reviews</span>
              </div>
            </div>

            <div className="text-4xl font-bold text-foreground">
              ${product.price.toFixed(2)}
            </div>

            <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              product.inStock
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
            </div>

            <div className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <Button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    variant="ghost"
                    size="sm"
                    disabled={!product.inStock}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <Button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    variant="ghost"
                    size="sm"
                    disabled={!product.inStock || quantity >= product.stockQuantity}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>

                <Button
                  onClick={handleWishlistToggle}
                  variant="outline"
                  size="lg"
                  className={`px-6 ${
                    isInWishlist(product._id)
                      ? 'text-red-500 border-red-200 bg-red-50'
                      : 'hover:text-red-500'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isInWishlist(product._id) ? 'fill-current' : ''
                    }`}
                  />
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <p className="font-medium">{product.category}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stock:</span>
                    <p className="font-medium">{product.stockQuantity} units</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Added:</span>
                    <p className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Updated:</span>
                    <p className="font-medium">{new Date(product.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;