import { useEffect } from "react";
import { JobCard } from "@/components/JobCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Job } from "@/types/job";
import { useInfiniteJobs } from "@/hooks/useInfiniteJobs";
import { useInView } from "react-intersection-observer";

interface InfiniteJobsListProps {
  source: 'veganjobs' | 'ea' | 'animaladvocacy' | 'vevolution' | 'userSubmissions';
  selectedLocations: string[];
  selectedTags: string[];
  selectedJob: Job | null;
  onLocationsUpdate: (locations: string[]) => void;
  selectedCompany: string | null;
  showColored?: boolean;
}

export const InfiniteJobsList = ({ 
  source,
  selectedLocations,
  selectedTags,
  selectedJob,
  onLocationsUpdate,
  selectedCompany,
  showColored
}: InfiniteJobsListProps) => {
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error
  } = useInfiniteJobs({
    source,
    selectedLocations,
    selectedTags,
    selectedCompany
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (data?.pages) {
      const allJobs = data.pages.flat();
      const uniqueLocations = [...new Set(allJobs
        .map(job => job.location)
        .filter(Boolean)
        .map(loc => loc?.replace(/[\[\]"]/g, '').trim())
      )];
      onLocationsUpdate(uniqueLocations);
    }
  }, [data?.pages, onLocationsUpdate]);

  if (error) {
    return (
      <div className="text-red-500">
        Error loading jobs: {error.message}
      </div>
    );
  }

  const jobs = data?.pages.flat() || [];

  if (!isLoading && jobs.length === 0) {
    return null;
  }

  return (
    <div>
      {jobs.map((job) => (
        <JobCard 
          key={job.id} 
          job={job} 
          isSelected={selectedJob?.id === job.id}
          source={source}
        />
      ))}
      
      {(isLoading || isFetchingNextPage) && (
        <div>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 mb-4 last:mb-0" />
          ))}
        </div>
      )}
      
      <div ref={ref} />
    </div>
  );
};