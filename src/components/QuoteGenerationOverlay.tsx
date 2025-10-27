import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle } from "lucide-react";

interface QuoteGenerationOverlayProps {
  isVisible: boolean;
}

export const QuoteGenerationOverlay = ({ isVisible }: QuoteGenerationOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <Loader2 className="w-16 h-16 animate-spin mx-auto text-primary" />
          
          <div>
            <h3 className="text-2xl font-bold mb-2">Generating Your Quote</h3>
            <p className="text-sm text-muted-foreground">
              We're fetching the best rates from our partner insurers...
            </p>
          </div>

          <div className="space-y-3 text-left max-w-xs mx-auto">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              <span>Analyzing driver profile</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              <span>Calculating risk assessment</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-primary flex-shrink-0" />
              <span>Fetching third-party pricing</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
