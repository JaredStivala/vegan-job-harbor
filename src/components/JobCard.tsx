import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Building2, Calendar } from "lucide-react";
import type { Job } from "@/types/job";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface JobCardProps {
  job: Job;
  isSelected?: boolean;
}

export const JobCard = ({ job, isSelected }: JobCardProps) => {
  const {
    page_title,
    company_name,
    location,
    salary,
    date_posted,
    url,
    description
  } = job;

  const [isOpen, setIsOpen] = useState(false);

  const formattedDate = date_posted
    ? new Date(date_posted).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : null;

  const shouldShowSalary = salary && 
    salary !== "N/A" && 
    salary !== "Salary not specified";

  const formatDescription = (desc: string) => {
    if (!desc) return '';
    
    const paragraphs = desc.split(/\n\n|<br\s*\/?>/gi);
    
    return paragraphs
      .filter(p => p.trim().length > 0)
      .map(p => p.trim())
      .join('\n\n');
  };

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
            "p-6 hover:shadow-md transition-all duration-200 relative hover:bg-sage/5",
            isSelected && "ring-2 ring-sage shadow-md"
          )}>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-sage-dark">
                    {page_title || "Untitled Position"}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-sage hover:bg-sage-dark text-white hover:text-white border-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    Apply
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
                  {company_name && (
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      <span>{company_name}</span>
                    </div>
                  )}
                  
                  {location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{location}</span>
                    </div>
                  )}
                  
                  {formattedDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formattedDate}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {shouldShowSalary && (
                  <Badge variant="outline" className="bg-white">
                    {salary}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="px-6 py-4 bg-white border-x border-b rounded-b-lg">
          <div className="prose prose-sm max-w-none">
            {description ? (
              <div 
                className="whitespace-pre-wrap space-y-4 text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: formatDescription(description) 
                }} 
              />
            ) : (
              <p className="text-gray-500 italic">No description available</p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
