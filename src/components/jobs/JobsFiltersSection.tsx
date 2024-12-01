import { JobsFilters } from "./JobsFilters";

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
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-sage-dark">Latest Jobs</h2>
      </div>
      
      <JobsFilters 
        onLocationDialogOpen={onLocationDialogOpen}
        selectedLocations={selectedLocations}
        setSortBy={setSortBy}
      />
    </div>
  );
};