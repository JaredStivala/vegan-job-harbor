import { JobLogo } from "./JobLogo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface JobHeaderProps {
  title: string;
  logo?: string | null;
  companyName: string;
  url: string;
  jobId: string;
  source: string;
  colored?: boolean;
  verified?: boolean;
}

export const JobHeader = ({ 
  title,
  logo,
  companyName,
  url,
  jobId,
  source,
  colored,
  verified
}: JobHeaderProps) => {
  const { toast } = useToast();

  const handleClick = async () => {
    try {
      const { error } = await supabase.from('job_clicks').insert([
        { 
          job_id: jobId,
          job_source: source,
          original_url: url
        }
      ]);

      if (error) {
        console.error('Error logging click:', error);
        toast({
          title: "Error tracking click",
          description: "There was an issue tracking this interaction",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error logging click:', error);
      toast({
        title: "Error tracking click",
        description: "There was an issue tracking this interaction",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-start gap-3 group/job relative">
      <JobLogo logo={logo} companyName={companyName} colored={colored} />
      
      <div className="space-y-1 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 
            className="font-medium leading-tight text-gray-900 group-hover:text-sage-dark transition-colors cursor-pointer"
            onClick={handleClick}
          >
            {title}
          </h3>
          {verified && (
            <span 
              className="text-xs font-medium bg-[#3B82F6] text-white px-2 py-0.5 rounded-full animate-pulse"
              aria-label="Verified job posting"
            >
              Verified
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-600 truncate">
          {companyName}
        </p>
      </div>
    </div>
  );
};