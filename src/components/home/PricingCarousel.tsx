import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehiclePricingCard } from "./VehiclePricingCard";
import { vehicleExamples } from "@/data/vehicleExamples";
import { usePricingScheme } from "@/hooks/usePricingScheme";

export function PricingCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    skipSnaps: false
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const { calculatePrice, activeScheme } = usePricingScheme();

  // Calculate premiums for all vehicles
  const vehiclesWithPremiums = vehicleExamples.map(vehicle => ({
    ...vehicle,
    premium: calculatePrice(vehicle.value)
  }));

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const toggleAutoplay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Setup embla events
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-play functionality
  useEffect(() => {
    if (!emblaApi || !isPlaying) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [emblaApi, isPlaying]);

  // Pause on hover
  const handleMouseEnter = () => setIsPlaying(false);
  const handleMouseLeave = () => setIsPlaying(true);

  const currentVehicle = vehiclesWithPremiums[selectedIndex];

  return (
    <div className="space-y-8" role="region" aria-label="Vehicle pricing examples carousel">
      {/* Main Carousel */}
      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {vehiclesWithPremiums.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className="flex-[0_0_100%] min-w-0 px-4 md:px-8"
              >
                <div className="max-w-2xl mx-auto">
                  <VehiclePricingCard
                    vehicle={vehicle}
                    premium={vehicle.premium}
                    scheme={activeScheme}
                    isActive={index === selectedIndex}
                  />
                </div>
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

        {/* Play/Pause Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-4 right-4 z-10 h-10 w-10 rounded-full bg-card/95 backdrop-blur shadow-lg"
          onClick={toggleAutoplay}
          aria-label={isPlaying ? "Pause autoplay" : "Resume autoplay"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center items-center gap-2" role="tablist">
        {vehiclesWithPremiums.map((vehicle, index) => (
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
            role="tab"
          />
        ))}
      </div>

    </div>
  );
}
