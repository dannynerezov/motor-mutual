import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import QuotePage from "./pages/QuotePage";
import AdminPage from "./pages/AdminPage";
import AdminPricingAnalysis from "./pages/AdminPricingAnalysis";
import PricingAnalysisPage from "./pages/PricingAnalysisPage";
import WidgetPage from "./pages/WidgetPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quote/:quoteId" element={<QuotePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/pricing-analysis" element={<AdminPricingAnalysis />} />
          <Route path="/pricing-analysis" element={<PricingAnalysisPage />} />
          <Route path="/widget" element={<WidgetPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
