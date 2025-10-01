import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const shopLinks = [
    { name: "Clothing", href: "/shop/clothing" },
    { name: "Bags & Accessories", href: "/shop/bags" },
    { name: "Homeware", href: "/shop/homeware" },
    { name: "Art & Decor", href: "/shop/art" },
    { name: "All Products", href: "/shop" },
  ];

  const informationLinks = [
    { name: "About Us", href: "/about" },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Artisan Stories", href: "/artisans" },
    { name: "Shipping & Returns", href: "/shipping" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white relative overflow-hidden">
      <style>{`
        .footer-link-hover {
          transition: all 0.3s ease;
        }
        .footer-link-hover:hover {
          color: #f59e0b;
          transform: translateX(4px);
        }
      `}</style>

      {/* Subtle decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-800 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold text-amber-500 hover:text-amber-400 transition-colors">
              MOMORE
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              "Cultural Elegance, Crafted for You." Celebrating African heritage through beautifully handmade products.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-amber-500 hover:bg-amber-500/10 h-9 w-9">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-amber-500 hover:bg-amber-500/10 h-9 w-9">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-amber-500 hover:bg-amber-500/10 h-9 w-9">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Shop</h3>
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 text-sm footer-link-hover block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Information</h3>
            <ul className="space-y-2">
              {informationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 text-sm footer-link-hover block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@momore.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+250 788 123 456</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">Kigali, Rwanda</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-gray-500 text-sm text-center md:text-left">
              &copy; 2024 Momore Limited. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-gray-500 hover:text-amber-500 transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-500 hover:text-amber-500 transition-colors text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;