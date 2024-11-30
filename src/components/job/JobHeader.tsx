import { Button } from "@/components/ui/button";
import { JobLogo } from "./JobLogo";

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
    window.open(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/redirect?id=${jobId}&source=${source}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex justify-between items-start gap-4">
      <div className="flex items-start gap-3">
        <JobLogo logo={logo} companyName={companyName} />
        <h3 className="font-semibold text-lg text-sage-dark">
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