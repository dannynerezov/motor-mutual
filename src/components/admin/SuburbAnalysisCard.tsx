import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Download } from "lucide-react";

const getIndexBadge = (index: number) => {
  if (index <= 150) return <Badge className="bg-green-500">Affordable</Badge>;
  if (index <= 250) return <Badge className="bg-yellow-500">Moderate</Badge>;
  if (index <= 400) return <Badge className="bg-orange-500">Expensive</Badge>;
  return <Badge className="bg-red-500">Very Expensive</Badge>;
};

type SortColumn = "rank" | "suburb" | "state" | "postcode" | "avg_index" | "location_count";
type SortDirection = "asc" | "desc";

export const SuburbAnalysisCard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("ALL");
  const [sortColumn, setSortColumn] = useState<SortColumn>("avg_index");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

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

  // Filter, sort and paginate data
  const processedData = useMemo(() => {
    if (!data?.all) return { suburbs: [], total: 0, stats: null };

    // Apply filters
    let filtered = data.all.filter((item) => {
      const matchesSearch = searchTerm === "" || 
        item.suburb.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.postcode.includes(searchTerm);
      const matchesState = stateFilter === "ALL" || item.state === stateFilter;
      return matchesSearch && matchesState;
    });

    // Calculate stats
    const stats = {
      total: filtered.length,
      avgIndex: filtered.length > 0 
        ? filtered.reduce((sum, item) => sum + item.avg_index, 0) / filtered.length 
        : 0,
      minIndex: filtered.length > 0 ? Math.min(...filtered.map(item => item.avg_index)) : 0,
      maxIndex: filtered.length > 0 ? Math.max(...filtered.map(item => item.avg_index)) : 0,
    };

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortColumn) {
        case "suburb":
          aValue = a.suburb.toLowerCase();
          bValue = b.suburb.toLowerCase();
          break;
        case "state":
          aValue = a.state;
          bValue = b.state;
          break;
        case "postcode":
          aValue = a.postcode;
          bValue = b.postcode;
          break;
        case "avg_index":
          aValue = a.avg_index;
          bValue = b.avg_index;
          break;
        case "location_count":
          aValue = a.location_count;
          bValue = b.location_count;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    // Add rank based on sorted position
    const withRank = filtered.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    // Apply pagination
    const start = (currentPage - 1) * pageSize;
    const paginated = withRank.slice(start, start + pageSize);

    return {
      suburbs: paginated,
      total: filtered.length,
      stats,
      allFiltered: withRank
    };
  }, [data, searchTerm, stateFilter, sortColumn, sortDirection, currentPage, pageSize]);

  const totalPages = Math.ceil(processedData.total / pageSize);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection(column === "avg_index" ? "desc" : "asc");
    }
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    if (!processedData.allFiltered) return;
    
    const headers = ["Rank", "Suburb", "State", "Postcode", "Average Index", "Locations", "Premium ($)"];
    const rows = processedData.allFiltered.map(item => [
      item.rank,
      item.suburb,
      item.state,
      item.postcode,
      item.avg_index,
      item.location_count,
      ((item.avg_index / 100) * 1000).toFixed(0)
    ]);
    
    const csv = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suburb-analysis-${stateFilter}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === "asc" ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />;
  };

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
      {/* Summary Statistics */}
      {processedData.stats && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Total Suburbs</div>
                <div className="text-2xl font-bold">{data?.all.length.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Filtered Results</div>
                <div className="text-2xl font-bold">{processedData.stats.total.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Average Index</div>
                <div className="text-2xl font-bold">{processedData.stats.avgIndex.toFixed(1)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Index Range</div>
                <div className="text-2xl font-bold">
                  {processedData.stats.minIndex.toFixed(0)} - {processedData.stats.maxIndex.toFixed(0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <Select value={stateFilter} onValueChange={(value) => { setStateFilter(value); setCurrentPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All States</SelectItem>
            <SelectItem value="NSW">NSW</SelectItem>
            <SelectItem value="VIC">VIC</SelectItem>
            <SelectItem value="QLD">QLD</SelectItem>
            <SelectItem value="SA">SA</SelectItem>
            <SelectItem value="WA">WA</SelectItem>
            <SelectItem value="TAS">TAS</SelectItem>
            <SelectItem value="NT">NT</SelectItem>
            <SelectItem value="ACT">ACT</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search suburbs or postcodes..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="max-w-md"
        />

        <Button onClick={handleExportCSV} variant="outline" className="ml-auto">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle>Suburb Pricing Analysis</CardTitle>
          <CardDescription>
            All {processedData.total.toLocaleString()} suburbs ranked by average insurance index
            {processedData.total < (data?.all.length || 0) && ` (filtered from ${data?.all.length.toLocaleString()} total)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("suburb")} className="h-8 p-0 hover:bg-transparent">
                      Suburb
                      <SortIcon column="suburb" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("state")} className="h-8 p-0 hover:bg-transparent">
                      State
                      <SortIcon column="state" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("postcode")} className="h-8 p-0 hover:bg-transparent">
                      Postcode
                      <SortIcon column="postcode" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("avg_index")} className="h-8 p-0 hover:bg-transparent">
                      Avg Index
                      <SortIcon column="avg_index" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("location_count")} className="h-8 p-0 hover:bg-transparent">
                      Locations
                      <SortIcon column="location_count" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedData.suburbs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No suburbs found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  processedData.suburbs.map((item) => (
                    <TableRow key={`${item.suburb}-${item.postcode}`}>
                      <TableCell className="font-medium">#{item.rank}</TableCell>
                      <TableCell className="font-medium">{item.suburb}</TableCell>
                      <TableCell>{item.state}</TableCell>
                      <TableCell>{item.postcode}</TableCell>
                      <TableCell>
                        <div className="font-semibold">{item.avg_index.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">
                          ${((item.avg_index / 100) * 1000).toFixed(0)} premium
                        </div>
                      </TableCell>
                      <TableCell>{item.location_count}</TableCell>
                      <TableCell className="text-right">
                        {getIndexBadge(item.avg_index)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, processedData.total)} of {processedData.total}
                </span>
                <Select value={pageSize.toString()} onValueChange={(value) => { setPageSize(Number(value)); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25 / page</SelectItem>
                    <SelectItem value="50">50 / page</SelectItem>
                    <SelectItem value="100">100 / page</SelectItem>
                    <SelectItem value="200">200 / page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
