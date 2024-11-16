import { Building2, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  type: string;
  posted: string;
  source: string;
  logo?: string;
}

export const JobCard = ({
  title,
  company,
  location,
  type,
  posted,
  source,
  logo,
}: JobCardProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-sage/10">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-cream flex items-center justify-center">
          {logo ? (
            <img src={logo} alt={company} className="w-8 h-8 object-contain" />
          ) : (
            <Building2 className="w-6 h-6 text-sage" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-sage-dark mb-1">{title}</h3>
          <p className="text-sage mb-3">{company}</p>
          
          <div className="flex flex-wrap gap-3 text-sm text-sage mb-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {posted}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-sage">via {source}</span>
            <Button className="bg-accent hover:bg-accent/90">
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};