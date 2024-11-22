import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategorizedTags } from "./CategorizedTags";

interface JobFiltersProps {
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export const JobFilters = ({ selectedTags, onTagSelect }: JobFiltersProps) => {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      // Fetch from all job tables with explicit error handling
      const [veganJobs, advocacyJobs, eaJobs, vevolutionJobs] = await Promise.all([
        supabase.from('veganjobs').select('tags').not('tags', 'is', null),
        supabase.from('animaladvocacy').select('tags').not('tags', 'is', null),
        supabase.from('ea').select('tags').not('tags', 'is', null),
        supabase.from('vevolution').select('tags').not('tags', 'is', null)
      ]);
      
      // Combine all tags and filter out null/undefined values
      const allJobsData = [
        ...(veganJobs.data || []),
        ...(advocacyJobs.data || []),
        ...(eaJobs.data || []),
        ...(vevolutionJobs.data || [])
      ];

      // Extract and flatten all tags, ensuring we handle arrays properly
      const allTags = allJobsData.reduce((acc: string[], job) => {
        if (Array.isArray(job.tags)) {
          acc.push(...job.tags);
        }
        return acc;
      }, []);

      // Remove duplicates and filter out empty/null values
      return Array.from(new Set(allTags)).filter(Boolean);
    }
  });

  // Extract unique tags from all jobs
  const allTags = jobs || [];

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-6 w-24 bg-sage/10 rounded"></div>
      <div className="space-y-2">
        {[1,2,3].map(i => (
          <div key={i} className="h-8 w-20 bg-sage/5 rounded"></div>
        ))}
      </div>
    </div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full md:w-64">
      <CategorizedTags
        tags={allTags}
        selectedTags={selectedTags}
        onTagSelect={onTagSelect}
      />
    </div>
  );
};