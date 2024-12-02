import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface CardWrapperProps {
  isSelected?: boolean;
  colored?: boolean;
  children: ReactNode;
}

export const CardWrapper = ({ isSelected, colored, children }: CardWrapperProps) => {
  return (
    <Card 
      className={cn(
        "p-6 transition-all duration-200 relative cursor-pointer",
        isSelected && "ring-2 ring-sage shadow-md",
        colored ? (
          "bg-[#8B5CF6] text-white hover:bg-[#7C3AED] border-[#8B5CF6]"
        ) : (
          "hover:bg-gray-50/50"
        )
      )}
    >
      {children}
    </Card>
  );
};