import { JobLogo } from "./JobLogo";
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
    <div className="flex items-start gap-3">
      <JobLogo logo={logo} companyName={companyName} />
      
      <div className="space-y-1 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium leading-tight text-gray-900 group-hover:text-sage-dark transition-colors">
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