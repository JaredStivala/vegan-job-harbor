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
  jobs?: any[];
}

export const SearchBar = ({ tags, onTagSelect, selectedTags, jobs = [] }: SearchBarProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

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

  const jobTitles = jobs?.map(job => ({
    title: job.page_title || 'Untitled Position',
    type: job.type || 'Job',
    url: job.url
  })) || [];

  const handleSelect = (url: string) => {
    window.open(url, '_blank');
    setOpen(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <button
          onClick={() => setOpen(true)}
          className="w-full px-6 py-4 pl-14 text-lg rounded-full border-2 border-sage focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all bg-white shadow-lg text-left text-muted-foreground"
        >
          Search vegan jobs...
          <kbd className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-sage w-6 h-6" />
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="Type to search..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Jobs">
              {jobTitles
                .filter(job => 
                  job.title.toLowerCase().includes(search.toLowerCase())
                )
                .map((job, index) => (
                  <CommandItem
                    key={index}
                    value={job.title}
                    onSelect={() => handleSelect(job.url)}
                    className="cursor-pointer"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    <span>{job.title}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
            {search.length > 0 && (
              <CommandGroup heading="Tags">
                {tags
                  .filter(tag => 
                    tag.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((tag) => (
                    <CommandItem
                      key={tag}
                      value={tag}
                      onSelect={() => {
                        onTagSelect(tag);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <span className="mr-2">#</span>
                      <span>{tag}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};