import { MapPin } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface LocationSearchDialogProps {
  locationSearch: string;
  setLocationSearch: (search: string) => void;
  uniqueLocations: string[];
  selectedLocations: string[];
  onLocationSelect: (location: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const LocationSearchDialog = ({
  locationSearch,
  setLocationSearch,
  uniqueLocations,
  selectedLocations,
  onLocationSelect,
  isOpen,
  setIsOpen,
}: LocationSearchDialogProps) => {
  return (
    <Command className="absolute top-full mt-1 w-[200px] rounded-lg border shadow-md bg-white z-50">
      <CommandInput 
        placeholder="Search locations..." 
        value={locationSearch}
        onValueChange={setLocationSearch}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      />
      {isOpen && (
        <CommandList>
          <CommandEmpty>No locations found.</CommandEmpty>
          <CommandGroup heading="Available Locations">
            {uniqueLocations
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
      )}
    </Command>
  );
};