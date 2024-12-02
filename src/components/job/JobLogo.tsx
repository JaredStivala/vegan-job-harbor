import { ImageIcon } from "lucide-react";

interface JobLogoProps {
  logo?: string | null;
  companyName?: string | null;
}

export const JobLogo = ({ logo, companyName }: JobLogoProps) => {
  return (
    <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
      {logo ? (
        <img 
          src={logo} 
          alt={`${companyName} logo`}
          className="w-full h-full object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      ) : (
        <ImageIcon className="w-8 h-8 text-gray-400" />
      )}
    </div>
  );
};