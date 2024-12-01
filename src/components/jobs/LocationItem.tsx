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
      className={cn(
        "cursor-pointer flex items-center gap-2 px-4 py-2",
        isSelected && "bg-accent/10",
        className
      )}
    >
      <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
      <span className="flex-1">{location}</span>
    </CommandItem>
  );
};