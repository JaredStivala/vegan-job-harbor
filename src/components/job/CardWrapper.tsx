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
        "p-4 relative cursor-pointer border-0",
        isSelected && "ring-2 ring-sage shadow-md",
        colored ? (
          "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl"
        ) : (
          "hover:bg-gray-50/50"
        )
      )}
    >
      {children}
    </Card>
  );
};