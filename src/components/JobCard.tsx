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
    
    // Split into sections based on potential section headers
    const sections = desc.split(/(?=Overview|About You|Key Responsibilities|Experience|Qualifications|Requirements|Benefits)/gi);
    
    return sections
      .map(section => {
        // Extract the header (if any) and content
        const matches = section.match(/^(Overview|About You|Key Responsibilities|Experience|Qualifications|Requirements|Benefits)?(.*)$/si);
        const [_, header, content] = matches || [null, '', section];
        
        // Format the section
        const formattedContent = content
          .split(/\n\n|<br\s*\/?>/gi)
          .filter(p => p.trim().length > 0)
          .map(p => `<p class="mb-4 leading-relaxed">${p.trim()}</p>`)
          .join('\n');

        // If there's a header, wrap the section with header styling
        if (header) {
          return `
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-sage-dark mb-6">${header.trim()}</h2>
              ${formattedContent}
            </div>
          `;
        }
        
        return `<div class="mb-8">${formattedContent}</div>`;
      })
      .join('\n');
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
        
        <CollapsibleContent className="px-8 py-8 bg-white border-x border-b rounded-b-lg">
          <div className="prose prose-lg max-w-none">
            {description ? (
              <div 
                className="space-y-6 text-gray-700 leading-relaxed"
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