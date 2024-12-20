import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { BackToTop } from "@/components/BackToTop";
import { JobsHeader } from "@/components/jobs/JobsHeader";
import { JobsHero } from "@/components/jobs/JobsHero";
import { JobsContent } from "@/components/jobs/JobsContent";
import { Logo } from "@/components/Logo";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Job } from "@/types/job";
import { useLocations } from "@/hooks/useLocations";

const Index = () => {
  const { toast } = useToast();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'salary' | 'location'>('latest');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { data: allJobs = [], isLoading, error } = useQuery({
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
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-50">
        <Logo />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-cream"
          onClick={() => window.location.href = 'mailto:jaredworkveg@gmail.com'}
          title="Contact Us"
        >
          <Mail className="h-4 w-4" />
        </Button>
      </div>
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
        onTagSelect={handleTagSelect}
        sortBy={sortBy}
        setSortBy={setSortBy}
        allTags={allTags}
      />
      <BackToTop />
    </div>
  );
};

export default Index;