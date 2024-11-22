import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SelectedTagsProps {
  tags: string[];
  onRemoveTag: (tag: string) => void;
}

export const SelectedTags = ({ tags, onRemoveTag }: SelectedTagsProps) => {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="pl-3 pr-2 py-1.5 bg-sage/10 text-sage-dark hover:bg-sage/20 transition-colors group flex items-center gap-1"
        >
          {tag}
          <button
            onClick={() => onRemoveTag(tag)}
            className="ml-1 p-0.5 rounded-full hover:bg-sage/20 transition-colors"
          >
            <X className="w-3 h-3" />
            <span className="sr-only">Remove {tag} tag</span>
          </button>
        </Badge>
      ))}
    </div>
  );
};