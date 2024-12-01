import { Input } from "@/components/ui/input";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
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
}

export const LocationFilter = ({ selectedLocations, onLocationSelect }: LocationFilterProps) => {
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: locations = [] } = useQuery({
    queryKey: ['all-locations'],
    queryFn: async () => {
      // Fetch locations from all tables
      const [veganJobs, advocacyJobs, eaJobs, vevolutionJobs] = await Promise.all([
        supabase.from('veganjobs').select('location'),
        supabase.from('animaladvocacy').select('location'),
        supabase.from('ea').select('location'),
        supabase.from('vevolution').select('location')
      ]);

      // Combine all locations and handle different formats
      const allLocations = [
        ...(veganJobs.data || []),
        ...(advocacyJobs.data || []),
        ...(eaJobs.data || []),
        ...(vevolutionJobs.data || [])
      ];

      // Process locations to handle different formats and clean the data
      const processedLocations = allLocations
        .map(item => {
          if (!item.location) return null;
          
          // Handle array-like strings
          if (item.location.startsWith('[') && item.location.endsWith(']')) {
            try {
              return JSON.parse(item.location);
            } catch {
              return item.location.replace(/[\[\]"]/g, '').trim();
            }
          }
          return item.location.trim();
        })
        .flat() // Flatten arrays if any locations were parsed as arrays
        .filter(Boolean) // Remove null/undefined/empty values
        .map(loc => loc.trim()); // Trim all locations

      // Remove duplicates and sort
      return Array.from(new Set(processedLocations)).sort();
    }
  });

  return (
    <div className="relative flex-1 sm:w-48">
      <Input 
        type="text" 
        placeholder="Location..." 
        className="pl-10 pr-10"
        onClick={() => {
          setIsDropdownOpen(!isDropdownOpen);
          setLocationDialogOpen(true);
        }}
        value={selectedLocations.length > 0 ? `${selectedLocations.length} selected` : ''}
        readOnly
      />
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      {isDropdownOpen ? (
        <ChevronUp className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      ) : (
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      )}

      <CommandDialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="Search locations..." 
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
                    onSelect={() => {
                      onLocationSelect(location);
                      setLocationDialogOpen(false);
                    }}
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