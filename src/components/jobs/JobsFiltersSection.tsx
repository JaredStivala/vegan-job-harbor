import { Building2 } from "lucide-react";
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
import { LocationFilter } from "./filters/LocationFilter";
import { TagFilter } from "./filters/TagFilter";
import { Input } from "@/components/ui/input";

interface JobsFiltersSectionProps {
  onLocationDialogOpen: () => void;
  selectedLocations: string[];
  setSortBy: (sort: 'latest' | 'salary' | 'location') => void;
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  selectedCompany: string | null;
  onCompanySelect: (company: string) => void;
}

export const JobsFiltersSection = ({
  selectedLocations,
  setSortBy,
  selectedTags,
  onTagSelect,
  selectedCompany,
  onCompanySelect
}: JobsFiltersSectionProps) => {
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState("");

  // Fetch all jobs to get their tags, locations, and company names
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

  // Extract all unique tags from jobs, handling both array and string formats
  const availableTags = Array.from(new Set(
    allJobs.flatMap(job => {
      if (Array.isArray(job.tags)) {
        return job.tags;
      } else if (typeof job.tags === 'string') {
        return job.tags.split(',').map(tag => tag.trim());
      }
      return [];
    }).filter(Boolean)
  ));

  // Extract all unique company names
  const companyNames = Array.from(new Set(
    allJobs
      .map(job => job.company_name)
      .filter(Boolean)
      .map(name => name.trim())
  )).sort();

  const handleLocationSelect = (location: string) => {
    setSortBy('location');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-xl font-semibold text-sage-dark">Latest Jobs</h2>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <TagFilter 
          tags={availableTags}
          onTagSelect={onTagSelect}
          selectedTags={selectedTags}
        />

        <LocationFilter 
          selectedLocations={selectedLocations}
          onLocationSelect={handleLocationSelect}
        />

        <div className="relative flex-1 sm:w-48">
          <Input 
            type="text" 
            placeholder="Company name..." 
            className="pl-10 pr-10"
            onClick={() => setCompanyDialogOpen(true)}
            value={selectedCompany || ''}
            readOnly
          />
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />

          <CommandDialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen}>
            <Command className="rounded-lg border shadow-md">
              <CommandInput 
                placeholder="Search companies..." 
                value={companySearch}
                onValueChange={setCompanySearch}
              />
              <CommandList>
                <CommandEmpty>No companies found.</CommandEmpty>
                <CommandGroup heading="Companies">
                  {companyNames
                    .filter(company => 
                      company.toLowerCase().includes(companySearch.toLowerCase())
                    )
                    .map((company) => (
                      <CommandItem
                        key={company}
                        value={company}
                        onSelect={() => {
                          onCompanySelect(company);
                          setCompanyDialogOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        <Building2 className="mr-2 h-4 w-4 text-sage" />
                        <span>{company}</span>
                        {selectedCompany === company && (
                          <span className="ml-auto text-sage">Selected</span>
                        )}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </CommandDialog>
        </div>
      </div>
    </div>
  );
};