import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import iconLogo from "@/assets/mcm-logo-new-small.png";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      {/* Trust Banner Section */}
      <div className="bg-primary/95 border-b border-primary-foreground/10 relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <img 
            src={iconLogo} 
            alt="" 
            className="w-32 h-32 object-contain"
          />
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <p className="text-center text-primary-foreground text-lg max-w-4xl mx-auto leading-relaxed">
            Join your rideshare community, backed by ASIC-regulated protection and AFCA supervision. Get your quote today and drive with confidence, knowing your livelihood is protected by a trusted, transparent mutual.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <img 
              src={iconLogo} 
              alt="Motor Cover Mutual" 
              className="h-10 w-auto mb-4"
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
                <Link to="/widget" className="text-sm opacity-90 hover:opacity-100 transition-opacity">
                  Price Explorer
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="text-sm opacity-90 hover:opacity-100 transition-opacity">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/pds" className="text-sm opacity-90 hover:opacity-100 transition-opacity">
                  Product Disclosure Statement
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-sm opacity-90 hover:opacity-100 transition-opacity">
                  Admin
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
        
        {/* Legal & Licence Details */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="space-y-4 text-xs opacity-80 leading-relaxed">
            <div>
              <h4 className="font-semibold text-sm mb-2 opacity-100">General Advice Warning</h4>
              <p>
                The information provided on this website is general advice only and has been prepared without taking into account your particular objectives, financial situation or needs. Before acting on any advice, you should consider the appropriateness of the advice, having regard to your objectives, financial situation and needs. You should read the relevant Product Disclosure Statement (PDS) before making a decision about whether to acquire a product. Past performance is not indicative of future performance.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 pt-2">
              <div>
                <p className="font-semibold text-sm opacity-100">Product Issuer</p>
                <p>Motor Cover Mutual Ltd</p>
                <p>ACN 692 709 649</p>
              </div>
              <div>
                <p className="font-semibold text-sm opacity-100">AFSL Holder &amp; Underwriter</p>
                <p>Asia Mideast Insurance and Reinsurance Pty Ltd</p>
                <p>ACN 079 924 851 | AFSL 239926</p>
              </div>
              <div>
                <p className="font-semibold text-sm opacity-100">Insurance Broker</p>
                <p>National Cover Pty Ltd</p>
                <p>ABN 74 639 621 480</p>
              </div>
            </div>

            <p className="pt-2">
              Motor Cover Mutual Ltd is not an insurer and does not issue insurance policies. Cover is arranged by National Cover Pty Ltd and underwritten by Asia Mideast Insurance and Reinsurance Pty Ltd (AFSL 239926). Disputes may be referred to the Australian Financial Complaints Authority (AFCA).
            </p>
          </div>

          <div className="border-t border-primary-foreground/10 mt-6 pt-4 text-center text-sm opacity-90">
            <p>&copy; {new Date().getFullYear()} Motor Cover Mutual Ltd. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};