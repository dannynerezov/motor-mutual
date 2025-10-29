import { Eye, X, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingCarousel } from "./PricingCarousel";
import { usePricingScheme } from "@/hooks/usePricingScheme";
import { Skeleton } from "@/components/ui/skeleton";

export const TransparencySection = () => {
  const { activeScheme, isLoading } = usePricingScheme();

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-background via-accent/[0.015] to-background">
      {/* Massive Watermark Background */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="text-[14vw] font-black text-accent/[0.03] uppercase tracking-tighter rotate-[1deg] whitespace-nowrap">
          Transparency
        </div>
      </div>

      {/* Background Synonyms - Stylized & barely visible */}
      <div className="absolute top-20 left-10 text-2xl font-medium italic rotate-[-1deg] pointer-events-none select-none" style={{ color: '#cccccc', opacity: 0.15, userSelect: 'none' }} aria-hidden="true">
        clarity
      </div>
      <div className="absolute bottom-28 right-20 text-4xl font-semibold italic rotate-[2deg] pointer-events-none select-none" style={{ color: '#cccccc', opacity: 0.15, userSelect: 'none' }} aria-hidden="true">
        openness
      </div>
      <div className="absolute top-44 right-24 text-2xl font-medium italic rotate-[-2deg] pointer-events-none select-none" style={{ color: '#cccccc', opacity: 0.15, userSelect: 'none' }} aria-hidden="true">
        honesty
      </div>
      <div className="absolute top-1/3 left-1/4 text-4xl font-semibold italic rotate-[1deg] pointer-events-none select-none" style={{ color: '#cccccc', opacity: 0.15, userSelect: 'none' }} aria-hidden="true">
        lucidity
      </div>
      <div className="absolute bottom-1/3 left-16 text-3xl font-medium italic rotate-[-1deg] pointer-events-none select-none" style={{ color: '#cccccc', opacity: 0.15, userSelect: 'none' }} aria-hidden="true">
        candidness
      </div>
      <div className="absolute top-2/3 right-1/3 text-3xl font-medium italic rotate-[2deg] pointer-events-none select-none" style={{ color: '#cccccc', opacity: 0.15, userSelect: 'none' }} aria-hidden="true">
        frankness
      </div>
      <div className="absolute bottom-44 right-16 text-2xl font-medium italic rotate-[-2deg] pointer-events-none select-none" style={{ color: '#cccccc', opacity: 0.15, userSelect: 'none' }} aria-hidden="true">
        explicitness
      </div>
      <div className="absolute top-52 left-1/3 text-4xl font-semibold italic rotate-[1deg] pointer-events-none select-none" style={{ color: '#cccccc', opacity: 0.15, userSelect: 'none' }} aria-hidden="true">
        visibility
      </div>
      <div className="absolute bottom-52 left-1/4 text-3xl font-medium italic rotate-[-1deg] pointer-events-none select-none" style={{ color: '#cccccc', opacity: 0.15, userSelect: 'none' }} aria-hidden="true">
        directness
      </div>
      <div className="absolute top-1/4 right-20 text-2xl font-medium italic rotate-[2deg] pointer-events-none select-none" style={{ color: '#cccccc', opacity: 0.15, userSelect: 'none' }} aria-hidden="true">
        forthrightness
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-accent/10 backdrop-blur-md border-2 border-accent/40 rounded-full text-lg md:text-xl font-bold text-accent mb-6 shadow-lg hover:shadow-accent/20 transition-all duration-300 animate-pulse [animation-duration:3s]">
            <Eye className="h-6 w-6" />
            <span className="tracking-wide">TRANSPARENCY</span>
          </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Winning Prices Without Hidden Variables
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Simple, transparent pricing you can understand
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Problem Statement */}
        <Card className="border-2 border-orange-200 bg-orange-50/50 dark:border-orange-900 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="text-2xl">Traditional Insurance: Confusing & Opaque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-lg mb-4">
              Traditional insurance pricing is confusing and opaque, with multiple hidden variables affecting your premium:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <X className="h-5 w-5 flex-shrink-0" />
                <span>👤 Gender-based pricing discrimination</span>
              </div>
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <X className="h-5 w-5 flex-shrink-0" />
                <span>🎂 Age-based pricing penalties</span>
              </div>
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <X className="h-5 w-5 flex-shrink-0" />
                <span>🚗 Vehicle make/model discrimination</span>
              </div>
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <X className="h-5 w-5 flex-shrink-0" />
                <span>📊 Complex risk algorithms</span>
              </div>
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <X className="h-5 w-5 flex-shrink-0" />
                <span>❓ Unexplained adjustments</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solution Statement */}
        <Card className="border-2 border-primary/30 bg-primary/5 dark:border-primary/50 dark:bg-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl">The Mutual: Transparent Value-Based Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-lg mb-4">
              The Mutual has transparent pricing driven <strong>solely by vehicle value</strong>. No matter who you are, you get the same fair price:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <Check className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">Gender? Not considered</span>
              </div>
              <div className="flex items-center gap-2 text-accent">
                <Check className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">Age? Not considered</span>
              </div>
              <div className="flex items-center gap-2 text-accent">
                <Check className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">Vehicle make/model? Not considered</span>
              </div>
              <div className="flex items-center gap-2 text-accent">
                <Check className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">Location? Not considered</span>
              </div>
              <div className="flex items-center gap-2 text-accent">
                <Check className="h-5 w-5 flex-shrink-0 text-xl" />
                <span className="font-bold text-lg">Vehicle Value? Only factor ✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Table */}
      <Card className="mb-12 overflow-hidden border-2">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-2xl text-center">Pricing Factor Comparison</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Factor</th>
                  <th className="px-6 py-4 text-center font-semibold">Traditional Insurers</th>
                  <th className="px-6 py-4 text-center font-semibold bg-accent/10">The Mutual</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-6 py-4 font-medium">Gender</td>
                  <td className="px-6 py-4 text-center text-orange-600 dark:text-orange-400">Yes - affects price</td>
                  <td className="px-6 py-4 text-center bg-accent/5">
                    <span className="text-accent font-semibold">❌ Not considered</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Age</td>
                  <td className="px-6 py-4 text-center text-muted-foreground">Yes - affects price</td>
                  <td className="px-6 py-4 text-center bg-accent/5">
                    <span className="text-accent font-semibold">❌ Not considered</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Vehicle Make/Model</td>
                  <td className="px-6 py-4 text-center text-muted-foreground">Yes - affects price</td>
                  <td className="px-6 py-4 text-center bg-accent/5">
                    <span className="text-accent font-semibold">❌ Not considered</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Location</td>
                  <td className="px-6 py-4 text-center text-muted-foreground">Yes - huge impact</td>
                  <td className="px-6 py-4 text-center bg-accent/5">
                    <span className="text-accent font-semibold">❌ Not considered</span>
                  </td>
                </tr>
                <tr className="bg-primary/5 dark:bg-primary/10">
                  <td className="px-6 py-4 font-bold">Vehicle Value</td>
                  <td className="px-6 py-4 text-center text-muted-foreground">❓ Hidden weighting</td>
                  <td className="px-6 py-4 text-center bg-accent/10 dark:bg-accent/20">
                    <span className="text-accent font-bold text-lg">✅ ONLY FACTOR</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Live Vehicle Examples Section */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Real Vehicles, Real Prices - See What Drivers Actually Pay
          </h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            These are actual vehicles from our quote database, showing real pricing calculations.
            Every vehicle uses the exact same transparent formula - watch how the premium changes with vehicle value.
          </p>
        </div>

        {/* Database-Driven Carousel */}
        <PricingCarousel />

        <p className="text-center text-sm text-muted-foreground italic max-w-2xl mx-auto">
          Base premium shown. Claims history loading may apply (transparently disclosed).
        </p>
      </div>
      </div>
    </section>
  );
};
