import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleChevronProps {
  isOpen: boolean;
  colored?: boolean;
}

export const CollapsibleChevron = ({ isOpen, colored }: CollapsibleChevronProps) => {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2">
      <ChevronDown 
        className={cn(
          "h-5 w-5 transition-transform duration-200",
          colored ? "text-white" : "text-gray-400",
          isOpen && "rotate-180"
        )} 
      />
    </div>
  );
};