import { Building2, MapPin, Calendar } from "lucide-react";

interface JobMetadataProps {
  companyName?: string | null;
  location?: string | null;
  formattedDate?: string | null;
}

export const JobMetadata = ({ companyName, location, formattedDate }: JobMetadataProps) => {
  const formatLocation = (loc: string | null) => {
    if (!loc) return null;
    // Remove brackets, quotes, and clean up any extra whitespace
    return loc.replace(/[\[\]"]/g, '').trim();
  };

  return (
    <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
      {companyName && (
        <div className="flex items-center gap-1">
          <Building2 className="w-4 h-4" />
          <span>{companyName}</span>
        </div>
      )}
      
      {location && (
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{formatLocation(location)}</span>
        </div>
      )}
      
      {formattedDate && (
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
      )}
    </div>
  );
};