import { Button } from "@/components/ui/button";
import { Search, MapPin, DollarSign } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface JobsFiltersProps {
  onLocationDialogOpen: () => void;
  selectedLocations: string[];
  setSortBy: (sort: 'latest' | 'salary' | 'location') => void;
}

export const JobsFilters = ({ 
  onLocationDialogOpen, 
  selectedLocations,
  setSortBy 
}: JobsFiltersProps) => {
  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Search className="w-4 h-4" />
            Search
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setSortBy('latest')}>
            Latest
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2 relative w-[200px] justify-between"
        onClick={onLocationDialogOpen}
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span className="text-left truncate">
            {selectedLocations.length > 0 
              ? `${selectedLocations.length} location${selectedLocations.length > 1 ? 's' : ''}`
              : 'Search locations...'}
          </span>
        </div>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <DollarSign className="w-4 h-4" />
            Salary
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setSortBy('salary')}>
            Sort by salary
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};