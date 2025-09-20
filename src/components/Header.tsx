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
      <div className="fixed top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm z-[10000]">
        <div className="container mx-auto px-4">
          Free shipping on orders over $50 | Contact: info@momore.com | +250 788 123 456
        </div>
      </div>

      {/* Main Header - Enhanced Fixed Position with proper overflow handling */}
      <header className="fixed top-[36px] left-0 right-0 bg-background/95 backdrop-blur-md border-b shadow-lg z-[9999] supports-[backdrop-filter]:bg-background/60">
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
                  <DropdownMenuContent 
                    align="end" 
                    sideOffset={8}
                    className="border-primary/20 shadow-2xl bg-white dark:bg-gray-900 backdrop-blur-md min-w-[200px] z-[50000]"
                    style={{ 
                      position: 'fixed',
                      zIndex: 50000,
                      maxWidth: '200px',
                      right: '16px',
                      marginTop: '8px',
                      border: '1px solid hsl(var(--primary) / 0.2)',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      overflow: 'visible'
                    }}
                  >
                    <DropdownMenuItem className="font-medium cursor-default focus:bg-transparent hover:bg-transparent">
                      <div className="flex flex-col">
                        <span className="font-semibold text-primary">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </DropdownMenuItem>
                    <div className="h-px bg-border my-1" />
                    {user.isAdmin && (
                      <>
                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10">
                          <Link to="/admin/dashboard" className="flex items-center w-full">
                            <User className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <div className="h-px bg-border my-1" />
                      </>
                    )}
                    <DropdownMenuItem 
                      onClick={logout} 
                      className="cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600 focus:text-red-600 dark:hover:bg-red-950 dark:focus:bg-red-950"
                    >
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
                    <div className="flex flex-col space-y-2 pl-4 border-l border-primary/20">
                      <div className="text-sm font-medium text-primary">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                      {user.isAdmin && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="justify-start p-0 h-auto text-sm hover:bg-transparent hover:text-primary" 
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
                        className="justify-start p-0 h-auto text-sm hover:bg-transparent hover:text-red-600 text-red-600"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
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