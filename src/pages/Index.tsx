import { JobFilters } from "@/components/JobFilters";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";
import { SearchBar } from "@/components/SearchBar";
import { Briefcase, Building2, Users } from "lucide-react";

type Job = Database['public']['Tables']['jobs']['Row'];

const Index = () => {
  const { toast } = useToast();

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage/5 to-cream">
      {/* Header */}
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
        className="relative bg-center bg-cover min-h-[500px] flex items-center" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2400&q=80")',
          backgroundPosition: 'center 40%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-sage-dark/90 to-sage/60" />
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto space-y-8 text-center">
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-5xl font-bold text-white">
                Find Your Next <span className="text-cream">Vegan Career</span>
              </h2>
              <p className="text-2xl font-light text-white/90">
                Join the plant-based <span className="text-cream">revolution</span>
              </p>
            </div>
            
            <SearchBar />

            <div className="flex justify-center gap-8 text-white/90">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span>{jobs?.length || 0} Companies</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                <span>{jobs?.length || 0} Active Jobs</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>1000+ Candidates</span>
              </div>
            </div>
          </div>
        </div>
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