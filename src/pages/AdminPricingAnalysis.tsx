import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SummaryStatsCard } from "@/components/admin/SummaryStatsCard";
import { StateAnalysisCard } from "@/components/admin/StateAnalysisCard";
import { PostcodeAnalysisCard } from "@/components/admin/PostcodeAnalysisCard";
import { SuburbAnalysisCard } from "@/components/admin/SuburbAnalysisCard";
import { PricingDistributionChart } from "@/components/admin/PricingDistributionChart";
import { PremiumCalculator } from "@/components/admin/PremiumCalculator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AdminPricingAnalysis = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/admin">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Postcode Pricing Analysis</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of insurance pricing indices across Australia
          </p>
        </div>

        <SummaryStatsCard />

        <Tabs defaultValue="states" className="mt-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="states">States</TabsTrigger>
            <TabsTrigger value="postcodes">Postcodes</TabsTrigger>
            <TabsTrigger value="suburbs">Suburbs</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="states">
            <StateAnalysisCard />
          </TabsContent>

          <TabsContent value="postcodes">
            <PostcodeAnalysisCard />
          </TabsContent>

          <TabsContent value="suburbs">
            <SuburbAnalysisCard />
          </TabsContent>

          <TabsContent value="distribution">
            <PricingDistributionChart />
          </TabsContent>

          <TabsContent value="calculator">
            <PremiumCalculator />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPricingAnalysis;
