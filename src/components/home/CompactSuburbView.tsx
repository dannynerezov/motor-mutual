import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";

type SuburbData = {
  suburb: string;
  postcode: string;
  avg_index: number;
  min_index: number;
  max_index: number;
  location_count: number;
};

type CompactSuburbViewProps = {
  state: string;
  context: 'cheapest' | 'expensive';
  onBack: () => void;
};

export const CompactSuburbView = ({ state, context, onBack }: CompactSuburbViewProps) => {
  const { data: rawSuburbData, isLoading, error } = useQuery({
    queryKey: ["state-suburbs", state],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_state_suburbs', {
        state_filter: state,
      });

      if (error) throw error;
      if (!data || data.length === 0) return [];

      return data.map((row: any) => ({
        suburb: row.suburb,
        postcode: row.postcode,
        avg_index: parseFloat(row.avg_index),
        min_index: parseFloat(row.min_index),
        max_index: parseFloat(row.max_index),
        location_count: parseInt(row.location_count),
      }));
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const suburbData = rawSuburbData || [];
  
  // Get top 5 based on context
  const displaySuburbs = context === 'cheapest' 
    ? suburbData.slice(0, 5) 
    : [...suburbData].reverse().slice(0, 5);

  const isCheapest = context === 'cheapest';

  if (isLoading) {
    return (
      <Card className={`border-2 ${isCheapest ? 'border-primary/30 bg-primary/5 dark:border-primary/50 dark:bg-primary/10' : 'border-muted bg-muted/30 dark:border-muted dark:bg-muted/10'}`}>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Error Loading Suburbs</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to load suburb data. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  if (displaySuburbs.length === 0) {
    return (
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>{state}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No suburb data available for {state}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${isCheapest ? 'border-primary/30 bg-primary/5 dark:border-primary/50 dark:bg-primary/10' : 'border-muted bg-muted/30 dark:border-muted dark:bg-muted/10'}`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="hover:bg-background/80"
            aria-label="Return to state comparison"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-xl">{state}</CardTitle>
            <p className={`text-sm ${isCheapest ? 'text-accent' : 'text-muted-foreground'}`}>
              Top {displaySuburbs.length} {isCheapest ? 'Cheapest' : 'Most Expensive'} Suburbs
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displaySuburbs.map((suburb, index) => (
            <div 
              key={`${suburb.suburb}-${suburb.postcode}`} 
              className="flex items-center justify-between p-3 rounded-lg bg-background/50 border"
            >
              <div className="flex items-center gap-3">
                <div className={`text-2xl font-bold ${isCheapest ? 'text-accent' : 'text-muted-foreground'}`}>
                  #{index + 1}
                </div>
                <div>
                  <div className="font-semibold text-base">{suburb.suburb}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{suburb.postcode}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{suburb.location_count} locations</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${isCheapest ? 'text-accent' : 'text-muted-foreground'}`}>
                  {suburb.avg_index.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Avg. Index</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
