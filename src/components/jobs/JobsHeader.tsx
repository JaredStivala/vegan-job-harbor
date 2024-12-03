import { SelectedLocations } from "./SelectedLocations";

interface JobsHeaderProps {
  selectedTags: string[];
  onTagRemove: (tag: string) => void;
  selectedLocations: string[];
  onLocationRemove: (location: string) => void;
}

export const JobsHeader = ({
  selectedTags,
  onTagRemove,
  selectedLocations,
  onLocationRemove
}: JobsHeaderProps) => {
  return (
    <div className="space-y-4">      
      {selectedLocations.length > 0 && (
        <SelectedLocations
          locations={selectedLocations}
          onLocationRemove={onLocationRemove}
        />
      )}
    </div>
  );
};