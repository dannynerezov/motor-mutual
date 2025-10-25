import { Shield, TrendingUp, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

export const PriceProtectionNotice = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Alert className="border-2 border-accent/30 bg-gradient-to-br from-accent/10 to-accent/5">
        <Shield className="h-5 w-5 text-accent" />
        <AlertTitle className="text-xl font-bold text-foreground mb-3">
          Understanding Claims and Price Protection
        </AlertTitle>
        <AlertDescription className="space-y-4 text-foreground">
          <p>
            <strong>Claims affect your renewal price</strong> - this is true for all insurance providers. 
            However, we minimize the impact through transparent pricing and membership price protection.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="border bg-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Not-At-Fault Claims</h4>
                    <p className="text-sm text-muted-foreground">
                      Zero impact on your premium. Processed through our accident management partners, 
                      your claims history stays clean.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border bg-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">At-Fault Claims</h4>
                    <p className="text-sm text-muted-foreground">
                      Transparent pricing adjustment explained upfront. No hidden penalties. 
                      Long-term members receive price protection benefits.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-sm font-medium">
              💡 <strong>Membership Price Protection:</strong> Loyal members who maintain continuous coverage 
              receive graduated price protection, reducing the impact of claims on renewal premiums over time.
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
