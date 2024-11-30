import { Badge } from "@/components/ui/badge";
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

  const shouldShowSalary = salary && 
    salary !== "N/A" && 
    salary !== "Salary not specified";

  const formatDescription = (desc: string) => {
    if (!desc) return '';
    
    // First, identify and format the overview section
    let sections = desc.split(/(?=Overview|About the Role|Requirements|Key Responsibilities|What We Offer|Benefits|About Us)/gi);
    
    return sections.map(section => {
      // Get the section title if it exists
      const titleMatch = section.match(/^(Overview|About the Role|Requirements|Key Responsibilities|What We Offer|Benefits|About Us)/i);
      const title = titleMatch ? titleMatch[0] : '';
      const content = titleMatch ? section.substring(title.length) : section;
      
      // Split content into paragraphs and format them
      const formattedContent = content
        .split(/\n\n|\n(?=[•-])|<br\s*\/?>/gi)
        .filter(p => p.trim().length > 0)
        .map(p => {
          const trimmedP = p.trim();
          
          // Handle bullet points
          if (trimmedP.startsWith('•') || trimmedP.startsWith('-')) {
            return `<li class="mb-2">${trimmedP.substring(1).trim()}</li>`;
          }
          
          // Regular paragraphs
          return `<p class="mb-4 leading-relaxed">${trimmedP}</p>`;
        })
        .join('\n');

      // If this is a section with a title, wrap it in a section with heading
      if (title) {
        return `
          <section class="mb-8">
            <h3 class="text-xl font-bold text-sage-dark mb-4">${title}</h3>
            ${content.trim().startsWith('•') || content.trim().startsWith('-') 
              ? `<ul class="list-disc pl-6 space-y-1">${formattedContent}</ul>`
              : formattedContent}
          </section>
        `;
      }
      
      // If no title, just return the formatted content
      return `<div class="mb-6">${formattedContent}</div>`;
    }).join('\n');
  };

  // Ensure tags is an array before mapping
  const jobTags = Array.isArray(tags) ? tags : [];

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
                <JobHeader 
                  title={page_title}
                  logo={logo}
                  companyName={company_name}
                  url={url}
                />
                
                <JobMetadata 
                  companyName={company_name}
                  location={location}
                  formattedDate={formattedDate}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {shouldShowSalary && (
                  <Badge variant="outline" className="bg-white">
                    {salary}
                  </Badge>
                )}
                {jobTags.length > 0 && jobTags.map((tag, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="bg-sage/10 text-sage-dark hover:bg-sage/20 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="px-8 py-6 bg-white border-x border-b rounded-b-lg">
          <div className="prose prose-lg max-w-none">
            {description ? (
              <div 
                className="text-gray-700"
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