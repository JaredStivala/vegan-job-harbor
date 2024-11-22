import { Briefcase, Sprout, Search, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchBar } from "@/components/SearchBar";
import { JobFilters } from "@/components/JobFilters";
import { useToast } from "@/components/ui/use-toast";
import { useState, useMemo } from "react";
import { JobStats } from "@/components/JobStats";
import { JobsList } from "@/components/JobsList";
import { JobMap } from "@/components/JobMap";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      return data;
    },
    initialData: []
  });

  const allJobs = useMemo(() => {
    let jobs = [...veganJobs, ...advocacyJobs, ...vevolutionJobs].filter((job): job is Job => {
      return Boolean(
        job &&
        job.id &&
        job.url
      );
    });

    if (selectedTags.length > 0) {
      jobs = jobs.filter(job => 
        job.tags?.some(tag => selectedTags.includes(tag))
      );
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

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    const element = document.getElementById('jobs-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
      
      <div className="container py-12">
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-sage-dark mb-6">Job Locations</h2>
          <JobMap jobs={allJobs} onJobSelect={handleJobSelect} />
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-sage-dark">Latest Jobs</h2>
                <span className="text-sage bg-sage/10 px-2 py-1 rounded-full text-sm">
                  {allJobs.length}
                </span>
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Search className="w-4 h-4" />
                      Search
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy('latest')}>
                      Latest
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy('location')}>
                      Sort by location
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <DollarSign className="w-4 h-4" />
                      Salary
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy('salary')}>
                      Sort by salary
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <JobsList 
              jobs={allJobs}
              isLoading={isLoadingVegan || isLoadingAdvocacy || isLoadingVevolution}
              error={veganError || advocacyError || vevolutionError}
              selectedJob={selectedJob}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
