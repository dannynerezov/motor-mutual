import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type ColumnType = 'mutual' | 'traditional' | 'clubs';

const rows = [
  {
    aspect: "Pricing",
    mutual: { icon: "check", text: "Simple vehicle value-based — same price everywhere" },
    traditional: { icon: "x", text: "Complex location-based, can be 6× higher in metro areas" },
    clubs: { icon: "warn", text: "Variable, opaque fee structures" },
  },
  {
    aspect: "Third-Party Cover",
    mutual: { icon: "check", text: "$20M APRA-regulated liability included" },
    traditional: { icon: "check", text: "APRA-regulated, included" },
    clubs: { icon: "x", text: "Not APRA-regulated, limited or no cover" },
  },
  {
    aspect: "Claims Speed",
    mutual: { icon: "check", text: "5–10 days average, cash settlements standard" },
    traditional: { icon: "x", text: "15–30+ days, insurer-controlled repairs" },
    clubs: { icon: "x", text: "20–40+ days, network conflicts" },
  },
  {
    aspect: "Regulation",
    mutual: { icon: "check", text: "Corporations Act 2001, AFCA member" },
    traditional: { icon: "check", text: "ASIC regulated, AFCA member" },
    clubs: { icon: "x", text: "Not ASIC regulated, no AFCA access" },
  },
  {
    aspect: "Repair Control",
    mutual: { icon: "check", text: "Your choice of repairer, you control repairs" },
    traditional: { icon: "x", text: "Insurer steers to network shops, causes delays" },
    clubs: { icon: "x", text: "Must use affiliated repairers, club earns from claims" },
  },
];

const iconMap = {
  check: <Check className="h-5 w-5 text-accent flex-shrink-0" />,
  x: <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />,
  warn: <AlertTriangle className="h-5 w-5 text-accent flex-shrink-0" />,
};

const iconMapSmall = {
  check: <Check className="h-4 w-4 text-accent flex-shrink-0" />,
  x: <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />,
  warn: <AlertTriangle className="h-4 w-4 text-accent flex-shrink-0" />,
};

export const HowItWorksComparison = () => {
  const [activeColumn, setActiveColumn] = useState<ColumnType>('mutual');

  return (
    <div>
      <div className="text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
          Why Choose The Mutual?
        </h3>
        <p className="text-lg text-primary-foreground/70 max-w-3xl mx-auto">
          Compare what you <span className="font-semibold text-accent">get</span> with The Mutual vs what you <span className="font-semibold text-primary-foreground/50">miss</span> with others
        </p>
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block border-2 overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold border-r w-[180px]">Feature</th>
                <th className="px-6 py-4 text-center font-semibold border-r bg-accent/10">
                  <span className="text-accent">The Mutual ✓</span>
                </th>
                <th className="px-6 py-4 text-center font-semibold border-r">Traditional Insurance</th>
                <th className="px-6 py-4 text-center font-semibold">Rideshare Clubs</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((row) => (
                <tr key={row.aspect} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-5 font-semibold border-r">{row.aspect}</td>
                  <td className="px-6 py-5 border-r bg-accent/5">
                    <div className="flex items-center gap-2 justify-center">
                      {iconMap[row.mutual.icon as keyof typeof iconMap]}
                      <span className="text-sm font-semibold">{row.mutual.text}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 border-r">
                    <div className="flex items-center gap-2 justify-center">
                      {iconMap[row.traditional.icon as keyof typeof iconMap]}
                      <span className="text-sm">{row.traditional.text}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 justify-center">
                      {iconMap[row.clubs.icon as keyof typeof iconMap]}
                      <span className="text-sm">{row.clubs.text}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Mobile Carousel */}
      <div className="md:hidden relative">
        <div className="flex justify-center mb-4">
          <div className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
            activeColumn === 'mutual' 
              ? 'bg-accent text-accent-foreground' 
              : 'bg-muted text-muted-foreground'
          }`}>
            {activeColumn === 'mutual' && '🏆 The Mutual'}
            {activeColumn === 'traditional' && 'Traditional Insurance'}
            {activeColumn === 'clubs' && 'Rideshare Clubs'}
          </div>
        </div>

        <Card className="border-2">
          <CardContent className="p-0">
            <div className="grid grid-cols-[100px_1fr]">
              <div className="sticky left-0 bg-muted/50 border-r-2 z-10">
                <div className="px-3 py-4 text-xs font-semibold border-b">Feature</div>
                {rows.map((r) => (
                  <div key={r.aspect} className="px-3 py-4 text-xs font-medium border-b min-h-[60px] flex items-center">
                    {r.aspect}
                  </div>
                ))}
              </div>
              <div className={`transition-colors duration-300 ${activeColumn === 'mutual' ? 'bg-accent/5' : ''}`}>
                <div className="px-3 py-4 text-xs font-semibold text-center border-b">
                  {activeColumn === 'mutual' ? 'The Mutual' : activeColumn === 'traditional' ? 'Traditional' : 'Clubs'}
                </div>
                {rows.map((r) => {
                  const col = r[activeColumn];
                  return (
                    <div key={r.aspect} className="px-3 py-4 border-b min-h-[60px] flex items-center justify-center">
                      <div className="flex items-center gap-2">
                        {iconMapSmall[col.icon as keyof typeof iconMapSmall]}
                        <span className="text-xs">{col.text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-card/95 backdrop-blur shadow-lg disabled:opacity-30"
          onClick={() => setActiveColumn(activeColumn === 'traditional' ? 'mutual' : activeColumn === 'clubs' ? 'traditional' : 'mutual')}
          disabled={activeColumn === 'mutual'}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-card/95 backdrop-blur shadow-lg disabled:opacity-30"
          onClick={() => setActiveColumn(activeColumn === 'mutual' ? 'traditional' : activeColumn === 'traditional' ? 'clubs' : 'clubs')}
          disabled={activeColumn === 'clubs'}>
          <ChevronRight className="h-5 w-5" />
        </Button>

        <div className="flex justify-center gap-2 mt-4">
          {(['mutual', 'traditional', 'clubs'] as ColumnType[]).map((col) => (
            <button key={col}
              className={`transition-all duration-300 rounded-full ${activeColumn === col ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-muted hover:bg-muted-foreground/50'}`}
              onClick={() => setActiveColumn(col)} />
          ))}
        </div>
      </div>
    </div>
  );
};
