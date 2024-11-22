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
    "Food Service",
    "Catering",
    "Hospitality Management"
  ],
  "Food Industry": [
    "Food Production",
    "Food Safety",
    "Quality Control",
    "Recipe Development",
    "Food Science",
    "Product Development",
    "Kitchen Operations",
    "Food Manufacturing",
    "Food Technology",
    "Food Innovation",
    "Food Distribution",
    "Supply Chain",
    "Procurement"
  ],
  "Business & Operations": [
    "Operations Manager",
    "Project Manager",
    "Business Development",
    "Marketing Manager",
    "HR Manager",
    "Finance Manager",
    "Account Manager",
    "Operations",
    "Strategy",
    "Business Strategy",
    "Business Operations",
    "Administration",
    "Executive",
    "Consulting"
  ],
  "Technology": [
    "Software Engineer",
    "Web Developer",
    "UX Designer",
    "Product Manager",
    "Data Analyst",
    "IT Support",
    "Software Development",
    "Engineering",
    "Technical",
    "Technology",
    "Development"
  ],
  "Retail & Service": [
    "Retail Manager",
    "Sales Associate",
    "Store Manager",
    "Cashier",
    "Customer Service",
    "Visual Merchandiser",
    "Retail",
    "Sales",
    "Service"
  ],
  "Marketing & Communications": [
    "Marketing",
    "Communications",
    "Social Media",
    "Digital Marketing",
    "Content Creation",
    "Public Relations",
    "Brand Management",
    "Community Management",
    "Advertising"
  ],
  "Non-Profit & Advocacy": [
    "Non-Profit",
    "Advocacy",
    "Community Outreach",
    "Program Management",
    "Volunteer Management",
    "Fundraising",
    "Grant Writing",
    "Animal Rights",
    "Animal Welfare",
    "Vegan Advocacy"
  ],
  "Education & Research": [
    "Education",
    "Research",
    "Teaching",
    "Training",
    "Curriculum Development",
    "Program Development",
    "Academic"
  ],
  "Employment Type": [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Remote",
    "Hybrid",
    "Temporary",
    "Freelance",
    "Volunteer"
  ],
  "Experience Level": [
    "Entry Level",
    "Mid Level",
    "Senior",
    "Lead",
    "Manager",
    "Director",
    "Executive",
    "Junior",
    "Associate",
    "Principal"
  ],
  "Other Skills": [
    "Writing",
    "Editing",
    "Analysis",
    "Leadership",
    "Project Management",
    "Event Planning",
    "Customer Relations",
    "Coordination",
    "Design",
    "Planning",
    "Management"
  ]
};

export const CategorizedTags = ({ tags, selectedTags, onTagSelect }: CategorizedTagsProps) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-sage-dark mb-4">Categories</h3>
      <Accordion type="multiple" className="w-full space-y-2">
        {Object.entries(categories).map(([category, categoryTags]) => {
          const filteredTags = categoryTags.filter(tag => tags.includes(tag));
          if (filteredTags.length === 0) return null;
          
          const selectedCount = filteredTags.filter(tag => selectedTags.includes(tag)).length;
          
          return (
            <AccordionItem 
              value={category} 
              key={category} 
              className="border rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <AccordionTrigger className="px-4 py-3 text-sage-dark hover:text-sage hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{category}</span>
                  {selectedCount > 0 && (
                    <span className="text-sm bg-sage/10 px-2 py-0.5 rounded-full ml-2">
                      {selectedCount}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1 p-3">
                  {filteredTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "ghost"}
                      size="sm"
                      className={`justify-start ${
                        selectedTags.includes(tag) 
                          ? "bg-sage hover:bg-sage-dark text-white" 
                          : "hover:bg-sage/10 text-sage-dark"
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
    </div>
  );
};