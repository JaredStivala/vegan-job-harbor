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
  const [animationIndex, setAnimationIndex] = useState(-1);
  const placeholderText = "Search vegan jobs by tags...";

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

  // Animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      let currentIndex = -1;
      const animationCycle = setInterval(() => {
        currentIndex++;
        if (currentIndex >= placeholderText.length) {
          clearInterval(animationCycle);
          setAnimationIndex(-1);
          return;
        }
        setAnimationIndex(currentIndex);
      }, 50); // Speed of the wave effect

      // Cleanup the inner interval
      setTimeout(() => {
        clearInterval(animationCycle);
        setAnimationIndex(-1);
      }, placeholderText.length * 50 + 100);
    }, 5000); // Run every 5 seconds

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

  const renderPlaceholder = () => {
    return placeholderText.split('').map((char, index) => (
      <span
        key={index}
        className={`inline-block transition-all duration-200 ${
          index === animationIndex
            ? 'transform scale-125 text-sage-dark'
            : 'scale-100'
        }`}
        style={{ 
          transitionDelay: `${index * 30}ms`,
        }}
      >
        {char}
      </span>
    ));
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <button
          onClick={() => setOpen(true)}
          className="w-full px-6 py-4 pl-14 text-lg rounded-full border-2 border-sage hover:border-sage-dark focus:border-sage-dark focus:ring-2 focus:ring-sage/20 outline-none transition-all bg-white/90 backdrop-blur-sm shadow-lg text-left"
        >
          <div className="text-gray-600 font-medium">
            {renderPlaceholder()}
          </div>
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