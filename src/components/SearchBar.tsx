import { Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";

interface SearchBarProps {
  tags: string[];
  onTagSelect: (tag: string) => void;
  selectedTag: string | null;
}

export const SearchBar = ({ tags, onTagSelect, selectedTag }: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div
        className="relative"
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        <input
          type="text"
          placeholder="Search vegan jobs..."
          className="w-full px-6 py-4 pl-14 text-lg rounded-full border-2 border-sage focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all bg-white shadow-lg"
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-sage w-6 h-6" />
      </div>

      {isOpen && tags.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white rounded-lg shadow-lg border border-sage/10 z-50">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "secondary"}
                className={`cursor-pointer ${
                  selectedTag === tag ? "bg-sage" : "bg-sage/5 hover:bg-sage/10"
                }`}
                onClick={() => onTagSelect(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};