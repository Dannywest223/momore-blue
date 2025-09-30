import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, Heart, ShoppingBag, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import SearchModal from "./SearchModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoImage from "../assets/logo.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { state: cartState } = useCart();
  const { items: wishlistItems } = useWishlist();

  const isActive = (path: string) => location.pathname === path;

  const navigationLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      {/* Top Banner - Fixed Position */}
      <div className="fixed top-0 left-0 right-0 bg-black text-white text-center py-2 text-sm z-[10000]">
        <div className="container mx-auto px-4">
          Free shipping on orders over $50 | Contact: info@momore.com | +250 788 123 456
        </div>
      </div>

      {/* Main Header - Black Background with White Text */}
      <header className="fixed top-[36px] left-0 right-0 bg-black border-b border-gray-800 shadow-md z-[9999]">
  <nav className="container mx-auto px-4 py-1.5"> {/* Smaller navbar padding */}
    <div className="flex items-center justify-between">
      {/* Logo */}
      <Link 
        to="/" 
        className="flex items-center group transition-all duration-300 hover:scale-105"
      >
        <div className="relative">
          {/* Smaller Logo Container */}
          <div className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 flex items-center justify-center overflow-visible rounded-lg transition-all duration-500 group-hover:scale-105">
            <img
              src={logoImage}
              alt="MOMORE - Premium Fashion"
              className="relative z-10 w-full h-full object-contain transition-all duration-500 drop-shadow-lg"
            />
          </div>
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-lg"></div>
        </div>
        {/* Brand Text */}
        <div className="ml-3 hidden sm:block group-hover:scale-105 transition-transform duration-300">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-none">
            MOMORE
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-0.5">Premium Fashion</p>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4"> {/* Reduced spacing */}
        {navigationLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`font-medium text-base transition-all duration-200 hover:text-white hover:scale-105 relative ${
              isActive(link.path) ? "text-white" : "text-gray-300"
            }`}
          >
            {link.name}
            {isActive(link.path) && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"></div>
            )}
          </Link>
        ))}
      </div>
     

      {/* Desktop Icons */}
      <div className="hidden md:flex items-center space-x-2"> {/* Smaller spacing */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-105"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className="h-4 w-4" /> {/* Smaller icon */}
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-105 relative"
          asChild
        >
                <Link to="/wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistItems && wishlistItems.length > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse font-semibold min-w-[20px]"
                      key={`wishlist-${wishlistItems.length}`}
                    >
                      {wishlistItems.length > 99 ? '99+' : wishlistItems.length}
                    </span>
                  )}
                </Link>
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-110 relative"
                asChild
              >
                <Link to="/cart">
                  <ShoppingBag className="h-5 w-5" />
                  {cartState && cartState.itemCount > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse font-semibold min-w-[20px]"
                      key={`cart-${cartState.itemCount}`}
                    >
                      {cartState.itemCount > 99 ? '99+' : cartState.itemCount}
                    </span>
                  )}
                </Link>
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-110">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    sideOffset={8}
                    className="border-gray-700 shadow-2xl bg-gray-900 backdrop-blur-md min-w-[200px] z-[50000]"
                    style={{ 
                      position: 'fixed',
                      zIndex: 50000,
                      maxWidth: '200px',
                      right: '16px',
                      marginTop: '8px',
                      border: '1px solid rgb(55, 65, 81)',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                      borderRadius: '8px',
                      overflow: 'visible'
                    }}
                  >
                    <DropdownMenuItem className="font-medium cursor-default focus:bg-transparent hover:bg-transparent text-white">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{user.name}</span>
                        <span className="text-xs text-gray-400">{user.email}</span>
                      </div>
                    </DropdownMenuItem>
                    <div className="h-px bg-gray-700 my-1" />
                    {user.isAdmin && (
                      <>
                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-white">
                          <Link to="/admin/dashboard" className="flex items-center w-full">
                            <User className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <div className="h-px bg-gray-700 my-1" />
                      </>
                    )}
                    <DropdownMenuItem 
                      onClick={logout} 
                      className="cursor-pointer hover:bg-red-600/20 focus:bg-red-600/20 text-red-400 focus:text-red-400"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
                  <Link to="/admin">Login</Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10 transition-all duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-800 animate-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col space-y-4 pt-4">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`font-medium transition-colors hover:text-white ${
                      isActive(link.path) ? "text-white" : "text-gray-300"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="flex items-center space-x-4 pt-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:text-white hover:bg-white/10"
                    onClick={() => {
                      setIsSearchOpen(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                  
                  {/* Mobile Wishlist with Count */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:text-white hover:bg-white/10 relative" 
                    asChild
                  >
                    <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>
                      <Heart className="h-5 w-5" />
                      {wishlistItems && wishlistItems.length > 0 && (
                        <span 
                          className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold"
                          key={`mobile-wishlist-${wishlistItems.length}`}
                        >
                          {wishlistItems.length > 99 ? '99+' : wishlistItems.length}
                        </span>
                      )}
                    </Link>
                  </Button>
                  
                  {/* Mobile Cart with Count */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:text-white hover:bg-white/10 relative" 
                    asChild
                  >
                    <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                      <ShoppingBag className="h-5 w-5" />
                      {cartState && cartState.itemCount > 0 && (
                        <span 
                          className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold"
                          key={`mobile-cart-${cartState.itemCount}`}
                        >
                          {cartState.itemCount > 99 ? '99+' : cartState.itemCount}
                        </span>
                      )}
                    </Link>
                  </Button>
                  
                  {user ? (
                    <div className="flex flex-col space-y-2 pl-4 border-l border-gray-800">
                      <div className="text-sm font-medium text-white">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                      {user.isAdmin && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="justify-start p-0 h-auto text-sm hover:bg-transparent hover:text-white text-gray-300" 
                          asChild
                        >
                          <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                            <User className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }} 
                        className="justify-start p-0 h-auto text-sm hover:bg-transparent hover:text-red-400 text-red-400"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Login</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Spacer to prevent content from hiding behind fixed header and banner */}
      <div className="h-[140px]"></div>

      {/* Search Modal with Higher Z-Index */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60000]">
          <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
      )}
    </>
  );
};

export default Header;