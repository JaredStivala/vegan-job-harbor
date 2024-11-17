import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const JobFilters = () => {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('veganjobs')
        .select('tags');
      
      if (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }
      return data;
    }
  });

  // Extract unique tags from all jobs
  const allTags = Array.from(new Set(jobs?.flatMap(job => job.tags || []) || []));

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
      <div>
        <h3 className="font-semibold mb-3 text-sage-dark">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant="outline"
              size="sm"
              className="bg-white hover:bg-sage/10"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};