import { Link } from "react-router-dom";
import fullLogo from "@/assets/mcm-logo-full.webp";
import iconLogo from "@/assets/mcm-logo-icon.webp";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

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
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/#how-it-works">
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-base h-12")}>
                  How It Works
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base h-12">Values</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-56 gap-3 p-4 bg-background">
                  <li>
                    <Link to="/#fairness" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-base font-semibold leading-none">Fair</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Transparent pricing for everyone
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/#transparency" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-base font-semibold leading-none">Transparent</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Open and honest processes
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/#reliability" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-base font-semibold leading-none">Reliable</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Dependable protection always
                      </p>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/benefits">
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-base h-12")}>
                  Benefits
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/claims">
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-base h-12")}>
                  Claims
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

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