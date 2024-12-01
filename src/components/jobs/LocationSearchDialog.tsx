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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  // Fetch all jobs to check which locations have matching jobs
  const { data: allJobs = [] } = useQuery({
    queryKey: ['all-jobs'],
    queryFn: async () => {
      const [veganJobs, advocacyJobs, eaJobs, vevolutionJobs] = await Promise.all([
        supabase.from('veganjobs').select('*'),
        supabase.from('animaladvocacy').select('*'),
        supabase.from('ea').select('*'),
        supabase.from('vevolution').select('*')
      ]);
      
      return [
        ...(veganJobs.data || []),
        ...(advocacyJobs.data || []),
        ...(eaJobs.data || []),
        ...(vevolutionJobs.data || [])
      ];
    }
  });

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
    const lowercaseLocation = location.toLowerCase();
    // Standardize Remote locations
    if (lowercaseLocation.includes('remote')) {
      if (lowercaseLocation.includes('usa') || lowercaseLocation.includes('united states')) {
        return 'Remote (USA)';
      }
      if (lowercaseLocation.includes('uk') || lowercaseLocation.includes('united kingdom')) {
        return 'Remote (UK)';
      }
      if (lowercaseLocation.includes('global')) {
        return 'Remote (Global)';
      }
      return 'Remote';
    }
    return location;
  };

  // Get all valid locations from jobs and count jobs per location
  const locationJobCounts = allJobs.reduce((acc, job) => {
    const formattedLocation = formatLocation(job.location);
    if (formattedLocation) {
      acc[formattedLocation] = (acc[formattedLocation] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Filter and process locations that exist in jobs
  const processedLocations = Array.from(new Set(
    uniqueLocations
      .map(loc => formatLocation(loc))
      .filter(loc => loc && locationJobCounts[loc] > 0) // Only include locations with jobs
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
                  <span className="ml-2 text-sm text-gray-500">
                    ({locationJobCounts[location]} jobs)
                  </span>
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