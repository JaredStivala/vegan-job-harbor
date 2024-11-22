import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface CategorizedTagsProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

const categories = {
  "Restaurant & Hospitality": [
    "Chef", 
    "Sous Chef",
    "Line Cook",
    "Pastry Chef",
    "Server",
    "Bartender",
    "Barback",
    "Host/Hostess",
    "Restaurant Manager",
    "Kitchen Manager",
    "Food Service"
  ],
  "Food Industry": [
    "Food Production",
    "Food Safety",
    "Quality Control",
    "Recipe Development",
    "Food Science",
    "Product Development",
    "Kitchen Operations"
  ],
  "Business & Operations": [
    "Operations Manager",
    "Project Manager",
    "Business Development",
    "Marketing Manager",
    "HR Manager",
    "Finance Manager",
    "Account Manager"
  ],
  "Technology": [
    "Software Engineer",
    "Web Developer",
    "UX Designer",
    "Product Manager",
    "Data Analyst",
    "IT Support"
  ],
  "Retail & Service": [
    "Retail Manager",
    "Sales Associate",
    "Store Manager",
    "Cashier",
    "Customer Service",
    "Visual Merchandiser"
  ],
  "Employment Type": [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Remote"
  ],
  "Experience Level": [
    "Entry Level",
    "Mid Level",
    "Senior",
    "Lead",
    "Manager",
    "Director",
    "Executive"
  ]
};

export const CategorizedTags = ({ tags, selectedTags, onTagSelect }: CategorizedTagsProps) => {
  return (
    <Accordion type="multiple" className="w-full space-y-2">
      {Object.entries(categories).map(([category, categoryTags]) => {
        const filteredTags = categoryTags.filter(tag => tags.includes(tag));
        if (filteredTags.length === 0) return null;
        
        const selectedCount = filteredTags.filter(tag => selectedTags.includes(tag)).length;
        
        return (
          <AccordionItem value={category} key={category} className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-2 text-sage-dark hover:text-sage hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <span>{category}</span>
                {selectedCount > 0 && (
                  <span className="text-sm bg-sage/10 px-2 py-0.5 rounded-full">
                    {selectedCount}
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1 p-2">
                {filteredTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "ghost"}
                    size="sm"
                    className={`justify-start ${
                      selectedTags.includes(tag) 
                        ? "bg-sage hover:bg-sage-dark" 
                        : "hover:bg-sage/10"
                    }`}
                    onClick={() => onTagSelect(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};