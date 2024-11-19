import { Briefcase } from "lucide-react";
import { JobCard } from "@/components/JobCard";
import type { Job } from "@/types/job";

interface JobsListProps {
  jobs: Job[];
  isLoading: boolean;
  error: Error | null;
}

export const JobsList = ({ jobs, isLoading, error }: JobsListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-sage border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sage-dark">Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error loading jobs</div>;
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-sage/10">
        <Briefcase className="w-12 h-12 text-sage/50 mx-auto mb-4" />
        <p className="text-sage-dark font-medium">No jobs found</p>
        <p className="text-sage text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          title={job.page_title || 'Position Available'}
          company={job.company_name || 'Company Name Not Available'}
          location={job.location || 'Location not specified'}
          type={job.type || 'Full-time'}
          salary={job.salary || 'Salary not specified'}
          posted={job.date_posted ? new Date(job.date_posted).toLocaleDateString() : 'Recently'}
          tags={Array.isArray(job.tags) ? job.tags : ['Vegan']}
          url={job.url}
          description={job.description}
        />
      ))}
    </div>
  );
};