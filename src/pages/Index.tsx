import { JobFilters } from "@/components/JobFilters";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { Database } from "@/integrations/supabase/types";
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type Job = Database['public']['Tables']['jobs']['Row'];

const Index = () => {
  const { toast } = useToast();

  const { data: jobs, isLoading, error, refetch } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const scrapeJobs = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('scrape-jobs');
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: `Successfully scraped ${data.jobsProcessed} jobs`,
      });
      
      refetch(); // Refresh the jobs list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to scrape jobs. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('jobs_changes')
      .on<Job>(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs'
        },
        (payload: RealtimePostgresChangesPayload<Job>) => {
          if (payload.new) {
            toast({
              title: "New job posted!",
              description: `${payload.new.title} at ${payload.new.company}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage/5 to-cream">
      {/* Header */}
      <header className="border-b border-sage/10">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-sage-dark">VeganJobs</h1>
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
        <div className="absolute inset-0 bg-gradient-to-r from-sage-dark/80 to-sage/40" />
        <div className="container relative z-10 text-center text-white">
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-5xl font-bold mb-4">
              Find Your Next <span className="text-cream">Vegan Career</span>
            </h2>
            <p className="text-3xl font-light">
              Join the plant-based <span className="text-cream">revolution</span>
            </p>
            <Button 
              onClick={scrapeJobs} 
              className="bg-cream hover:bg-cream/90 text-sage-dark"
            >
              Refresh Jobs
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <JobFilters />
          
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
              <div className="text-center py-8">Loading jobs...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">Error loading jobs</div>
            ) : jobs?.length === 0 ? (
              <div className="text-center py-8">No jobs found</div>
            ) : (
              jobs?.map((job) => (
                <JobCard
                  key={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location || 'Location not specified'}
                  type={job.type || 'Type not specified'}
                  salary={job.salary || 'Salary not specified'}
                  posted={new Date(job.posted_at).toLocaleDateString()}
                  tags={job.tags || []}
                  logo={job.logo_url}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;