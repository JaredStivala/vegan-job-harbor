import { Search, Tag } from "lucide-react";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SearchBarProps {
  tags: string[];
  onTagSelect: (tag: string) => void;
  selectedTags: string[];
}

export const SearchBar = ({ tags, onTagSelect, selectedTags }: SearchBarProps) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Remove duplicate tags
  const uniqueTags = Array.from(new Set(tags));

  const scrollToJobs = () => {
    const jobsSection = document.querySelector('#jobs-section');
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTagSelect = (tag: string) => {
    onTagSelect(tag);
    // Scroll to jobs section after a small delay to ensure the UI has updated
    setTimeout(scrollToJobs, 100);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Command className="relative rounded-lg border shadow-md bg-white">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder="Search vegan jobs by tags..." 
              value={search}
              onValueChange={setSearch}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 200)}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none"
            />
          </div>
          {isOpen && (
            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup heading="Available Tags">
                {uniqueTags
                  .filter(tag => 
                    tag.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((tag) => (
                    <CommandItem
                      key={tag}
                      value={tag}
                      onSelect={() => handleTagSelect(tag)}
                      className="cursor-pointer"
                    >
                      <Tag className="mr-2 h-4 w-4 text-sage" />
                      <span>{tag}</span>
                      {selectedTags.includes(tag) && (
                        <span className="ml-auto text-sage">Selected</span>
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </div>
    </div>
  );
};