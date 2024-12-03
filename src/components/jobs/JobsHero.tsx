import { SearchBar } from "@/components/SearchBar";
import { SelectedTags } from "@/components/SelectedTags";
import type { Job } from "@/types/job";

interface JobsHeroProps {
  allJobs: Job[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export const JobsHero = ({ allJobs, selectedTags, onTagSelect }: JobsHeroProps) => {
  return (
    <div 
      className="relative bg-center bg-cover pt-24 sm:pt-20 pb-8 flex items-center overflow-hidden" 
      style={{ 
        backgroundImage: 'url("https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=2400&q=80")',
        backgroundPosition: 'center 40%',
        minHeight: '350px'
      }}
    >
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.2))'
        }}
      />
      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto space-y-8 text-center">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
              Find Your Next{' '}
              <span className="text-white font-extrabold bg-gradient-to-r from-sage via-sage-dark to-sage bg-clip-text text-transparent drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)]">
                Vegan Career
              </span>
            </h2>
          </div>
          
          <div className="space-y-4">
            <SearchBar 
              tags={allJobs.flatMap(job => job.tags || [])}
              onTagSelect={onTagSelect}
              selectedTags={selectedTags}
            />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-[40px]"
          style={{ transform: 'rotate(180deg)' }}
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-cream"
          />
        </svg>
      </div>
    </div>
  );
};