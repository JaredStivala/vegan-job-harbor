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
} from "@/components/ui/command";

interface SearchBarProps {
  tags: string[];
  onTagSelect: (tag: string) => void;
  selectedTags: string[];
}

export const SearchBar = ({ tags, onTagSelect, selectedTags }: SearchBarProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isAnimating, setIsAnimating] = useState(true);

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

  // Animation interval
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000); // Animation duration
    }, 10000); // Repeat every 10 seconds

    return () => clearInterval(interval);
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

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <button
          onClick={() => setOpen(true)}
          className={`w-full px-6 py-4 pl-14 text-lg rounded-full border-2 border-sage focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all bg-white/90 backdrop-blur-sm shadow-lg text-left ${
            isAnimating ? 'animate-pulse' : ''
          }`}
        >
          <span className={`text-sage-dark/70 font-medium ${
            isAnimating ? 'animate-pulse' : ''
          }`}>
            Search vegan jobs by tags...
          </span>
          <kbd className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
        <Search className={`absolute left-5 top-1/2 -translate-y-1/2 text-sage w-6 h-6 ${
          isAnimating ? 'animate-bounce' : ''
        }`} />
        
        {isAnimating && (
          <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-sage-dark/70 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Type here</span>
              <svg 
                className="w-4 h-4 animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 8l4 4m0 0l-4 4m4-4H3" 
                />
              </svg>
            </div>
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
              {tags
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
                    <span className="mr-2">#</span>
                    <span>{tag}</span>
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