import { Link } from "react-router-dom";
import logo from "@/assets/mcm-logo-new.png";

export const Header = () => {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="Motor Cover Mutual" 
            className="h-12 w-auto"
          />
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
            How It Works
          </Link>
        </nav>
      </div>
    </header>
  );
};