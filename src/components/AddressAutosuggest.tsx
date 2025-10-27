import { useState, useEffect } from "react";
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
  lurn: string;
  unitType?: string;
  unitNumber?: string;
  streetNumber: string;
  streetName: string;
  streetType: string;
  latitude?: string;
  longitude?: string;
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
  const [isValidating, setIsValidating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validatedAddress, setValidatedAddress] = useState<AddressSuggestion | null>(selectedAddress || null);

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

  const handleAddressSearch = async () => {
    if (searchTerm.length < 3) return;

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('suncorp-proxy', {
        body: {
          action: 'addressSearch',
          parameters: {
            searchText: searchTerm,
          }
        }
      });

      if (error) throw error;

      if (data.addresses && Array.isArray(data.addresses)) {
        const formattedSuggestions: AddressSuggestion[] = data.addresses.map((addr: any) => ({
          addressLine1: addr.addressLine1 || '',
          suburb: addr.suburb || '',
          state: addr.state || '',
          postcode: addr.postcode || '',
          lurn: addr.lurn || '',
          unitType: addr.unitType,
          unitNumber: addr.unitNumber,
          streetNumber: addr.streetNumber || '',
          streetName: addr.streetName || '',
          streetType: addr.streetType || '',
          latitude: addr.latitude,
          longitude: addr.longitude,
        }));

        setSuggestions(formattedSuggestions);
        setShowSuggestions(formattedSuggestions.length > 0);
      }
    } catch (error: any) {
      console.error('Address search error:', error);
      toast.error('Failed to search addresses');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddressValidation = async (address: AddressSuggestion) => {
    setIsValidating(true);
    try {
      const { data, error } = await supabase.functions.invoke('suncorp-proxy', {
        body: {
          action: 'addressValidate',
          parameters: {
            lurn: address.lurn,
          }
        }
      });

      if (error) throw error;

      if (data.validatedAddress) {
        const validated: AddressSuggestion = {
          addressLine1: data.validatedAddress.addressLine1 || address.addressLine1,
          suburb: data.validatedAddress.suburb || address.suburb,
          state: data.validatedAddress.state || address.state,
          postcode: data.validatedAddress.postcode || address.postcode,
          lurn: data.validatedAddress.lurn || address.lurn,
          unitType: data.validatedAddress.unitType || address.unitType,
          unitNumber: data.validatedAddress.unitNumber || address.unitNumber,
          streetNumber: data.validatedAddress.streetNumber || address.streetNumber,
          streetName: data.validatedAddress.streetName || address.streetName,
          streetType: data.validatedAddress.streetType || address.streetType,
          latitude: data.validatedAddress.latitude || address.latitude,
          longitude: data.validatedAddress.longitude || address.longitude,
        };

        setValidatedAddress(validated);
        setSearchTerm(validated.addressLine1);
        setShowSuggestions(false);
        onAddressSelect(validated);
        toast.success('Address validated successfully');
      } else {
        throw new Error('Address validation failed');
      }
    } catch (error: any) {
      console.error('Address validation error:', error);
      toast.error('Failed to validate address');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    handleAddressValidation(suggestion);
  };

  return (
    <div className="space-y-2 relative">
      <Label htmlFor="address-search" className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        Residential Address
        {validatedAddress && (
          <CheckCircle2 className="w-4 h-4 text-green-600" />
        )}
      </Label>
      
      <div className="relative">
        <Input
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
          disabled={disabled || isValidating}
          className={validatedAddress ? "border-green-500" : ""}
        />
        
        {(isSearching || isValidating) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto bg-background border shadow-lg">
          <div className="p-2 space-y-1">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-accent/50"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm">{suggestion.addressLine1}</span>
                  <span className="text-xs text-muted-foreground">
                    {suggestion.suburb}, {suggestion.state} {suggestion.postcode}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </Card>
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
