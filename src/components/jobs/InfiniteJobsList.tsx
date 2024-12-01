import { useInfiniteJobs } from "@/hooks/useInfiniteJobs";
import { JobCard } from "../JobCard";
import type { Job } from "@/types/job";

interface InfiniteJobsListProps {
  source: "veganjobs" | "ea" | "animaladvocacy" | "vevolution";
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
  });

  // Process locations and tags after data is loaded
  if (data?.pages) {
    // Extract unique locations from the jobs
    const locations = data.pages.flatMap(page => 
      page.map(job => job.location)
    ).filter((location): location is string => typeof location === 'string' && location !== null);
    onLocationsUpdate([...new Set(locations)]);

    // Extract unique tags from the jobs
    const tags = data.pages.flatMap(page => 
      page.flatMap(job => job.tags || [])
    ).filter((tag): tag is string => typeof tag === 'string' && tag !== null);
    onTagsUpdate([...new Set(tags)]);
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading jobs</div>;
  if (!data?.pages) return null;

  return (
    <div className="space-y-4">
      {data.pages.map((page, i) => (
        <div key={i} className="space-y-4">
          {page.map((job) => (
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