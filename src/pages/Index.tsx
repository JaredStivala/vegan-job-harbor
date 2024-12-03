import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { JobsContent } from "@/components/jobs/JobsContent";
import { JobsHeader } from "@/components/jobs/JobsHeader";
import { JobsHero } from "@/components/jobs/JobsHero";
import { Logo } from "@/components/Logo";
import type { Job } from "@/types/job";
import { useLocations } from "@/hooks/useLocations";

const Index = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'salary' | 'location'>('latest');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { data: allJobs = [], isLoading } = useQuery({
    queryKey: ['all-jobs'],
    queryFn: async () => {
      const [veganJobs, advocacyJobs, eaJobs, vevolutionJobs] = await Promise.all([
        supabase.from('veganjobs').select('*'),
        supabase.from('animaladvocacy').select('*'),
        supabase.from('ea').select('*'),
        supabase.from('vevolution').select('*')
      ]);
      
      const allJobsData = [
        ...(veganJobs.data || []),
        ...(advocacyJobs.data || []),
        ...(eaJobs.data || []),
        ...(vevolutionJobs.data || [])
      ];

      return allJobsData as Job[];
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

  const allTags = Array.from(new Set(
    allJobs.flatMap(job => Array.isArray(job.tags) ? job.tags : [])
  ));

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage/5 to-cream">
      <div className="absolute top-4 left-4 z-50">
        <Logo />
      </div>
      <JobsHero 
        allJobs={allJobs}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
      />
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <JobsHeader 
            selectedTags={selectedTags}
            onTagRemove={handleTagRemove}
            selectedLocations={selectedLocations}
            onLocationRemove={handleLocationRemove}
          />
        </div>
        <JobsContent 
          selectedJob={selectedJob}
          selectedTags={selectedTags}
          onTagRemove={handleTagRemove}
          onTagSelect={handleTagSelect}
          sortBy={sortBy}
          setSortBy={setSortBy}
          allTags={allTags}
        />
      </div>
    </div>
  );
};

export default Index;