import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const getIndexBadge = (index: number) => {
  if (index <= 150) return <Badge className="bg-green-500">Affordable</Badge>;
  if (index <= 250) return <Badge className="bg-yellow-500">Moderate</Badge>;
  if (index <= 400) return <Badge className="bg-orange-500">Expensive</Badge>;
  return <Badge className="bg-red-500">Very Expensive</Badge>;
};

export const SuburbAnalysisCard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["suburb-analysis"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insurance_pricing_data")
        .select("suburb, state, postcode, index_value")
        .not("index_value", "is", null)
        .not("suburb", "is", null);

      if (error) throw error;

      // Group by suburb
      const suburbGroups = data.reduce((acc: any, row) => {
        const index = parseFloat(row.index_value || "0");
        
        // Skip invalid data
        if (isNaN(index) || index <= 0 || !row.suburb) return acc;
        
        const key = `${row.suburb}-${row.state}-${row.postcode}`;
        
        if (!acc[key]) {
          acc[key] = {
            suburb: row.suburb,
            state: row.state?.toUpperCase() || "",
            postcode: row.postcode,
            indices: [],
            count: 0,
          };
        }
        
        acc[key].indices.push(index);
        acc[key].count++;
        
        return acc;
      }, {});

      const suburbStats = Object.values(suburbGroups).map((group: any) => {
        const avg = group.indices.reduce((a: number, b: number) => a + b, 0) / group.indices.length;
        return {
          suburb: group.suburb,
          state: group.state,
          postcode: group.postcode,
          avg_index: parseFloat(avg.toFixed(2)),
          location_count: group.count,
        };
      });

      const sorted = suburbStats.sort((a, b) => b.avg_index - a.avg_index);
      
      return {
        topExpensive: sorted.slice(0, 20),
        topCheapest: sorted.slice(-20).reverse(),
        all: sorted,
      };
    },
  });

  const filteredExpensive = data?.topExpensive.filter((item) =>
    item.suburb.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.postcode.includes(searchTerm)
  );

  const filteredCheapest = data?.topCheapest.filter((item) =>
    item.suburb.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.postcode.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Input
          placeholder="Search suburbs or postcodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 20 Most Expensive Suburbs</CardTitle>
            <CardDescription>Suburbs with the highest average pricing index</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Suburb</TableHead>
                    <TableHead>Postcode</TableHead>
                    <TableHead>Index</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpensive?.map((item, index) => (
                    <TableRow key={`${item.suburb}-${item.postcode}`}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.suburb}</div>
                          <div className="text-xs text-muted-foreground">{item.state}</div>
                        </div>
                      </TableCell>
                      <TableCell>{item.postcode}</TableCell>
                      <TableCell>
                        <div className="font-semibold">{item.avg_index}</div>
                        <div className="text-xs text-muted-foreground">
                          ${((item.avg_index / 100) * 1000).toFixed(0)} premium
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 20 Most Affordable Suburbs</CardTitle>
            <CardDescription>Suburbs with the lowest average pricing index</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Suburb</TableHead>
                    <TableHead>Postcode</TableHead>
                    <TableHead>Index</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCheapest?.map((item, index) => (
                    <TableRow key={`${item.suburb}-${item.postcode}`}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.suburb}</div>
                          <div className="text-xs text-muted-foreground">{item.state}</div>
                        </div>
                      </TableCell>
                      <TableCell>{item.postcode}</TableCell>
                      <TableCell>
                        <div className="font-semibold">{item.avg_index}</div>
                        <div className="text-xs text-muted-foreground">
                          ${((item.avg_index / 100) * 1000).toFixed(0)} premium
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
