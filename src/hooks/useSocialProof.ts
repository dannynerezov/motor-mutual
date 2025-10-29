import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VehicleNotification {
  id: string;
  make: string;
  model?: string;
  series?: string;
  year?: number;
  state: string;
  membershipPrice: number;
  imageUrl: string;
}

const MEMBER_NAMES = [
  'Sarah', 'James', 'Michael', 'Emma', 'David',
  'Sophie', 'Daniel', 'Olivia', 'Chris', 'Jessica',
  'Matt', 'Rachel', 'Tom', 'Lisa', 'Ben',
  'Katie', 'Alex', 'Jordan', 'Sam', 'Taylor',
];

const HEADINGS = [
  '🔥 Popular Right Now',
  '⚡ Trending',
  '✨ Just Joined',
  '🚀 Hot Deal',
  '💎 Member Spotlight',
];

const ACTION_PHRASES = [
  'just joined for',
  'got covered for',
  'protected their ride for',
  'signed up for',
  'secured coverage for',
];

const SHOWN_VEHICLES_KEY = 'social_proof_shown';
const MAX_SHOWN_VEHICLES = 50;

function generateTimeAgo(): string {
  const roll = Math.random();
  
  if (roll < 0.6) {
    const minutes = Math.floor(Math.random() * 40) + 5;
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (roll < 0.9) {
    const hours = Math.floor(Math.random() * 6) + 1;
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const hours = Math.floor(Math.random() * 17) + 7;
    return `${hours} hours ago`;
  }
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getShownVehicles(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(SHOWN_VEHICLES_KEY) || '[]');
  } catch {
    return [];
  }
}

function markVehicleShown(vehicleId: string) {
  try {
    let shown = getShownVehicles();
    shown.push(vehicleId);
    
    // Keep only last MAX_SHOWN_VEHICLES
    if (shown.length > MAX_SHOWN_VEHICLES) {
      shown = shown.slice(-MAX_SHOWN_VEHICLES);
    }
    
    sessionStorage.setItem(SHOWN_VEHICLES_KEY, JSON.stringify(shown));
  } catch {
    // Ignore storage errors
  }
}

export const useSocialProof = () => {
  const [currentNotification, setCurrentNotification] = useState<VehicleNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [vehicleQueue, setVehicleQueue] = useState<VehicleNotification[]>([]);
  const [timeAgo, setTimeAgo] = useState('');
  const [memberName, setMemberName] = useState('');
  const [heading, setHeading] = useState('');
  const [actionPhrase, setActionPhrase] = useState('');

  const fetchVehicles = useCallback(async () => {
    try {
      const shownIds = getShownVehicles();
      
      let query = supabase
        .from('sample_vehicle_quotes')
        .select('id, state, vehicle_make, vehicle_model, vehicle_series, vehicle_year, calculated_membership_price, vehicle_image_url')
        .eq('image_exists', true)
        .not('vehicle_image_url', 'is', null)
        .not('calculated_membership_price', 'is', null);

      // Exclude recently shown vehicles if there are any
      if (shownIds.length > 0) {
        query = query.not('id', 'in', `(${shownIds.join(',')})`);
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;

      if (data && data.length > 0) {
        // Shuffle the results
        const shuffled = data.sort(() => Math.random() - 0.5);
        
        const vehicles: VehicleNotification[] = shuffled.map((v) => ({
          id: v.id,
          make: v.vehicle_make,
          model: v.vehicle_model || undefined,
          series: v.vehicle_series || undefined,
          year: v.vehicle_year || undefined,
          state: v.state,
          membershipPrice: v.calculated_membership_price || 0,
          imageUrl: v.vehicle_image_url || '',
        }));

        setVehicleQueue(vehicles);
      }
    } catch (error) {
      console.error('Error fetching vehicles for social proof:', error);
    }
  }, []);

  const showNextNotification = useCallback(() => {
    if (vehicleQueue.length === 0) return;

    const vehicle = vehicleQueue[0];
    setVehicleQueue((prev) => prev.slice(1));

    // Set random content
    setTimeAgo(generateTimeAgo());
    setMemberName(getRandomItem(MEMBER_NAMES));
    setHeading(getRandomItem(HEADINGS));
    setActionPhrase(getRandomItem(ACTION_PHRASES));

    // Show notification
    setCurrentNotification(vehicle);
    setIsVisible(true);

    // Mark as shown
    markVehicleShown(vehicle.id);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentNotification(null);
      }, 400); // Wait for exit animation
    }, 5000);
  }, [vehicleQueue]);

  const scheduleNextNotification = useCallback(() => {
    // Random interval between 60-180 seconds (1-3 minutes)
    const delay = Math.floor(Math.random() * 120000) + 60000;
    
    return setTimeout(() => {
      showNextNotification();
    }, delay);
  }, [showNextNotification]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentNotification(null);
    }, 400);
  }, []);

  // Initial setup
  useEffect(() => {
    // Wait 30 seconds before first notification
    const initialTimeout = setTimeout(() => {
      fetchVehicles();
    }, 30000);

    return () => clearTimeout(initialTimeout);
  }, [fetchVehicles]);

  // Schedule notifications when queue is ready
  useEffect(() => {
    if (vehicleQueue.length === 0) return;
    if (currentNotification !== null) return;

    const timeout = scheduleNextNotification();

    return () => clearTimeout(timeout);
  }, [vehicleQueue, currentNotification, scheduleNextNotification]);

  // Refetch when queue is low
  useEffect(() => {
    if (vehicleQueue.length < 3 && vehicleQueue.length > 0) {
      fetchVehicles();
    }
  }, [vehicleQueue.length, fetchVehicles]);

  // Schedule next notification after current one is dismissed
  useEffect(() => {
    if (currentNotification === null && vehicleQueue.length > 0) {
      const timeout = scheduleNextNotification();
      return () => clearTimeout(timeout);
    }
  }, [currentNotification, vehicleQueue.length, scheduleNextNotification]);

  return {
    currentNotification,
    isVisible,
    timeAgo,
    memberName,
    heading,
    actionPhrase,
    handleDismiss,
  };
};
