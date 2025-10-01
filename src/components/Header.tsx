import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, Heart, ShoppingBag, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoImage from "@/assets/logo.jpg";
import { productsAPI } from "@/lib/api";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(5);
  const [user] = useState(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const navigationLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Handle search
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await productsAPI.getAll();
      const allProducts = response.data.products || response.data;
      
      // Filter products based on search query
      const filtered = allProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  // Prevent body scroll when search is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSearchOpen]);

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .search-overlay {
          backdrop-filter: blur(8px);
        }
      `}</style>

      {/* Premium Top Banner */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-black via-zinc-950 to-black text-gray-300 text-center py-2 text-xs md:text-sm z-[10000] border-b border-zinc-900/50 shadow-xl">
        <div className="container mx-auto px-4 font-medium">
          <span className="hidden md:inline">Free shipping on orders over $50 | </span>
          <span>Contact: info@momore.com</span>
          <span className="hidden sm:inline"> | +250 788 123 456</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="fixed top-[36px] left-0 right-0 bg-gradient-to-b from-black via-zinc-950 to-black border-b border-zinc-900/50 shadow-2xl z-[9999]">
        <nav className="container mx-auto px-4 py-1.5">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <a 
              href="/" 
              className="flex items-center gap-2 group transition-all duration-300 ml-4 sm:ml-6 md:ml-8"
            >
              <img
                src={logoImage}
                alt="MOMORE Logo"
                className="h-24 w-24 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 object-contain transition-all duration-500 group-hover:scale-105 drop-shadow-2xl"
              />
              
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-none">
                  MOMORE
                </h1>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">Premium Fashion</p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navigationLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="font-medium text-sm text-gray-300 hover:text-white transition-all duration-200 relative group/link"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover/link:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-1">
              <button 
                className="text-gray-300 hover:text-white hover:bg-neutral-700/50 transition-all duration-200 p-2 rounded-lg"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </button>

              <a 
                href="/wishlist"
                className="text-gray-300 hover:text-white hover:bg-neutral-700/50 transition-all duration-200 relative p-2 rounded-lg"
              >
                <Heart className="h-4 w-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full h-4 w-4 flex items-center justify-center shadow-lg font-bold text-[10px]">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </a>

              <a 
                href="/cart"
                className="text-gray-300 hover:text-white hover:bg-neutral-700/50 transition-all duration-200 relative p-2 rounded-lg"
              >
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full h-4 w-4 flex items-center justify-center shadow-lg font-bold text-[10px]">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </a>

              {user ? (
                <button className="text-gray-300 hover:text-white hover:bg-neutral-700/50 transition-all duration-200 p-2 rounded-lg">
                  <User className="h-4 w-4" />
                </button>
              ) : (
                <a 
                  href="/admin"
                  className="text-black hover:bg-gray-100 font-semibold px-4 py-1.5 rounded-lg shadow-lg transition-all duration-300 text-sm ml-2"
                  style={{ background: 'linear-gradient(120deg, rgba(78, 35, 16, 0.95) 0%, rgba(120, 53, 15, 0.90) 30%, rgba(146, 64, 14, 0.85) 60%, rgba(180, 83, 9, 0.75) 100%)' }}
                >
                  <span className="text-white">Login</span>
                </a>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-300 hover:bg-neutral-700/50 transition-all duration-200 p-2 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-3 pb-3 border-t border-neutral-700/50 animate-slide-down">
              <div className="flex flex-col space-y-2 pt-3">
                {navigationLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    className="font-medium text-sm text-gray-300 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-neutral-700/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                
                <div className="flex items-center justify-around pt-3 border-t border-neutral-700/50">
                  <button 
                    className="text-gray-300 hover:text-white hover:bg-neutral-700/50 p-2 rounded-lg"
                    onClick={() => {
                      setIsSearchOpen(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  
                  <a 
                    href="/wishlist"
                    className="text-gray-300 hover:text-white hover:bg-neutral-700/50 relative p-2 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="h-5 w-5" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px]">
                        {wishlistCount}
                      </span>
                    )}
                  </a>
                  
                  <a 
                    href="/cart"
                    className="text-gray-300 hover:text-white hover:bg-neutral-700/50 relative p-2 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px]">
                        {cartCount}
                      </span>
                    )}
                  </a>
                  
                  {!user && (
                    <a 
                      href="/admin"
                      className="text-white font-semibold px-4 py-2 rounded-lg shadow-lg text-sm"
                      style={{ background: 'linear-gradient(120deg, rgba(78, 35, 16, 0.95) 0%, rgba(120, 53, 15, 0.90) 30%, rgba(146, 64, 14, 0.85) 60%, rgba(180, 83, 9, 0.75) 100%)' }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/70 search-overlay z-[10001] animate-fade-in">
          <div className="container mx-auto px-4 pt-32 sm:pt-40" ref={searchRef}>
            {/* Search Box */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Search for products, categories..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="flex-1 outline-none text-gray-900 dark:text-white bg-transparent text-lg"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {isSearching ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'rgba(146, 64, 14, 0.85)' }}></div>
                    </div>
                  ) : searchQuery.trim().length < 2 ? (
                    <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Type at least 2 characters to search</p>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      <p className="text-sm">No products found for "{searchQuery}"</p>
                      <p className="text-xs mt-2">Try searching with different keywords</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {searchResults.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => handleProductClick(product._id)}
                          className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                        >
                          <div className="w-16 h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${product.images[0]}`}
                                alt={product.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ShoppingBag className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                              {product.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {product.category}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-bold text-sm" style={{ 
                                background: 'linear-gradient(120deg, rgba(78, 35, 16, 0.95) 0%, rgba(120, 53, 15, 0.90) 30%, rgba(146, 64, 14, 0.85) 60%, rgba(180, 83, 9, 0.75) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                              }}>
                                ${product.price.toFixed(2)}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                product.inStock 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {searchResults.length > 0 && (
                  <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-[120px] sm:h-[110px] md:h-[120px] lg:h-[130px]"></div>
    </>
  );
}