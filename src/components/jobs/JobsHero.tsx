import { SearchBar } from "@/components/SearchBar";
import type { Job } from "@/types/job";

interface JobsHeroProps {
  allJobs: Job[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export const JobsHero = ({ allJobs, selectedTags, onTagSelect }: JobsHeroProps) => {
  return (
    <div 
      className="relative bg-center bg-cover pt-32 sm:pt-28 pb-16 flex items-center overflow-hidden min-h-[85vh]" 
      style={{ 
        backgroundImage: 'url("https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=2400&q=80")',
        backgroundPosition: 'center 40%',
      }}
    >
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"
      />
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
              Find Your Next{' '}
              <span className="relative">
                <span className="relative z-10 font-extrabold bg-gradient-to-r from-sage-dark to-sage bg-clip-text text-transparent drop-shadow-[0_3px_3px_rgba(0,0,0,0.4)]">
                  Vegan Career
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-sage/30"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 15 Q25 5 50 15 Q75 25 100 15 L100 20 L0 20 Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-xl text-cream/90 mt-6 max-w-2xl mx-auto font-light">
              Discover meaningful opportunities in the vegan industry
            </p>
          </div>
          
          <div className="mt-12">
            <SearchBar />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-[60px]"
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