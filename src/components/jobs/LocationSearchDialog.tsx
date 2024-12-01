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
import { Globe, Mountain, User, Building, Lion, Mosque, PalmTree, Water } from "lucide-react";
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

  const getRegionIcon = (region: string) => {
    switch (region) {
      case "Worldwide":
        return <Globe className="h-4 w-4 mr-2" />;
      case "North America":
        return <Mountain className="h-4 w-4 mr-2" />;
      case "Latin America":
        return <User className="h-4 w-4 mr-2" />;
      case "Europe":
        return <Building className="h-4 w-4 mr-2" />;
      case "Africa":
        return <Lion className="h-4 w-4 mr-2" />;
      case "Middle East":
        return <Mosque className="h-4 w-4 mr-2" />;
      case "Asia":
        return <PalmTree className="h-4 w-4 mr-2" />;
      case "Oceania":
        return <Water className="h-4 w-4 mr-2" />;
      default:
        return <Globe className="h-4 w-4 mr-2" />;
    }
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
                        // When selecting a region, add all its locations
                        data.locations.forEach(loc => {
                          if (!selectedLocations.includes(loc)) {
                            onLocationSelect(loc);
                          }
                        });
                      }}
                    >
                      {getRegionIcon(region)}
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
                        // When selecting a country, add all its locations
                        data.locations.forEach(loc => {
                          if (!selectedLocations.includes(loc)) {
                            onLocationSelect(loc);
                          }
                        });
                      }}
                    >
                      <span className="mr-2 text-sm">{data.code}</span>
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