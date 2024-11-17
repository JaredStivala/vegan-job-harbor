import { JobFilters } from "@/components/JobFilters";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";
import { SearchBar } from "@/components/SearchBar";
import { Briefcase, Building2, Users, Code2, Terminal } from "lucide-react";

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
      <div className="relative bg-[#0A0F1C] overflow-hidden">
        {/* Animated grid background */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z'/%3E%3C/g%3E%3C/svg%3E")`,
            animation: 'move-background 20s linear infinite'
          }}
        />

        <div className="container relative z-10 py-24">
          <div className="max-w-3xl mx-auto space-y-10 text-center">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 rounded-full bg-sage/10 text-accent border border-accent/20 backdrop-blur-sm">
                <Terminal className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Tech + Compassion</span>
              </div>
              
              <h1 className="text-6xl font-bold tracking-tight">
                <span className="text-white">Find Your Next</span>
                <div className="mt-2">
                  <span className="bg-gradient-to-r from-[#4ADE80] to-[#22D3EE] bg-clip-text text-transparent">
                    Vegan Tech Career
                  </span>
                </div>
              </h1>
              
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Join the intersection of technology and compassion. Build a career that matters.
              </p>
            </div>
            
            <SearchBar />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm hover:bg-white/[0.05] transition-colors">
                <Building2 className="w-5 h-5 text-[#4ADE80]" />
                <span className="text-white/90 font-medium">{jobs?.length || 0} Companies</span>
              </div>
              <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm hover:bg-white/[0.05] transition-colors">
                <Code2 className="w-5 h-5 text-[#22D3EE]" />
                <span className="text-white/90 font-medium">{jobs?.length || 0} Active Jobs</span>
              </div>
              <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm hover:bg-white/[0.05] transition-colors">
                <Users className="w-5 h-5 text-[#A78BFA]" />
                <span className="text-white/90 font-medium">1000+ Candidates</span>
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