import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { categories } from "./categories";

interface CategorizedTagsProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

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