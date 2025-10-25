import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database, Trash2 } from "lucide-react";

export function AdminDataCard() {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to delete ALL pricing data? This cannot be undone.")) {
      return;
    }

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("insurance_pricing_data")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;

      toast.success("All pricing data cleared successfully");
    } catch (error: any) {
      console.error("Clear error:", error);
      toast.error(`Failed to clear data: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Management
        </CardTitle>
        <CardDescription>
          Manage existing pricing data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleClearData}
          disabled={isDeleting}
          variant="destructive"
          className="w-full"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isDeleting ? "Clearing..." : "Clear All Data"}
        </Button>
      </CardContent>
    </Card>
  );
}
