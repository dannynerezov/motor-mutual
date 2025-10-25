import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const getIndexBadge = (index: number) => {
  if (index <= 150) return <Badge className="bg-accent">Affordable</Badge>;
  if (index <= 250) return <Badge className="bg-secondary">Moderate</Badge>;
  if (index <= 400) return <Badge className="bg-muted-foreground">Expensive</Badge>;
  return <Badge className="bg-muted-foreground">Very Expensive</Badge>;
};

export const PostcodeAnalysisCard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["postcode-analysis"],
    queryFn: async () => {
      const { data: rpcData, error } = await supabase.rpc('get_postcode_pricing_analysis');

      if (error) throw error;

      // Data already comes aggregated from database with all postcodes
      const postcodeStats = rpcData.map((row: any) => ({
        postcode: row.postcode,
        state: row.state,
        avg_index: parseFloat(row.avg_index),
        location_count: parseInt(row.location_count),
      }));

      return {
        topExpensive: postcodeStats.slice(0, 10),
        topCheapest: postcodeStats.slice(-10).reverse(),
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[400px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Most Expensive Postcodes</CardTitle>
          <CardDescription>Postcodes with the highest average pricing index</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Postcode</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Avg Index</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.topExpensive.map((item, index) => (
                <TableRow key={`${item.postcode}-${item.state}`}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item.postcode}</TableCell>
                  <TableCell>{item.state}</TableCell>
                  <TableCell className="font-semibold">{item.avg_index}</TableCell>
                  <TableCell>{getIndexBadge(item.avg_index)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs text-muted-foreground mt-4">
            * A $1,000 base premium in these postcodes ranges from $
            {((data?.topExpensive[9]?.avg_index || 0) * 10).toFixed(0)} to $
            {((data?.topExpensive[0]?.avg_index || 0) * 10).toFixed(0)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 10 Most Affordable Postcodes</CardTitle>
          <CardDescription>Postcodes with the lowest average pricing index</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Postcode</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Avg Index</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.topCheapest.map((item, index) => (
                <TableRow key={`${item.postcode}-${item.state}`}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item.postcode}</TableCell>
                  <TableCell>{item.state}</TableCell>
                  <TableCell className="font-semibold">{item.avg_index}</TableCell>
                  <TableCell>{getIndexBadge(item.avg_index)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs text-muted-foreground mt-4">
            * A $1,000 base premium in these postcodes ranges from $
            {((data?.topCheapest[0]?.avg_index || 0) * 10).toFixed(0)} to $
            {((data?.topCheapest[9]?.avg_index || 0) * 10).toFixed(0)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
