import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Job } from "@/types/job";

const JOBS_PER_PAGE = 10;

interface FetchJobsOptions {
  source: 'veganjobs' | 'ea' | 'animaladvocacy' | 'vevolution';
  selectedLocations?: string[];
  selectedTags?: string[];
  selectedCompany?: string | null;
}

export const useInfiniteJobs = ({ source, selectedLocations, selectedTags, selectedCompany }: FetchJobsOptions) => {
  return useInfiniteQuery({
    queryKey: ['jobs', source, selectedLocations, selectedTags, selectedCompany],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam * JOBS_PER_PAGE;
      const end = start + JOBS_PER_PAGE - 1;

      let query = supabase
        .from(source)
        .select('*')
        .range(start, end)
        .order('date_posted', { ascending: false, nullsFirst: false });

      // Handle location filtering
      if (selectedLocations?.length) {
        const locationFilters = selectedLocations.map(location => {
          return `location.ilike.%${location}%`;
        });
        query = query.or(locationFilters.join(','));
      }

      // Handle company filtering
      if (selectedCompany) {
        query = query.ilike('company_name', `%${selectedCompany}%`);
      }

      // Handle tags filtering based on the source table structure
      if (selectedTags?.length) {
        if (source === 'veganjobs' || source === 'ea') {
          // For array type tags columns
          const tagFilters = selectedTags.map(tag => `tags.cs.{${tag}}`);
          query = query.or(tagFilters.join(','));
        } else {
          // For text type tags columns (animaladvocacy and vevolution)
          const tagFilters = selectedTags.map(tag => `tags.ilike.%${tag}%`);
          query = query.or(tagFilters.join(','));
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Job[];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === JOBS_PER_PAGE ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
};