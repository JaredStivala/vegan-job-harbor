import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Job } from "@/types/job";

const JOBS_PER_PAGE = 10;

interface FetchJobsOptions {
  source: 'veganjobs' | 'ea' | 'animaladvocacy' | 'vevolution';
  selectedLocations?: string[];
  selectedTags?: string[];
  onSuccess?: (data: { pages: Job[][] }) => void;
}

export const useInfiniteJobs = ({ source, selectedLocations, selectedTags, onSuccess }: FetchJobsOptions) => {
  return useInfiniteQuery({
    queryKey: ['jobs', source, selectedLocations, selectedTags],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam * JOBS_PER_PAGE;
      const end = start + JOBS_PER_PAGE - 1;

      let query = supabase
        .from(source)
        .select('*')
        .range(start, end)
        .order('date_posted', { ascending: false, nullsFirst: false });

      if (selectedLocations?.length) {
        query = query.or(
          selectedLocations.map(loc => `location.ilike.%${loc}%`).join(',')
        );
      }

      // Handle tags differently for vevolution table since it uses text type
      if (selectedTags?.length) {
        if (source === 'vevolution') {
          // For text type, use LIKE for each tag
          const tagConditions = selectedTags.map(tag => `tags.ilike.%${tag}%`);
          query = query.or(tagConditions.join(','));
        } else {
          // For array type, use contains operator
          query = query.contains('tags', selectedTags);
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
    onSuccess
  });
};