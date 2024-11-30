import { Search, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobsList } from "@/components/JobsList";
import { SelectedTags } from "@/components/SelectedTags";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Job } from "@/types/job";
import { useState } from "react";

interface JobsContentProps {
  allJobs: Job[];
  isLoading: boolean;
  error: Error | null;
  selectedJob: Job | null;
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  sortBy: 'latest' | 'salary' | 'location';
  setSortBy: (sort: 'latest' | 'salary' | 'location') => void;
}

export const JobsContent = ({ 
  allJobs,
  isLoading,
  error,
  selectedJob,
  selectedTags,
  onTagSelect,
  onTagRemove,
  sortBy,
  setSortBy
}: JobsContentProps) => {
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  // Get unique locations from jobs, ensuring we have a valid array
  const uniqueLocations = Array.from(new Set(
    allJobs
      .filter((job): job is Job & { location: string } => 
        Boolean(job && job.location)
      )
      .map(job => job.location)
  ));

  // Filter jobs based on selected locations
  const filteredJobs = allJobs.filter(job => {
    if (selectedLocations.length === 0) return true;
    return job.location && selectedLocations.some(loc => 
      job.location?.toLowerCase().includes(loc.toLowerCase())
    );
  });

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

  return (
    <div id="jobs-section" className="container max-w-none py-8 px-4 md:px-8">
      <div className="space-y-4">
        <SelectedTags 
          tags={selectedTags} 
          onRemoveTag={onTagRemove} 
        />
        
        {selectedLocations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedLocations.map(location => (
              <Button
                key={location}
                variant="secondary"
                size="sm"
                onClick={() => handleLocationRemove(location)}
                className="gap-1"
              >
                <MapPin className="w-3 h-3" />
                {location}
                <span className="ml-1">×</span>
              </Button>
            ))}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-sage-dark">Latest Jobs</h2>
            <span className="text-sage bg-sage/10 px-2 py-1 rounded-full text-sm">
              {filteredJobs.length}
            </span>
          </div>
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
              onClick={() => setLocationDialogOpen(true)}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-left truncate">
                  {selectedLocations.length > 0 
                    ? `${selectedLocations.length} location${selectedLocations.length > 1 ? 's' : ''}`
                    : 'Search locations...'}
                </span>
              </div>
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>L
              </kbd>
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
        </div>
      </div>
      
      <CommandDialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="Search locations..." 
            value={locationSearch}
            onValueChange={setLocationSearch}
          />
          <CommandList>
            <CommandEmpty>No locations found.</CommandEmpty>
            <CommandGroup heading="Available Locations">
              {uniqueLocations
                .filter(location => 
                  location.toLowerCase().includes(locationSearch.toLowerCase())
                )
                .map((location) => (
                  <CommandItem
                    key={location}
                    value={location}
                    onSelect={() => handleLocationSelect(location)}
                    className="cursor-pointer"
                  >
                    <MapPin className="mr-2 h-4 w-4 text-sage" />
                    <span>{location}</span>
                    {selectedLocations.includes(location) && (
                      <span className="ml-auto text-sage">Selected</span>
                    )}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
      
      <JobsList 
        jobs={filteredJobs}
        isLoading={isLoading}
        error={error}
        selectedJob={selectedJob}
        source="jobs-content"
      />
    </div>
  );
};