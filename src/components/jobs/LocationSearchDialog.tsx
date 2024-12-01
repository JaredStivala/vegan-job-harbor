import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { LocationItem } from "./LocationItem";

interface LocationSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationSearch: string;
  setLocationSearch: (search: string) => void;
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
  const allLocations = [
    "Across the UK",
    "Africa",
    "Amsterdam",
    "Amsterdam, Netherlands",
    "Andhra Pradesh, India",
    "Angel, London",
    "Remote",
    "London, United Kingdom",
    "New York, United States",
    "San Francisco, United States",
    "Los Angeles, United States",
    "Chicago, United States",
    "Toronto, Canada",
    "Vancouver, Canada",
    "Montreal, Canada",
    "Berlin, Germany",
    "Paris, France",
    "Dublin, Ireland",
    "Singapore",
    "Tokyo, Japan",
    "Sydney, Australia",
    "Melbourne, Australia"
  ];

  const filteredLocations = allLocations.filter(location =>
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
          <CommandGroup heading="Available Locations" className="font-bold text-xs uppercase text-gray-500">
            {filteredLocations.map((location) => (
              <LocationItem
                key={location}
                location={location}
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