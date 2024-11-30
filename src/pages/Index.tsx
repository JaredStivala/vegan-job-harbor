import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState, useMemo } from "react";
import { BackToTop } from "@/components/BackToTop";
import { JobsHeader } from "@/components/jobs/JobsHeader";
import { JobsHero } from "@/components/jobs/JobsHero";
import { JobsContent } from "@/components/jobs/JobsContent";
import type { Job } from "@/types/job";

const Index = () => {
  const { toast } = useToast();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'salary' | 'location'>('latest');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { data: veganJobs = [], isLoading: isLoadingVegan, error: veganError } = useQuery({
    queryKey: ['veganjobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('veganjobs')
        .select('*')
        .order('date_posted', { ascending: false });
      
      if (error) {
        toast({
          title: "Error loading vegan jobs",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data || [];
    }
  });

  const { data: advocacyJobs = [], isLoading: isLoadingAdvocacy, error: advocacyError } = useQuery({
    queryKey: ['advocacy'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('animaladvocacy')
        .select('*')
        .order('date_posted', { ascending: false });
      
      if (error) {
        toast({
          title: "Error loading advocacy jobs",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data || [];
    }
  });

  const { data: vevolutionJobs = [], isLoading: isLoadingVevolution, error: vevolutionError } = useQuery({
    queryKey: ['vevolution'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vevolution')
        .select('*')
        .order('date_posted', { ascending: false });
      
      if (error) {
        toast({
          title: "Error loading vevolution jobs",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data || [];
    }
  });

  const allJobs = useMemo(() => {
    const combinedJobs = [...(Array.isArray(veganJobs) ? veganJobs : []), 
                         ...(Array.isArray(advocacyJobs) ? advocacyJobs : []), 
                         ...(Array.isArray(vevolutionJobs) ? vevolutionJobs : [])];
    
    let jobs = combinedJobs.filter((job): job is Job => {
      return Boolean(job && job.id && job.url);
    });

    if (selectedTags.length > 0) {
      jobs = jobs.filter(job => {
        if (!job.tags) return false;
        
        // Handle both array and string tags
        const jobTags = Array.isArray(job.tags) 
          ? job.tags 
          : typeof job.tags === 'string' 
            ? job.tags.split(',').map(t => t.trim())
            : [];

        return jobTags.some(tag => selectedTags.includes(tag));
      });
    }

    switch (sortBy) {
      case 'salary':
        return jobs.sort((a, b) => {
          if (!a.salary) return 1;
          if (!b.salary) return -1;
          return b.salary.localeCompare(a.salary);
        });
      case 'location':
        return jobs.sort((a, b) => {
          if (!a.location) return 1;
          if (!b.location) return -1;
          return a.location.localeCompare(b.location);
        });
      default:
        return jobs.sort((a, b) => {
          const dateA = a.date_posted ? new Date(a.date_posted) : new Date(0);
          const dateB = b.date_posted ? new Date(b.date_posted) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
    }
  }, [veganJobs, advocacyJobs, vevolutionJobs, selectedTags, sortBy]);

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
      <JobsHeader />
      <JobsHero 
        allJobs={allJobs}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
      />
      <JobsContent 
        allJobs={allJobs}
        isLoading={isLoadingVegan || isLoadingAdvocacy || isLoadingVevolution}
        error={veganError || advocacyError || vevolutionError}
        selectedJob={selectedJob}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
        onTagRemove={handleTagRemove}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <BackToTop />
    </div>
  );
};

export default Index;