import { JobCard } from "./JobCard";
import { Skeleton } from "./ui/skeleton";
import type { Job } from "@/types/job";

interface JobsListProps {
  jobs: Job[];
  isLoading: boolean;
  error: Error | null;
  selectedJob?: Job | null;
}

export const JobsList = ({ jobs = [], isLoading, error, selectedJob }: JobsListProps) => {
  if (error) {
    return (
      <div className="text-red-500">
        Error loading jobs: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (!Array.isArray(jobs) || jobs.length === 0) {
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
        />
      ))}
    </div>
  );
};