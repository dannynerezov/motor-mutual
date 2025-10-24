import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Clock, ExternalLink } from "lucide-react";

interface ContactBrokerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContactBrokerDialog = ({ open, onOpenChange }: ContactBrokerDialogProps) => {
  const handleCall = () => {
    window.location.href = "tel:1300123456";
  };

  const handleEmail = () => {
    window.location.href = "mailto:info@nationalcover.com.au?subject=Motor Cover Mutual - Quote Inquiry";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Contact National Cover</DialogTitle>
          <DialogDescription>
            Get in touch with our broker partner to complete your purchase
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Phone</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Call us directly to finalize your policy
                </p>
                <Button onClick={handleCall} className="w-full" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call 1300 123 456
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Email</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Send us your quote details
                </p>
                <Button onClick={handleEmail} variant="outline" className="w-full" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Us
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Business Hours</h4>
                <p className="text-sm text-muted-foreground">
                  Monday - Friday: 9:00 AM - 5:00 PM AEST<br />
                  Saturday: 9:00 AM - 1:00 PM AEST<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Quick Tip:</strong> Have your quote reference number ready when contacting us to expedite the process.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};