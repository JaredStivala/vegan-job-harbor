import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { locationData } from "./locations/locationData";
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
  const filterLocations = (locations: string[]) => {
    return locations.filter(location =>
      location.toLowerCase().includes(locationSearch.toLowerCase())
    );
  };

  const hasMatchInGroup = (locations: string[]) => {
    return locations.some(location =>
      location.toLowerCase().includes(locationSearch.toLowerCase())
    );
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
          
          {/* Regions */}
          {(!locationSearch || Object.entries(locationData.regions).some(
            ([_, data]) => hasMatchInGroup(data.locations)
          )) && (
            <CommandGroup heading="REGIONS" className="font-bold text-xs uppercase text-gray-500">
              {Object.entries(locationData.regions).map(([region, data]) => {
                const filteredLocations = filterLocations(data.locations);
                if (locationSearch && filteredLocations.length === 0) return null;
                
                return (
                  <div key={region}>
                    <CommandItem
                      className="cursor-pointer font-medium"
                      onSelect={() => {
                        data.locations.forEach(loc => {
                          if (!selectedLocations.includes(loc)) {
                            onLocationSelect(loc);
                          }
                        });
                      }}
                    >
                      {region}
                    </CommandItem>
                    {filteredLocations.map((location) => (
                      <LocationItem
                        key={location}
                        location={location}
                        isSelected={selectedLocations.includes(location)}
                        onSelect={onLocationSelect}
                        className="pl-8"
                      />
                    ))}
                  </div>
                );
              })}
            </CommandGroup>
          )}

          <CommandSeparator className="my-2" />

          {/* Countries */}
          {(!locationSearch || Object.entries(locationData.countries).some(
            ([_, data]) => hasMatchInGroup(data.locations)
          )) && (
            <CommandGroup heading="COUNTRIES" className="font-bold text-xs uppercase text-gray-500">
              {Object.entries(locationData.countries).map(([country, data]) => {
                const filteredLocations = filterLocations(data.locations);
                if (locationSearch && filteredLocations.length === 0) return null;

                return (
                  <div key={country}>
                    <CommandItem
                      className="cursor-pointer font-medium"
                      onSelect={() => {
                        data.locations.forEach(loc => {
                          if (!selectedLocations.includes(loc)) {
                            onLocationSelect(loc);
                          }
                        });
                      }}
                    >
                      {country}
                    </CommandItem>
                    {filteredLocations.map((location) => (
                      <LocationItem
                        key={location}
                        location={location}
                        isSelected={selectedLocations.includes(location)}
                        onSelect={onLocationSelect}
                        className="pl-8"
                      />
                    ))}
                  </div>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
};