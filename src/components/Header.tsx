import { Link } from "react-router-dom";
import fullLogo from "@/assets/mcm-logo-full.webp";
import iconLogo from "@/assets/mcm-logo-icon.webp";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b bg-background sticky top-0 z-50 backdrop-blur-sm">
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
        
        <nav className="hidden md:flex items-center gap-1">
          <Link 
            to="/#how-it-works" 
            className="px-4 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors h-12 flex items-center"
          >
            How It Works
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="px-4 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors h-12 flex items-center gap-1">
              Values
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/#fairness" className="w-full cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <div className="font-semibold">Fair</div>
                    <div className="text-sm text-muted-foreground">
                      Transparent pricing for everyone
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/#transparency" className="w-full cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <div className="font-semibold">Transparent</div>
                    <div className="text-sm text-muted-foreground">
                      Open and honest processes
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/#reliability" className="w-full cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <div className="font-semibold">Reliable</div>
                    <div className="text-sm text-muted-foreground">
                      Dependable protection always
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link 
            to="/benefits" 
            className="px-4 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors h-12 flex items-center"
          >
            Benefits
          </Link>

          <Link 
            to="/claims" 
            className="px-4 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors h-12 flex items-center"
          >
            Claims
          </Link>
        </nav>

        {/* Mobile menu - simplified */}
        <nav className="flex md:hidden items-center gap-4">
          <Link to="/#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link to="/claims" className="text-sm font-medium hover:text-primary transition-colors">
            Claims
          </Link>
        </nav>
      </div>
    </header>
  );
};