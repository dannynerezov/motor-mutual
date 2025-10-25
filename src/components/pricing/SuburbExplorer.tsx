import { useState, useMemo } from "react";
import { ArrowLeft, Search, TrendingUp, TrendingDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StateStats, SuburbData } from "./PricingExplorerWidget";

type SuburbExplorerProps = {
  stateData: StateStats;
  onBack: () => void;
  onSelectSuburb: (suburb: SuburbData) => void;
};

const getIndexBadge = (index: number) => {
  if (index <= 150) return <Badge className="bg-green-500">Affordable</Badge>;
  if (index <= 250) return <Badge className="bg-yellow-500">Moderate</Badge>;
  if (index <= 400) return <Badge className="bg-orange-500">Expensive</Badge>;
  return <Badge className="bg-red-500">Very Expensive</Badge>;
};

export const SuburbExplorer = ({ stateData, onBack, onSelectSuburb }: SuburbExplorerProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSuburbs = useMemo(() => {
    if (!searchTerm) return stateData.suburbs;
    return stateData.suburbs.filter(
      (suburb) =>
        suburb.suburb.toLowerCase().includes(searchTerm.toLowerCase()) ||
        suburb.postcode.includes(searchTerm)
    );
  }, [stateData.suburbs, searchTerm]);

  const topExpensive = useMemo(
    () => [...stateData.suburbs].reverse().slice(0, 5),
    [stateData.suburbs]
  );

  const topCheapest = useMemo(
    () => stateData.suburbs.slice(0, 5),
    [stateData.suburbs]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{stateData.state}</h2>
          <p className="text-sm text-muted-foreground">
            {stateData.suburb_count.toLocaleString()} suburbs analyzed
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          #{stateData.ranking}
        </Badge>
      </div>

      {/* State Summary */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Average Index</div>
          <div className="text-lg font-bold">{stateData.avg_index.toFixed(1)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Cheapest</div>
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {stateData.min_index.toFixed(0)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Most Expensive</div>
          <div className="text-lg font-bold text-red-600 dark:text-red-400">
            {stateData.max_index.toFixed(0)}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search suburbs or postcodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Insights */}
      {!searchTerm && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold">Most Affordable Suburbs</h3>
            </div>
            <div className="space-y-2">
              {topCheapest.map((suburb) => (
                <button
                  key={`${suburb.suburb}-${suburb.postcode}`}
                  onClick={() => onSelectSuburb(suburb)}
                  className="w-full p-3 rounded-lg border hover:bg-accent transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{suburb.suburb}</div>
                      <div className="text-xs text-muted-foreground">
                        {suburb.postcode} • {suburb.location_count} location{suburb.location_count !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 dark:text-green-400">
                        {suburb.avg_index.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400" />
              <h3 className="font-semibold">Most Expensive Suburbs</h3>
            </div>
            <div className="space-y-2">
              {topExpensive.map((suburb) => (
                <button
                  key={`${suburb.suburb}-${suburb.postcode}`}
                  onClick={() => onSelectSuburb(suburb)}
                  className="w-full p-3 rounded-lg border hover:bg-accent transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{suburb.suburb}</div>
                      <div className="text-xs text-muted-foreground">
                        {suburb.postcode} • {suburb.location_count} location{suburb.location_count !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600 dark:text-red-400">
                        {suburb.avg_index.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchTerm && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5" />
            <h3 className="font-semibold">
              {filteredSuburbs.length} suburb{filteredSuburbs.length !== 1 ? 's' : ''} found
            </h3>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2 pr-4">
              {filteredSuburbs.map((suburb) => (
                <button
                  key={`${suburb.suburb}-${suburb.postcode}`}
                  onClick={() => onSelectSuburb(suburb)}
                  className="w-full p-3 rounded-lg border hover:bg-accent transition-colors text-left"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">{suburb.suburb}</div>
                    {getIndexBadge(suburb.avg_index)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">
                      {suburb.postcode} • {suburb.location_count} location{suburb.location_count !== 1 ? 's' : ''}
                    </div>
                    <div className="font-bold">{suburb.avg_index.toFixed(1)}</div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
