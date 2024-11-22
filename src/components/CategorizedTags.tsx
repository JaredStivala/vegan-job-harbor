import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface CategorizedTagsProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export const CategorizedTags = ({ tags, selectedTags, onTagSelect }: CategorizedTagsProps) => {
  const categories = {
    "Job Type": ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
    "Department": ["Engineering", "Marketing", "Sales", "Design", "Product", "Operations"],
    "Experience": ["Entry Level", "Mid Level", "Senior", "Lead", "Manager"],
    "Other": [] as string[]
  };

  // Categorize tags
  tags.forEach(tag => {
    let categorized = false;
    for (const [category, categoryTags] of Object.entries(categories)) {
      if (categoryTags.includes(tag)) {
        categorized = true;
        break;
      }
    }
    if (!categorized) {
      categories["Other"].push(tag);
    }
  });

  return (
    <Accordion type="single" collapsible className="w-full">
      {Object.entries(categories).map(([category, categoryTags]) => {
        const filteredTags = categoryTags.filter(tag => tags.includes(tag));
        if (filteredTags.length === 0) return null;
        
        return (
          <AccordionItem value={category} key={category}>
            <AccordionTrigger className="text-sage-dark hover:text-sage">
              {category}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {filteredTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    className={`justify-start ${
                      selectedTags.includes(tag) 
                        ? "bg-sage hover:bg-sage-dark" 
                        : "bg-white hover:bg-sage/10"
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