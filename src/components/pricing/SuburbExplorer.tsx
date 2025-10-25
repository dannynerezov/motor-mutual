import { useState, useMemo } from "react";
import { ArrowLeft, Search, TrendingUp, TrendingDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StateStats, SuburbData } from "./PricingExplorerWidget";

type SuburbExplorerProps = {
  stateData: StateStats;
  onBack: () => void;
  onSelectSuburb: (suburb: SuburbData) => void;
};

const getIndexBadge = (index: number) => {
  if (index <= 150) return <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">Affordable</Badge>;
  if (index <= 250) return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0">Moderate</Badge>;
  if (index <= 400) return <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0">Expensive</Badge>;
  return <Badge className="bg-red-500 hover:bg-red-600 text-white border-0">Very Expensive</Badge>;
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 md:gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex-shrink-0 p-2 hover:bg-accent/10 rounded-xl transition-colors group border hover:border-accent"
          aria-label="Back to states"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="min-w-0">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate">
            {stateData.state}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            {stateData.suburb_count.toLocaleString()} suburbs analyzed
          </p>
        </div>
      </div>

      {/* State Summary */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 p-4 md:p-6 bg-gradient-to-br from-card to-muted/30 rounded-2xl border-2 shadow-soft">
        <div className="text-center">
          <div className="text-xs md:text-sm text-muted-foreground mb-1">Average</div>
          <div className="text-xl md:text-2xl font-bold text-accent">{stateData.avg_index.toFixed(1)}</div>
        </div>
        <div className="text-center border-x">
          <div className="text-xs md:text-sm text-muted-foreground mb-1">Cheapest</div>
          <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
            {stateData.min_index.toFixed(1)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs md:text-sm text-muted-foreground mb-1">Expensive</div>
          <div className="text-xl md:text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stateData.max_index.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
        <input
          type="text"
          placeholder="Search suburbs by name or postcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-12 py-3 md:py-4 border-2 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-base md:text-lg"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-lg transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Quick Insights */}
      {!searchTerm && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-lg">Most Affordable Suburbs</h3>
            </div>
            <div className="space-y-2">
              {topCheapest.map((suburb) => (
                <button
                  key={`${suburb.suburb}-${suburb.postcode}`}
                  onClick={() => onSelectSuburb(suburb)}
                  className="w-full p-4 rounded-xl border-2 hover:border-accent hover:bg-accent/5 transition-all duration-200 text-left group shadow-soft hover:shadow-medium"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base md:text-lg truncate group-hover:text-accent transition-colors">
                        {suburb.suburb}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">
                        {suburb.postcode} • {suburb.location_count} location{suburb.location_count !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
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
              <h3 className="font-semibold text-lg">Most Expensive Suburbs</h3>
            </div>
            <div className="space-y-2">
              {topExpensive.map((suburb) => (
                <button
                  key={`${suburb.suburb}-${suburb.postcode}`}
                  onClick={() => onSelectSuburb(suburb)}
                  className="w-full p-4 rounded-xl border-2 hover:border-accent hover:bg-accent/5 transition-all duration-200 text-left group shadow-soft hover:shadow-medium"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base md:text-lg truncate group-hover:text-accent transition-colors">
                        {suburb.suburb}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">
                        {suburb.postcode} • {suburb.location_count} location{suburb.location_count !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <div className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400">
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
            <h3 className="font-semibold text-lg">
              {filteredSuburbs.length} suburb{filteredSuburbs.length !== 1 ? 's' : ''} found
            </h3>
          </div>
          <ScrollArea className="h-[500px] md:h-[600px]">
            <div className="space-y-2 pr-4">
              {filteredSuburbs.map((suburb) => (
                <button
                  key={`${suburb.suburb}-${suburb.postcode}`}
                  onClick={() => onSelectSuburb(suburb)}
                  className="w-full p-4 rounded-xl border-2 hover:border-accent hover:bg-accent/5 transition-all duration-200 text-left group shadow-soft hover:shadow-medium"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-base md:text-lg group-hover:text-accent transition-colors">
                      {suburb.suburb}
                    </div>
                    {getIndexBadge(suburb.avg_index)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">
                      {suburb.postcode} • {suburb.location_count} location{suburb.location_count !== 1 ? 's' : ''}
                    </div>
                    <div className="text-lg font-bold">{suburb.avg_index.toFixed(1)}</div>
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
