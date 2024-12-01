import { useState } from "react";
import { LocationSearchDialog } from "./LocationSearchDialog";
import { JobsFiltersSection } from "./JobsFiltersSection";
import { InfiniteJobsList } from "./InfiniteJobsList";
import { JobsHeader } from "./JobsHeader";
import { useLocations } from "@/hooks/useLocations";
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
  const {
    locationDialogOpen,
    setLocationDialogOpen,
    locationSearch,
    setLocationSearch,
    selectedLocations,
    uniqueLocations,
    setUniqueLocations,
    handleLocationSelect,
    handleLocationRemove
  } = useLocations();

  return (
    <div id="jobs-section" className="container max-w-none py-8 px-4 md:px-8">
      <div className="space-y-4">
        <JobsHeader 
          selectedTags={selectedTags}
          onTagRemove={onTagRemove}
          selectedLocations={selectedLocations}
          onLocationRemove={handleLocationRemove}
        />
        
        <JobsFiltersSection 
          onLocationDialogOpen={() => setLocationDialogOpen(true)}
          selectedLocations={selectedLocations}
          setSortBy={setSortBy}
        />
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
      
      <div className="space-y-8 mt-8">
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