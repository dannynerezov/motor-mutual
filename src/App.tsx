import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocialProofManager } from "@/components/SocialProofManager";
import Index from "./pages/Index";
import QuotePage from "./pages/QuotePage";
import AdminPage from "./pages/AdminPage";
import AdminPricingAnalysis from "./pages/AdminPricingAnalysis";
import AdminPricingSchemes from "./pages/AdminPricingSchemes";
import PricingAnalysisPage from "./pages/PricingAnalysisPage";
import WidgetPage from "./pages/WidgetPage";
import ClaimsPage from "./pages/ClaimsPage";
import BenefitsPage from "./pages/BenefitsPage";
import ThirdPartyBulk from "./pages/ThirdPartyBulk";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SocialProofManager />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quote/:quoteId" element={<QuotePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/pricing-analysis" element={<AdminPricingAnalysis />} />
          <Route path="/admin/pricing-schemes" element={<AdminPricingSchemes />} />
          <Route path="/pricing-analysis" element={<PricingAnalysisPage />} />
          <Route path="/widget" element={<WidgetPage />} />
          <Route path="/claims" element={<ClaimsPage />} />
          <Route path="/benefits" element={<BenefitsPage />} />
          <Route path="/third-party-bulk" element={<ThirdPartyBulk />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
