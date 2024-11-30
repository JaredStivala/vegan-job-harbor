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
}

export const JobHeader = ({ title, logo, companyName, url, jobId, source }: JobHeaderProps) => {
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
        <h3 className="font-semibold text-lg text-black hover:text-sage transition-colors">
          {title || "Untitled Position"}
        </h3>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity bg-sage hover:bg-sage-dark text-white hover:text-white border-none"
        onClick={handleApply}
      >
        Apply
      </Button>
    </div>
  );
};