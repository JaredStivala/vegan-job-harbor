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

      if (selectedLocations?.length) {
        const filters = selectedLocations.map(location => {
          const cleanLocation = location.replace(/[^a-zA-Z0-9\s]/g, ' ').trim();
          return `location.ilike.%${cleanLocation}%`;
        });
        
        // Apply each location filter individually
        filters.forEach(filter => {
          query = query.or(filter);
        });
      }

      if (selectedCompany) {
        query = query.ilike('company_name', `%${selectedCompany}%`);
      }

      // Handle tags differently based on the source table
      if (selectedTags?.length) {
        if (source === 'veganjobs' || source === 'ea') {
          // For array type columns, we need to check if the array contains ANY of the selected tags
          const tagConditions = selectedTags.map(tag => `tags.cs.{${tag}}`);
          query = query.or(tagConditions.join(','));
        } else {
          // For text type columns (animaladvocacy and vevolution)
          const tagConditions = selectedTags.map(tag => `tags.ilike.%${tag}%`);
          query = query.or(tagConditions.join(','));
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