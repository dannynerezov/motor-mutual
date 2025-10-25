import { Eye, X, Check, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingSchemeChart } from "@/components/admin/PricingSchemeChart";
import { usePricingScheme } from "@/hooks/usePricingScheme";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const TransparencySection = () => {
  const { activeScheme, isLoading } = usePricingScheme();

  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/30 rounded-full text-sm font-medium text-accent mb-6">
          <Eye className="h-4 w-4" />
          Transparency
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
        <Card className="border-2 border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="text-2xl">The Mutual: Transparent Value-Based Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-lg mb-4">
              The Mutual has transparent pricing driven <strong>solely by vehicle value</strong>. No matter who you are, you get the same fair price:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Check className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">Gender? Not considered</span>
              </div>
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Check className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">Age? Not considered</span>
              </div>
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Check className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">Vehicle make/model? Not considered</span>
              </div>
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Check className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">Location? Not considered</span>
              </div>
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
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
                    <span className="text-green-600 dark:text-green-400 font-semibold">❌ Not considered</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Age</td>
                  <td className="px-6 py-4 text-center text-orange-600 dark:text-orange-400">Yes - affects price</td>
                  <td className="px-6 py-4 text-center bg-accent/5">
                    <span className="text-green-600 dark:text-green-400 font-semibold">❌ Not considered</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Vehicle Make/Model</td>
                  <td className="px-6 py-4 text-center text-orange-600 dark:text-orange-400">Yes - affects price</td>
                  <td className="px-6 py-4 text-center bg-accent/5">
                    <span className="text-green-600 dark:text-green-400 font-semibold">❌ Not considered</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Location</td>
                  <td className="px-6 py-4 text-center text-orange-600 dark:text-orange-400">Yes - huge impact</td>
                  <td className="px-6 py-4 text-center bg-accent/5">
                    <span className="text-green-600 dark:text-green-400 font-semibold">❌ Not considered</span>
                  </td>
                </tr>
                <tr className="bg-green-50/50 dark:bg-green-950/20">
                  <td className="px-6 py-4 font-bold">Vehicle Value</td>
                  <td className="px-6 py-4 text-center text-muted-foreground">❓ Hidden weighting</td>
                  <td className="px-6 py-4 text-center bg-green-100/50 dark:bg-green-900/30">
                    <span className="text-green-700 dark:text-green-300 font-bold text-lg">✅ ONLY FACTOR</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Active Pricing Scheme Chart */}
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h3 className="text-2xl md:text-3xl font-bold">
              Our Pricing Formula - Fully Transparent
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 hover:bg-muted rounded-full transition-colors">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-4">
                  <p className="font-semibold mb-2">How to Read This Chart:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>X-axis</strong>: Your vehicle's value ($5k - $100k)</li>
                    <li>• <strong>Y-axis</strong>: Your base membership premium</li>
                    <li>• <strong>Find your vehicle value</strong> on the bottom, look up to see your price</li>
                    <li>• <strong>Green line (Floor)</strong>: Minimum vehicle value tier</li>
                    <li>• <strong>Red line (Ceiling)</strong>: Maximum vehicle value tier</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            This is the exact formula we use. No secrets, no surprises. Everyone sees the same pricing curve.
          </p>
        </div>

        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : activeScheme ? (
          <Card className="border-2">
            <CardHeader className="text-center bg-muted/30">
              <CardTitle className="text-lg">
                Active Pricing Scheme #{activeScheme.scheme_number}
                <span className="text-sm text-muted-foreground ml-2">
                  (Valid from {new Date(activeScheme.valid_from).toLocaleDateString()})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <PricingSchemeChart scheme={activeScheme} height={400} />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-orange-200">
            <CardContent className="py-8 text-center text-muted-foreground">
              No active pricing scheme available
            </CardContent>
          </Card>
        )}

        <p className="text-center text-sm text-muted-foreground italic max-w-2xl mx-auto">
          This chart shows base membership pricing. Additional loadings may apply based on claims history (transparently disclosed).
        </p>
      </div>
    </div>
  );
};
