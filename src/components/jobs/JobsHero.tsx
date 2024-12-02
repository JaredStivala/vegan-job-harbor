import { SearchBar } from "@/components/SearchBar";
import type { Job } from "@/types/job";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface JobsHeroProps {
  allJobs: Job[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export const JobsHero = ({ allJobs, selectedTags, onTagSelect }: JobsHeroProps) => {
  const { data: featuredCompanies } = useQuery({
    queryKey: ['featuredCompanies'],
    queryFn: async () => {
      const companies = ['ProVeg', 'Good Food Institute', 'Mercy For Animals', 'PETA', 'The Humane League', 'EA Funds'];
      const { data } = await supabase
        .from('veganjobs')
        .select('company_name, logo')
        .in('company_name', companies)
        .not('logo', 'is', null);
      
      return data || [];
    }
  });

  return (
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
          </div>
          
          <SearchBar 
            tags={allJobs.flatMap(job => job.tags || [])}
            onTagSelect={onTagSelect}
            selectedTags={selectedTags}
          />

          {featuredCompanies && featuredCompanies.length > 0 && (
            <div className="pt-8">
              <p className="text-white/60 text-sm mb-6">Trusted by leading organizations</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-center">
                {featuredCompanies.map((company) => (
                  <div 
                    key={company.company_name}
                    className="flex items-center justify-center"
                  >
                    <img
                      src={company.logo}
                      alt={`${company.company_name} logo`}
                      className={cn(
                        "h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity",
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
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
  );
};