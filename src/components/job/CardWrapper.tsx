import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface CardWrapperProps {
  isSelected?: boolean;
  colored?: boolean;
  children: ReactNode;
  url: string;
}

export const CardWrapper = ({ isSelected, colored, children, url }: CardWrapperProps) => {
  return (
    <Card 
      className={cn(
        "p-4 transition-all duration-200 relative cursor-pointer border-2 group",
        isSelected && "ring-2 ring-sage shadow-md",
        colored ? (
          "border-blue-500 border-4 shadow-lg hover:shadow-xl"
        ) : (
          "hover:bg-gray-50/50"
        )
      )}
    >
      {children}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          variant="default"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            window.open(url, '_blank');
          }}
          className="bg-sage hover:bg-sage-dark text-white"
        >
          Apply
        </Button>
      </div>
    </Card>
  );
};