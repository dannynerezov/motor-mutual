import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, RefreshCw, TrendingUp, TrendingDown, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehiclePricingCard } from "./VehiclePricingCard";
import { usePricingScheme } from "@/hooks/usePricingScheme";
import { useRandomVehicles, SortMode } from "@/hooks/useRandomVehicles";
import { adaptDatabaseVehicle } from "@/types/databaseVehicle";
import { Skeleton } from "@/components/ui/skeleton";

export function PricingCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>('random');
  const { activeScheme } = usePricingScheme();
  const { vehicles: dbVehicles, totalCount, isLoading, refreshVehicles } = useRandomVehicles({ 
    count: 3, 
    sortBy: sortMode 
  });

  const displayVehicles = dbVehicles.map(adaptDatabaseVehicle);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const toggleAutoplay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleSortChange = useCallback((newMode: SortMode) => {
    setSortMode(newMode);
    setIsPlaying(false);
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || !isPlaying || isLoading || displayVehicles.length === 0) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [emblaApi, isPlaying, isLoading, displayVehicles.length]);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[600px] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Live from Database</span>
          </div>
          <span className="text-xs">•</span>
          <span>Viewing {displayVehicles.length} of {totalCount} vehicles</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={sortMode === 'random' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleSortChange('random')}
            >
              <Shuffle className="w-4 h-4 mr-1" />
              Random
            </Button>
            <Button
              variant={sortMode === 'price-asc' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleSortChange('price-asc')}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Cheapest
            </Button>
            <Button
              variant={sortMode === 'price-desc' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleSortChange('price-desc')}
            >
              <TrendingDown className="w-4 h-4 mr-1" />
              Expensive
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={refreshVehicles}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Different Vehicles
          </Button>
        </div>
      </div>

      <div className="relative">
        {/* Carousel Container */}
        <div 
          className="overflow-hidden" 
          ref={emblaRef}
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          <div className="flex gap-4 md:gap-6">
            {displayVehicles.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className="flex-[0_0_100%] md:flex-[0_0_85%] lg:flex-[0_0_75%] min-w-0"
              >
                <VehiclePricingCard
                  vehicle={vehicle}
                  scheme={activeScheme}
                  isActive={index === selectedIndex}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-card/95 backdrop-blur shadow-lg hover:scale-110 transition-transform"
          onClick={scrollPrev}
          aria-label="Previous vehicle"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-card/95 backdrop-blur shadow-lg hover:scale-110 transition-transform"
          onClick={scrollNext}
          aria-label="Next vehicle"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {displayVehicles.map((vehicle, index) => (
          <button
            key={vehicle.id}
            className={`transition-all duration-300 rounded-full ${
              index === selectedIndex
                ? 'w-8 h-3 bg-accent'
                : 'w-3 h-3 bg-muted hover:bg-muted-foreground/50'
            }`}
            onClick={() => scrollTo(index)}
            aria-label={`Go to ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            aria-selected={index === selectedIndex}
          />
        ))}
      </div>
    </div>
  );
}
