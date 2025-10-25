import { Link } from "react-router-dom";
import logo from "@/assets/mcm-logo-new.png";

export const Header = () => {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img 
            src={logo} 
            alt="Motor Cover Mutual" 
            className="h-12 w-auto"
          />
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              Motor Cover Mutual
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              Fair. Transparent. Reliable.
            </p>
          </div>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/widget" className="text-sm font-medium hover:text-primary transition-colors">
            Price Explorer
          </Link>
          <Link to="/#how-it-works" className="text-sm font-medium hover:text-primary transition-colors hidden sm:inline">
            How It Works
          </Link>
        </nav>
      </div>
    </header>
  );
};