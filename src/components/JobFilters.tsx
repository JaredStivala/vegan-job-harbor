import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Tag = {
  id: string;
  name: string;
  category: string;
  created_at: string;
};

export const JobFilters = () => {
  const { data: tags, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching tags:', error);
        throw error;
      }
      return data as Tag[];
    }
  });

  // Group tags by category
  const tagsByCategory = tags?.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag.name);
    return acc;
  }, {} as Record<string, string[]>) || {};

  const categories = Object.keys(tagsByCategory);

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-6 w-24 bg-sage/10 rounded"></div>
      <div className="space-y-2">
        {[1,2,3].map(i => (
          <div key={i} className="h-8 w-20 bg-sage/5 rounded"></div>
        ))}
      </div>
    </div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full md:w-64">
      {categories.map((category) => (
        <div key={category}>
          <h3 className="font-semibold mb-3 text-sage-dark">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {tagsByCategory[category].map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                className="bg-white hover:bg-sage/10"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};