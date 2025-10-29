import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, MapPin, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface AddressSuggestion {
  addressLine1: string;
  suburb: string;
  state: string;
  postcode: string;
  unitType?: string;
  unitNumber?: string;
  streetNumber?: string;
  streetName?: string;
  streetType?: string;
  buildingName?: string;
  country?: string;
  lurn?: string;
  latitude?: string;
  longitude?: string;
  geocodedNationalAddressFileData?: any;
}

interface AddressAutosuggestProps {
  onAddressSelect: (address: AddressSuggestion) => void;
  selectedAddress?: AddressSuggestion | null;
  disabled?: boolean;
}

export const AddressAutosuggest = ({ 
  onAddressSelect, 
  selectedAddress,
  disabled = false 
}: AddressAutosuggestProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validatedAddress, setValidatedAddress] = useState<AddressSuggestion | null>(selectedAddress || null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [hasPinged, setHasPinged] = useState(false);

  useEffect(() => {
    if (selectedAddress) {
      setValidatedAddress(selectedAddress);
      setSearchTerm(selectedAddress.addressLine1);
    }
  }, [selectedAddress]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.length >= 3) {
        handleAddressSearch();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Calculate dropdown position when suggestions appear
  useEffect(() => {
    if (showSuggestions && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width
      });
    }
  }, [showSuggestions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        inputRef.current && 
        !inputRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSuggestions]);

  const handleAddressSearch = async () => {
    if (searchTerm.length < 3) return;

    console.log('[AddressAutosuggest] Searching for:', searchTerm);
    setIsSearching(true);
    try {
      const requestBody = {
        action: 'addressSearch',
        searchText: searchTerm,
      };
      console.log('[AddressAutosuggest] Request body:', requestBody);

      const { data, error } = await supabase.functions.invoke('suncorp-proxy', {
        body: requestBody
      });

      if (error) throw error;

      console.log('[AddressAutosuggest] Response:', data);

      if (data?.success && data.data?.data && Array.isArray(data.data.data)) {
        const formattedSuggestions: AddressSuggestion[] = data.data.data.map((addr: any) => {
          const broken = addr.addressInBrokenDownForm || {};
          
          // Build addressLine1 from components
          let addressParts = [];
          if (broken.unitNumber && broken.unitType) {
            addressParts.push(`${broken.unitType}${broken.unitNumber}`);
          }
          if (broken.buildingName) addressParts.push(broken.buildingName);
          if (broken.streetNumber) addressParts.push(broken.streetNumber);
          if (broken.streetName) addressParts.push(broken.streetName);
          if (broken.streetType) addressParts.push(broken.streetType);
          
          return {
            addressLine1: addressParts.join(' '),
            suburb: addr.suburb || '',
            state: addr.state || '',
            postcode: addr.postcode || '',
            unitType: broken.unitType,
            unitNumber: broken.unitNumber,
            streetNumber: broken.streetNumber,
            streetName: broken.streetName,
            streetType: broken.streetType,
            buildingName: broken.buildingName,
            country: addr.country || 'AU',
          };
        });

        console.log('[AddressAutosuggest] Suggestions count:', formattedSuggestions.length);
        setSuggestions(formattedSuggestions);
        setShowSuggestions(formattedSuggestions.length > 0);
      } else {
        console.warn('[AddressAutosuggest] No valid data in response:', data);
        if (!data?.success) {
          toast({ title: 'Address search failed', description: data?.error || 'Please try again.', variant: 'destructive' });
        }
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error: any) {
      console.error('[AddressAutosuggest] Error:', error);
      toast({ title: 'Address search error', description: (error?.message as string) || 'Please try again.', variant: 'destructive' });
    } finally {
      setIsSearching(false);
    }
  };

  const handlePing = async () => {
    if (hasPinged) return;
    console.log('[AddressAutosuggest] Pinging suncorp-proxy...');
    try {
      const { data } = await supabase.functions.invoke('suncorp-proxy', {
        body: { action: 'ping' }
      });
      console.log('[AddressAutosuggest] Ping response:', data);
      setHasPinged(true);
    } catch (error) {
      console.warn('[AddressAutosuggest] Ping failed:', error);
    }
  };

  const handleSuggestionClick = async (suggestion: AddressSuggestion) => {
    console.log('[AddressAutosuggest] Suggestion clicked:', suggestion);
    setSearchTerm(suggestion.addressLine1);
    setShowSuggestions(false);
    
    // Validate the address to get GNAF data
    try {
      const { data, error } = await supabase.functions.invoke('suncorp-proxy', {
        body: {
          action: 'addressValidate',
          address: {
            suburb: suggestion.suburb,
            postcode: suggestion.postcode,
            state: suggestion.state,
            streetNumber: suggestion.streetNumber,
            streetName: suggestion.streetName,
            streetType: suggestion.streetType,
            unitType: suggestion.unitType,
            unitNumber: suggestion.unitNumber,
          }
        }
      });

      if (error) throw error;

      if (data?.success && data.data) {
        const validatedData = data.data;
        
        // Extract coordinates from multiple possible sources
        const extractedLatitude = validatedData.pointLevelCoordinates?.latitude ||
                                  validatedData.latitude ||
                                  validatedData.geocodedNationalAddressFileData?.latitude ||
                                  null;
        const extractedLongitude = validatedData.pointLevelCoordinates?.longitude ||
                                   validatedData.longitude ||
                                   validatedData.geocodedNationalAddressFileData?.longitude ||
                                   null;

        console.log('[AddressAutosuggest] Validation response structure:', {
          hasPointLevelCoordinates: !!validatedData.pointLevelCoordinates,
          hasLatitude: !!validatedData.latitude,
          hasGnafData: !!validatedData.geocodedNationalAddressFileData,
          extractedLatitude,
          extractedLongitude
        });

        const completeAddress = {
          ...suggestion,
          lurn: validatedData.lurn,
          latitude: extractedLatitude,
          longitude: extractedLongitude,
          geocodedNationalAddressFileData: validatedData.geocodedNationalAddressFileData,
        };
        
        console.log('[AddressAutosuggest] Address validated with GNAF data:', completeAddress);
        setValidatedAddress(completeAddress);
        onAddressSelect(completeAddress);
        
        if (!extractedLatitude || !extractedLongitude) {
          toast({ 
            title: 'Address validated', 
            description: 'Warning: Coordinates not available',
            variant: 'default'
          });
        } else {
          toast({ title: 'Address validated' });
        }
      }
    } catch (error) {
      console.error('[AddressAutosuggest] Validation error:', error);
      
      // Still set the address even if validation fails
      setValidatedAddress(suggestion);
      onAddressSelect(suggestion);
      
      // Only show info toast for validation unavailability, not an error
      toast({ 
        title: 'Address validation unavailable', 
        description: 'Proceeding with address search result', 
        variant: 'default'
      });
    }
  };

  return (
    <div className="space-y-2 relative">
      <Label htmlFor="address-search" className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        Overnight Parking Address
        {validatedAddress && (
          <CheckCircle2 className="w-4 h-4 text-green-600" />
        )}
      </Label>
      
      <div className="relative">
        <Input
          ref={inputRef}
          id="address-search"
          type="text"
          placeholder="Start typing your address..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!e.target.value) {
              setValidatedAddress(null);
            }
          }}
          onFocus={() => {
            handlePing();
            if (searchTerm.length >= 3 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          disabled={disabled}
          className={validatedAddress ? "border-green-500" : ""}
        />
        
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {suggestions.length} result{suggestions.length !== 1 ? 's' : ''} found
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && createPortal(
        <Card 
          ref={dropdownRef}
          className="fixed z-[9999] max-h-64 overflow-y-auto bg-white dark:bg-gray-900 border shadow-xl"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`
          }}
        >
          <div className="p-2 space-y-1">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left h-auto py-3 px-3 hover:bg-accent transition-colors"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleSuggestionClick(suggestion);
                }}
              >
                <div className="flex flex-col items-start w-full">
                  <span className="font-medium text-sm">{suggestion.addressLine1}</span>
                  <span className="text-xs text-muted-foreground">
                    {suggestion.suburb}, {suggestion.state} {suggestion.postcode}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </Card>,
        document.body
      )}

      {validatedAddress && (
        <div className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in">
          <CheckCircle2 className="w-3 h-3" />
          Address validated: {validatedAddress.suburb}, {validatedAddress.state} {validatedAddress.postcode}
        </div>
      )}
    </div>
  );
};
