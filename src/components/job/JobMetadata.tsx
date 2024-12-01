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
    try {
      // Check if it's a JSON string and parse it
      if (loc.startsWith('[') && loc.endsWith(']')) {
        const parsed = JSON.parse(loc);
        return Array.isArray(parsed) ? parsed[0] : parsed;
      }
      return loc.replace(/[\[\]"{}']/g, '').trim();
    } catch {
      return loc.replace(/[\[\]"{}']/g, '').trim();
    }
  };

  const formattedLocation = formatLocation(location);

  return (
    <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
      {companyName && (
        <div className="flex items-center gap-1">
          <Building2 className="w-4 h-4" />
          <span>{companyName}</span>
        </div>
      )}
      
      {formattedLocation && (
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{formattedLocation}</span>
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