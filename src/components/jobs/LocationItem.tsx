import { MapPin } from "lucide-react";
import { CommandItem } from "@/components/ui/command";

interface LocationItemProps {
  location: string;
  jobCount: number;
  isSelected: boolean;
  onSelect: (location: string) => void;
}

export const LocationItem = ({ 
  location, 
  jobCount, 
  isSelected, 
  onSelect 
}: LocationItemProps) => {
  return (
    <CommandItem
      key={location}
      value={location}
      onSelect={() => onSelect(location)}
      className="cursor-pointer"
    >
      <MapPin className="mr-2 h-4 w-4 text-sage" />
      <span>{location}</span>
      <span className="ml-2 text-sm text-gray-500">
        ({jobCount} jobs)
      </span>
      {isSelected && (
        <span className="ml-auto text-sage">Selected</span>
      )}
    </CommandItem>
  );
};