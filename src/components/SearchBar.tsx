import { Search, Tag } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

interface SearchBarProps {
  tags: string[];
  onTagSelect: (tag: string) => void;
  selectedTags: string[];
}

export const SearchBar = ({ tags = [], onTagSelect, selectedTags }: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Remove duplicate tags - ensure tags is an array before creating Set
  const uniqueTags = Array.from(new Set(tags.filter(Boolean)));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
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
    setIsOpen(false);
    setTimeout(scrollToJobs, 100);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={wrapperRef}>
      <div className="relative">
        <div
          onClick={() => setIsOpen(true)}
          className="w-full px-6 py-4 pl-14 text-lg rounded-full border-2 border-sage focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all bg-white shadow-lg text-left text-muted-foreground cursor-pointer"
        >
          Search vegan jobs by tags...
          <kbd className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-sage w-6 h-6" />
      </div>

      {isOpen && (
        <div className="absolute w-full mt-2 rounded-lg border shadow-lg bg-white z-50">
          <Command className="rounded-lg">
            <CommandInput 
              placeholder="Type to search tags..." 
              value={search}
              onValueChange={setSearch}
              className="border-none focus:ring-0"
            />
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandGroup heading="Available Tags" className="max-h-[300px] overflow-y-auto">
              {uniqueTags
                .filter(tag => 
                  tag.toLowerCase().includes(search.toLowerCase())
                )
                .map((tag) => (
                  <CommandItem
                    key={tag}
                    value={tag}
                    onSelect={() => handleTagSelect(tag)}
                    className="cursor-pointer flex items-center px-4 py-2 hover:bg-sage/10"
                  >
                    <Tag className="mr-2 h-4 w-4 text-sage" />
                    <span>{tag}</span>
                    {selectedTags.includes(tag) && (
                      <span className="ml-auto text-sage">Selected</span>
                    )}
                  </CommandItem>
                ))}
            </CommandGroup>
          </Command>
        </div>
      )}
    </div>
  );
};