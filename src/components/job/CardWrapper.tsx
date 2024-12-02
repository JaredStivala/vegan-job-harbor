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
        "p-4 transition-all duration-200 relative cursor-pointer border-2 text-foreground",
        isSelected && "ring-2 ring-sage shadow-md",
        colored ? (
          "border-[#8B5CF6] border-4 shadow-lg hover:shadow-xl"
        ) : (
          "hover:bg-gray-50/50"
        )
      )}
    >
      {children}
    </Card>
  );
};