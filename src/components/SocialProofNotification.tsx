import { X, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SocialProofNotificationProps {
  vehicle: {
    make: string;
    model?: string;
    series?: string;
    year?: number;
    state: string;
    membershipPrice: number;
    imageUrl: string;
  };
  timeAgo: string;
  memberName: string;
  heading: string;
  actionPhrase: string;
  onClose: () => void;
  isVisible: boolean;
}

export const SocialProofNotification = ({
  vehicle,
  timeAgo,
  memberName,
  heading,
  actionPhrase,
  onClose,
  isVisible,
}: SocialProofNotificationProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const vehicleDisplay = [
    vehicle.year,
    vehicle.make,
    vehicle.series || vehicle.model,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Social proof notification"
      className={`
        relative
        w-full max-w-sm
        bg-card/95 backdrop-blur-md
        border border-accent/30
        rounded-xl
        shadow-xl
        p-4
        transition-all duration-500
        hover:scale-[1.02] hover:shadow-2xl
        ${
          isVisible
            ? 'animate-in slide-in-from-left fade-in zoom-in-95 duration-500'
            : 'animate-out slide-out-to-left fade-out zoom-out-95 duration-400'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-semibold text-foreground">
            {heading}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 -mr-1"
          onClick={onClose}
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-[80px_1fr] gap-3">
        {/* Vehicle Image */}
        <div className="relative w-20 h-[60px] rounded-lg overflow-hidden bg-muted border border-border">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          )}
          {!imageError ? (
            <img
              src={vehicle.imageUrl}
              alt={`${vehicleDisplay}`}
              className="w-full h-full object-cover"
              loading="eager"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🚗</span>
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="flex flex-col justify-center min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {memberName} {actionPhrase} $
            {vehicle.membershipPrice.toFixed(0)}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {vehicleDisplay} • {vehicle.state}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
        </div>
      </div>
    </div>
  );
};
