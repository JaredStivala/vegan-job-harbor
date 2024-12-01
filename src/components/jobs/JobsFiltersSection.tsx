import { Input } from "@/components/ui/input";
import { MapPin, Tag, Building2, ChevronDown, ChevronUp } from "lucide-react";
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface JobsFiltersSectionProps {
  onLocationDialogOpen: () => void;
  selectedLocations: string[];
  setSortBy: (sort: 'latest' | 'salary' | 'location') => void;
  tags: string[];
  onTagSelect: (tag: string) => void;
  selectedTags: string[];
}

export const JobsFiltersSection = ({
  onLocationDialogOpen,
  selectedLocations,
  setSortBy,
  tags: propTags,
  onTagSelect,
  selectedTags
}: JobsFiltersSectionProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Fetch all jobs to get their tags
  const { data: allJobs = [] } = useQuery({
    queryKey: ['all-jobs'],
    queryFn: async () => {
      const [veganJobs, advocacyJobs, eaJobs, vevolutionJobs] = await Promise.all([
        supabase.from('veganjobs').select('*'),
        supabase.from('animaladvocacy').select('*'),
        supabase.from('ea').select('*'),
        supabase.from('vevolution').select('*')
      ]);
      
      return [
        ...(veganJobs.data || []),
        ...(advocacyJobs.data || []),
        ...(eaJobs.data || []),
        ...(vevolutionJobs.data || [])
      ];
    }
  });

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleTagSelect = (tag: string) => {
    onTagSelect(tag);
    setSearchDialogOpen(false);
  };

  // Extract all unique tags from jobs
  const availableTags = Array.from(new Set(
    allJobs.flatMap(job => Array.isArray(job.tags) ? job.tags : [])
  ));

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-xl font-semibold text-sage-dark">Latest Jobs</h2>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-48">
          <button
            onClick={() => setSearchDialogOpen(true)}
            className="w-full px-4 py-2 pl-10 pr-10 text-sm rounded-md border border-input bg-background text-left"
          >
            {selectedTags.length > 0 ? `${selectedTags.length} tags selected` : "Search jobs..."}
          </button>
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          {activeDropdown === 'search' ? (
            <ChevronUp className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          )}

          <CommandDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
            <Command className="rounded-lg border shadow-md">
              <CommandInput 
                placeholder="Type to search tags..." 
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandList>
                <CommandEmpty>No tags found.</CommandEmpty>
                <CommandGroup heading="Available Tags">
                  {availableTags
                    .filter(tag => 
                      tag.toLowerCase().includes(searchValue.toLowerCase())
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
            </Command>
          </CommandDialog>
        </div>

        <div className="relative flex-1 sm:w-48">
          <Input 
            type="text" 
            placeholder="Location..." 
            className="pl-10 pr-10"
            onClick={() => {
              toggleDropdown('location');
              onLocationDialogOpen();
            }}
            value={selectedLocations.length > 0 ? `${selectedLocations.length} selected` : ''}
            readOnly
          />
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          {activeDropdown === 'location' ? (
            <ChevronUp className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          )}
        </div>

        <div className="relative flex-1 sm:w-48">
          <Input 
            type="text" 
            placeholder="Company name..." 
            className="pl-10 pr-10"
            onClick={() => toggleDropdown('company')}
          />
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          {activeDropdown === 'company' ? (
            <ChevronUp className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          )}
        </div>
      </div>
    </div>
  );
};