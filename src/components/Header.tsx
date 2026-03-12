import { Link } from "react-router-dom";
import fullLogo from "@/assets/mcm-logo-new-large-stylised.webp";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Shield, ExternalLink, Menu, Lightbulb, Gift, FileText, TrendingDown, Handshake } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b bg-background sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <img 
            src={fullLogo} 
            alt="Motor Cover Mutual - Fair. Transparent. Reliable." 
            className="h-12 md:h-16 w-auto"
          />
        </Link>
        
        <nav className="hidden md:flex items-center gap-2 ml-8">
          <a 
            href="#how-it-works" 
            className="px-6 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors h-14 flex items-center"
          >
            How It Works
          </a>

          <a 
            href="#live-quotes" 
            className="px-6 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors h-14 flex items-center"
          >
            Pricing
          </a>

          <a 
            href="#why-choose-mutual" 
            className="px-6 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors h-14 flex items-center"
          >
            Benefits
          </a>

          <Link 
            to="/claims" 
            className="px-6 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors h-14 flex items-center"
          >
            Claims
          </Link>

          <Link 
            to="/pds" 
            className="px-6 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors h-14 flex items-center"
          >
            PDS
          </Link>

          <a 
            href="https://getbirdeye.com.au/national-cover-insurance-brokers-169994241801236"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium border border-primary/20 hover:bg-accent/10 hover:border-accent transition-colors rounded-md h-14 flex items-center gap-2 whitespace-nowrap"
          >
            <Handshake className="w-4 h-4 text-accent" />
            <div className="flex flex-col leading-tight">
              <span className="text-xs text-muted-foreground">Brokered by</span>
              <span className="font-semibold text-sm">National Cover</span>
            </div>
            <ExternalLink className="w-3 h-3 opacity-50" />
          </a>

          <a 
            href="https://service.asic.gov.au/search/EntityDetail?LicenceNumber=239926&PermissionType=Australian%20financial%20services%20licensees&licenceName=ASIA%20MIDEAST%20INSURANCE%20AND%20REINSURANCE%20PTY%20LTD" 
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Verify AFSL 239926 on ASIC (opens in new window)"
            title="AFSL 239926 — Asia Mideast Insurance and Reinsurance Pty Ltd"
            className="px-6 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors h-14 flex items-center gap-2 border border-border/50"
          >
            <Shield className="w-4 h-4" />
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-sm">Verify Licence</span>
              <span className="text-xs text-muted-foreground">AFSL 239926</span>
            </div>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </nav>

        {/* Mobile menu */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            
            <SheetContent 
              side="right" 
              className="w-[300px] sm:w-[400px] bg-gradient-to-br from-background/98 via-primary/5 to-accent/10 backdrop-blur-xl border-l-2 border-primary/20"
            >
              <SheetHeader className="border-b border-primary/10 pb-4">
                <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Menu
                </SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col gap-4 mt-8 min-h-[calc(100vh-8rem)] pb-4">
                <Link 
                  to="/#how-it-works" 
                  className="flex items-center gap-3 px-4 py-3 text-lg font-medium hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:border-l-4 hover:border-accent rounded-md transition-all duration-300 hover:translate-x-1"
                >
                  <Lightbulb className="w-5 h-5" />
                  How It Works
                </Link>
                
                <Link 
                  to="/#live-quotes" 
                  className="flex items-center gap-3 px-4 py-3 text-lg font-medium hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:border-l-4 hover:border-accent rounded-md transition-all duration-300 hover:translate-x-1"
                >
                  <TrendingDown className="w-5 h-5" />
                  Pricing
                </Link>
                
                <Link 
                  to="/benefits" 
                  className="flex items-center gap-3 px-4 py-3 text-lg font-medium hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:border-l-4 hover:border-accent rounded-md transition-all duration-300 hover:translate-x-1"
                >
                  <Gift className="w-5 h-5" />
                  Benefits
                </Link>
                
                <Link 
                  to="/claims" 
                  className="flex items-center gap-3 px-4 py-3 text-lg font-medium hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:border-l-4 hover:border-accent rounded-md transition-all duration-300 hover:translate-x-1"
                >
                  <FileText className="w-5 h-5" />
                  Claims
                </Link>
                
                <Link 
                  to="/pds" 
                  className="flex items-center gap-3 px-4 py-3 text-lg font-medium hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:border-l-4 hover:border-accent rounded-md transition-all duration-300 hover:translate-x-1"
                >
                  <FileText className="w-5 h-5" />
                  PDS
                </Link>
                
                <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent my-2"></div>
                
                <a 
                  href="https://getbirdeye.com.au/national-cover-insurance-brokers-169994241801236"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 text-lg font-medium border border-primary/20 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:border-l-4 hover:border-accent rounded-md transition-all duration-300 hover:translate-x-1"
                >
                  <Handshake className="w-5 h-5 text-accent" />
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs text-muted-foreground">Brokered by</span>
                    <span className="font-semibold">National Cover</span>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </a>
                
                <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent my-2"></div>
                
                <a 
                  href="https://service.asic.gov.au/search/EntityDetail?LicenceNumber=239926&PermissionType=Australian%20financial%20services%20licensees&licenceName=ASIA%20MIDEAST%20INSURANCE%20AND%20REINSURANCE%20PTY%20LTD" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 text-lg font-medium border border-border/50 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:border-l-4 hover:border-accent rounded-md transition-all duration-300 hover:translate-x-1"
                >
                  <Shield className="w-5 h-5" />
                  <div className="flex flex-col leading-tight">
                    <span className="font-semibold">Verify Licence</span>
                    <span className="text-xs text-muted-foreground">AFSL 239926</span>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </a>
                
                <div className="mt-auto pt-6 border-t border-primary/10">
                  <div className="flex flex-col items-center gap-3 py-4">
                    <img 
                      src={fullLogo} 
                      alt="Motor Cover Mutual" 
                      className="h-16 w-auto opacity-80"
                    />
                    <p className="text-xs text-center text-muted-foreground font-medium px-4">
                      Fair • Transparent • Reliable
                    </p>
                    <p className="text-[10px] text-center text-muted-foreground/60 px-4">
                      Community-Powered Rideshare Protection
                    </p>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
