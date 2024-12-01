import { MapPin } from "lucide-react";
import { CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface LocationItemProps {
  location: string;
  isSelected: boolean;
  onSelect: (location: string) => void;
  className?: string;
}

export const LocationItem = ({ 
  location, 
  isSelected, 
  onSelect,
  className 
}: LocationItemProps) => {
  return (
    <CommandItem
      value={location}
      onSelect={() => onSelect(location)}
      className={cn("cursor-pointer", className)}
    >
      <MapPin className="mr-2 h-4 w-4 text-sage" />
      <span>{location}</span>
      {isSelected && (
        <span className="ml-auto text-sage">Selected</span>
      )}
    </CommandItem>
  );
};