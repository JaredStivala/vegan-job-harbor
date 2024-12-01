import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useLocations = () => {
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [uniqueLocations, setUniqueLocations] = useState<string[]>([]);

  // Fetch all locations from all job tables
  const { data: locations } = useQuery({
    queryKey: ['all-locations'],
    queryFn: async () => {
      const [veganJobs, advocacyJobs, eaJobs, vevolutionJobs] = await Promise.all([
        supabase.from('veganjobs').select('location').not('location', 'is', null),
        supabase.from('animaladvocacy').select('location').not('location', 'is', null),
        supabase.from('ea').select('location').not('location', 'is', null),
        supabase.from('vevolution').select('location').not('location', 'is', null)
      ]);

      // Combine all locations and filter out null/undefined values
      const allLocations = [
        ...(veganJobs.data || []),
        ...(advocacyJobs.data || []),
        ...(eaJobs.data || []),
        ...(vevolutionJobs.data || [])
      ];

      // Extract locations and remove duplicates
      const uniqueLocations = Array.from(new Set(
        allLocations
          .map(item => item.location)
          .filter(Boolean) // Remove null/undefined values
          .map(loc => loc.trim()) // Trim whitespace
      ));

      return uniqueLocations;
    }
  });

  // Update uniqueLocations when data changes
  useEffect(() => {
    if (locations) {
      setUniqueLocations(locations);
    }
  }, [locations]);

  const handleLocationSelect = (location: string) => {
    setSelectedLocations(prev => {
      if (prev.includes(location)) {
        return prev.filter(l => l !== location);
      }
      return [...prev, location];
    });
  };

  const handleLocationRemove = (location: string) => {
    setSelectedLocations(prev => prev.filter(l => l !== location));
  };

  return {
    locationDialogOpen,
    setLocationDialogOpen,
    locationSearch,
    setLocationSearch,
    selectedLocations,
    uniqueLocations,
    setUniqueLocations,
    handleLocationSelect,
    handleLocationRemove
  };
};