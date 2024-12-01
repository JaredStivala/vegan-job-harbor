import { MapPin } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface LocationSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationSearch: string;
  setLocationSearch: (search: string) => void;
  uniqueLocations: string[];
  selectedLocations: string[];
  onLocationSelect: (location: string) => void;
}

export const LocationSearchDialog = ({
  open,
  onOpenChange,
  locationSearch,
  setLocationSearch,
  uniqueLocations = [],
  selectedLocations,
  onLocationSelect,
}: LocationSearchDialogProps) => {
  const formatLocation = (loc: string | null) => {
    if (!loc) return '';
    
    try {
      // Handle JSON array strings
      if (loc.startsWith('[') && loc.endsWith(']')) {
        const parsed = JSON.parse(loc);
        const location = Array.isArray(parsed) ? parsed[0] : parsed;
        return standardizeLocation(location);
      }
      return standardizeLocation(loc.replace(/[\[\]"{}']/g, '').trim());
    } catch {
      return standardizeLocation(loc.replace(/[\[\]"{}']/g, '').trim());
    }
  };

  const standardizeLocation = (location: string) => {
    // Standardize Remote locations
    if (location.toLowerCase().includes('remote')) {
      if (location.toLowerCase().includes('usa') || location.toLowerCase().includes('united states')) {
        return 'Remote (USA)';
      }
      if (location.toLowerCase().includes('uk') || location.toLowerCase().includes('united kingdom')) {
        return 'Remote (UK)';
      }
      if (location.toLowerCase().includes('global')) {
        return 'Remote (Global)';
      }
      return 'Remote';
    }
    return location;
  };

  // Remove duplicates and sort locations
  const processedLocations = Array.from(new Set(
    uniqueLocations
      .map(loc => formatLocation(loc))
      .filter(Boolean)
  )).sort((a, b) => {
    // Sort Remote locations first
    if (a.startsWith('Remote') && !b.startsWith('Remote')) return -1;
    if (!a.startsWith('Remote') && b.startsWith('Remote')) return 1;
    return a.localeCompare(b);
  });

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command className="rounded-lg border shadow-md">
        <CommandInput 
          placeholder="Search locations..." 
          value={locationSearch}
          onValueChange={setLocationSearch}
        />
        <CommandList>
          <CommandEmpty>No locations found.</CommandEmpty>
          <CommandGroup heading="Available Locations">
            {processedLocations
              .filter(location => 
                location.toLowerCase().includes(locationSearch.toLowerCase())
              )
              .map((location) => (
                <CommandItem
                  key={location}
                  value={location}
                  onSelect={() => onLocationSelect(location)}
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
  );
};