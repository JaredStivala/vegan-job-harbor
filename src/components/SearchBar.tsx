import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { categories } from "./CategorizedTags/categories";

interface SearchBarProps {
  tags: string[];
  onTagSelect: (tag: string) => void;
  selectedTags: string[];
}

export const SearchBar = ({ tags, onTagSelect, selectedTags }: SearchBarProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Remove duplicate tags
  const uniqueTags = Array.from(new Set(tags));

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const scrollToJobs = () => {
    const jobsSection = document.querySelector('#jobs-section');
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTagSelect = (tag: string) => {
    onTagSelect(tag);
    setOpen(false);
    setTimeout(scrollToJobs, 100);
  };

  // Filter and organize tags by category
  const categorizedTags = Object.entries(categories).reduce((acc, [category, categoryTags]) => {
    const filteredTags = categoryTags.filter(tag => 
      uniqueTags.includes(tag) && 
      tag.toLowerCase().includes(search.toLowerCase())
    );
    if (filteredTags.length > 0) {
      acc[category] = filteredTags;
    }
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <button
          onClick={() => setOpen(true)}
          className="w-full px-6 py-4 pl-14 text-lg rounded-full border-2 border-sage focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all bg-white shadow-lg text-left text-muted-foreground"
        >
          Search vegan jobs by tags...
          <kbd className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-sage w-6 h-6" />
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
            {Object.entries(categorizedTags).map(([category, tags], index) => (
              <div key={category}>
                {index > 0 && <CommandSeparator />}
                <CommandGroup heading={category}>
                  {tags.map((tag) => (
                    <CommandItem
                      key={tag}
                      value={tag}
                      onSelect={() => handleTagSelect(tag)}
                      className="cursor-pointer"
                    >
                      <span className="mr-2">#</span>
                      <span>{tag}</span>
                      {selectedTags.includes(tag) && (
                        <span className="ml-auto text-sage">Selected</span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};