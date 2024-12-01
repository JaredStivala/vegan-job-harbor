import { useState } from "react";
import { SelectedTags } from "@/components/SelectedTags";
import { LocationSearchDialog } from "@/components/jobs/LocationSearchDialog";
import { JobsFilters } from "@/components/jobs/JobsFilters";
import { InfiniteJobsList } from "@/components/jobs/InfiniteJobsList";
import type { Job } from "@/types/job";

interface JobsContentProps {
  selectedJob: Job | null;
  selectedTags: string[];
  onTagRemove: (tag: string) => void;
  sortBy: 'latest' | 'salary' | 'location';
  setSortBy: (sort: 'latest' | 'salary' | 'location') => void;
}

export const JobsContent = ({ 
  selectedJob,
  selectedTags,
  onTagRemove,
  sortBy,
  setSortBy
}: JobsContentProps) => {
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
              <button
                key={location}
                onClick={() => handleLocationRemove(location)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-sage/10 text-sage-dark rounded-full text-sm hover:bg-sage/20"
              >
                {location}
                <span>×</span>
              </button>
            ))}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-sage-dark">Latest Jobs</h2>
          </div>
          
          <JobsFilters 
            onLocationDialogOpen={() => setLocationDialogOpen(true)}
            selectedLocations={selectedLocations}
            setSortBy={setSortBy}
          />
        </div>
      </div>
      
      <LocationSearchDialog
        open={locationDialogOpen}
        onOpenChange={setLocationDialogOpen}
        locationSearch={locationSearch}
        setLocationSearch={setLocationSearch}
        uniqueLocations={uniqueLocations}
        selectedLocations={selectedLocations}
        onLocationSelect={handleLocationSelect}
      />
      
      <div className="grid gap-8 mt-8">
        <InfiniteJobsList
          source="veganjobs"
          selectedLocations={selectedLocations}
          selectedTags={selectedTags}
          selectedJob={selectedJob}
          onLocationsUpdate={setUniqueLocations}
        />
        <InfiniteJobsList
          source="ea"
          selectedLocations={selectedLocations}
          selectedTags={selectedTags}
          selectedJob={selectedJob}
          onLocationsUpdate={setUniqueLocations}
        />
        <InfiniteJobsList
          source="animaladvocacy"
          selectedLocations={selectedLocations}
          selectedTags={selectedTags}
          selectedJob={selectedJob}
          onLocationsUpdate={setUniqueLocations}
        />
        <InfiniteJobsList
          source="vevolution"
          selectedLocations={selectedLocations}
          selectedTags={selectedTags}
          selectedJob={selectedJob}
          onLocationsUpdate={setUniqueLocations}
        />
      </div>
    </div>
  );
};