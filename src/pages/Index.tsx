import { JobFilters } from "@/components/JobFilters";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";
import { SearchBar } from "@/components/SearchBar";
import { Briefcase, Building2, Users, Sprout } from "lucide-react";

type Job = Database['public']['Tables']['veganjobs']['Row'];

const Index = () => {
  const { toast } = useToast();

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('veganjobs')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

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

      {/* Hero Section */}
      <div 
        className="relative bg-center bg-cover min-h-[600px] flex items-center overflow-hidden" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2400&q=80")',
          backgroundPosition: 'center 40%'
        }}
      >
        {/* Simplified background overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-sage-dark/70 to-sage/60" />

        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto space-y-12 text-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block p-2 px-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-cream mb-4">
                <span className="flex items-center gap-2">
                  <Sprout className="w-4 h-4" />
                  <span>Join the plant-based revolution</span>
                </span>
              </div>
              <h2 className="text-6xl font-bold text-white leading-tight">
                Find Your Next{' '}
                <span className="bg-gradient-to-r from-cream to-white bg-clip-text text-transparent">
                  Vegan Career
                </span>
              </h2>
              <p className="text-2xl font-light text-white/80">
                Discover opportunities that align with your values
              </p>
            </div>
            
            <SearchBar />

            <div className="grid grid-cols-3 gap-6 mt-12">
              {[
                { icon: Building2, label: 'Companies', value: jobs?.length || 0 },
                { icon: Briefcase, label: 'Active Jobs', value: jobs?.length || 0 },
                { icon: Users, label: 'Candidates', value: '1000+' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <stat.icon className="w-6 h-6 text-cream mb-2" />
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                  <span className="text-white/70">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent" />
      </div>
      
      {/* Main Content */}
      <div className="container py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-64 shrink-0">
            <JobFilters />
          </aside>
          
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-sage-dark">Latest Jobs</h2>
                <span className="text-sage bg-sage/10 px-2 py-1 rounded-full text-sm">
                  {jobs?.length || 0}
                </span>
              </div>
              <Button variant="outline" className="border-sage hover:bg-sage/10">
                Sort by: Latest
              </Button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-sage border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-sage-dark">Loading jobs...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">Error loading jobs</div>
            ) : jobs?.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-sage/10">
                <Briefcase className="w-12 h-12 text-sage/50 mx-auto mb-4" />
                <p className="text-sage-dark font-medium">No jobs found</p>
                <p className="text-sage text-sm mt-1">Check back later for new opportunities</p>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {jobs?.map((job) => (
                  <JobCard
                    key={job.id}
                    title={job.page_title || 'Untitled Position'}
                    company={job.company_name || 'Company Not Specified'}
                    location={job.location || 'Location not specified'}
                    type={'Full-time'}
                    salary={job.salary || 'Salary not specified'}
                    posted="Just now"
                    tags={['Vegan', 'Remote']}
                    url={job.url}
                    description={job.description}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
