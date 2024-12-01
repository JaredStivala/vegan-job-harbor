import { Card } from "@/components/ui/card";
import type { Job } from "@/types/job";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { JobHeader } from "./job/JobHeader";
import { JobMetadata } from "./job/JobMetadata";
import { JobTags } from "./job/JobTags";
import { JobDescription } from "./job/JobDescription";

interface JobCardProps {
  job: Job;
  isSelected?: boolean;
  source: string;
}

export const JobCard = ({ job, isSelected, source }: JobCardProps) => {
  const {
    id,
    page_title,
    company_name,
    location,
    salary,
    date_posted,
    url,
    description,
    tags,
    logo
  } = job;

  const [isOpen, setIsOpen] = useState(false);

  const formattedDate = date_posted
    ? new Date(date_posted).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : null;

  return (
    <div 
      id={`job-${job.id}`}
      className={cn(
        "group transition-all duration-200",
        isSelected && "scale-[1.02]"
      )}
    >
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <CollapsibleTrigger className="w-full text-left">
          <Card className={cn(
            "p-6 transition-all duration-200 relative",
            isSelected && "ring-2 ring-sage shadow-md"
          )}>
            <div className="space-y-4">
              <div className="space-y-2">
                <JobHeader 
                  title={page_title}
                  logo={logo}
                  companyName={company_name}
                  url={url}
                  jobId={id}
                  source={source}
                />
                
                <JobMetadata 
                  companyName={company_name}
                  location={location}
                  formattedDate={formattedDate}
                />
              </div>

              <JobTags 
                salary={salary}
                tags={tags}
                source={source}
              />
            </div>
          </Card>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="px-8 py-6 bg-white border-x border-b rounded-b-lg">
          <JobDescription description={description} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};