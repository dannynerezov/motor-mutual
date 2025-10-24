import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <img 
              src="/src/assets/mcm-logo.png" 
              alt="Motor Cover Mutual" 
              className="h-12 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-sm opacity-90">
              Rideshare insurance designed specifically for drivers who earn on the road.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm opacity-90 hover:opacity-100 transition-opacity">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="text-sm opacity-90 hover:opacity-100 transition-opacity">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm opacity-90">
                <Phone className="h-4 w-4" />
                <span>1300 123 456</span>
              </li>
              <li className="flex items-center gap-2 text-sm opacity-90">
                <Mail className="h-4 w-4" />
                <span>info@motorcovermutual.com.au</span>
              </li>
              <li className="flex items-center gap-2 text-sm opacity-90">
                <MapPin className="h-4 w-4" />
                <span>Sydney, Australia</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-90">
          <p>&copy; {new Date().getFullYear()} Motor Cover Mutual. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};