import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const WishlistContext = createContext<{
  items: WishlistItem[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
} | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { user } = useAuth();

  // Load wishlist from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedWishlist = localStorage.getItem(`wishlist_${user.id}`);
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          setItems(parsedWishlist);
        } catch (error) {
          console.error('Error loading wishlist from localStorage:', error);
          setItems([]);
        }
      }
    } else {
      // Clear wishlist when user logs out
      setItems([]);
    }
  }, [user]);

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving wishlist to localStorage:', error);
      }
    }
  }, [items, user]);

  const addToWishlist = useCallback((product: any) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    // Ensure the image has the full URL for display
    const productImage = product.images?.[0]
      ? `http://localhost:5000${product.images[0]}`
      : product.image || '/images/fallback.jpg'; // fallback image if none exists

    const wishlistItem: WishlistItem = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: productImage,
      category: product.category,
    };

    setItems(prev => {
      if (prev.find(item => item.id === wishlistItem.id)) {
        toast({
          title: "Already in Wishlist",
          description: `${product.name} is already in your wishlist`,
        });
        return prev;
      }

      const newItems = [...prev, wishlistItem];
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist`,
      });
      return newItems;
    });
  }, [user]);

  const removeFromWishlist = useCallback((id: string) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.id !== id);
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist",
      });
      return newItems;
    });
  }, []);

  const isInWishlist = useCallback((id: string) => {
    return items.some(item => item.id === id);
  }, [items]);

  const clearWishlist = useCallback(() => {
    setItems([]);
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist",
    });
  }, []);

  return (
    <WishlistContext.Provider value={{
      items,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
