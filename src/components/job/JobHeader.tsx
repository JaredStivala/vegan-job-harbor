import { Button } from "@/components/ui/button";
import { JobLogo } from "./JobLogo";
import { supabase } from "@/integrations/supabase/client";

interface JobHeaderProps {
  title: string;
  logo?: string | null;
  companyName?: string | null;
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
  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');

    // Log the click in the background without waiting for the response
    const logClick = async () => {
      try {
        const { error } = await supabase.functions.invoke('log-click', {
          body: {
            jobId,
            source,
            url
          }
        });
        
        if (error) {
          console.error('Error logging click:', error);
        }
      } catch (error) {
        console.error('Error logging click:', error);
      }
    };
    logClick();
  };

  return (
    <div className="flex justify-between items-start gap-4">
      <div className="flex items-start gap-3">
        <JobLogo logo={logo} companyName={companyName} />
        <div className="flex items-center gap-1.5">
          <h3 className={`font-semibold text-lg ${colored ? 'text-white' : 'text-black group-hover:text-sage'}`}>
            {title || "Untitled Position"}
          </h3>
          {verified && (
            <span 
              className="text-sm font-semibold bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 text-white px-2 py-0.5 rounded-full animate-pulse"
              aria-label="Verified job posting"
            >
              Verified
            </span>
          )}
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="opacity-0 group-hover:opacity-100 bg-sage hover:bg-sage-dark text-white hover:text-white border-none"
        onClick={handleApply}
      >
        Apply
      </Button>
    </div>
  );
};