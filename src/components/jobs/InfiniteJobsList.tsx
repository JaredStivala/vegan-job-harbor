import { useInfiniteJobs } from "@/hooks/useInfiniteJobs";
import { JobCard } from "../JobCard";
import type { Job } from "@/types/job";

interface InfiniteJobsListProps {
  source: string;
  selectedLocations: string[];
  selectedTags: string[];
  selectedJob: Job | null;
  onLocationsUpdate: (locations: string[]) => void;
  onTagsUpdate: (tags: string[]) => void;
}

export const InfiniteJobsList = ({ 
  source,
  selectedLocations,
  selectedTags,
  selectedJob,
  onLocationsUpdate,
  onTagsUpdate
}: InfiniteJobsListProps) => {
  const { data, isLoading, error } = useInfiniteJobs({
    source,
    selectedLocations,
    selectedTags,
    onSuccess: (data) => {
      // Extract unique locations from the jobs
      const locations = data.pages.flatMap(page => 
        page.jobs.map(job => job.location)
      ).filter((location): location is string => !!location);
      onLocationsUpdate([...new Set(locations)]);

      // Extract unique tags from the jobs
      const tags = data.pages.flatMap(page => 
        page.jobs.flatMap(job => job.tags || [])
      ).filter((tag): tag is string => !!tag);
      onTagsUpdate([...new Set(tags)]);
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading jobs</div>;
  if (!data) return null;

  return (
    <div className="space-y-4">
      {data.pages.map((page, i) => (
        <div key={i} className="space-y-4">
          {page.jobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job}
              source={source}
              isSelected={selectedJob?.id === job.id}
            />
          ))}
        </div>
      ))}
    </div>
  );
};