import { useEffect, useRef } from "react";
import { JobCard } from "@/components/JobCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Job } from "@/types/job";
import { useInfiniteJobs } from "@/hooks/useInfiniteJobs";
import { useInView } from "react-intersection-observer";

interface InfiniteJobsListProps {
  source: 'veganjobs' | 'ea' | 'animaladvocacy' | 'vevolution';
  selectedLocations: string[];
  selectedTags: string[];
  selectedJob: Job | null;
}

export const InfiniteJobsList = ({ 
  source,
  selectedLocations,
  selectedTags,
  selectedJob 
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
    selectedTags
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (error) {
    return (
      <div className="text-red-500">
        Error loading jobs: {error.message}
      </div>
    );
  }

  const jobs = data?.pages.flat() || [];

  if (!isLoading && jobs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No jobs found matching your criteria
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard 
          key={job.id} 
          job={job} 
          isSelected={selectedJob?.id === job.id}
          source={source}
        />
      ))}
      
      {(isLoading || isFetchingNextPage) && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      )}
      
      <div ref={ref} className="h-10" />
    </div>
  );
};