import type { Job } from "@/types/job";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { JobHeader } from "./job/JobHeader";
import { JobMetadata } from "./job/JobMetadata";
import { JobTags } from "./job/JobTags";
import { CardWrapper } from "./job/CardWrapper";
import { CollapsibleChevron } from "./job/CollapsibleChevron";
import { CollapsibleContent } from "./job/CollapsibleContent";

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
    logo,
    Colored,
    Verified
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
          <CardWrapper isSelected={isSelected} colored={Colored}>
            <div className="space-y-2">
              <JobHeader 
                title={page_title}
                logo={logo}
                companyName={company_name}
                url={url}
                jobId={id}
                source={source}
                colored={Colored}
                verified={Verified}
              />
              
              <JobMetadata 
                companyName={company_name}
                location={location}
                formattedDate={formattedDate}
                colored={Colored}
              />

              <JobTags 
                salary={salary}
                tags={tags}
                source={source}
                colored={Colored}
              />

              <CollapsibleChevron isOpen={isOpen} colored={Colored} />
            </div>
          </CardWrapper>
        </CollapsibleTrigger>
        
        <CollapsibleContent description={description} />
      </Collapsible>
    </div>
  );
};