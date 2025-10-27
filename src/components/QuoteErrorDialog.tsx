import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface QuoteErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  error: string;
  requestPayload?: any;
  responseData?: any;
}

export const QuoteErrorDialog = ({
  isOpen,
  onClose,
  error,
  requestPayload,
  responseData,
}: QuoteErrorDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Quote Generation Failed
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="request">
              <AccordionTrigger className="text-sm font-medium">
                Request Payload
              </AccordionTrigger>
              <AccordionContent>
                <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(requestPayload, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="response">
              <AccordionTrigger className="text-sm font-medium">
                Response Data
              </AccordionTrigger>
              <AccordionContent>
                <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(responseData, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

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
