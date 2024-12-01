import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { BackToTop } from "@/components/BackToTop";
import { JobsHeader } from "@/components/jobs/JobsHeader";
import { JobsHero } from "@/components/jobs/JobsHero";
import { JobsContent } from "@/components/jobs/JobsContent";
import type { Job } from "@/types/job";
import { useLocations } from "@/hooks/useLocations";

const Index = () => {
  const { toast } = useToast();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'salary' | 'location'>('latest');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { data: allJobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('veganjobs').select('*');
      if (error) throw error;
      return data as Job[];
    }
  });

  const {
    selectedLocations,
    handleLocationRemove
  } = useLocations();

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      }
      return [...prev, tag];
    });
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage/5 to-cream">
      <JobsHeader 
        selectedTags={selectedTags}
        onTagRemove={handleTagRemove}
        selectedLocations={selectedLocations}
        onLocationRemove={handleLocationRemove}
      />
      <JobsHero 
        allJobs={allJobs}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
      />
      <JobsContent 
        selectedJob={selectedJob}
        selectedTags={selectedTags}
        onTagRemove={handleTagRemove}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <BackToTop />
    </div>
  );
};

export default Index;