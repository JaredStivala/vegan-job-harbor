import { Building2, MapPin, Clock, CheckCircle2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  tags: string[];
  verified?: boolean;
  logo?: string;
  url: string;
  description?: string;
}

export const JobCard = ({
  title,
  company,
  location,
  type,
  salary,
  posted,
  tags,
  verified = false,
  logo,
  url,
  description,
}: JobCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDescription = (text: string) => {
    // Extended list of common section headers in job descriptions
    const sectionPatterns = [
      'Overview',
      'About Us',
      'About the Role',
      'About the Position',
      'Job Description',
      'Responsibilities',
      'Key Responsibilities',
      'Requirements',
      'Required Skills',
      'Qualifications',
      'Required Qualifications',
      'Preferred Qualifications',
      'Experience',
      'Required Experience',
      'Skills',
      'Key Skills',
      'Benefits',
      'What We Offer',
      'Perks',
      'Company Benefits',
      'Location',
      'Hours',
      'Working Hours',
      'Schedule',
      'Work Schedule',
      'Holidays',
      'Salary',
      'Compensation',
      'Start Date',
      'Start date',
      'Reports to',
      'Contract type',
      'Employment Type',
      'How to Apply',
      'Application Process',
      'Next Steps'
    ].join('|');

    // Create a regex pattern that matches any of the section headers
    const regex = new RegExp(`(?=${sectionPatterns})`, 'g');
    
    // Split the text into sections based on the patterns
    const sections = text.split(regex);
    
    return sections.map((section, index) => {
      // Find the title at the start of the section
      const titleMatch = section.match(new RegExp(`^(${sectionPatterns})`));
      const title = titleMatch ? titleMatch[0] : '';
      const content = titleMatch ? section.slice(title.length) : section;
      
      // Only render sections that have content
      if (!content.trim()) return null;
      
      return (
        <div key={index} className="mb-6 last:mb-0">
          {title && (
            <h4 className="font-semibold text-sage-dark mb-3 text-lg">
              {title}
            </h4>
          )}
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {content.trim()}
          </p>
        </div>
      );
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all border border-sage/10 group">
      <div 
        className="cursor-pointer" 
        onClick={() => description && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-cream flex items-center justify-center">
            {logo ? (
              <img src={logo} alt={company} className="w-8 h-8 object-contain" />
            ) : (
              <Building2 className="w-6 h-6 text-sage" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg text-sage-dark group-hover:text-sage transition-colors flex items-center gap-2">
                  {title}
                  {verified && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                  {description && (
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  )}
                </h3>
                <p className="text-sage">{company}</p>
              </div>
              <span className="text-sm text-sage bg-sage/5 px-3 py-1 rounded-full">
                {posted}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="bg-white">
                <MapPin className="w-3 h-3 mr-1" />
                {location}
              </Badge>
              <Badge variant="outline" className="bg-white">
                <Clock className="w-3 h-3 mr-1" />
                {type}
              </Badge>
              <Badge variant="outline" className="bg-white">
                {salary}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-sage/5 hover:bg-sage/10">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(url, '_blank');
                }}
                className="bg-sage hover:bg-sage-dark"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>

        {description && (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-[2000px] mt-6 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="prose prose-sage max-w-none bg-cream/50 p-6 rounded-lg">
              {formatDescription(description)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};