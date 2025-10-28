import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ExternalLink } from "lucide-react";

interface QuoteErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  error: string;
  requestPayload?: any;
  responseData?: any;
  sentPayload?: any;
}

export const QuoteErrorDialog = ({
  isOpen,
  onClose,
  error,
  requestPayload,
  responseData,
  sentPayload,
}: QuoteErrorDialogProps) => {
  // Extract key info from payloads
  const extractKeyInfo = (payload: any) => {
    if (!payload) return null;
    return {
      vehicle_nvic: payload?.vehicle?.vehicle_nvic || payload?.vehicleDetails?.nvic,
      driver_name: payload?.driver ? `${payload.driver.first_name} ${payload.driver.last_name}` : null,
      address_lurn: payload?.driver?.address_lurn || payload?.riskAddress?.lurn,
      policy_start: payload?.policyStartDate || payload?.quoteDetails?.policyStartDate,
    };
  };

  const requestInfo = extractKeyInfo(requestPayload);
  const hasLurnInRequest = requestPayload?.driver?.address_lurn;
  const hasLurnInSuncorpPayload = requestPayload?.riskAddress?.lurn;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Quote Generation Failed
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
          </Alert>

          {/* Quick Diagnostic */}
          <div className="border rounded-lg p-4 bg-muted/50 space-y-2">
            <h3 className="font-semibold text-sm mb-2">Quick Diagnostic</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Badge variant={requestInfo?.vehicle_nvic ? "default" : "destructive"} className="w-3 h-3 rounded-full p-0" />
                <span>Vehicle NVIC: {requestInfo?.vehicle_nvic || "Missing"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={requestInfo?.driver_name ? "default" : "destructive"} className="w-3 h-3 rounded-full p-0" />
                <span>Driver: {requestInfo?.driver_name || "Missing"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={hasLurnInRequest ? "default" : "destructive"} className="w-3 h-3 rounded-full p-0" />
                <span>LURN in Request: {hasLurnInRequest ? "✓ Present" : "✗ Missing"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={requestInfo?.policy_start ? "default" : "destructive"} className="w-3 h-3 rounded-full p-0" />
                <span>Policy Start: {requestInfo?.policy_start || "Missing"}</span>
              </div>
            </div>

            {!hasLurnInRequest && (
              <Alert variant="destructive" className="mt-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>CRITICAL:</strong> LURN (address validation ID) is missing from the request. 
                  Please select an address from the autocomplete suggestions to validate it.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Detailed Tabs */}
          <Tabs defaultValue="request" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="request">Frontend Request</TabsTrigger>
              <TabsTrigger value="response">API Response</TabsTrigger>
              <TabsTrigger value="payload">Payload Used</TabsTrigger>
              <TabsTrigger value="trace">Endpoint Trace</TabsTrigger>
            </TabsList>

            <TabsContent value="request" className="space-y-2">
              <div className="text-sm text-muted-foreground mb-2">
                Payload sent from frontend to <code className="text-xs bg-muted px-1 py-0.5 rounded">suncorp-single-quote</code> edge function:
              </div>
              <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-96 border">
                {JSON.stringify(requestPayload, null, 2)}
              </pre>
            </TabsContent>

            <TabsContent value="response" className="space-y-2">
              <div className="text-sm text-muted-foreground mb-2">
                Response received from the API:
              </div>
              <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-96 border">
                {JSON.stringify(responseData, null, 2)}
              </pre>
            </TabsContent>

            <TabsContent value="payload" className="space-y-2">
              <div className="text-sm text-muted-foreground mb-2">
                Exact JSON payload sent to Suncorp's quote API:
                <br />
                <code className="text-xs bg-muted px-1 py-0.5 rounded mt-1 inline-block">
                  POST /pi-motor-quote-api/api/v1/insurance/motor/brands/sun/quotes
                </code>
              </div>
              {sentPayload ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mb-2"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(sentPayload, null, 2));
                    }}
                  >
                    📋 Copy Payload to Clipboard
                  </Button>
                  <pre className="text-xs bg-gray-900 text-blue-400 p-4 rounded-lg overflow-auto max-h-96 border font-mono">
                    {JSON.stringify(sentPayload, null, 2)}
                  </pre>
                </>
              ) : (
                <Alert>
                  <AlertDescription>
                    Payload not available. This may occur if the error happened before the payload was constructed.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="trace" className="space-y-3">
              <div className="text-sm text-muted-foreground mb-2">
                API call chain and endpoint details:
              </div>
              <div className="space-y-2 text-sm">
                <div className="p-3 border rounded bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>1</Badge>
                    <strong>Frontend → Edge Function</strong>
                  </div>
                  <code className="text-xs block bg-background p-2 rounded mt-1">
                    POST /functions/v1/suncorp-single-quote
                  </code>
                  <div className="text-xs text-muted-foreground mt-1">
                    Status: Request sent successfully
                  </div>
                </div>

                <div className="p-3 border rounded bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>2</Badge>
                    <strong>Edge Function → Suncorp API</strong>
                  </div>
                  <code className="text-xs block bg-background p-2 rounded mt-1">
                    POST api.suncorp.com.au/pi-motor-quote-api/api/v1/insurance/motor/brands/sun/quotes
                  </code>
                  <div className="text-xs text-muted-foreground mt-1">
                    Status: {responseData ? "Response received (see Response tab)" : "Failed"}
                  </div>
                </div>

                <div className="p-3 border rounded bg-yellow-50 border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <strong className="text-yellow-900">Failure Point</strong>
                  </div>
                  <div className="text-xs text-yellow-800">
                    {error.includes("address") || error.includes("LURN") 
                      ? "Address validation or LURN missing"
                      : error.includes("vehicle") || error.includes("NVIC")
                      ? "Vehicle lookup or NVIC issue"
                      : "Quote generation failed at Suncorp API"}
                  </div>
                </div>

                <a 
                  href="https://docs.lovable.dev/features/cloud" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  View edge function logs in Lovable Cloud
                </a>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
