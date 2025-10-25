import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingExplorerWidget } from "@/components/pricing/PricingExplorerWidget";

const PricingAnalysisPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Insurance Pricing Explorer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how location affects rideshare insurance costs across Australia
          </p>
        </div>
        
        <PricingExplorerWidget />
      </main>
      <Footer />
    </div>
  );
};

export default PricingAnalysisPage;
