import { Input } from "@/components/ui/input";
import { MapPin, ChevronDown } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LocationFilterProps {
  selectedLocations: string[];
  onLocationSelect: (location: string) => void;
  disabled?: boolean;
}

export const LocationFilter = ({ selectedLocations, onLocationSelect, disabled }: LocationFilterProps) => {
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");

  const { data: locations = [] } = useQuery({
    queryKey: ['all-locations'],
    queryFn: async () => {
      const [veganJobs, advocacyJobs, eaJobs, vevolutionJobs] = await Promise.all([
        supabase.from('veganjobs').select('location'),
        supabase.from('animaladvocacy').select('location'),
        supabase.from('ea').select('location'),
        supabase.from('vevolution').select('location')
      ]);

      const allLocations = [
        ...(veganJobs.data || []),
        ...(advocacyJobs.data || []),
        ...(eaJobs.data || []),
        ...(vevolutionJobs.data || [])
      ];

      const processedLocations = allLocations
        .map(item => {
          if (!item.location) return null;
          
          if (item.location.startsWith('[') && item.location.endsWith(']')) {
            try {
              return JSON.parse(item.location);
            } catch {
              return item.location.replace(/[\[\]"]/g, '').trim();
            }
          }
          return item.location.trim();
        })
        .flat()
        .filter(Boolean)
        .map(loc => loc.trim());

      return Array.from(new Set(processedLocations)).sort();
    }
  });

  const handleLocationSelection = (location: string) => {
    if (!disabled) {
      onLocationSelect(location);
      setLocationDialogOpen(false);
    }
  };

  return (
    <div className="relative flex-1 sm:w-48">
      <button
        onClick={() => !disabled && setLocationDialogOpen(true)}
        className={`w-full px-4 py-2.5 pl-10 pr-10 text-base rounded-xl border border-sage hover:border-sage-dark focus:border-sage-dark transition-colors bg-background text-gray-600 font-normal text-left ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={disabled}
      >
        {selectedLocations.length > 0 ? `${selectedLocations.length} selected` : "Location"}
      </button>
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sage" />
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sage" />

      <CommandDialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="Search locations" 
            value={locationSearch}
            onValueChange={setLocationSearch}
          />
          <CommandList>
            <CommandEmpty>No locations found.</CommandEmpty>
            <CommandGroup heading="Available Locations">
              {locations
                .filter(location => 
                  location.toLowerCase().includes(locationSearch.toLowerCase())
                )
                .map((location) => (
                  <CommandItem
                    key={location}
                    value={location}
                    onSelect={() => handleLocationSelection(location)}
                    className="cursor-pointer"
                  >
                    <MapPin className="mr-2 h-4 w-4 text-sage" />
                    <span>{location}</span>
                    {selectedLocations.includes(location) && (
                      <span className="ml-auto text-sage">Selected</span>
                    )}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};
