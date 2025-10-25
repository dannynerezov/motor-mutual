import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StateSelector } from "./StateSelector";
import { SuburbExplorer } from "./SuburbExplorer";
import { SuburbDetailView } from "./SuburbDetailView";

export type SuburbData = {
  suburb: string;
  state: string;
  postcode: string;
  avg_index: number;
  min_index: number;
  max_index: number;
  location_count: number;
};

export type StateStats = {
  state: string;
  avg_index: number;
  min_index: number;
  max_index: number;
  suburb_count: number;
  ranking: number;
  suburbs: SuburbData[];
  cheapest_suburb: SuburbData | null;
  most_expensive_suburb: SuburbData | null;
};

export const PricingExplorerWidget = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedSuburb, setSelectedSuburb] = useState<SuburbData | null>(null);

  const { data: suburbData, isLoading } = useQuery({
    queryKey: ["pricing-explorer-data"],
    queryFn: async () => {
      // Fetch first page to get total count
      const { data: firstPage, error: firstError } = await supabase.rpc(
        'get_suburb_pricing_analysis_paginated',
        { limit_rows: 1000, offset_rows: 0 }
      );

      if (firstError) throw firstError;
      if (!firstPage || firstPage.length === 0) return [];

      const totalCount = Number(firstPage[0].total_count);
      const allData = [...firstPage];

      // Calculate remaining pages
      const remainingPages = Math.ceil((totalCount - 1000) / 1000);

      // Fetch remaining pages in parallel
      if (remainingPages > 0) {
        const pagePromises = Array.from({ length: remainingPages }, (_, i) => {
          const offset = (i + 1) * 1000;
          return supabase.rpc('get_suburb_pricing_analysis_paginated', {
            limit_rows: 1000,
            offset_rows: offset
          });
        });

        const pageResults = await Promise.all(pagePromises);
        
        pageResults.forEach(result => {
          if (result.data) {
            allData.push(...result.data);
          }
        });
      }

      return allData.map((row: any) => ({
        suburb: row.suburb,
        state: row.state,
        postcode: row.postcode,
        avg_index: parseFloat(row.avg_index),
        min_index: parseFloat(row.min_index),
        max_index: parseFloat(row.max_index),
        location_count: parseInt(row.location_count),
      }));
    },
  });

  // Calculate state-level statistics
  const stateStats = useMemo<StateStats[]>(() => {
    if (!suburbData || suburbData.length === 0) return [];

    const stateGroups = suburbData.reduce((acc, suburb) => {
      if (!acc[suburb.state]) {
        acc[suburb.state] = [];
      }
      acc[suburb.state].push(suburb);
      return acc;
    }, {} as Record<string, SuburbData[]>);

    const stats = Object.entries(stateGroups).map(([state, suburbs]) => {
      const avgIndex = suburbs.reduce((sum, s) => sum + s.avg_index, 0) / suburbs.length;
      const minIndex = Math.min(...suburbs.map(s => s.min_index));
      const maxIndex = Math.max(...suburbs.map(s => s.max_index));
      
      const sortedByIndex = [...suburbs].sort((a, b) => a.avg_index - b.avg_index);

      return {
        state,
        avg_index: avgIndex,
        min_index: minIndex,
        max_index: maxIndex,
        suburb_count: suburbs.length,
        ranking: 0, // Will be set after sorting
        suburbs: sortedByIndex,
        cheapest_suburb: sortedByIndex[0] || null,
        most_expensive_suburb: sortedByIndex[sortedByIndex.length - 1] || null,
      };
    });

    // Sort by average index and assign rankings
    const sortedStats = stats.sort((a, b) => a.avg_index - b.avg_index);
    sortedStats.forEach((stat, index) => {
      stat.ranking = index + 1;
    });

    return sortedStats;
  }, [suburbData]);

  const selectedStateData = useMemo(() => {
    if (!selectedState) return null;
    return stateStats.find(s => s.state === selectedState) || null;
  }, [selectedState, stateStats]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="p-6 shadow-lg border-2 backdrop-blur-sm bg-card/95">
        {!selectedState ? (
          <StateSelector 
            stateStats={stateStats} 
            onSelectState={setSelectedState}
          />
        ) : !selectedSuburb ? (
          <SuburbExplorer
            stateData={selectedStateData!}
            onBack={() => setSelectedState(null)}
            onSelectSuburb={setSelectedSuburb}
          />
        ) : (
          <SuburbDetailView
            suburb={selectedSuburb}
            stateData={selectedStateData!}
            onBack={() => setSelectedSuburb(null)}
          />
        )}
      </Card>
    </div>
  );
};
