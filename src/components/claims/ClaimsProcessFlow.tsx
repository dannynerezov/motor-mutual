import { FileText, GitBranch, Users, Wrench, DollarSign, CheckCircle, AlertCircle, FileSearch } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const ClaimsProcessFlow = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          How Your Claim is Processed
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Clear, step-by-step process from submission to resolution
        </p>
      </div>

      {/* Step 1: Submission */}
      <div className="mb-8">
        <Card className="border-2 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-bold">Step 1</span>
                  <h3 className="text-xl font-bold text-foreground">Submit Claim Form</h3>
                </div>
                <p className="text-muted-foreground">
                  Complete our simple online claim form with incident details, photos, and supporting documentation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Step 2: Fault Assessment */}
      <div className="mb-8">
        <Card className="border-2 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <GitBranch className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-bold">Step 2</span>
                  <h3 className="text-xl font-bold text-foreground">Fault Assessment</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  We determine if you're at fault or not at fault. This determines which claims path you follow.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Paths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Not At Fault Path */}
        <div className="space-y-4">
          <div className="bg-accent/5 border-2 border-accent/30 rounded-2xl p-4 text-center font-bold text-foreground">
            Not At Fault Path
          </div>

          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Accident Management Partner</h4>
                  <p className="text-sm text-muted-foreground">Partner assigned to handle your claim</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Wrench className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Replacement Vehicle & Repairs</h4>
                  <p className="text-sm text-muted-foreground">Free replacement vehicle arranged, repairs organized through at-fault party</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/40 bg-accent/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Resolved - No Cost to You</h4>
                  <p className="text-sm text-muted-foreground">Vehicle repaired, claims history protected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* At Fault Path */}
        <div className="space-y-4">
          <div className="bg-primary/10 border-2 border-primary/30 rounded-2xl p-4 text-center font-bold text-foreground">
            At Fault / Single Vehicle Path
          </div>

          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <FileSearch className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Damage Assessment</h4>
                  <p className="text-sm text-muted-foreground">Independent assessment of vehicle damage (2-3 days)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Settlement Offer</h4>
                  <p className="text-sm text-muted-foreground">Cash settlement amount calculated and presented</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Accept or Dispute?</h4>
                  <p className="text-sm text-muted-foreground">If you disagree, enter dispute resolution process</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/40 bg-accent/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Cash Payment Issued</h4>
                  <p className="text-sm text-muted-foreground">Your choice: Repair or keep the cash (5-10 days total)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center p-6 bg-muted/50 rounded-2xl">
        <p className="text-foreground font-medium">
          💚 Both paths lead to fast, fair resolution - typically within 5-10 business days
        </p>
      </div>
    </div>
  );
};
