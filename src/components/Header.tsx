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
      {/* Top Banner */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm">
        <div className="container mx-auto px-4">
          Free shipping on orders over $50 | Contact: info@momore.com | +250 788 123 456
        </div>
      </div>

      {/* Main Header - Enhanced Fixed Position */}
      <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md border-b shadow-lg z-[9999] supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo */}
            <Link 
              to="/" 
              className="flex items-center group transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                {/* Logo Container with Classic Elegant Styling - Larger but Compact */}
                <div className="h-16 w-16 md:h-18 md:w-18 flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-white via-gray-50 to-white border-2 border-primary/30 shadow-elegant hover:shadow-glow transition-all duration-500 group-hover:border-primary/60 group-hover:scale-110 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/8 via-transparent to-primary-glow/15 opacity-60"></div>
                  <img
                    src={logoImage}
                    alt="MOMORE - Premium Fashion"
                    className="relative z-10 w-full h-full object-contain p-1.5 filter brightness-110 contrast-120 saturate-120 group-hover:scale-110 transition-all duration-500 drop-shadow-md"
                  />
                </div>
                {/* Premium Shine Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                {/* Subtle Glow Ring */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500 pointer-events-none"></div>
              </div>
              {/* Brand Text - Enhanced Typography */}
              <div className="ml-3 hidden sm:block group-hover:scale-105 transition-transform duration-300">
                <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight leading-none bg-gradient-primary bg-clip-text text-transparent">
                  MOMORE
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`font-medium transition-all duration-200 hover:text-primary hover:scale-105 relative ${
                    isActive(link.path) ? "text-primary" : "text-foreground"
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-primary rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 hover:scale-110"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              {/* Optimized Wishlist Button with Real-time Count */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 hover:scale-110 relative"
                asChild
              >
                <Link to="/wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistItems && wishlistItems.length > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 bg-gradient-primary text-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-glow animate-pulse font-semibold min-w-[20px]"
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
                className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 hover:scale-110 relative"
                asChild
              >
                <Link to="/cart">
                  <ShoppingBag className="h-5 w-5" />
                  {cartState && cartState.itemCount > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 bg-gradient-primary text-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-glow animate-pulse font-semibold min-w-[20px]"
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
                    <Button variant="ghost" size="icon" className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 hover:scale-110">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-primary/20 shadow-elegant">
                    <DropdownMenuItem className="font-medium">
                      {user.name}
                    </DropdownMenuItem>
                    {user.isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin/dashboard">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" className="hover:bg-primary/10" asChild>
                  <Link to="/admin">Login</Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-primary/10 transition-all duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-primary/20 animate-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col space-y-4 pt-4">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`font-medium transition-colors hover:text-primary ${
                      isActive(link.path) ? "text-primary" : "text-foreground"
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
                    className="text-foreground hover:text-primary hover:bg-primary/10"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                  
                  {/* Mobile Wishlist with Count */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-foreground hover:text-primary hover:bg-primary/10 relative" 
                    asChild
                  >
                    <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>
                      <Heart className="h-5 w-5" />
                      {wishlistItems && wishlistItems.length > 0 && (
                        <span 
                          className="absolute -top-1 -right-1 bg-gradient-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold"
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
                    className="text-foreground hover:text-primary hover:bg-primary/10 relative" 
                    asChild
                  >
                    <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                      <ShoppingBag className="h-5 w-5" />
                      {cartState && cartState.itemCount > 0 && (
                        <span 
                          className="absolute -top-1 -right-1 bg-gradient-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold"
                          key={`mobile-cart-${cartState.itemCount}`}
                        >
                          {cartState.itemCount > 99 ? '99+' : cartState.itemCount}
                        </span>
                      )}
                    </Link>
                  </Button>
                  
                  {user ? (
                    <Button variant="ghost" onClick={logout} className="hover:bg-primary/10">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  ) : (
                    <Button variant="ghost" className="hover:bg-primary/10" asChild>
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Login</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-[104px]"></div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;