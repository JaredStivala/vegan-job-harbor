import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatLocation } from "@/utils/locationFormatting";
import { LocationItem } from "./LocationItem";

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
      try {
        const [veganJobs, advocacyJobs, eaJobs, vevolutionJobs] = await Promise.all([
          supabase.from('veganjobs').select('location'),
          supabase.from('animaladvocacy').select('location'),
          supabase.from('ea').select('location'),
          supabase.from('vevolution').select('location')
        ]);
        
        return [
          ...(veganJobs.data || []),
          ...(advocacyJobs.data || []),
          ...(eaJobs.data || []),
          ...(vevolutionJobs.data || [])
        ];
      } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
      }
    }
  });

  // Get all valid locations from jobs and count jobs per location
  const locationJobCounts = allJobs.reduce((acc, job) => {
    if (!job.location) return acc;
    
    // Handle different location formats
    let locations: string[] = [];
    try {
      if (typeof job.location === 'string') {
        if (job.location.startsWith('[')) {
          locations = JSON.parse(job.location);
        } else {
          locations = [job.location];
        }
      } else if (Array.isArray(job.location)) {
        locations = job.location;
      }
    } catch (e) {
      console.error('Error parsing location:', e);
      locations = [String(job.location)];
    }

    locations.forEach(loc => {
      const formattedLocation = formatLocation(loc);
      if (formattedLocation) {
        acc[formattedLocation] = (acc[formattedLocation] || 0) + 1;
      }
    });
    
    return acc;
  }, {} as Record<string, number>);

  // Filter and process locations that exist in jobs
  const processedLocations = Array.from(new Set(
    uniqueLocations
      .map(loc => formatLocation(loc))
      .filter(Boolean)
  )).sort((a, b) => {
    // Always put Remote first
    if (a === 'Remote') return -1;
    if (b === 'Remote') return 1;
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
                location.toLowerCase().includes(locationSearch.toLowerCase()) &&
                locationJobCounts[location] > 0 // Only show locations with jobs
              )
              .map((location) => (
                <LocationItem
                  key={location}
                  location={location}
                  jobCount={locationJobCounts[location] || 0}
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