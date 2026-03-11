import { Shield, Building2, Banknote, BarChart3, FileCheck } from "lucide-react";

const items = [
  { icon: Shield, text: "APRA-Regulated Underwriter" },
  { icon: Building2, text: "AFCA Member — Full Dispute Access" },
  { icon: Banknote, text: "$20M Third-Party Cover" },
  { icon: BarChart3, text: "Daily Market Monitoring" },
  { icon: FileCheck, text: "AFSL Authorised Representative" },
];

export const APRATrustStrip = () => {
  return (
    <section className="bg-primary py-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {items.map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-primary-foreground/90">
              <item.icon className="w-4 h-4 text-accent flex-shrink-0" />
              <span className="text-xs md:text-sm font-medium whitespace-nowrap">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
