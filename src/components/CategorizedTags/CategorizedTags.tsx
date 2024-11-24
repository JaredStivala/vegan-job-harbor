import { Accordion } from "@/components/ui/accordion";
import { categories } from "./categories";
import { CategoryItem } from "./CategoryItem";

interface CategorizedTagsProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export const CategorizedTags = ({ tags, selectedTags, onTagSelect }: CategorizedTagsProps) => {
  // Convert tags array to lowercase for case-insensitive comparison
  const normalizedTags = tags.map(tag => tag.toLowerCase());

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-sage-dark mb-4">Categories</h3>
      <Accordion type="multiple" className="w-full space-y-2">
        {Object.entries(categories).map(([category, categoryTags]) => {
          // Filter tags case-insensitively and match partial matches
          const filteredTags = categoryTags.filter(tag => 
            normalizedTags.some(normalizedTag => 
              normalizedTag.includes(tag.toLowerCase()) || 
              tag.toLowerCase().includes(normalizedTag)
            )
          );
          
          // Don't render empty categories
          if (filteredTags.length === 0) return null;
          
          return (
            <CategoryItem
              key={category}
              category={category}
              tags={filteredTags}
              selectedTags={selectedTags}
              onTagSelect={onTagSelect}
            />
          );
        })}
      </Accordion>
    </div>
  );
};