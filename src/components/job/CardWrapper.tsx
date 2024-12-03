import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { Lock } from "lucide-react";

interface CardWrapperProps {
  isSelected?: boolean;
  colored?: boolean;
  children: ReactNode;
  url: string;
  source?: string;
  requiresAuth?: boolean;
}

export const CardWrapper = ({ 
  isSelected, 
  colored, 
  children, 
  url, 
  source,
  requiresAuth 
}: CardWrapperProps) => {
  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // For EA jobs, redirect to the animal welfare jobs page
    const redirectUrl = source === 'ea' 
      ? 'https://jobs.80000hours.org/jobs?refinementList%5Btags_area%5D%5B0%5D=Animal%20welfare'
      : url;
    window.open(redirectUrl, '_blank');
  };

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
        {requiresAuth ? (
          <div className="flex items-center gap-2 text-sage">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Sign in to apply</span>
          </div>
        ) : (
          <Button 
            variant="default"
            size="sm"
            onClick={handleApplyClick}
            className="bg-sage hover:bg-sage-dark text-white"
          >
            Apply
          </Button>
        )}
      </div>
    </Card>
  );
};