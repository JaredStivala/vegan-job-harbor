import { Search, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobsList } from "@/components/JobsList";
import { SelectedTags } from "@/components/SelectedTags";
import { JobFilters } from "@/components/JobFilters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Job } from "@/types/job";

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
  return (
    <div id="jobs-section" className="container py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-64 shrink-0">
          <JobFilters 
            selectedTags={selectedTags}
            onTagSelect={onTagSelect}
          />
        </aside>
        
        <div className="flex-1">
          <div className="space-y-4">
            <SelectedTags 
              tags={selectedTags} 
              onRemoveTag={onTagRemove} 
            />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-sage-dark">Latest Jobs</h2>
                <span className="text-sage bg-sage/10 px-2 py-1 rounded-full text-sm">
                  {allJobs.length}
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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy('location')}>
                      Sort by location
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

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
          
          <JobsList 
            jobs={allJobs}
            isLoading={isLoading}
            error={error}
            selectedJob={selectedJob}
            source="jobs-content"
          />
        </div>
      </div>
    </div>
  );
};