import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Building2, Calendar } from "lucide-react";
import type { Job } from "@/types/job";
import { cn } from "@/lib/utils";

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
    url
  } = job;

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

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn(
        "block transition-all duration-200",
        isSelected && "scale-[1.02]"
      )}
    >
      <Card className={cn(
        "p-6 hover:shadow-md transition-shadow duration-200",
        isSelected && "ring-2 ring-sage shadow-md"
      )}>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-sage-dark">
              {page_title || "Untitled Position"}
            </h3>
            
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
    </a>
  );
};