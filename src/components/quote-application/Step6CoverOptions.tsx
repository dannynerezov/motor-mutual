import { QuoteApplicationFormData } from "@/types/quoteApplication";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";

interface Props {
  formData: QuoteApplicationFormData;
  updateField: (field: keyof QuoteApplicationFormData, value: string) => void;
}

export function Step6CoverOptions({ formData, updateField }: Props) {
  const handleExtrasChange = (extra: string, checked: boolean) => {
    const current = formData.policy_extras ? formData.policy_extras.split("\n").filter(Boolean) : [];
    if (checked) current.push(extra);
    else {
      const idx = current.indexOf(extra);
      if (idx > -1) current.splice(idx, 1);
    }
    updateField("policy_extras", current.join("\n"));
  };

  const isExtraSelected = (extra: string) => formData.policy_extras?.includes(extra) || false;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-muted px-4 py-3 -mx-4 md:-mx-6 border-l-4 border-primary">
        <h2 className="text-xl font-medium">Cover Options</h2>
      </div>

      <div className="space-y-2">
        <Label>When would you like the policy to start?</Label>
        <Input
          type="date"
          value={formData.policy_start_date}
          onChange={(e) => updateField("policy_start_date", e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Policy Extras (optional)</Label>
        {["No excess glass repair or replacement", "Hire car or alternative transport after incident", "Choose any repairer"].map((extra) => (
          <div key={extra} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
            <Checkbox id={`ext-${extra}`} checked={isExtraSelected(extra)} onCheckedChange={(checked) => handleExtrasChange(extra, checked as boolean)} />
            <Label htmlFor={`ext-${extra}`} className="flex-1 cursor-pointer">{extra}</Label>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">Roadside Assistance?</Label>
        <RadioGroup value={formData.roadside_assistance} onValueChange={(val) => updateField("roadside_assistance", val)}>
          {["Yes", "No"].map((opt) => (
            <div key={opt} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
              <RadioGroupItem value={opt} id={`road-${opt}`} />
              <Label htmlFor={`road-${opt}`} className="flex-1 cursor-pointer">{opt}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
