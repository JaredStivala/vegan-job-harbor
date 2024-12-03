import { SelectedLocations } from "./SelectedLocations";
import { Button } from "@/components/ui/button";

interface JobsHeaderProps {
  selectedTags: string[];
  onTagRemove: (tag: string) => void;
  selectedLocations: string[];
  onLocationRemove: (location: string) => void;
  onPostJobClick: () => void;
}

export const JobsHeader = ({
  selectedTags,
  onTagRemove,
  selectedLocations,
  onLocationRemove,
  onPostJobClick
}: JobsHeaderProps) => {
  return (
    <div className="space-y-4">      
      <div className="flex justify-end px-4 pt-4">
        <Button 
          onClick={onPostJobClick}
          className="bg-sage hover:bg-sage-dark"
        >
          Post a Job
        </Button>
      </div>
      {selectedLocations.length > 0 && (
        <SelectedLocations
          locations={selectedLocations}
          onLocationRemove={onLocationRemove}
        />
      )}
    </div>
  );
};