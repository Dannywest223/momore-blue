import React, { createContext, useContext, useState, useEffect } from 'react';

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

const ProductContext = createContext<{
  products: Product[];
  featuredProducts: Product[];
  loading: boolean;
  searchResults: Product[];
  fetchProducts: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  clearSearch: () => void;
} | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      console.log('All products fetched:', data);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      console.log('Fetching featured products...');
      // Use the correct endpoint from your router
      const response = await fetch('http://localhost:5000/api/products/featured/list');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Featured products API response:', data);
      
      // The /featured/list endpoint returns products directly, not wrapped in data.products
      setFeaturedProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setFeaturedProducts([]);
      
      // Fallback: try to get featured products from regular endpoint
      try {
        console.log('Trying fallback method for featured products...');
        const response = await fetch('http://localhost:5000/api/products?featured=true');
        const data = await response.json();
        console.log('Fallback featured products:', data);
        setFeaturedProducts(data.products || []);
      } catch (fallbackError) {
        console.error('Fallback method also failed:', fallbackError);
      }
    }
  };

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products?search=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data.products || []);
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
  };

  useEffect(() => {
    const initializeProducts = async () => {
      await fetchProducts();
      await fetchFeaturedProducts();
    };
    
    initializeProducts();

    // Set up real-time updates if socket.io is available
    let socket: any = null;
    
    try {
      // Check if socket.io is loaded
      if (typeof window !== 'undefined' && (window as any).io) {
        socket = (window as any).io();
        
        socket.on('productAdded', (newProduct: Product) => {
          console.log('New product added via socket:', newProduct);
          setProducts(prev => [newProduct, ...prev]);
          
          // If the new product is featured, add it to featured products
          if (newProduct.featured) {
            setFeaturedProducts(prev => [newProduct, ...prev]);
          }
        });

        socket.on('productUpdated', (updatedProduct: Product) => {
          console.log('Product updated via socket:', updatedProduct);
          setProducts(prev => 
            prev.map(p => p._id === updatedProduct._id ? updatedProduct : p)
          );
          
          setFeaturedProducts(prev => {
            if (updatedProduct.featured) {
              // Add to featured if it's now featured and not already there
              const exists = prev.some(p => p._id === updatedProduct._id);
              if (!exists) {
                return [updatedProduct, ...prev];
              }
              return prev.map(p => p._id === updatedProduct._id ? updatedProduct : p);
            } else {
              // Remove from featured if no longer featured
              return prev.filter(p => p._id !== updatedProduct._id);
            }
          });
        });

        socket.on('productDeleted', (productId: string) => {
          console.log('Product deleted via socket:', productId);
          setProducts(prev => prev.filter(p => p._id !== productId));
          setFeaturedProducts(prev => prev.filter(p => p._id !== productId));
        });

        console.log('Socket.IO connected for real-time updates');
      } else {
        console.log('Socket.IO not available - using manual refresh only');
      }
    } catch (error) {
      console.log('Socket.IO setup failed, continuing without real-time updates:', error);
    }

    // Cleanup function
    return () => {
      if (socket) {
        try {
          socket.disconnect();
          console.log('Socket.IO disconnected');
        } catch (error) {
          console.log('Error disconnecting socket:', error);
        }
      }
    };
  }, []);

  return (
    <ProductContext.Provider value={{
      products,
      featuredProducts,
      loading,
      searchResults,
      fetchProducts,
      fetchFeaturedProducts,
      searchProducts,
      clearSearch,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}