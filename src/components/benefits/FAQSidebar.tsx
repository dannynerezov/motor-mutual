import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQQuestion {
  question: string;
  answer: string;
  pds_reference: string;
}

interface FAQSidebarProps {
  faqData?: {
    questions: FAQQuestion[];
  };
}

export const FAQSidebar = ({ faqData }: FAQSidebarProps) => {
  const questions = faqData?.questions || [];

  if (questions.length === 0) {
    return (
      <aside className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Quick FAQ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              FAQ information will be available once the PDS is processed.
            </p>
          </CardContent>
        </Card>
      </aside>
    );
  }

  return (
    <aside className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Quick FAQ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {questions.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`}>
                <AccordionTrigger className="text-left text-sm font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {faq.answer}
                    </p>
                    {faq.pds_reference && (
                      <p className="text-xs text-primary font-medium">
                        Reference: {faq.pds_reference}
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </aside>
  );
};
