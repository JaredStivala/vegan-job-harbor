import { Search, Tag } from "lucide-react";
import { useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SelectedTags } from "@/components/SelectedTags";

interface SearchBarProps {
  tags: string[];
  onTagSelect: (tag: string) => void;
  selectedTags: string[];
}

export const SearchBar = ({ tags, onTagSelect, selectedTags }: SearchBarProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Clean and process tags
  const processTag = (tag: string) => {
    return tag
      .replace(/[\[\]"{}]/g, '') // Remove brackets, quotes, and curly braces
      .trim();
  };

  // Remove duplicate tags and clean them
  const uniqueTags = Array.from(new Set(
    tags
      .filter(tag => tag && tag !== 'null')
      .map(processTag)
      .filter(tag => tag.length > 0)
  ));

  const scrollToJobs = () => {
    const jobsSection = document.querySelector('#jobs-section');
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTagSelect = (tag: string) => {
    onTagSelect(tag);
    setOpen(false);
    // Scroll to jobs section after a small delay to ensure the UI has updated
    setTimeout(scrollToJobs, 100);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto hidden md:block">
      <div className="space-y-4">
        <div className="relative">
          <button
            onClick={() => setOpen(true)}
            className="w-full px-6 py-4 pl-14 text-lg rounded-full border-2 border-sage focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all bg-white shadow-lg text-left text-muted-foreground"
          >
            Search vegan jobs...
          </button>
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-sage w-6 h-6" />
        </div>

        {selectedTags.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2">
            <SelectedTags 
              tags={selectedTags} 
              onRemoveTag={onTagSelect}
            />
          </div>
        )}
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="Type to search tags..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
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
                    <span>{processTag(tag)}</span>
                    {selectedTags.includes(tag) && (
                      <span className="ml-auto text-sage">Selected</span>
                    )}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};