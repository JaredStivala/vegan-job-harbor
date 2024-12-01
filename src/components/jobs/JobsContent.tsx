import { useState } from "react";
import { LocationSearchDialog } from "./LocationSearchDialog";
import { JobsFiltersSection } from "./JobsFiltersSection";
import { InfiniteJobsList } from "./InfiniteJobsList";
import { JobsHeader } from "./JobsHeader";
import { useLocations } from "@/hooks/useLocations";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
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
    setSelectedCompany(prev => prev === company ? null : company);
  };

  const handleCompanyRemove = () => {
    setSelectedCompany(null);
  };

  // Combine tags from both hero and filter sections for job filtering
  const allSelectedTags = [...new Set([...heroSelectedTags, ...filterSelectedTags])];

  const renderFilterBadge = (text: string, onRemove: () => void) => (
    <Badge
      key={text}
      variant="secondary"
      className="pl-3 pr-2 py-1.5 bg-sage/10 text-sage-dark hover:bg-sage/20 transition-colors group flex items-center gap-1"
    >
      {text}
      <button
        onClick={onRemove}
        className="ml-1 p-0.5 rounded-full hover:bg-sage/20 transition-colors"
      >
        <X className="w-3 h-3" />
        <span className="sr-only">Remove {text}</span>
      </button>
    </Badge>
  );

  return (
    <div id="jobs-section" className="container max-w-none py-8 px-4 md:px-8">
      <div className="space-y-4">
        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2">
          {filterSelectedTags.map((tag) => 
            renderFilterBadge(tag, () => handleFilterTagSelect(tag))
          )}
          {selectedLocations.map((location) => 
            renderFilterBadge(location, () => handleLocationRemove(location))
          )}
          {selectedCompany && 
            renderFilterBadge(selectedCompany, handleCompanyRemove)
          }
        </div>
        
        <JobsFiltersSection 
          onLocationDialogOpen={() => setLocationDialogOpen(true)}
          selectedLocations={selectedLocations}
          onLocationSelect={handleLocationSelect}
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