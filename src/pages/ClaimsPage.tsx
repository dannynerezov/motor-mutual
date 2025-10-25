import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ClaimsHero } from "@/components/claims/ClaimsHero";
import { NotAtFaultProcess } from "@/components/claims/NotAtFaultProcess";
import { CashSettlementSection } from "@/components/claims/CashSettlementSection";
import { DelayComparisonDiagram } from "@/components/claims/DelayComparisonDiagram";
import { ClaimsProcessFlow } from "@/components/claims/ClaimsProcessFlow";
import { DisputeResolutionProcess } from "@/components/claims/DisputeResolutionProcess";
import { ClaimsComparisonTable } from "@/components/claims/ClaimsComparisonTable";
import { TimelineExample } from "@/components/claims/TimelineExample";
import { PriceProtectionNotice } from "@/components/claims/PriceProtectionNotice";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ClaimsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <ClaimsHero />
        
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <NotAtFaultProcess />
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <CashSettlementSection />
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <DelayComparisonDiagram />
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <ClaimsProcessFlow />
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <DisputeResolutionProcess />
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <ClaimsComparisonTable />
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <TimelineExample />
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <PriceProtectionNotice />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Experience Fair, Fast Claims?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join the mutual that puts you in control. Get a quote in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button size="lg" variant="secondary" className="gap-2">
                  Get a Quote
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                Contact Claims Team
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ClaimsPage;
