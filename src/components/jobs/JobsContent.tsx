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
  onTagSelect: (tag: string) => void;
  sortBy: 'latest' | 'salary' | 'location';
  setSortBy: (sort: 'latest' | 'salary' | 'location') => void;
  allTags: string[];
}

export const JobsContent = ({ 
  selectedJob,
  selectedTags: heroSelectedTags,
  onTagRemove: heroTagRemove,
  onTagSelect: heroTagSelect,
  sortBy,
  setSortBy,
  allTags
}: JobsContentProps) => {
  const [filterSelectedTags, setFilterSelectedTags] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

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

  const handleFilterTagSelect = (tag: string) => {
    setFilterSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      }
      return [...prev, tag];
    });
  };

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
  };

  const handleCompanyRemove = () => {
    setSelectedCompany(null);
  };

  // Combine tags from both hero and filter sections for job filtering
  const allSelectedTags = [...new Set([...heroSelectedTags, ...filterSelectedTags])];

  return (
    <div id="jobs-section" className="container max-w-none py-8 px-4 md:px-8">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {filterSelectedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleFilterTagSelect(tag)}
              className="inline-flex items-center px-3 py-1 rounded-full bg-sage/10 text-sage-dark hover:bg-sage/20 transition-colors"
            >
              {tag}
              <span className="ml-2">×</span>
            </button>
          ))}
          {selectedLocations.map((location) => (
            <button
              key={location}
              onClick={() => handleLocationRemove(location)}
              className="inline-flex items-center px-3 py-1 rounded-full bg-sage/10 text-sage-dark hover:bg-sage/20 transition-colors"
            >
              {location}
              <span className="ml-2">×</span>
            </button>
          ))}
          {selectedCompany && (
            <button
              onClick={handleCompanyRemove}
              className="inline-flex items-center px-3 py-1 rounded-full bg-sage/10 text-sage-dark hover:bg-sage/20 transition-colors"
            >
              {selectedCompany}
              <span className="ml-2">×</span>
            </button>
          )}
        </div>
        
        <JobsFiltersSection 
          onLocationDialogOpen={() => setLocationDialogOpen(true)}
          selectedLocations={selectedLocations}
          setSortBy={setSortBy}
          selectedTags={filterSelectedTags}
          onTagSelect={handleFilterTagSelect}
          selectedCompany={selectedCompany}
          onCompanySelect={handleCompanySelect}
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
          selectedTags={allSelectedTags}
          selectedJob={selectedJob}
          onLocationsUpdate={setUniqueLocations}
          selectedCompany={selectedCompany}
        />
        <InfiniteJobsList
          source="ea"
          selectedLocations={selectedLocations}
          selectedTags={allSelectedTags}
          selectedJob={selectedJob}
          onLocationsUpdate={setUniqueLocations}
          selectedCompany={selectedCompany}
        />
        <InfiniteJobsList
          source="animaladvocacy"
          selectedLocations={selectedLocations}
          selectedTags={allSelectedTags}
          selectedJob={selectedJob}
          onLocationsUpdate={setUniqueLocations}
          selectedCompany={selectedCompany}
        />
        <InfiniteJobsList
          source="vevolution"
          selectedLocations={selectedLocations}
          selectedTags={allSelectedTags}
          selectedJob={selectedJob}
          onLocationsUpdate={setUniqueLocations}
          selectedCompany={selectedCompany}
        />
      </div>
    </div>
  );
};