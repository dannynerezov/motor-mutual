import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const PremiumCalculator = () => {
  const [basePremium, setBasePremium] = useState("1000");
  const [index1, setIndex1] = useState("240");
  const [index2, setIndex2] = useState("560");

  const calculatePremium = (base: number, index: number) => {
    return (base * index) / 100;
  };

  const base = parseFloat(basePremium) || 0;
  const idx1 = parseFloat(index1) || 0;
  const idx2 = parseFloat(index2) || 0;

  const premium1 = calculatePremium(base, idx1);
  const premium2 = calculatePremium(base, idx2);
  const difference = Math.abs(premium1 - premium2);
  const percentageDiff = idx1 > 0 ? (((idx2 - idx1) / idx1) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Premium Calculator</CardTitle>
          <CardDescription>
            Calculate how the pricing index affects insurance premiums
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="basePremium">Base Premium Amount ($)</Label>
            <Input
              id="basePremium"
              type="number"
              value={basePremium}
              onChange={(e) => setBasePremium(e.target.value)}
              placeholder="1000"
            />
            <p className="text-xs text-muted-foreground">
              The premium cost at the cheapest location (Index 100)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="index1">Location A Index</Label>
              <Input
                id="index1"
                type="number"
                value={index1}
                onChange={(e) => setIndex1(e.target.value)}
                placeholder="240"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="index2">Location B Index</Label>
              <Input
                id="index2"
                type="number"
                value={index2}
                onChange={(e) => setIndex2(e.target.value)}
                placeholder="560"
              />
            </div>
          </div>

          <Button className="w-full" variant="outline">
            Calculate Difference
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>Premium comparison based on your inputs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Location A (Index {idx1})</div>
              <div className="text-3xl font-bold">${premium1.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {((idx1 - 100)).toFixed(0)}% more expensive than base
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Location B (Index {idx2})</div>
              <div className="text-3xl font-bold">${premium2.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {((idx2 - 100)).toFixed(0)}% more expensive than base
              </div>
            </div>
          </div>

          <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
            <div className="text-sm font-medium mb-1">Premium Difference</div>
            <div className="text-3xl font-bold text-primary">${difference.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Location B is {percentageDiff}% more expensive than Location A
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg text-sm space-y-2">
            <p className="font-semibold">What this means:</p>
            <p className="text-muted-foreground">
              For a policy that costs ${base.toFixed(0)} in the cheapest location (Index 100),
              you would pay ${premium1.toFixed(0)} in Location A and ${premium2.toFixed(0)} in
              Location B, creating a difference of ${difference.toFixed(0)}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
