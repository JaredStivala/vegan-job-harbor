import { Button } from "@/components/ui/button";
import { MapIcon } from "lucide-react";

interface MapToggleProps {
  isMapVisible: boolean;
  onToggle: () => void;
}

export const MapToggle = ({ isMapVisible, onToggle }: MapToggleProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className="gap-2 text-sage hover:text-sage-dark border-sage hover:border-sage-dark hover:bg-sage/5"
    >
      <MapIcon className="w-4 h-4" />
      Show Interactive Map
    </Button>
  );
};