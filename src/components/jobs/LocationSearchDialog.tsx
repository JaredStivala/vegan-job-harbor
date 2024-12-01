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
  uniqueLocations,
  selectedLocations,
  onLocationSelect,
}: LocationSearchDialogProps) => {
  const formatLocation = (loc: string | null) => {
    if (!loc) return '';
    // Remove brackets, quotes, and clean up any extra whitespace
    return loc.replace(/[\[\]"]/g, '').trim();
  };

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
            {uniqueLocations
              .filter(location => 
                formatLocation(location).toLowerCase().includes(locationSearch.toLowerCase())
              )
              .map((location) => {
                const formattedLocation = formatLocation(location);
                return (
                  <CommandItem
                    key={location}
                    value={formattedLocation}
                    onSelect={() => onLocationSelect(location)}
                    className="cursor-pointer"
                  >
                    <MapPin className="mr-2 h-4 w-4 text-sage" />
                    <span>{formattedLocation}</span>
                    {selectedLocations.includes(location) && (
                      <span className="ml-auto text-sage">Selected</span>
                    )}
                  </CommandItem>
                );
              })}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
};