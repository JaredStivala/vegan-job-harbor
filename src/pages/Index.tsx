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
import { MapToggle } from "@/components/MapToggle";
import { SelectedTags } from "@/components/SelectedTags";
import { BackToTop } from "@/components/BackToTop";
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
  const [isMapVisible, setIsMapVisible] = useState(false);

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

  const handleTagRemove = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
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
      <div 
        className="relative bg-center bg-cover py-8 flex items-center overflow-hidden" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=2400&q=80")',
          backgroundPosition: 'center 40%',
          minHeight: '350px'
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.2))'
          }}
        />
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto space-y-8 text-center">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
                Find Your Next{' '}
                <span className="text-cream font-extrabold bg-gradient-to-r from-sage to-cream bg-clip-text text-transparent drop-shadow-[0_3px_3px_rgba(0,0,0,0.4)]">
                  Vegan Career
                </span>
              </h2>
              <p className="text-xl text-white font-medium drop-shadow-md tracking-wide">
                Discover opportunities that <span className="text-cream font-semibold drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">align with your values</span>
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
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="relative block w-full h-[40px]"
            style={{ transform: 'rotate(180deg)' }}
          >
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              className="fill-cream"
            />
          </svg>
        </div>
      </div>

      <div className="container py-8">
        {isMapVisible && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-dark mb-4">Job Locations</h2>
            <JobMap jobs={allJobs} onJobSelect={handleJobSelect} />
          </div>
        )}
      </div>
      
      <div id="jobs-section" className="container py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-64 shrink-0">
            <JobFilters 
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
            />
          </aside>
          
          <div className="flex-1">
            <div className="space-y-4">
              <SelectedTags 
                tags={selectedTags} 
                onRemoveTag={handleTagRemove} 
              />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold text-sage-dark">Latest Jobs</h2>
                  <span className="text-sage bg-sage/10 px-2 py-1 rounded-full text-sm">
                    {allJobs.length}
                  </span>
                  <MapToggle isMapVisible={isMapVisible} onToggle={() => setIsMapVisible(!isMapVisible)} />
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
      <BackToTop />
    </div>
  );
};

export default Index;
