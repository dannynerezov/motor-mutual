import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, MapPin, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

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
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Calculate dropdown position when suggestions appear
  useEffect(() => {
    if (showSuggestions && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [showSuggestions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
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

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('suncorp-proxy', {
        body: {
          action: 'addressSearch',
          searchText: searchTerm,
        }
      });

      if (error) throw error;

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

        setSuggestions(formattedSuggestions);
        setShowSuggestions(formattedSuggestions.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error: any) {
      console.error('Address search error:', error);
      toast.error('Failed to search addresses');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    setValidatedAddress(suggestion);
    setSearchTerm(suggestion.addressLine1);
    setShowSuggestions(false);
    onAddressSelect(suggestion);
    toast.success('Address selected');
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
          disabled={disabled}
          className={validatedAddress ? "border-green-500" : ""}
        />
        
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && createPortal(
        <Card 
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
                onClick={() => handleSuggestionClick(suggestion)}
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
