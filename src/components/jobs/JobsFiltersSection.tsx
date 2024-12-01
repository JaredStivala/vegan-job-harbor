import { Input } from "@/components/ui/input";
import { MapPin, Search, Building2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface JobsFiltersSectionProps {
  onLocationDialogOpen: () => void;
  selectedLocations: string[];
  setSortBy: (sort: 'latest' | 'salary' | 'location') => void;
}

export const JobsFiltersSection = ({
  onLocationDialogOpen,
  selectedLocations,
  setSortBy
}: JobsFiltersSectionProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-xl font-semibold text-sage-dark">Latest Jobs</h2>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-48">
          <Input 
            type="text" 
            placeholder="Search jobs..." 
            className="pl-10 pr-10"
            onClick={() => toggleDropdown('search')}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          {activeDropdown === 'search' ? (
            <ChevronUp className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          )}
        </div>

        <div className="relative flex-1 sm:w-48">
          <Input 
            type="text" 
            placeholder="Location..." 
            className="pl-10 pr-10"
            onClick={() => {
              toggleDropdown('location');
              onLocationDialogOpen();
            }}
            value={selectedLocations.length > 0 ? `${selectedLocations.length} selected` : ''}
            readOnly
          />
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          {activeDropdown === 'location' ? (
            <ChevronUp className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          )}
        </div>

        <div className="relative flex-1 sm:w-48">
          <Input 
            type="text" 
            placeholder="Company name..." 
            className="pl-10 pr-10"
            onClick={() => toggleDropdown('company')}
          />
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          {activeDropdown === 'company' ? (
            <ChevronUp className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          )}
        </div>
      </div>
    </div>
  );
};