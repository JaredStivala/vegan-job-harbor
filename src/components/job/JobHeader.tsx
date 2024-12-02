import { Button } from "@/components/ui/button";
import { JobLogo } from "./JobLogo";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  const handleClick = async () => {
    try {
      await supabase.from('job_clicks').insert([
        { 
          job_id: jobId,
          job_source: source,
          original_url: url
        }
      ]);
    } catch (error) {
      console.error('Error logging click:', error);
    }
  };

  return (
    <div className="flex items-start gap-3 group/job relative">
      <JobLogo logo={logo} companyName={companyName} />
      
      <div className="space-y-1 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium leading-tight text-gray-900">
            {title}
          </h3>
          {verified && (
            <span 
              className="text-xs font-medium bg-[#3B82F6] text-white px-2 py-0.5 rounded-full"
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

      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover/job:opacity-100 transition-opacity absolute -right-2 -top-2"
        asChild
      >
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
        >
          <ExternalLink className="w-4 h-4" />
          <span className="sr-only">Open job posting</span>
        </a>
      </Button>
    </div>
  );
};