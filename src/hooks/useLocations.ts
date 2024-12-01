import { useState } from "react";

export const useLocations = () => {
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [uniqueLocations, setUniqueLocations] = useState<string[]>([]);

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