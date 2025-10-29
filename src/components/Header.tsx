import { Link } from "react-router-dom";
import fullLogo from "@/assets/mcm-logo-new-large-stylised.webp";
import iconLogo from "@/assets/mcm-logo-new-small.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, Shield, ExternalLink, Menu, Lightbulb, Heart, Gift, FileText } from "lucide-react";

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
          <img 
            src={iconLogo} 
            alt="Motor Cover Mutual" 
            className="md:hidden h-10 w-auto"
          />
        </Link>
        
        <nav className="hidden md:flex items-center gap-2 ml-8">
          <Link 
            to="/#how-it-works" 
            className="px-6 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors h-14 flex items-center"
          >
            How It Works
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="px-6 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors h-14 flex items-center gap-1">
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
            className="px-6 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors h-14 flex items-center"
          >
            Benefits
          </Link>

          <Link 
            to="/claims" 
            className="px-6 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors h-14 flex items-center"
          >
            Claims
          </Link>

              <a 
                href="https://www.google.com/search?q=motor+cover+mutual+reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-lg font-medium border border-primary/20 hover:bg-accent hover:border-accent transition-colors rounded-md h-14 flex items-center gap-2 whitespace-nowrap"
              >
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">G</span>
                </div>
                <div className="hidden lg:flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span>5.0</span>
                </div>
              </a>

              <a 
                href="https://connectonline.asic.gov.au/RegistrySearch/faces/landing/SearchRegisters.jspx" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Verify our ASIC licence (opens in new window)"
                className="px-6 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors h-14 flex items-center gap-2 border border-border/50"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden lg:inline">Verify Licence</span>
                <span className="lg:hidden">Licence</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
        </nav>

        {/* Mobile menu - hamburger sidebar */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col gap-4 mt-8">
                <Link 
                  to="/#how-it-works" 
                  className="flex items-center gap-3 px-4 py-3 text-lg font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                >
                  <Lightbulb className="w-5 h-5" />
                  How It Works
                </Link>
                
                {/* Values Submenu */}
                <Collapsible className="space-y-2">
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 text-lg font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5" />
                      Values
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 pl-12">
                    <Link to="/#fairness" className="block px-4 py-2 text-base hover:bg-accent/50 rounded-md">
                      Fair
                    </Link>
                    <Link to="/#transparency" className="block px-4 py-2 text-base hover:bg-accent/50 rounded-md">
                      Transparent
                    </Link>
                    <Link to="/#reliability" className="block px-4 py-2 text-base hover:bg-accent/50 rounded-md">
                      Reliable
                    </Link>
                  </CollapsibleContent>
                </Collapsible>
                
                <Link 
                  to="/benefits" 
                  className="flex items-center gap-3 px-4 py-3 text-lg font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                >
                  <Gift className="w-5 h-5" />
                  Benefits
                </Link>
                
                <Link 
                  to="/claims" 
                  className="flex items-center gap-3 px-4 py-3 text-lg font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  Claims
                </Link>
                
                <a 
                  href="https://www.google.com/search?q=motor+cover+mutual+reviews"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 text-lg font-medium border border-primary/20 hover:bg-accent rounded-md transition-colors"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">G</span>
                  </div>
                  <span>Google Reviews (5.0★)</span>
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </a>
                
                <a 
                  href="https://connectonline.asic.gov.au/RegistrySearch/faces/landing/SearchRegisters.jspx" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 text-lg font-medium border border-border/50 hover:bg-accent rounded-md transition-colors"
                >
                  <Shield className="w-5 h-5" />
                  <span>Verify ASIC Licence</span>
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};