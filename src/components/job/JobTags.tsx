import { Badge } from "@/components/ui/badge";

interface JobTagsProps {
  salary: string | null;
  tags: string[] | string | null;
  source: string;
}

export const JobTags = ({ salary, tags, source }: JobTagsProps) => {
  const shouldShowSalary = salary && 
    salary !== "N/A" && 
    salary !== "Salary not specified" &&
    salary.toLowerCase() !== "none" &&
    !salary.toLowerCase().includes("per_annum") &&
    !salary.toLowerCase().includes("per annum") &&
    salary.toLowerCase() !== "none per_annum";

  // Process tags based on source and type
  const processedTags = (() => {
    if (!tags) return [];
    
    // For vevolution, tags are stored as a string
    if (source === 'vevolution' && typeof tags === 'string') {
      return tags
        .replace(/[\[\]"]/g, '') // Remove brackets and quotes
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    }
    
    // For other sources, tags should be an array
    if (Array.isArray(tags)) {
      return tags.filter(tag => tag && typeof tag === 'string');
    }
    
    return [];
  })();

  return (
    <div className="flex flex-wrap gap-2">
      {shouldShowSalary && (
        <Badge variant="outline" className="bg-white">
          {salary}
        </Badge>
      )}
      {processedTags.length > 0 && processedTags.map((tag, index) => (
        <Badge 
          key={index}
          variant="secondary" 
          className="bg-sage/10 text-sage-dark"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};