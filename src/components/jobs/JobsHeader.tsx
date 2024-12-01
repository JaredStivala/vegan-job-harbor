import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface JobsHeaderProps {
  selectedTags: string[];
  onTagRemove: (tag: string) => void;
  selectedLocations: string[];
  onLocationRemove: (location: string) => void;
}

export const JobsHeader = ({
  selectedTags,
  onTagRemove,
  selectedLocations,
  onLocationRemove,
}: JobsHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              VeganJobs
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="flex items-center gap-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="pl-2 pr-1 py-1 bg-sage/10 text-sage-dark hover:bg-sage/20 transition-colors group flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => onTagRemove(tag)}
                    className="ml-1 p-0.5 rounded-full hover:bg-sage/20 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    <span className="sr-only">Remove {tag}</span>
                  </button>
                </Badge>
              ))}
              {selectedLocations.map((location) => (
                <Badge
                  key={location}
                  variant="secondary"
                  className="pl-2 pr-1 py-1 bg-sage/10 text-sage-dark hover:bg-sage/20 transition-colors group flex items-center gap-1"
                >
                  {location}
                  <button
                    onClick={() => onLocationRemove(location)}
                    className="ml-1 p-0.5 rounded-full hover:bg-sage/20 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    <span className="sr-only">Remove {location}</span>
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <Link to="/post-job">
            <Button variant="default" className="bg-sage hover:bg-sage-dark text-white">
              Post a Job
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};