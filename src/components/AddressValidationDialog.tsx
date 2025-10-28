import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, AlertCircle, Loader2, ChevronDown, MapPin, Search } from "lucide-react";

interface AddressValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: 'idle' | 'searching' | 'found' | 'validating' | 'success' | 'error';
  searchResults?: number;
  validatedAddress?: {
    line1: string;
    suburb: string;
    state: string;
    postcode: string;
    lurn: string;
    quality: string;
  };
  error?: string;
  logs?: string[];
}

const StepIndicator = ({ step, status }: { step: string; status: 'pending' | 'active' | 'complete' }) => {
  return (
    <div className="flex items-center gap-3">
      {status === 'pending' && (
        <div className="w-6 h-6 rounded-full border-2 border-muted flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-muted" />
        </div>
      )}
      {status === 'active' && (
        <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
        </div>
      )}
      {status === 'complete' && (
        <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
      )}
      <span className={`text-sm font-medium ${status === 'complete' ? 'text-green-600' : status === 'active' ? 'text-primary' : 'text-muted-foreground'}`}>
        {step}
      </span>
    </div>
  );
};

export const AddressValidationDialog = ({
  open,
  onOpenChange,
  status,
  searchResults,
  validatedAddress,
  error,
  logs = []
}: AddressValidationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Validating Your Address
          </DialogTitle>
          <DialogDescription>
            We're verifying your address with our insurance database
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Status Progress */}
          <div className="space-y-3 py-4">
            <StepIndicator 
              step="Searching for address" 
              status={status === 'searching' ? 'active' : (status === 'found' || status === 'validating' || status === 'success') ? 'complete' : 'pending'} 
            />
            {searchResults !== undefined && status !== 'searching' && (
              <p className="text-xs text-muted-foreground ml-9">
                Found {searchResults} {searchResults === 1 ? 'match' : 'matches'}
              </p>
            )}
            
            <StepIndicator 
              step="Validating with insurance system" 
              status={status === 'validating' ? 'active' : status === 'success' ? 'complete' : 'pending'} 
            />
            
            <StepIndicator 
              step="Address confirmed" 
              status={status === 'success' ? 'complete' : 'pending'} 
            />
          </div>

          {/* Results Display */}
          {validatedAddress && (
            <Card className="border-green-600 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Validated Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{validatedAddress.line1}</p>
                  <p className="text-muted-foreground">
                    {validatedAddress.suburb}, {validatedAddress.state} {validatedAddress.postcode}
                  </p>
                  <p className="text-xs text-muted-foreground pt-2 border-t border-green-200 mt-2">
                    LURN: ****…{validatedAddress.lurn.slice(-8)} • Quality Level: {validatedAddress.quality}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Technical Logs (Collapsible) */}
          {logs.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:underline">
                <ChevronDown className="w-3 h-3" />
                Show technical details
              </CollapsibleTrigger>
              <CollapsibleContent>
                <pre className="mt-2 p-3 bg-gray-900 text-green-400 text-xs rounded max-h-40 overflow-auto font-mono">
                  {logs.join('\n')}
                </pre>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Error Display */}
          {status === 'error' && error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          {status === 'success' && (
            <Button onClick={() => onOpenChange(false)}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Address
            </Button>
          )}
          {status === 'error' && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Try Again
            </Button>
          )}
          {(status === 'searching' || status === 'validating') && (
            <Button disabled>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Validating...
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
