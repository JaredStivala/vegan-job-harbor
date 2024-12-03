import { Building2, ChevronDown, PlusCircle } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EmailCaptureModal } from "@/components/EmailCaptureModal";

interface JobsFiltersSectionProps {
  onLocationDialogOpen: () => void;
  selectedLocations: string[];
  onLocationSelect: (location: string) => void;
  setSortBy: (sort: 'latest' | 'salary' | 'location') => void;
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  selectedCompany: string | null;
  onCompanySelect: (company: string) => void;
}

export const JobsFiltersSection = ({
  selectedLocations,
  onLocationSelect,
  setSortBy,
  selectedTags,
  onTagSelect,
  selectedCompany,
  onCompanySelect
}: JobsFiltersSectionProps) => {
  const navigate = useNavigate();
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);

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

  const handlePostJobClick = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      setShowEmailModal(true);
      return;
    }
    navigate('/post-job');
  };

  const handleEmailSubmit = (email: string) => {
    localStorage.setItem('userEmail', email);
    navigate('/post-job');
  };

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

  const companyNames = Array.from(new Set(
    allJobs
      .map(job => job.company_name)
      .filter(Boolean)
      .map(name => name.trim())
  )).sort();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-sage-dark">Latest Jobs</h2>
          <Button 
            onClick={handlePostJobClick}
            className="bg-sage hover:bg-sage-dark text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 px-6"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Post a Job
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <TagFilter 
            tags={availableTags}
            onTagSelect={onTagSelect}
            selectedTags={selectedTags}
          />

          <LocationFilter 
            selectedLocations={selectedLocations}
            onLocationSelect={onLocationSelect}
          />

          <div className="relative flex-1 sm:w-48">
            <button
              onClick={() => setCompanyDialogOpen(true)}
              className="w-full px-4 py-2.5 pl-10 pr-10 text-base rounded-xl border border-sage hover:border-sage-dark focus:border-sage-dark transition-colors bg-background text-gray-600 font-normal text-left"
            >
              {selectedCompany || "Company"}
            </button>
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sage" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sage" />

            <CommandDialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen}>
              <Command className="rounded-lg border shadow-md">
                <CommandInput 
                  placeholder="Search companies" 
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

      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        action="post"
      />
    </div>
  );
};