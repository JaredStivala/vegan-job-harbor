import { Briefcase, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchBar } from "@/components/SearchBar";
import { JobFilters } from "@/components/JobFilters";
import { useToast } from "@/components/ui/use-toast";
import { useState, useMemo } from "react";
import { JobStats } from "@/components/JobStats";
import { JobsList } from "@/components/JobsList";
import type { Job } from "@/types/job";

const Index = () => {
  const { toast } = useToast();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
      return data;
    },
    initialData: []
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
      return data;
    },
    initialData: []
  });

  const allJobs = useMemo(() => {
    const jobs = [...veganJobs, ...advocacyJobs].filter((job): job is Job => {
      return Boolean(
        job &&
        job.id &&
        job.url &&
        (job.page_title || job.company_name) // At least one of these should be present
      );
    });

    if (selectedTags.length === 0) return jobs;
    
    return jobs.filter(job => 
      job.tags?.some(tag => selectedTags.includes(tag))
    );
  }, [veganJobs, advocacyJobs, selectedTags]);

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      }
      return [...prev, tag];
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage/5 to-cream">
      <header className="border-b border-sage/10 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-sage-dark flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            VeganJobs
          </h1>
          <div className="flex gap-4">
            <Button variant="ghost">Log in</Button>
            <Button className="bg-sage hover:bg-sage-dark">Post a job</Button>
          </div>
        </div>
      </header>

      <div 
        className="relative bg-center bg-cover py-16 flex items-center overflow-hidden" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2400&q=80")',
          backgroundPosition: 'center 40%',
          minHeight: '400px'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-sage-dark/40 to-sage/40" />

        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto space-y-8 text-center">
            <div className="space-y-4">
              <div className="inline-block p-2 px-4 rounded-full bg-white/20 text-white mb-2">
                <span className="flex items-center gap-2">
                  <Sprout className="w-4 h-4" />
                  <span>Join the plant-based revolution</span>
                </span>
              </div>
              <h2 className="text-5xl font-bold text-white leading-tight">
                Find Your Next{' '}
                <span className="text-cream">
                  Vegan Career
                </span>
              </h2>
              <p className="text-xl text-white/90">
                Discover opportunities that align with your values
              </p>
            </div>
            
            <SearchBar 
              tags={allJobs.flatMap(job => job.tags || [])}
              onTagSelect={handleTagSelect}
              selectedTags={selectedTags}
            />

            <JobStats jobCount={allJobs.length} />
          </div>
        </div>
      </div>
      
      <div id="jobs-section" className="container py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-64 shrink-0">
            <JobFilters 
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
            />
          </aside>
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-sage-dark">Latest Jobs</h2>
                <span className="text-sage bg-sage/10 px-2 py-1 rounded-full text-sm">
                  {allJobs.length}
                </span>
              </div>
              <Button variant="outline" className="border-sage hover:bg-sage/10">
                Sort by: Latest
              </Button>
            </div>
            
            <JobsList 
              jobs={allJobs}
              isLoading={isLoadingVegan || isLoadingAdvocacy}
              error={veganError || advocacyError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;