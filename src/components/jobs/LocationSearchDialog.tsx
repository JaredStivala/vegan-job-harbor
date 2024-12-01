import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { LocationItem } from "./LocationItem";

// Predefined list of locations
const AVAILABLE_LOCATIONS = [
  'Remote',
  'New York, USA',
  'San Francisco, USA',
  'Los Angeles, USA',
  'London, UK',
  'Berlin, Germany',
  'Toronto, Canada',
  'Sydney, Australia',
  'Amsterdam, Netherlands',
  'Paris, France',
  'Singapore',
  'Hong Kong',
  'Tokyo, Japan'
];

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
  selectedLocations,
  onLocationSelect,
}: LocationSearchDialogProps) => {
  // Filter locations based on search input
  const filteredLocations = AVAILABLE_LOCATIONS.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

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
            {filteredLocations.map((location) => (
              <LocationItem
                key={location}
                location={location}
                jobCount={0} // We're not tracking job counts with predefined locations
                isSelected={selectedLocations.includes(location)}
                onSelect={onLocationSelect}
              />
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
};