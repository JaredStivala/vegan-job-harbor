import { Building2, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  tags: string[];
  verified?: boolean;
  logo?: string;
  url: string;
}

export const JobCard = ({
  title,
  company,
  location,
  type,
  salary,
  posted,
  tags,
  verified = false,
  logo,
  url,
}: JobCardProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all border border-sage/10 group">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-cream flex items-center justify-center">
          {logo ? (
            <img src={logo} alt={company} className="w-8 h-8 object-contain" />
          ) : (
            <Building2 className="w-6 h-6 text-sage" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg text-sage-dark group-hover:text-sage transition-colors">
                {title}
                {verified && (
                  <CheckCircle2 className="inline-block w-4 h-4 ml-2 text-green-500" />
                )}
              </h3>
              <p className="text-sage">{company}</p>
            </div>
            <span className="text-sm text-sage bg-sage/5 px-3 py-1 rounded-full">
              {posted}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-white">
              <MapPin className="w-3 h-3 mr-1" />
              {location}
            </Badge>
            <Badge variant="outline" className="bg-white">
              <Clock className="w-3 h-3 mr-1" />
              {type}
            </Badge>
            <Badge variant="outline" className="bg-white">
              {salary}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-sage/5 hover:bg-sage/10">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button
              onClick={() => window.open(url, '_blank')}
              className="bg-sage hover:bg-sage-dark"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};