import { Link } from "react-router-dom";
import fullLogo from "@/assets/mcm-logo-full.webp";
import iconLogo from "@/assets/mcm-logo-icon.webp";

export const Header = () => {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <img 
            src={fullLogo} 
            alt="Motor Cover Mutual - Fair. Transparent. Reliable." 
            className="hidden md:block h-16 w-auto"
          />
          <div className="flex md:hidden items-center gap-2">
            <img 
              src={iconLogo} 
              alt="MCM Logo" 
              className="h-10 w-auto"
            />
            <span className="text-sm font-bold text-foreground">MCM</span>
          </div>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/widget" className="text-sm font-medium hover:text-primary transition-colors">
            Price Explorer
          </Link>
          <Link to="/benefits" className="text-sm font-medium hover:text-primary transition-colors hidden sm:inline">
            Benefits
          </Link>
          <Link to="/claims" className="text-sm font-medium hover:text-primary transition-colors hidden sm:inline">
            Claims
          </Link>
          <Link to="/#how-it-works" className="text-sm font-medium hover:text-primary transition-colors hidden md:inline">
            How It Works
          </Link>
        </nav>
      </div>
    </header>
  );
};