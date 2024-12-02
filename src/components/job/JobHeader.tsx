import { Badge } from "@/components/ui/badge";
import { JobLogo } from "./JobLogo";
import { ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface JobHeaderProps {
  title: string | null;
  logo: string | null;
  companyName: string | null;
  url: string;
  jobId: string;
  source: string;
  colored?: boolean | null;
  verified?: boolean | null;
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
      const response = await fetch('https://synbnbuwsiazqdrxphdb.supabase.co/functions/v1/log-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          source,
          url
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error logging click:', errorData);
        throw new Error(errorData.error || 'Failed to log click');
      }

      window.open(url, '_blank');
    } catch (error) {
      console.error('Error handling click:', error);
      toast({
        title: "Error",
        description: "Failed to track job click. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-start gap-3">
      <JobLogo logo={logo} companyName={companyName} colored={colored} />
      
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 
            className={`font-medium leading-none hover:underline cursor-pointer ${
              colored ? 'text-sage-dark' : ''
            }`}
            onClick={handleClick}
          >
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {companyName}
          </p>
          {verified && (
            <Badge variant="outline" className="text-[10px] px-1 py-0 border-sage text-sage">
              Verified
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};