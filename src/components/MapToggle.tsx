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
      className="mb-6 gap-2 text-sage hover:text-sage-dark"
    >
      <MapIcon className="w-4 h-4" />
      {isMapVisible ? "Hide Map" : "Show Map"}
    </Button>
  );
};