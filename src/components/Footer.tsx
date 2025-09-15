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
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-bold hover:text-primary-lighter transition-colors">
              MOMORE
            </Link>
            <p className="text-primary-foreground/80 leading-relaxed">
              "Cultural Elegance, Crafted for You." Celebrating African heritage through beautifully handmade products.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary-lighter hover:bg-primary-light/20">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary-lighter hover:bg-primary-light/20">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary-lighter hover:bg-primary-light/20">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Shop</h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-primary-lighter transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Information</h3>
            <ul className="space-y-3">
              {informationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-primary-lighter transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-lighter" />
                <span className="text-primary-foreground/80">info@momore.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-lighter" />
                <span className="text-primary-foreground/80">+250 788 123 456</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary-lighter" />
                <span className="text-primary-foreground/80">Kigali, Rwanda</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-light/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-foreground/80 text-center md:text-left">
              &copy; 2023 Momore Limited. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-primary-foreground/80 hover:text-primary-lighter transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-primary-foreground/80 hover:text-primary-lighter transition-colors text-sm"
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