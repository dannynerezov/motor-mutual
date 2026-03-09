import { Phone, Mail, Clock, MessageCircle } from "lucide-react";

export function Step7TermsSignature() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-muted px-4 py-3 -mx-4 md:-mx-6 border-l-4 border-primary">
        <h2 className="text-xl font-medium">Complete Your Application</h2>
      </div>

      <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <MessageCircle className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold">Almost There!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your application details have been saved. To complete your rideshare insurance quote, 
          please contact <strong>National Cover</strong> directly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="tel:1300843834"
          className="flex items-center gap-3 p-4 border-2 border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold">Call Us</p>
            <p className="text-sm text-primary font-medium">1300 843 834</p>
          </div>
        </a>

        <a
          href="mailto:info@nationalcover.com.au"
          className="flex items-center gap-3 p-4 border-2 border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold">Email Us</p>
            <p className="text-sm text-primary font-medium">info@nationalcover.com.au</p>
          </div>
        </a>
      </div>

      <div className="flex items-center gap-3 p-4 bg-muted/50 border border-border rounded-lg">
        <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Business Hours</p>
          <p>Monday – Friday: 9:00 AM – 5:00 PM AEST</p>
        </div>
      </div>
    </div>
  );
}
